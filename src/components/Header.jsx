import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": { title: "Welcome Back!", sub: "Ready to analyze your CV today?" },
  "/upload": {
    title: "Upload Your CV",
    sub: "Upload your resume and get smart insights",
  },
  "/dashboard": {
    title: "Analysis Dashboard",
    sub: "Your complete AI-powered CV results",
  },
  "/suggestions": {
    title: "AI Suggestions",
    sub: "Smart tips to improve your CV",
  },
  "/jobs": { title: "Job Matches", sub: "Jobs matched to your profile by AI" },
  "/chat": {
    title: "AI Career Assistant",
    sub: "Ask me anything about your CV or career",
  },
  "/history": {
    title: "Analysis History",
    sub: "Track your CV improvement over time",
  },
};

export default function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || pageTitles["/"];

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-white font-semibold text-lg">{page.title}</h2>
        <p className="text-gray-500 text-xs">{page.sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
          <Bell size={16} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}
