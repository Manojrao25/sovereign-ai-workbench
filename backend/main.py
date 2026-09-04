from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_ollama import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

app = FastAPI(title="Sovereign AI Workbench - RBAC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FEATHERLESS_API_KEY = "rc_3c0092bb53255a05ec76108b2c4fd06263f86daa193e65e582dc1cd440d54693"
FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1"
MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"

vectorstore = None
retriever = None

class QueryRequest(BaseModel):
    question: str
    language: str = "English"
    role: str = "Technician"
    department: str = "Maintenance"

class SummaryRequest(BaseModel):
    language: str = "English"

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), role: str = Form("Technician")):
    global vectorstore, retriever
    try:
        filename_lower = file.filename.lower()

        if role == "Technician" and not any(k in filename_lower for k in ["tech", "valve", "maintenance", "sop"]):
            raise HTTPException(status_code=403, detail="❌ Clearance Denied: Technicians are only authorized to upload Maintenance SOPs & Valve manuals.")
        elif role == "Engineer" and not any(k in filename_lower for k in ["engineer", "telemetry", "p102", "instrumentation"]):
            raise HTTPException(status_code=403, detail="❌ Clearance Denied: Engineers are only authorized to upload Telemetry & Instrumentation reports.")
        elif role == "Manager" and not any(k in filename_lower for k in ["manager", "compliance", "audit", "executive"]):
            raise HTTPException(status_code=403, detail="❌ Clearance Denied: Managers are only authorized to upload Executive Compliance & Audit reports.")

        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        full_text = "".join([d.page_content for d in docs]).strip()
        if len(full_text) < 10:
            raise HTTPException(status_code=400, detail="Rejected: Uploaded PDF is empty.")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)

        embeddings = OllamaEmbeddings(model="nomic-embed-text")
        vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
        retriever = vectorstore.as_retriever()

        return {"filename": file.filename, "status": "Success", "message": f"Document verified and indexed for {role} clearance."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_document(req: QueryRequest):
    global retriever
    if not retriever:
        try:
            default_pdf = "Tech_Valve_Maintenance_SOP.pdf"
            if os.path.exists(default_pdf):
                loader = PyPDFLoader(default_pdf)
                docs = loader.load()
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                splits = text_splitter.split_documents(docs)
                embeddings = OllamaEmbeddings(model="nomic-embed-text")
                vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
                retriever = vectorstore.as_retriever()
        except:
            pass

    if not retriever:
        raise HTTPException(status_code=400, detail="No document uploaded yet.")

    cleaned_q = req.question.strip()
    if len(cleaned_q.split()) < 2 and not any(char.isdigit() for char in cleaned_q):
        return {"answer": "⚠️ Invalid input: Please enter a valid maintenance or safety question."}

    if "confidential engineering" in req.question.lower() and req.role == "Technician":
        return {"answer": "❌ Security Access Denied: Technicians are not authorized to view confidential engineering designs."}

    persona_instructions = {
        "Technician": "Provide clear, simple, step-by-step action instructions with bullet points.",
        "Engineer": "Provide deep technical analysis, telemetry thresholds, component tags, and compliance standards.",
        "Manager": "Provide an executive summary focusing on operational metrics, risk status, and completion rates."
    }

    llm = ChatOpenAI(
        openai_api_key=FEATHERLESS_API_KEY,
        openai_api_base=FEATHERLESS_BASE_URL,
        model_name=MODEL_NAME,
        temperature=0
    )

    template = """You are a strict industrial AI assistant.
User Role: {role} 
Department: {department}
Target Language: {language}
Formatting Style: {style}

Answer the question ONLY using the facts in the context. Translate your final answer into {language}. If the question is gibberish, meaningless, or not mentioned in the context, reply strictly with: "⚠️ Invalid query or no matching information found in the document."

Context:
{context}

Question: {question}
"""
    prompt = ChatPromptTemplate.from_template(template)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {
            "context": retriever | format_docs, 
            "question": RunnablePassthrough(), 
            "role": lambda x: req.role, 
            "department": lambda x: req.department,
            "language": lambda x: req.language,
            "style": lambda x: persona_instructions.get(req.role, 'Provide clear answers.')
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    try:
        answer = rag_chain.invoke(req.question)
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"AI Engine error connecting to Featherless.ai: {str(e)}"}

@app.post("/summary")
async def get_summary(req: SummaryRequest):
    global retriever
    if not retriever:
        try:
            default_pdf = "Tech_Valve_Maintenance_SOP.pdf"
            if os.path.exists(default_pdf):
                loader = PyPDFLoader(default_pdf)
                docs = loader.load()
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                splits = text_splitter.split_documents(docs)
                embeddings = OllamaEmbeddings(model="nomic-embed-text")
                vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
                retriever = vectorstore.as_retriever()
        except:
            pass

    if not retriever:
        return {"summary": "Please upload a document first."}

    llm = ChatOpenAI(
        openai_api_key=FEATHERLESS_API_KEY,
        openai_api_base=FEATHERLESS_BASE_URL,
        model_name=MODEL_NAME,
        temperature=0
    )
    
    try:
        summary_chain = (
            {"context": retriever | (lambda docs: "\n\n".join(d.page_content for d in docs)), "question": RunnablePassthrough(), "language": lambda x: req.language}
            | ChatPromptTemplate.from_template("Provide a 3-bullet point executive summary based on this context. Translate into {language}:\n{context}")
            | llm
            | StrOutputParser()
        )
        summary = summary_chain.invoke("Summarize")
        return {"summary": summary}
    except Exception as e:
        return {"summary": f"Error generating summary: {str(e)}"}
