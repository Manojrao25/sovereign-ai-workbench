# Sovereign AI Workbench (MRPL Industrial Assistant)

An enterprise-grade, on-premise industrial AI workbench built for Mangalore Refinery and Petrochemicals Limited (MRPL) to ensure zero-trust clearance controls, secure multi-format document ingestion, vectorized RAG, and multilingual safety/maintenance assistance.

## 🛡️ Architecture & Deployment Strategy

- **On-Premise Offline Mode (Production / MRPL Security):** Designed to run entirely offline using local LLMs (via **Ollama**) to ensure complete data sovereignty and prevent any sensitive refinery telemetry or safety documents from leaving the local network.
- **Online Evaluation Mode (Hackathon / CodeSpectra):** Integrated with **Featherless.ai** cloud endpoints to enable remote evaluation and judging without requiring local Ollama setup.

## 🌟 Core Features

- **Zero-Trust Role-Based Access Control (RBAC):** Secure authentication portal with multi-tier clearance levels (Technician, Engineer, Manager).
- **Secure Document Ingestion:** Upload and vectorize enterprise PDF reports matching specific security clearances.
- **Adaptive AI Assistant:** Multilingual support (English, Hindi, Kannada) for real-time safety, telemetry, and maintenance querying powered by state-of-the-art LLMs.
- **Executive Insights & Summarization:** Instant AI-driven summaries of complex industrial documents and maintenance logs.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express (or Python FastAPI), Vector RAG Engine
- **AI Inference:** 
  - *Primary (MRPL On-Premise):* Local Ollama instance
  - *Evaluation:* Featherless.ai Cloud API

## 📦 Getting Started & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sovereign-ai-workbench.git
   cd sovereign-ai-workbench
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Configure your environment variables (.env) for Featherless.ai or Ollama
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔑 Default Accounts for Testing

- **Technician:** `TECH-01` / `Tech@2026`
- **Engineer:** `ENG-02` / `Eng@2026`
- **Manager:** `MGR-03` / `Mgr@2026`
