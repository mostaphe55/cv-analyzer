import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Award,
  MessageCircle,
  ChevronDown,
  Mic,
  Copy,
  CheckCircle,
  RefreshCw,
  X,
} from "lucide-react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
const quickSuggestions = [
  {
    icon: TrendingUp,
    text: "How can I improve my CV score?",
    color: "text-blue-400",
  },
  {
    icon: Target,
    text: "What jobs match my profile best?",
    color: "text-green-400",
  },
  {
    icon: Brain,
    text: "What skills should I learn next?",
    color: "text-purple-400",
  },
  {
    icon: Award,
    text: "How do I write a professional summary?",
    color: "text-yellow-400",
  },
  {
    icon: Zap,
    text: "What is ATS and how do I pass it?",
    color: "text-cyan-400",
  },
  {
    icon: MessageCircle,
    text: "How do I quantify my achievements?",
    color: "text-pink-400",
  },
];

// Typing dots animation
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20"
      >
        <Bot size={16} className="text-white" />
      </motion.div>
      <div className="bg-gray-800 border border-gray-700/50 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-blue-400"
          />
        ))}
      </div>
    </div>
  );
}

// Single message bubble
function MessageBubble({ msg, index }) {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.03,
      }}
      className={`flex gap-3 group ${!isAI ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg
          ${
            isAI
              ? "bg-linear-to-br from-blue-600 to-cyan-600 shadow-blue-600/20"
              : "bg-linear-to-br from-gray-600 to-gray-700"
          }`}
      >
        {isAI ? (
          <Bot size={16} className="text-white" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </motion.div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[80%] ${!isAI ? "items-end" : "items-start"}`}
      >
        <div
          className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${
            isAI
              ? "bg-gray-800 border border-gray-700/50 text-gray-200 rounded-tl-sm"
              : "bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20"
          }`}
        >
          {msg.text}

          {/* Copy button for AI messages */}
          {isAI && (
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              onClick={handleCopy}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-600"
            >
              {copied ? (
                <CheckCircle size={11} className="text-green-400" />
              ) : (
                <Copy size={11} className="text-gray-400" />
              )}
            </motion.button>
          )}
        </div>
        <span className="text-gray-600 text-xs px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [cvName, setCvName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const bottomRef = useRef();
  const chatRef = useRef();
  const inputRef = useRef();
  const navigate = useNavigate();

  const getTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const saved = localStorage.getItem("cvAnalysis");
    const name = localStorage.getItem("currentCV");
    if (saved) {
      const data = JSON.parse(saved);
      setCvData(data);
      setCvName(name || "Your CV");
      setMessages([
        {
          role: "assistant",
          time: getTime(),
          text: `👋 Hello! I have fully analyzed your CV **${name || ""}**!\n\n📊 Overall Score: **${data.overallScore}/100**\n🎯 Best Match: **${data.jobMatches?.[0]?.title || "See Job Matches"}** at **${data.jobMatches?.[0]?.match || 0}%**\n⚡ ATS Score: **${data.atsScore}%**\n\nI know everything about your CV. Ask me anything and I will give you personalized advice! 🚀`,
        },
      ]);
    } else {
      setMessages([
        {
          role: "assistant",
          time: getTime(),
          text: "👋 Hello! I'm your AI Career Assistant.\n\nI notice you haven't uploaded a CV yet. Upload your CV first and I'll give you fully personalized advice based on your actual results! 🎯",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const buildSystemPrompt = () => {
    if (!cvData)
      return `You are an expert AI Career Assistant. The user hasn't uploaded a CV yet. Encourage them to upload their CV for personalized advice. Be warm and helpful.`;
    const jobs =
      cvData.jobMatches?.map((j) => `${j.title} (${j.match}%)`).join(", ") ||
      "None";
    const missing =
      cvData.missingSkills?.map((s) => s.skill).join(", ") || "None";
    const suggs =
      cvData.suggestions?.map((s) => `${s.priority}: ${s.title}`).join(", ") ||
      "None";
    return `You are an expert AI Career Assistant and CV Coach.

The user's CV has been analyzed with these REAL results:
- CV File: ${cvName}
- Overall CV Score: ${cvData.overallScore}/100
- Skills Score: ${cvData.breakdown?.skills}%
- Experience Score: ${cvData.breakdown?.experience}%
- Education Score: ${cvData.breakdown?.education}%
- Formatting Score: ${cvData.breakdown?.formatting}%
- ATS Score: ${cvData.atsScore}%
- Best Job Matches: ${jobs}
- Missing Skills: ${missing}
- Key Suggestions: ${suggs}

Always use this REAL data. Be friendly, specific, encouraging and concise.
Format responses clearly with emojis and bullet points when helpful.`;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setShowSuggestions(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, time: getTime() },
    ]);
    setInput("");
    setCharCount(0);
    setLoading(true);
    try {
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
            max_tokens: 1000,
            messages: [
              { role: "system", content: buildSystemPrompt() },
              ...messages.map((m) => ({ role: m.role, content: m.text })),
              { role: "user", content: userText },
            ],
          }),
        },
      );
      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not get a response.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, time: getTime() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Something went wrong. Please try again.",
          time: getTime(),
        },
      ]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        time: getTime(),
        text: "🔄 Chat cleared! How can I help you?",
      },
    ]);
    setShowSuggestions(true);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/25"
          >
            <Brain size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Career Assistant
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-green-400 inline-block"
              />
            </h1>
            <p className="text-gray-500 text-xs">
              {cvData
                ? `📄 ${cvName} — Score ${cvData.overallScore}/100`
                : "Upload CV for personalized advice"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* CV Score Badge */}
          {cvData && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl px-3 py-2 text-center cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <p className="text-blue-400 font-black text-xl leading-none">
                {cvData.overallScore}
              </p>
              <p className="text-gray-600 text-xs">Score</p>
            </motion.div>
          )}

          {/* Clear Chat */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl p-5 overflow-y-auto mb-3 space-y-4 relative"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/2 to-cyan-600/2 rounded-3xl pointer-events-none" />

        {/* Messages */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {/* Loading */}
        <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>

        <div ref={bottomRef} />

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              <ChevronDown size={16} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Suggestions */}
      <AnimatePresence>
        {showSuggestions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mb-3"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-xs font-semibold flex items-center gap-1">
                <Sparkles size={10} className="text-blue-400" /> Quick Questions
              </p>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-700 hover:text-gray-500"
              >
                <X size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickSuggestions.map(({ icon: Icon, text, color }, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(text)}
                  className="flex items-start gap-2 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-3 text-left transition-all group"
                >
                  <Icon size={13} className={`${color} shrink-0 mt-0.5`} />
                  <span className="text-gray-400 group-hover:text-white text-xs leading-relaxed transition-colors">
                    {text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex items-end gap-3 focus-within:border-blue-500/50 transition-all"
      >
        {/* Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCharCount(e.target.value.length);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me anything about your CV or career..."
            rows={1}
            className="w-full bg-transparent outline-none text-white placeholder-gray-600 text-sm resize-none leading-relaxed py-2 px-1"
            style={{ maxHeight: "120px" }}
          />
          {charCount > 0 && (
            <span className="absolute bottom-1 right-1 text-gray-700 text-xs">
              {charCount}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Clear input */}
          <AnimatePresence>
            {input.trim() && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => {
                  setInput("");
                  setCharCount(0);
                }}
                className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all"
              >
                <X size={13} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Send Button */}
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            whileHover={input.trim() && !loading ? { scale: 1.1 } : {}}
            whileTap={input.trim() && !loading ? { scale: 0.9 } : {}}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative overflow-hidden
              ${
                input.trim() && !loading
                  ? "bg-linear-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/30"
                  : "bg-gray-800 cursor-not-allowed"
              }`}
          >
            {/* Shimmer on send button */}
            {input.trim() && !loading && (
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatDelay: 0.5,
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            )}
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={16} className="text-blue-400" />
              </motion.div>
            ) : (
              <Send
                size={16}
                className={input.trim() ? "text-white" : "text-gray-600"}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-gray-700 text-xs mt-2"
      >
        Press{" "}
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
          Enter
        </kbd>{" "}
        to send •{" "}
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
          Shift+Enter
        </kbd>{" "}
        for new line
      </motion.p>
    </div>
  );
}
