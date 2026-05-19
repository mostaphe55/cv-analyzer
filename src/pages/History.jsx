import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Briefcase,
  BarChart2,
  Sparkles,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const scoreTrend = (current, prev) => {
  if (!prev) return null;
  if (current > prev)
    return {
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      label: `+${current - prev}`,
    };
  if (current < prev)
    return {
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      label: `-${prev - current}`,
    };
  return {
    icon: Minus,
    color: "text-gray-400",
    bg: "bg-gray-500/10 border-gray-500/20",
    label: "0",
  };
};

const scoreColor = (score) =>
  score >= 80
    ? "text-green-400"
    : score >= 65
      ? "text-yellow-400"
      : "text-red-400";
const scoreBg = (score) =>
  score >= 80 ? "bg-green-500" : score >= 65 ? "bg-yellow-500" : "bg-red-500";
const scoreGlow = (score) =>
  score >= 80
    ? "shadow-green-500/20"
    : score >= 65
      ? "shadow-yellow-500/20"
      : "shadow-red-500/20";
const scoreLabel = (score) =>
  score >= 80 ? "🏆 Excellent" : score >= 65 ? "👍 Good" : "⚠️ Needs Work";
const scoreGrad = (score) =>
  score >= 80
    ? "from-green-600 to-emerald-400"
    : score >= 65
      ? "from-yellow-600 to-amber-400"
      : "from-red-600 to-rose-400";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// CV Detail Modal
function CVDetailModal({ entry, onClose }) {
  if (!entry) return null;
  const trend = scoreTrend(entry.score, entry.prevScore);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-md shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileText size={22} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base truncate max-w-[200px]">
                  {entry.filename}
                </h2>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                  <Calendar size={10} /> {entry.date} at {entry.time}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white transition-all"
            >
              <X size={14} />
            </motion.button>
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center mb-6">
            <div className={`relative w-32 h-32 mb-3`}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#modalGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${entry.score * 2.51} 251`}
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${entry.score * 2.51} 251` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="modalGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        entry.score >= 80
                          ? "#22c55e"
                          : entry.score >= 65
                            ? "#eab308"
                            : "#ef4444"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        entry.score >= 80
                          ? "#10b981"
                          : entry.score >= 65
                            ? "#f59e0b"
                            : "#f87171"
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-4xl font-black ${scoreColor(entry.score)}`}
                >
                  {entry.score}
                </motion.span>
                <span className="text-gray-500 text-xs">/ 100</span>
              </div>
            </div>
            <span className={`text-sm font-bold ${scoreColor(entry.score)}`}>
              {scoreLabel(entry.score)}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {
                icon: Briefcase,
                label: "Jobs Matched",
                value: entry.jobs,
                color: "text-blue-400",
                bg: "from-blue-900/30 to-blue-800/10",
              },
              {
                icon: CheckCircle,
                label: "Status",
                value: entry.status,
                color: "text-green-400",
                bg: "from-green-900/30 to-green-800/10",
              },
              {
                icon: Calendar,
                label: "Date",
                value: entry.date.split(",")[0],
                color: "text-purple-400",
                bg: "from-purple-900/30 to-purple-800/10",
              },
              {
                icon: Clock,
                label: "Time",
                value: entry.time,
                color: "text-cyan-400",
                bg: "from-cyan-900/30 to-cyan-800/10",
              },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-linear-to-br ${bg} border border-gray-800 rounded-2xl p-3 text-center`}
              >
                <Icon size={16} className={`${color} mx-auto mb-1`} />
                <p className="text-white font-bold text-sm">{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Score Trend */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between border rounded-2xl p-3 mb-5 ${trend.bg}`}
            >
              <span className="text-gray-400 text-sm">Score vs Previous</span>
              <div
                className={`flex items-center gap-1 font-bold ${trend.color}`}
              >
                <trend.icon size={14} />
                <span>{trend.label} points</span>
              </div>
            </motion.div>
          )}

          {/* Score Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">Overall Performance</span>
              <span className={`text-xs font-bold ${scoreColor(entry.score)}`}>
                {entry.score}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${entry.score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className={`h-3 rounded-full bg-linear-to-r ${scoreGrad(entry.score)}`}
              />
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-600/25 transition-all"
          >
            Close Details
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cvHistory") || "[]");
    if (saved.length === 0) {
      setHistory([
        {
          id: 1,
          filename: "Mohamed_CV_2025.pdf",
          date: "May 15, 2026",
          time: "11:45 PM",
          score: 78,
          prevScore: null,
          jobs: 6,
          status: "Completed",
        },
        {
          id: 2,
          filename: "Mohamed_CV_Updated.pdf",
          date: "April 28, 2026",
          time: "03:20 PM",
          score: 65,
          prevScore: 58,
          jobs: 4,
          status: "Completed",
        },
        {
          id: 3,
          filename: "Resume_Draft_v2.pdf",
          date: "April 10, 2026",
          time: "09:10 AM",
          score: 58,
          prevScore: 70,
          jobs: 3,
          status: "Completed",
        },
        {
          id: 4,
          filename: "My_Resume_Final.pdf",
          date: "March 22, 2026",
          time: "06:30 PM",
          score: 70,
          prevScore: null,
          jobs: 5,
          status: "Completed",
        },
      ]);
    } else {
      setHistory(saved);
    }
  }, []);

  const deleteEntry = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("cvHistory", JSON.stringify(updated));
    setDeleteConfirm(null);
  };

  const bestScore =
    history.length > 0 ? Math.max(...history.map((h) => h.score)) : 0;
  const firstScore = history.length > 0 ? history[history.length - 1].score : 0;
  const lastScore = history.length > 0 ? history[0].score : 0;
  const improvement = lastScore - firstScore;
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
      : 0;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* CV Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <CVDetailModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-red-500/20 rounded-3xl p-6 w-full max-w-sm text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 3, duration: 0.3 }}
                className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <Trash2 size={26} className="text-red-400" />
              </motion.div>
              <h3 className="text-white font-bold text-lg mb-2">
                Delete Analysis?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                This will permanently remove this CV analysis from your history.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-gray-400 font-semibold text-sm hover:text-white transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => deleteEntry(deleteConfirm)}
                  className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center"
          >
            <Clock size={22} className="text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">Analysis History</h1>
            <p className="text-gray-400 text-sm">
              Track your CV improvement journey over time
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
        >
          <Zap size={14} /> Analyze New CV
        </motion.button>
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
            label: "Total Analyses",
            value: history.length,
            icon: BarChart2,
            color: "text-white",
            bg: "from-gray-800 to-gray-900",
            border: "border-gray-700",
          },
          {
            label: "Best Score",
            value: bestScore,
            icon: Award,
            color: "text-green-400",
            bg: "from-green-900/40 to-green-800/10",
            border: "border-green-500/20",
          },
          {
            label: "Average Score",
            value: avgScore,
            icon: Target,
            color: "text-blue-400",
            bg: "from-blue-900/40 to-blue-800/10",
            border: "border-blue-500/20",
          },
          {
            label: "Total Growth",
            value: `${improvement >= 0 ? "+" : ""}${improvement}`,
            icon: improvement >= 0 ? TrendingUp : TrendingDown,
            color: improvement >= 0 ? "text-green-400" : "text-red-400",
            bg:
              improvement >= 0
                ? "from-green-900/40 to-green-800/10"
                : "from-red-900/40 to-red-800/10",
            border:
              improvement >= 0 ? "border-green-500/20" : "border-red-500/20",
          },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-linear-to-br ${bg} border ${border} rounded-2xl p-4 text-center cursor-default`}
          >
            <Icon size={18} className={`${color} mx-auto mb-2`} />
            <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Chart */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/3 to-purple-600/3 pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" />
              Score Journey
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              CV Score Over Time
            </div>
          </div>

          <div
            className="flex items-end justify-around gap-3"
            style={{ height: "120px" }}
          >
            {[...history].reverse().map(({ id, score, date, filename }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-0 cursor-pointer group"
                onClick={() =>
                  setSelectedEntry(history.find((h) => h.id === id))
                }
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className={`text-xs font-black ${scoreColor(score)}`}
                >
                  {score}
                </motion.span>
                <div
                  className="w-full relative bg-gray-800 rounded-xl overflow-hidden group-hover:opacity-80 transition-all"
                  style={{ height: "80px" }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${score}%` }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1 + 0.2,
                      ease: "easeOut",
                    }}
                    className={`absolute bottom-0 w-full ${scoreBg(score)} rounded-xl opacity-80`}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-linear-to-t from-transparent to-white/5 rounded-xl" />
                </div>
                <span className="text-gray-600 text-xs truncate w-full text-center leading-tight">
                  {date.split(",")[0]}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-700 text-xs text-center mt-3">
            Click on any bar to view details
          </p>
        </motion.div>
      )}

      {/* Timeline History List */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400" /> All Analyses
          </h2>
          <span className="text-gray-600 text-xs">{history.length} total</span>
        </div>

        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-14 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4"
            >
              <FileText size={28} className="text-gray-600" />
            </motion.div>
            <p className="text-white font-bold text-lg mb-2">No History Yet!</p>
            <p className="text-gray-500 text-sm mb-6">
              Upload your first CV to start tracking your progress
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/upload")}
              className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/25"
            >
              Upload CV Now
            </motion.button>
          </motion.div>
        )}

        <div className="relative">
          {/* Timeline line */}
          {history.length > 1 && (
            <div className="absolute left-6 top-8 bottom-8 w-px bg-linear-to-b from-blue-500/30 via-gray-700 to-transparent" />
          )}

          <div className="space-y-4">
            {history.map(
              (
                { id, filename, date, time, score, prevScore, jobs, status },
                index,
              ) => {
                const trend = scoreTrend(score, prevScore);
                return (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-900 z-10 ${scoreBg(score)} shadow-lg ${scoreGlow(score)}`}
                    />

                    <div
                      className="ml-12 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-4 md:p-5 transition-all group cursor-pointer"
                      onClick={() =>
                        setSelectedEntry({
                          id,
                          filename,
                          date,
                          time,
                          score,
                          prevScore,
                          jobs,
                          status,
                        })
                      }
                    >
                      <div className="flex items-start gap-4">
                        {/* File Icon */}
                        <motion.div
                          whileHover={{ rotate: 10 }}
                          className={`w-12 h-12 rounded-2xl bg-linear-to-br ${scoreGrad(score)} bg-opacity-10 flex items-center justify-center shrink-0 shadow-lg`}
                          style={{
                            background: `${score >= 80 ? "rgba(34,197,94,0.1)" : score >= 65 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)"}`,
                          }}
                        >
                          <FileText size={20} className={scoreColor(score)} />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-white font-bold text-sm md:text-base truncate">
                              {filename}
                            </p>
                            {index === 0 && (
                              <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold shrink-0"
                              >
                                Latest
                              </motion.span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                              <Clock size={10} /> {date} at {time}
                            </span>
                            <span className="text-gray-700">•</span>
                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                              <Briefcase size={10} /> {jobs} jobs matched
                            </span>
                            <span className="text-gray-700">•</span>
                            <span className="flex items-center gap-1 text-green-500 text-xs">
                              <CheckCircle size={10} /> {status}
                            </span>
                          </div>

                          {/* Score Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: index * 0.1 + 0.4,
                                  ease: "easeOut",
                                }}
                                className={`h-2 rounded-full bg-linear-to-r ${scoreGrad(score)}`}
                              />
                            </div>
                            <span
                              className={`text-xs font-bold shrink-0 ${scoreColor(score)}`}
                            >
                              {score}%
                            </span>
                          </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {/* Score Badge */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${scoreGrad(score)} flex flex-col items-center justify-center shadow-lg`}
                            style={{
                              background: `${score >= 80 ? "rgba(34,197,94,0.15)" : score >= 65 ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)"}`,
                              border: `1px solid ${score >= 80 ? "rgba(34,197,94,0.3)" : score >= 65 ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"}`,
                            }}
                          >
                            <span
                              className={`text-xl font-black ${scoreColor(score)}`}
                            >
                              {score}
                            </span>
                            <span className="text-gray-600 text-xs">score</span>
                          </motion.div>

                          {/* Trend Badge */}
                          {trend && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: index * 0.1 + 0.5,
                                type: "spring",
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold ${trend.color} ${trend.bg}`}
                            >
                              <trend.icon size={10} />
                              {trend.label}
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEntry({
                                  id,
                                  filename,
                                  date,
                                  time,
                                  score,
                                  prevScore,
                                  jobs,
                                  status,
                                });
                              }}
                              className="w-8 h-8 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all"
                            >
                              <Eye size={13} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(id);
                              }}
                              className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Click hint */}
                      <div className="flex items-center gap-1 mt-3 text-gray-700 text-xs opacity-0 group-hover:opacity-100 transition-all">
                        <Eye size={10} /> Click to view full details
                        <ChevronRight size={10} className="ml-auto" />
                      </div>
                    </div>
                  </motion.div>
                );
              },
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-linear-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 border border-blue-500/20 rounded-3xl p-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/25"
          >
            <RotateCcw size={20} className="text-white" />
          </motion.div>
          <h3 className="text-white font-bold mb-2">
            Keep Improving Your CV! 🚀
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Upload an updated CV to track your progress
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
          >
            <Zap size={16} /> Analyze New CV
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
