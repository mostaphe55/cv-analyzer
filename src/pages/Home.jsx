import { useNavigate } from "react-router-dom";
import {
  Upload,
  Zap,
  Target,
  MessageCircle,
  BarChart2,
  Lightbulb,
  ArrowRight,
  Star,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: BarChart2,
    title: "CV Score",
    desc: "Get a detailed quality score for your resume out of 100",
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: Target,
    title: "Job Matching",
    desc: "Match with jobs that fit your profile perfectly",
    color: "from-cyan-600 to-cyan-400",
  },
  {
    icon: Lightbulb,
    title: "AI Suggestions",
    desc: "Get smart tips to improve your CV instantly",
    color: "from-yellow-600 to-yellow-400",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    desc: "Chat with AI about your career and CV anytime",
    color: "from-purple-600 to-purple-400",
  },
  {
    icon: Zap,
    title: "ATS Checker",
    desc: "See if your CV passes real company filters",
    color: "from-green-600 to-green-400",
  },
  {
    icon: Upload,
    title: "Easy Upload",
    desc: "Upload PDF, DOCX or TXT CV in seconds",
    color: "from-red-600 to-red-400",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Your CV",
    desc: "Upload your resume in PDF, Word or TXT format",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Analyzes It",
    desc: "Our AI reads and scores every section of your CV",
    icon: Zap,
  },
  {
    step: "03",
    title: "Get Results",
    desc: "See your score, job matches and improvement tips",
    icon: Star,
  },
];

const stats = [
  {
    value: "95%",
    label: "Analysis Accuracy",
    icon: BarChart2,
    color: "text-blue-400",
  },
  {
    value: "6+",
    label: "AI Powered Features",
    icon: Zap,
    color: "text-cyan-400",
  },
  { value: "100%", label: "Free To Use", icon: Star, color: "text-yellow-400" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Hero Section */}
      <div className="relative text-center mb-16 mt-4">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 mb-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400 text-sm font-semibold tracking-wide">
            AI Powered Resume Analysis
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Take Your Career To
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-400 to-blue-600">
            The Next Level
          </span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your CV and get instant AI-powered feedback, job matches, skill
          gap analysis, ATS score and professional improvement tips — all for
          free!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 text-base"
          >
            <Upload size={20} />
            Upload Your CV Now
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-200 border border-gray-700 hover:border-gray-500 text-base"
          >
            <BarChart2 size={20} />
            View Demo Dashboard
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
          {[
            { icon: Shield, text: "100% Free" },
            { icon: Zap, text: "Instant Results" },
            { icon: Star, text: "AI Powered" },
            { icon: Clock, text: "Takes 30 Seconds" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-gray-500 text-xs"
            >
              <Icon size={13} className="text-blue-400" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {stats.map(({ value, label, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl p-6 text-center transition-all duration-200 group"
          >
            <Icon size={32} className={`${color} mx-auto mb-3`} />
            <div className="text-4xl font-bold text-white mb-2">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-sm">
            3 simple steps to transform your career
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ step, title, desc, icon: Icon }, index) => (
            <div key={step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-linear-to-r from-blue-500/50 to-transparent z-10 -translate-x-6" />
              )}
              <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl p-6 text-center transition-all duration-200 hover:bg-gray-800/50">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center">
                    <Icon size={28} className="text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Everything You Need
          </h2>
          <p className="text-gray-500 text-sm">
            All tools to land your dream job in one place
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all duration-200 hover:bg-gray-800/50 group cursor-pointer hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold mb-2 text-base">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-4 text-blue-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="mt-16 bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-3xl p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready To Improve Your CV? 🚀
        </h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Join thousands of job seekers who improved their CV with AI
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-600/25 text-base"
        >
          <Upload size={20} />
          Analyze My CV For Free
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
