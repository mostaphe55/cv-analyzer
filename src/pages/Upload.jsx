import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Zap,
  Shield,
  Clock,
  Sparkles,
  FileCheck,
  Brain,
  Briefcase,
  ArrowRight,
  CloudUpload,
  ScanLine,
  BarChart2,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).href;

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

const extractText = async (file) => {
  if (file.type === "text/plain") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  }
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result,
          });
          resolve(result.value);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
};

const analyzeCV = async (cvText) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are an expert CV analyzer. Analyze the CV and return ONLY valid JSON with no markdown or explanation. Use this exact structure:
{
  "overallScore": 75,
  "breakdown": { "skills": 70, "experience": 80, "education": 85, "formatting": 65 },
  "atsScore": 60,
  "atsChecklist": [
    {"label": "Contact Information", "pass": true},
    {"label": "Work Experience", "pass": true},
    {"label": "Education Section", "pass": true},
    {"label": "Skills Keywords", "pass": false},
    {"label": "Professional Summary", "pass": false}
  ],
  "suggestions": [
    {"priority": "High", "color": "red", "title": "title here", "desc": "description here", "action": "action here"},
    {"priority": "Medium", "color": "yellow", "title": "title here", "desc": "description here", "action": "action here"},
    {"priority": "Low", "color": "blue", "title": "title here", "desc": "description here", "action": "action here"}
  ],
  "jobMatches": [
    {"title": "Job Title", "company": "Company Name", "location": "City", "type": "Full Time", "salary": "$30k - $50k", "match": 85, "skills": ["skill1", "skill2"], "missing": ["skill3"]},
    {"title": "Job Title 2", "company": "Company 2", "location": "Remote", "type": "Full Time", "salary": "$25k - $45k", "match": 70, "skills": ["skill1"], "missing": ["skill2", "skill3"]}
  ],
  "missingSkills": [
    {"skill": "Skill Name", "demand": "Very High"},
    {"skill": "Skill 2", "demand": "High"},
    {"skill": "Skill 3", "demand": "Medium"}
  ],
  "radarData": [
    {"subject": "Skills", "A": 70},
    {"subject": "Experience", "A": 80},
    {"subject": "Education", "A": 85},
    {"subject": "Formatting", "A": 65},
    {"subject": "Keywords", "A": 55},
    {"subject": "Summary", "A": 60}
  ]
}`,
          },
          {
            role: "user",
            content: `Analyze this CV and return JSON only:\n\n${cvText.substring(0, 3000)}`,
          },
        ],
      }),
    },
  );
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    throw new Error("AI returned invalid response. Please try again.");
  }
};

const steps = [
  {
    icon: ScanLine,
    label: "Reading CV...",
    color: "text-blue-400",
    bg: "from-blue-600/20 to-blue-800/10",
  },
  {
    icon: Brain,
    label: "AI Analyzing...",
    color: "text-purple-400",
    bg: "from-purple-600/20 to-purple-800/10",
  },
  {
    icon: BarChart2,
    label: "Scoring CV...",
    color: "text-cyan-400",
    bg: "from-cyan-600/20 to-cyan-800/10",
  },
  {
    icon: Briefcase,
    label: "Matching Jobs...",
    color: "text-green-400",
    bg: "from-green-600/20 to-green-800/10",
  },
];

export default function UploadCV() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    setError("");
    if (!f) return;
    const allowed = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(f.type)) {
      setError("Only PDF, TXT or Word (.docx) files are allowed!");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File is too large! Max size is 5MB.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      setStatusIndex(0);
      const cvText = await extractText(file);
      setStatusIndex(1);
      const analysis = await analyzeCV(cvText);
      setStatusIndex(2);
      localStorage.setItem("cvAnalysis", JSON.stringify(analysis));
      localStorage.setItem("currentCV", file.name);
      const existing = JSON.parse(localStorage.getItem("cvHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        filename: file.name,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: analysis.overallScore,
        jobs: analysis.jobMatches?.length || 0,
        status: "Completed",
      };
      localStorage.setItem(
        "cvHistory",
        JSON.stringify([newEntry, ...existing]),
      );
      setStatusIndex(3);
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
      await new Promise((r) => setTimeout(r, 600));
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <CloudUpload size={26} className="text-blue-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Your CV</h1>
        <p className="text-gray-400 text-sm">
          Our AI will analyze every detail of your resume in seconds
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          onClick={() => !loading && fileRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: dragOver ? "#3b82f6" : file ? "#22c55e" : "#374151",
            backgroundColor: dragOver
              ? "rgba(59,130,246,0.05)"
              : file
                ? "rgba(34,197,94,0.03)"
                : "rgba(17,24,39,0.8)",
            scale: dragOver ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer mb-6 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/3 to-cyan-600/3 pointer-events-none" />

          {/* Animated corner decorations */}
          {[
            "-top-1 -left-1",
            "-top-1 -right-1",
            "-bottom-1 -left-1",
            "-bottom-1 -right-1",
          ].map((pos, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
              className={`absolute ${pos} w-6 h-6 border-blue-500/40`}
              style={{
                borderTop: pos.includes("top") ? "2px solid" : "none",
                borderBottom: pos.includes("bottom") ? "2px solid" : "none",
                borderLeft: pos.includes("left") ? "2px solid" : "none",
                borderRight: pos.includes("right") ? "2px solid" : "none",
                borderRadius: "4px",
                borderColor: "rgba(59,130,246,0.5)",
              }}
            />
          ))}

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                >
                  <FileCheck size={36} className="text-green-400" />
                </motion.div>
                <div>
                  <p className="text-white font-bold text-lg">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                  </p>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="w-32 h-1 bg-linear-to-r from-green-600 to-emerald-400 rounded-full"
                />
                {!loading && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl transition-all"
                  >
                    <X size={14} /> Remove File
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-5"
              >
                <motion.div
                  animate={
                    dragOver
                      ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                      : { y: [0, -8, 0] }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: dragOver ? 0.5 : 2.5,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center"
                >
                  <CloudUpload size={36} className="text-blue-400" />
                </motion.div>

                <div>
                  <p className="text-white font-bold text-xl mb-2">
                    {dragOver
                      ? "📂 Release to Upload!"
                      : "Drag & Drop Your CV Here"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    or click anywhere to browse your files
                  </p>
                </div>

                {/* File type badges */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {[
                    {
                      label: "PDF",
                      icon: FileText,
                      color: "text-red-400 border-red-500/30 bg-red-500/10",
                    },
                    {
                      label: "DOCX",
                      icon: FileText,
                      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
                    },
                    {
                      label: "TXT",
                      icon: FileText,
                      color:
                        "text-green-400 border-green-500/30 bg-green-500/10",
                    },
                    {
                      label: "Max 5MB",
                      icon: Shield,
                      color: "text-gray-400 border-gray-600 bg-gray-800",
                    },
                  ].map(({ label, icon: Icon, color }) => (
                    <motion.span
                      key={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${color}`}
                    >
                      <Icon size={11} />
                      {label}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 3, duration: 0.3 }}
            >
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            </motion.div>
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Loading Steps */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader size={16} className="text-blue-400" />
              </motion.div>
              <p className="text-white font-semibold text-sm">
                AI is working on your CV...
              </p>
            </div>

            <div className="space-y-3">
              {steps.map(({ icon: Icon, label, color, bg }, i) => {
                const isActive = i === statusIndex;
                const isDone = i < statusIndex;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? `bg-linear-to-r ${bg} border border-gray-700` : isDone ? "opacity-60" : "opacity-30"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? `bg-linear-to-br ${bg}` : isDone ? "bg-gray-800" : "bg-gray-800/50"}`}
                    >
                      {isDone ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <Icon size={16} className={color} />
                        </motion.div>
                      ) : (
                        <Icon size={16} className="text-gray-600" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${isActive ? "text-white" : isDone ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="ml-auto flex gap-1"
                      >
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: dot * 0.2,
                            }}
                            className={`w-1.5 h-1.5 rounded-full ${color.replace("text-", "bg-")}`}
                          />
                        ))}
                      </motion.div>
                    )}
                    {isDone && (
                      <span className="ml-auto text-green-400 text-xs font-semibold">
                        ✓ Done
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Overall progress bar */}
            <div className="mt-4 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                animate={{
                  width: `${((statusIndex + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
                className="h-1.5 rounded-full bg-linear-to-r from-blue-600 via-cyan-500 to-green-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Cards */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[
              {
                icon: ScanLine,
                label: "Smart Parsing",
                desc: "Reads every section",
                color: "text-blue-400",
                bg: "from-blue-600/10 to-blue-800/5",
                border: "border-blue-500/20",
              },
              {
                icon: Brain,
                label: "AI Scoring",
                desc: "Quality out of 100",
                color: "text-purple-400",
                bg: "from-purple-600/10 to-purple-800/5",
                border: "border-purple-500/20",
              },
              {
                icon: Briefcase,
                label: "Job Matching",
                desc: "Best roles for you",
                color: "text-green-400",
                bg: "from-green-600/10 to-green-800/5",
                border: "border-green-500/20",
              },
            ].map(({ icon: Icon, label, desc, color, bg, border }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className={`bg-linear-to-br ${bg} border ${border} rounded-2xl p-4 text-center cursor-default`}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                >
                  <Icon size={22} className={`${color} mx-auto mb-2`} />
                </motion.div>
                <p className="text-white text-sm font-bold">{label}</p>
                <p className="text-gray-500 text-xs mt-1">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Badges */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mb-8 flex-wrap"
          >
            {[
              { icon: Shield, text: "100% Private" },
              { icon: Zap, text: "Takes 20 Seconds" },
              { icon: Sparkles, text: "AI Powered" },
              { icon: Clock, text: "Free Forever" },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-500 text-xs"
              >
                <Icon size={12} className="text-blue-400" />
                {text}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleAnalyze}
          disabled={!file || loading || done}
          whileHover={file && !loading && !done ? { scale: 1.02, y: -2 } : {}}
          whileTap={file && !loading && !done ? { scale: 0.98 } : {}}
          className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 relative overflow-hidden
            ${
              file && !loading && !done
                ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50"
                : done
                  ? "bg-linear-to-r from-green-600 to-emerald-600 text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          {/* Button shimmer effect */}
          {file && !loading && !done && (
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          )}

          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader size={22} />
              </motion.div>
              <span>{steps[statusIndex]?.label || "Processing..."}</span>
            </>
          ) : done ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: 3, duration: 0.3 }}
              >
                <CheckCircle size={22} className="text-white" />
              </motion.div>
              <span>Analysis Complete! Redirecting...</span>
            </>
          ) : (
            <>
              <Sparkles size={22} />
              <span>Analyze My CV With AI</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Bottom note */}
      {!loading && !done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs mt-4"
        >
          Your CV is analyzed privately and never stored on any server 🔒
        </motion.p>
      )}
    </div>
  );
}
