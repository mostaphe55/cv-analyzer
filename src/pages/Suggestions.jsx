import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Info,
  Zap,
  Target,
  Award,
  BookOpen,
  Code,
  Briefcase,
  Globe,
  Users,
  Printer,
  Share2,
  Trophy,
  Medal,
  Star,
  ChevronDown,
  XCircle,
  Sparkles,
} from "lucide-react";

const colorMap = {
  red: {
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    icon: "text-red-400",
    dot: "bg-red-400",
    glow: "hover:shadow-red-500/10",
    border: "hover:border-red-500/30",
    bg: "from-red-600/10 to-transparent",
    priorityIcon: AlertTriangle,
    ring: "ring-red-500/20",
  },
  yellow: {
    badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    icon: "text-yellow-400",
    dot: "bg-yellow-400",
    glow: "hover:shadow-yellow-500/10",
    border: "hover:border-yellow-500/30",
    bg: "from-yellow-600/10 to-transparent",
    priorityIcon: Zap,
    ring: "ring-yellow-500/20",
  },
  blue: {
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: "text-blue-400",
    dot: "bg-blue-400",
    glow: "hover:shadow-blue-500/10",
    border: "hover:border-blue-500/30",
    bg: "from-blue-600/10 to-transparent",
    priorityIcon: Info,
    ring: "ring-blue-500/20",
  },
};

const demandConfig = {
  "Very High": {
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    bar: "bg-linear-to-r from-red-600 to-red-400",
    pct: 95,
    medal: "🥇",
  },
  High: {
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    bar: "bg-linear-to-r from-yellow-600 to-yellow-400",
    pct: 75,
    medal: "🥈",
  },
  Medium: {
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    bar: "bg-linear-to-r from-blue-600 to-blue-400",
    pct: 50,
    medal: "🥉",
  },
};

const skillIcons = [
  Code,
  Globe,
  Briefcase,
  BookOpen,
  Users,
  Target,
  Award,
  Zap,
  Star,
  Trophy,
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const skillVariants = {
  hidden: { opacity: 0, x: -40 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

export default function Suggestions() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("cvAnalysis");
    if (saved) setData(JSON.parse(saved));
    const savedChecked = localStorage.getItem("suggestionChecked");
    if (savedChecked) setChecked(JSON.parse(savedChecked));
  }, []);

  const toggleCheck = (i) => {
    const updated = { ...checked, [i]: !checked[i] };
    setChecked(updated);
    localStorage.setItem("suggestionChecked", JSON.stringify(updated));
    const allDone = Object.values(updated).filter(Boolean).length;
    if (allDone === data?.suggestions?.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const text = data.suggestions
      .map(
        (s, i) =>
          `${i + 1}. [${s.priority}] ${s.title}\n   ${s.desc}\n   ✅ Fix: ${s.action}`,
      )
      .join("\n\n");
    navigator.clipboard.writeText(`🎯 CV Improvement Suggestions\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => window.print();

  if (!data)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-16 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <Lightbulb size={40} className="text-yellow-400" />
          </motion.div>
          <h2 className="text-white text-2xl font-bold mb-2">
            No CV Analyzed Yet!
          </h2>
          <p className="text-gray-500 mb-8">
            Upload your CV to get world-class AI suggestions
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-600/25"
          >
            Upload CV Now
          </button>
        </div>
      </motion.div>
    );

  const { suggestions = [], missingSkills = [] } = data;
  const high = suggestions.filter((s) => s.priority === "High");
  const medium = suggestions.filter((s) => s.priority === "Medium");
  const low = suggestions.filter((s) => s.priority === "Low");
  const filtered =
    activeTab === "all"
      ? suggestions
      : activeTab === "high"
        ? high
        : activeTab === "medium"
          ? medium
          : low;
  const completedCount = Object.values(checked).filter(Boolean).length;
  const completionPct = Math.round(
    (completedCount / (suggestions.length || 1)) * 100,
  );

  const sortedSkills = [...missingSkills].sort((a, b) => {
    const order = { "Very High": 0, High: 1, Medium: 2 };
    return (order[a.demand] ?? 3) - (order[b.demand] ?? 3);
  });

  return (
    <div className="max-w-4xl mx-auto pb-10" ref={printRef}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gray-900/90 border border-green-500/30 rounded-3xl p-10 text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-white text-2xl font-bold mb-2">All Done!</h2>
              <p className="text-green-400">You completed all suggestions!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-8 flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 flex items-center justify-center"
          >
            <Lightbulb size={22} className="text-yellow-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Suggestions</h1>
            <p className="text-gray-400 text-sm">
              Personalized roadmap to your dream job
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border
              ${copied ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"}`}
          >
            {copied ? (
              <>
                <CheckCircle size={14} /> Copied!
              </>
            ) : (
              <>
                <Share2 size={14} /> Share
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
          >
            <Printer size={14} /> Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {[
          {
            label: "Total Issues",
            value: suggestions.length,
            color: "text-white",
            icon: Target,
            bg: "from-gray-700 to-gray-800",
          },
          {
            label: "High Priority",
            value: high.length,
            color: "text-red-400",
            icon: AlertTriangle,
            bg: "from-red-900/40 to-red-800/20",
          },
          {
            label: "Medium Priority",
            value: medium.length,
            color: "text-yellow-400",
            icon: Zap,
            bg: "from-yellow-900/40 to-yellow-800/20",
          },
          {
            label: "Completed",
            value: completedCount,
            color: "text-green-400",
            icon: CheckCircle,
            bg: "from-green-900/40 to-green-800/20",
          },
        ].map(({ label, value, color, icon: Icon, bg }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`bg-linear-to-br ${bg} border border-gray-800 rounded-2xl p-4 text-center cursor-default`}
          >
            <Icon size={18} className={`${color} mx-auto mb-2`} />
            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <span className="text-white font-bold text-sm">Your Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">
              {completedCount}/{suggestions.length} fixed
            </span>
            <span
              className={`text-sm font-bold ${completionPct === 100 ? "text-green-400" : "text-blue-400"}`}
            >
              {completionPct}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="h-3 rounded-full bg-linear-to-r from-blue-600 via-cyan-500 to-green-500"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-600 text-xs">
            Keep going! Check off suggestions as you fix them
          </span>
          {completionPct === 100 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-400 text-xs font-bold"
            >
              🏆 All Done!
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* CV Health */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-blue-400" />
            <span className="text-white font-semibold text-sm">
              CV Health Score
            </span>
          </div>
          <span className="text-white font-bold text-xl">
            {data.overallScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.overallScore}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="h-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-500"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Needs Work</span>
          <span
            className={`font-bold text-sm ${data.overallScore >= 80 ? "text-green-400" : data.overallScore >= 65 ? "text-yellow-400" : "text-red-400"}`}
          >
            {data.overallScore >= 80
              ? "🏆 Excellent CV"
              : data.overallScore >= 65
                ? "👍 Good CV"
                : "⚠️ Needs Work"}
          </span>
          <span>Excellent</span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 mb-6 flex-wrap"
      >
        {[
          {
            key: "all",
            label: "All Issues",
            count: suggestions.length,
            color: "from-blue-600 to-cyan-600",
          },
          {
            key: "high",
            label: "🔴 High",
            count: high.length,
            color: "from-red-600 to-red-500",
          },
          {
            key: "medium",
            label: "🟡 Medium",
            count: medium.length,
            color: "from-yellow-600 to-yellow-500",
          },
          {
            key: "low",
            label: "🔵 Low",
            count: low.length,
            color: "from-blue-600 to-blue-500",
          },
        ].map(({ key, label, count, color }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${
                activeTab === key
                  ? `bg-linear-to-r ${color} text-white shadow-lg`
                  : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
          >
            {label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === key ? "bg-white/20" : "bg-gray-800"}`}
            >
              {count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Suggestion Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4 mb-12"
      >
        <AnimatePresence mode="wait">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center"
            >
              <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-bold text-lg">No issues here!</p>
              <p className="text-gray-500 text-sm mt-1">
                This area of your CV is strong 💪
              </p>
            </motion.div>
          )}
          {filtered.map(({ priority, color, title, desc, action }, i) => {
            const c = colorMap[color] || colorMap.blue;
            const PriorityIcon = c.priorityIcon;
            const isExpanded = expanded === i;
            const isDone = checked[i];
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                layout
                className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl ${isDone ? "border-green-500/30 opacity-75" : `border-gray-800 ${c.border}`}`}
              >
                {/* Card Header */}
                <div
                  className={`bg-linear-to-r ${isDone ? "from-green-600/5" : c.bg} to-transparent p-5 cursor-pointer`}
                  onClick={() => setExpanded(isExpanded ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(i);
                      }}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                        ${isDone ? "bg-green-500 border-green-500" : "border-gray-600 hover:border-green-400"}`}
                    >
                      {isDone && (
                        <CheckCircle size={14} className="text-white" />
                      )}
                    </motion.button>

                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.badge}`}
                    >
                      {isDone ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <PriorityIcon size={14} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-bold text-sm md:text-base ${isDone ? "line-through text-gray-500" : "text-white"}`}
                      >
                        {title}
                      </h3>
                      {!isExpanded && (
                        <p className="text-gray-500 text-xs mt-1 truncate">
                          {desc}
                        </p>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isDone && (
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full font-semibold">
                          ✓ Done
                        </span>
                      )}
                      {!isDone && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${c.badge}`}
                        >
                          {priority}
                        </span>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center"
                      >
                        <ChevronDown size={12} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-800/50 overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3 mt-4">
                        <div className="bg-gray-800/40 rounded-xl p-4">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                            📋 Why This Matters
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {desc}
                          </p>
                        </div>
                        <div
                          className={`rounded-xl p-4 border ${color === "red" ? "bg-red-500/5 border-red-500/20" : color === "yellow" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-blue-500/5 border-blue-500/20"}`}
                        >
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                            ⚡ How To Fix It
                          </p>
                          <div className="flex items-start gap-2">
                            <ArrowRight
                              size={14}
                              className={`${c.icon} mt-0.5 shrink-0`}
                            />
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {action}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-800/40 rounded-xl p-3">
                          <span className="text-gray-500 text-xs">
                            Impact Level
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((dot) => (
                              <motion.div
                                key={dot}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: dot * 0.1 }}
                                className={`w-2 h-2 rounded-full ${priority === "High" ? "bg-red-400" : priority === "Medium" && dot <= 2 ? "bg-yellow-400" : priority === "Low" && dot <= 1 ? "bg-blue-400" : "bg-gray-700"}`}
                              />
                            ))}
                            <span
                              className={`text-xs font-bold ml-2 ${priority === "High" ? "text-red-400" : priority === "Medium" ? "text-yellow-400" : "text-blue-400"}`}
                            >
                              {priority === "High"
                                ? "Very High"
                                : priority === "Medium"
                                  ? "Medium"
                                  : "Low"}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleCheck(i)}
                          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                            ${
                              isDone
                                ? "bg-gray-800 text-gray-500 border border-gray-700"
                                : "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
                            }`}
                        >
                          {isDone ? (
                            <>
                              <XCircle size={16} /> Mark As Not Done
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} /> Mark As Fixed ✓
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Leaderboard Skills */}
      {sortedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 rounded-2xl bg-linear-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 flex items-center justify-center"
            >
              <Trophy size={22} className="text-yellow-400" />
            </motion.div>
            <div>
              <h2 className="text-white font-bold text-xl">
                Skills Leaderboard
              </h2>
              <p className="text-gray-500 text-xs">
                Ranked by market demand — learn these to boost your career
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {sortedSkills.map(({ skill, demand }, i) => {
              const config = demandConfig[demand] || demandConfig["Medium"];
              const IconComponent = skillIcons[i % skillIcons.length];
              const rankColors = [
                "from-yellow-600 to-yellow-400",
                "from-gray-400 to-gray-300",
                "from-orange-600 to-orange-400",
              ];
              const rankBg =
                i === 0
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : i === 1
                    ? "border-gray-500/30 bg-gray-500/5"
                    : i === 2
                      ? "border-orange-500/30 bg-orange-500/5"
                      : "border-gray-800";

              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={skillVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ x: 6, scale: 1.01 }}
                  className={`bg-gray-900 border ${rankBg} rounded-2xl p-4 transition-all cursor-default`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${rankColors[i] || "from-gray-700 to-gray-600"} flex items-center justify-center shrink-0 shadow-lg`}
                    >
                      {i < 3 ? (
                        <span className="text-white font-black text-sm">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        <span className="text-white font-black text-sm">
                          #{i + 1}
                        </span>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <IconComponent size={16} className="text-blue-400" />
                    </div>

                    {/* Skill Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold text-sm">
                          {skill}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-semibold ${config.color}`}
                        >
                          {demand}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${config.pct}%` }}
                          transition={{
                            duration: 1,
                            delay: i * 0.15,
                            ease: "easeOut",
                          }}
                          className={`h-2 rounded-full ${config.bar}`}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600 text-xs">
                          Market Demand
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">
                          {config.pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-linear-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 border border-blue-500/20 rounded-3xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25"
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-2">
              Ready To Level Up? 🚀
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Fix these suggestions and learn the missing skills to skyrocket
              your CV score and land your dream job!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
              >
                <Target size={16} /> See Job Matches <ArrowRight size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/chat")}
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white font-semibold px-8 py-3 rounded-2xl hover:border-blue-500/50 transition-all"
              >
                <Lightbulb size={16} /> Ask AI Assistant
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
