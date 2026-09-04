import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const translations = {
  English: {
    title: "Sovereign AI",
    subtitle: "On-Premise Workbench",
    dash: "📊 Facility Dashboard",
    upload: "📄 Upload Document",
    assistant: "💬 AI Assistant",
    activeUser: "Active User",
    role: "Role",
    activeDoc: "Active Document",
    noReport: "No report loaded",
    logout: "🔒 Secure Logout",
    welcome: "Welcome",
    dept: "Department",
    clearance: "Zero-Trust Clearance: Verified",
    authClearance: "Authorized Clearance",
    aiEngine: "AI Engine",
    secureIngestion: "Secure Ingestion",
    uploadSubtitle: "Upload verified PDF reports matching your clearance.",
    uploadBtn: "Upload & Vectorize",
    execInsights: "Executive Insights",
    genSummary: "Generate Summary",
    summaryPrompt: "Click above to generate summary...",
    adaptiveAi: "Adaptive AI",
    askPlaceholder: "Ask safety or maintenance questions...",
    send: "Send",
    loginTitle: "Industrial AI Workbench",
    loginSubtitle: "Enterprise Secure Access Portal",
    signInTab: "Sign In",
    signUpTab: "Sign Up",
    empId: "Employee ID",
    password: "Password",
    newEmpId: "New Employee ID",
    createPass: "Create Password",
    assignRole: "Assign Role",
    signInBtn: "Sign In",
    signUpBtn: "Create Account",
    defaultAccounts: "Default Accounts",
    suggestedQuestions: "💡 Quick Test Questions (Click to Ask):"
  },
  Hindi: {
    title: "सॉवरेन एआई",
    subtitle: "ऑन-प्रिमाइंस वर्कबेंच",
    dash: "📊 फैसिलिटी डैशबोर्ड",
    upload: "📄 दस्तावेज़ अपलोड करें",
    assistant: "💬 एआई सहायक",
    activeUser: "सक्रिय उपयोगकर्ता",
    role: "भूमिका",
    activeDoc: "सक्रिय दस्तावेज़",
    noReport: "कोई रिपोर्ट लोड नहीं हुई",
    logout: "🔒 सुरक्षित लॉग आउट",
    welcome: "स्वागत है",
    dept: "विभाग",
    clearance: "शून्य-विश्वास मंजूरी: सत्यापित",
    authClearance: "अधिकृत मंजूरी",
    aiEngine: "एआई इंजन",
    secureIngestion: "सुरक्षित अंतर्ग्रहण",
    uploadSubtitle: "अपनी मंजूरी से मेल खाने वाली सत्यापित पीडीएफ रिपोर्ट अपलोड करें।",
    uploadBtn: "अपलोड और वेक्टराइज़ करें",
    execInsights: "कार्यकारी अंतर्दृष्टि",
    genSummary: "सारांश तैयार करें",
    summaryPrompt: "सारांश तैयार करने के लिए ऊपर क्लिक करें...",
    adaptiveAi: "अनुकूली एआई",
    askPlaceholder: "सुरक्षा या रखरखाव के प्रश्न पूछें...",
    send: "भेजें",
    loginTitle: "औद्योगिक एआई वर्कबेंच",
    loginSubtitle: "एंटरप्राइज सुरक्षित एक्सेस पोर्टल",
    signInTab: "साइन इन",
    signUpTab: "साइन अप",
    empId: "कर्मचारी आईडी",
    password: "पासवर्ड",
    newEmpId: "नया कर्मचारी आईडी",
    createPass: "पासवर्ड बनाएं",
    assignRole: "भूमिका निर्दिष्ट करें",
    signInBtn: "साइन इन करें",
    signUpBtn: "खाता बनाएं",
    defaultAccounts: "डिफ़ॉल्ट खाते",
    suggestedQuestions: "💡 त्वरित परीक्षण प्रश्न (पूछने के लिए क्लिक करें):"
  },
  Kannada: {
    title: "ಸಾರ್ವಸ್ವ ಎಐ",
    subtitle: "ಆನ್-ಪ್ರಿಮೈಸ್ ವರ್ಕ್‌ಬೆಂಚ್",
    dash: "📊 ಸೌಲಭ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    upload: "📄 ಡಾಕ್ಯುಮೆಂಟ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    assistant: "💬 ಎಐ ಸಹಾಯಕ",
    activeUser: "ಸಕ್ರಿಯ ಬಳಕೆದಾರ",
    role: "ಪಾತ್ರ",
    activeDoc: "ಸಕ್ರಿಯ ಡಾಕ್ಯುಮೆಂಟ್",
    noReport: "ಯಾವುದೇ ವರದಿ ಲೋಡ್ ಆಗಿಲ್ಲ",
    logout: "🔒 ಸುರಕ್ಷಿತ ನಿರ್ಗಮನ",
    welcome: "ಸ್ವಾಗತ",
    dept: "ವಿಭಾಗ",
    clearance: "ಶೂನ್ಯ-ನಂಬಿಕೆ ಅನುಮೋದನೆ: ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    authClearance: "ಅಧಿಕೃತ ಅನುಮೋದನೆ",
    aiEngine: "ಎಐ ಎಂಜಿನ್",
    secureIngestion: "ಸುರಕ್ಷಿತ ಒಳಹರಿವು",
    uploadSubtitle: "ನಿಮ್ಮ ಅನುಮೋದನೆಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಪರಿಶೀಲಿಸಿದ ಪಿಡಿಎಫ್ ವರದಿಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ.",
    uploadBtn: "ಅಪ್ಲೋಡ್ ಮತ್ತು ವೆಕ್ಟರೈಸ್ ಮಾಡಿ",
    execInsights: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಒಳಹೋಟುಗಳು",
    genSummary: "ಸಾರಾಂಶವನ್ನು ರಚಿಸಿ",
    summaryPrompt: "ಸಾರಾಂಶ ರಚಿಸಲು ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ...",
    adaptiveAi: "ಅನುಕೂಲಕರ ಎಐ",
    askPlaceholder: "ಸುರಕ್ಷತೆ ಅಥವಾ ನಿರ್ವಹಣೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ...",
    send: "ಕಳುಹಿಸಿ",
    loginTitle: "ಕೈಗಾರಿಕಾ ಎಐ ವರ್ಕ್‌ಬೆಂಚ್",
    loginSubtitle: "ಉದ್ಯಮ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ ಪೋರ್ಟಲ್",
    signInTab: "ಸೈನ್ ಇನ್",
    signUpTab: "ಸೈನ್ ಅಪ್",
    empId: "ನೌಕರರ ಐಡಿ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    newEmpId: "ಹೊಸ ನೌಕರರ ಐಡಿ",
    createPass: "ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
    assignRole: "ಪಾತ್ರವನ್ನು ನಿಯೋಜಿಸಿ",
    signInBtn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    signUpBtn: "ಖಾತೆ ರಚಿಸಿ",
    defaultAccounts: "ಪೂರ್ವನಿಯೋಜಿತ ಖಾತೆಗಳು",
    suggestedQuestions: "💡 ತ್ವರಿತ ಪರೀಕ್ಷಾ ಪ್ರಶ್ನೆಗಳು ( ಕೇಳಲು ಕ್ಲಿಕ್ ಮಾಡಿ):"
  }
};
 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Technician");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
 
  const [role, setRole] = useState("Technician");
  const [department, setDepartment] = useState("Maintenance");
 
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const t = translations[language] || translations.English;
 
  const sampleQuestions = {
    Technician: "What are the step-by-step instructions for Pressure Relief Valve #402?",
    Engineer: "What are the vibration and temperature telemetry values for Pump P102?",
    Manager: "Give me a summary of critical issues and completed audits this week."
  };
 
  const getUsers = () => {
    const users = localStorage.getItem("enterprise_users");
    return users ? JSON.parse(users) : {
      "TECH-01": { pass: "Tech@2026", role: "Technician", dept: "Field Maintenance" },
      "ENG-02": { pass: "Eng@2026", role: "Engineer", dept: "Instrumentation & Reliability" },
      "MGR-03": { pass: "Mgr@2026", role: "Manager", dept: "Operations Management" }
    };
  };
 
  const handleSignUp = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    const id = employeeId.trim().toUpperCase();
    if (!id || !password) {
      setAuthError("All fields are required.");
      return;
    }
    const users = getUsers();
    if (users[id]) {
      setAuthError("Employee ID already exists. Please Sign In.");
      return;
    }
    let dept = "Field Maintenance";
    if (selectedRole === "Manager") dept = "Operations Management";
    else if (selectedRole === "Engineer") dept = "Instrumentation & Reliability";
 
    users[id] = { pass: password, role: selectedRole, dept: dept };
    localStorage.setItem("enterprise_users", JSON.stringify(users));
    setAuthSuccess("Account created successfully! Please Sign In.");
    setIsSignUp(false);
    setPassword("");
  };
 
  const handleSignIn = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    const id = employeeId.trim().toUpperCase();
    const users = getUsers();
 
    if (!users[id] || users[id].pass !== password) {
      setAuthError("Invalid Employee ID or Password.");
      return;
    }
 
    setRole(users[id].role);
    setDepartment(users[id].dept);
    setUploadedFileName("");
    setIsLoggedIn(true);
    navigate('/');
  };
 
  const handleLogout = () => {
    setUploadedFileName("");
    setChatLog([]);
    setSummary("");
    setPassword("");
    setEmployeeId("");
    setIsLoggedIn(false);
  };
 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);
 
    setLoading(true);
    setUploadStatus("");
    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setUploadStatus(res.data.message);
      setUploadedFileName(file.name);
      navigate('/workbench');
    } catch (err) {
      setUploadStatus(err.response?.data?.detail || "Upload failed due to role clearance restriction.");
    }
    setLoading(false);
  };
 
  const handleSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/summary", { language });
      setSummary(res.data.summary);
    } catch (err) {
      setSummary("Failed to generate summary.");
    }
    setLoading(false);
  };
 
  const handleAsk = async (qText) => {
    const qToAsk = qText || question;
    if (!qToAsk) return;
 
    const newLog = [...chatLog, { sender: "user", text: qToAsk }];
    setChatLog(newLog);
    setQuestion("");
    setLoading(true);
 
    try {
      const res = await axios.post("http://localhost:8000/query", { question: qToAsk, language, role, department });
      setChatLog([...newLog, { sender: "ai", text: res.data.answer }]);
    } catch (err) {
      setChatLog([...newLog, { sender: "ai", text: "Error fetching response." }]);
    }
    setLoading(false);
  };
 
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center font-sans text-slate-100">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-96 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400 font-bold text-xl">🏭</div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="English">EN</option>
              <option value="Hindi">हि</option>
              <option value="Kannada">ಕಂ</option>
            </select>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">{t.loginTitle}</h1>
            <p className="text-xs text-slate-400 mt-1">{t.loginSubtitle}</p>
          </div>
 
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => { setIsSignUp(false); setAuthError(""); setAuthSuccess(""); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${!isSignUp ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t.signInTab}
            </button>
            <button 
              onClick={() => { setIsSignUp(true); setAuthError(""); setAuthSuccess(""); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${isSignUp ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t.signUpTab}
            </button>
          </div>
 
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{t.empId}</label>
                <input 
                  type="text" 
                  value={employeeId} 
                  onChange={(e) => setEmployeeId(e.target.value)} 
                  placeholder="e.g. TECH-01"
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{t.password}</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              {authError && <p className="text-xs text-rose-400 font-medium text-center">{authError}</p>}
              {authSuccess && <p className="text-xs text-emerald-400 font-medium text-center">{authSuccess}</p>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20">
                {t.signInBtn}
              </button>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>🔑 <strong>{t.defaultAccounts}:</strong></p>
                <p>• Tech: <code>TECH-01</code> / <code>Tech@2026</code></p>
                <p>• Eng: <code>ENG-02</code> / <code>Eng@2026</code></p>
                <p>• Mgr: <code>MGR-03</code> / <code>Mgr@2026</code></p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{t.newEmpId}</label>
                <input 
                  type="text" 
                  value={employeeId} 
                  onChange={(e) => setEmployeeId(e.target.value)} 
                  placeholder="e.g. TECH-99"
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{t.createPass}</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{t.assignRole}</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Technician">Technician</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              {authError && <p className="text-xs text-rose-400 font-medium text-center">{authError}</p>}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20">
                {t.signUpBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
 
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="w-80 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold text-xl">🛡️</div>
            <div className="flex-1">
              <h1 className="font-bold text-lg tracking-tight">{t.title}</h1>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="English">EN</option>
              <option value="Hindi">हि</option>
              <option value="Kannada">ಕಂ</option>
            </select>
          </div>
          
          <nav className="space-y-2 mb-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition">{t.dash}</Link>
            <Link to="/upload" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition">{t.upload}</Link>
            <Link to="/workbench" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition">{t.assistant}</Link>
          </nav>
 
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{t.activeUser}</span>
              <p className="text-sm font-medium text-slate-200 mt-1">👤 {employeeId.toUpperCase()}</p>
              <p className="text-xs text-indigo-400 mt-1">{t.role}: {role}</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{t.activeDoc}</span>
              <p className="text-sm font-medium text-slate-200 mt-1 truncate">{uploadedFileName || t.noReport}</p>
            </div>
          </div>
        </div>
 
        <button onClick={handleLogout} className="text-xs text-rose-400 hover:underline text-center pt-4">
          {t.logout}
        </button>
      </div>
 
      <div className="flex-1 flex flex-col overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              <header className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">{t.welcome}, {employeeId.toUpperCase()} ({role})</h2>
                <p className="text-sm text-slate-400 mt-1">{t.dept}: {department} | {t.clearance}</p>
              </header>
 
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h4 className="text-xs uppercase font-semibold text-emerald-400">{t.authClearance}</h4>
                  <p className="text-2xl font-bold text-slate-100 mt-2">{role} Level</p>
                  <p className="text-xs text-slate-400 mt-1">Status: Active & Secured</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h4 className="text-xs uppercase font-semibold text-indigo-400">{t.aiEngine}</h4>
                  <p className="text-2xl font-bold text-indigo-400 mt-2">Featherless.ai Cloud</p>
                  <p className="text-xs text-slate-400 mt-1">Model: Qwen-2.5-7B</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h4 className="text-xs uppercase font-semibold text-amber-400">Security Firewall</h4>
                  <p className="text-2xl font-bold text-amber-400 mt-2">RBAC Enforced</p>
                  <p className="text-xs text-slate-400 mt-1">Zero-Trust Protocol</p>
                </div>
              </div>
 
              <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-2xl shadow-xl mt-6">
                <h3 className="text-xl font-bold mb-3">🏭 MRPL On-Premise Industrial Node</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Welcome to the secure operational telemetry and document intelligence portal. Your credentials have established a zero-trust encrypted session. Use the left navigation pane to ingest verified department reports or launch the adaptive AI assistant for real-time safety insights.
                </p>
              </div>
            </div>
          } />
 
          <Route path="/upload" element={
            <div className="max-w-xl mx-auto mt-12 space-y-6">
              <header className="text-center mb-6">
                <h2 className="text-3xl font-bold tracking-tight">{t.secureIngestion} ({department})</h2>
                <p className="text-sm text-slate-400 mt-1">{t.uploadSubtitle}</p>
              </header>
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleUpload} className="space-y-6">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                  />
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 rounded-xl transition duration-200">
                    {t.uploadBtn} ({role})
                  </button>
                </form>
                {uploadStatus && <p className="text-sm mt-4 text-center font-medium text-emerald-400">{uploadStatus}</p>}
              </div>
            </div>
          } />
 
          <Route path="/workbench" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col">
                <h3 className="text-lg font-semibold mb-4">⚡ {t.execInsights} ({role})</h3>
                <button onClick={handleSummary} className="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold py-2.5 rounded-xl transition duration-200 mb-4">
                  {t.genSummary}
                </button>
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm whitespace-pre-line text-slate-300 overflow-y-auto">
                  {summary || t.summaryPrompt}
                </div>
              </div>
 
              <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col h-[650px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">💬 {t.adaptiveAi} ({role})</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl mb-3">
                    <p className="text-xs text-indigo-300 font-semibold mb-1.5">{t.suggestedQuestions}</p>
                    <button 
                      onClick={() => handleAsk(sampleQuestions[role])}
                      className="text-xs bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 px-3 py-1.5 rounded-lg border border-indigo-500/40 text-left transition w-full"
                    >
                      👉 "{sampleQuestions[role]}"
                    </button>
                  </div>
 
                  {chatLog.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center mt-16">{t.askPlaceholder}</p>
                  ) : (
                    chatLog.map((chat, idx) => (
                      <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${chat.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                          {chat.text}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && <p className="text-xs text-indigo-400 italic animate-pulse">AI processing...</p>}
                </div>
 
                <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex gap-2">
                  <input 
                    type="text" 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.askPlaceholder} 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl font-semibold text-sm">
                    {t.send}
                  </button>
                </form>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}
 
export default App;
 