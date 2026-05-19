import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  CheckCircle,
  AlertCircle,
  Star,
  Briefcase,
  Code,
  GraduationCap,
  User,
  TrendingUp,
  Zap,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } },
};

// Animated Score Circle
function ScoreCircle({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const color = score >= 80 ? "#22c55e" : score >= 65 ? "#eab308" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Good" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Outer glow ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 40px ${color}30` }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
          />

          {/* Glow circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            opacity="0.1"
            strokeDasharray={circumference}
          />

          {/* Animated progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />

          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayed}
            className="text-5xl font-black text-white leading-none"
            style={{ color }}
          >
            {displayed}
          </motion.span>
          <span className="text-gray-500 text-xs mt-1">out of 100</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-4"
      >
        <p className="text-white font-bold text-lg">Overall CV Score</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star size={14} style={{ color }} className="fill-current" />
          </motion.div>
          <span className="text-sm font-bold" style={{ color }}>
            {label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">
          {payload[0].value}% match
        </p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cvName, setCvName] = useState("");
  const [activeBar, setActiveBar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cvAnalysis");
    const name = localStorage.getItem("currentCV");
    if (saved) setData(JSON.parse(saved));
    if (name) setCvName(name);
  }, []);

  if (!data)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-16 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <BarChart2 size={40} className="text-yellow-400" />
          </motion.div>
          <h2 className="text-white text-2xl font-bold mb-3">
            No CV Analyzed Yet!
          </h2>
          <p className="text-gray-500 mb-8">
            Upload your CV to see your amazing dashboard
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/upload")}
            className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/25"
          >
            Upload CV Now
          </motion.button>
        </div>
      </motion.div>
    );

  const overallScore = data.overallScore || 0;
  const breakdown = data.breakdown || {
    skills: 0,
    experience: 0,
    education: 0,
    formatting: 0,
  };
  const atsScore = data.atsScore || 0;
  const atsChecklist = data.atsChecklist || [];
  const radarData = data.radarData || [];
  const jobMatches = data.jobMatches || [];

  const barData = jobMatches.slice(0, 5).map((j) => ({
    job: j.title?.split(" ").slice(0, 2).join(" ") || "Job",
    match: j.match || 0,
  }));

  const barColors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

  const scoreBreakdown = [
    {
      icon: Code,
      label: "Skills",
      score: breakdown.skills,
      color: "#3b82f6",
      bg: "from-blue-600 to-blue-400",
    },
    {
      icon: Briefcase,
      label: "Experience",
      score: breakdown.experience,
      color: "#06b6d4",
      bg: "from-cyan-600 to-cyan-400",
    },
    {
      icon: GraduationCap,
      label: "Education",
      score: breakdown.education,
      color: "#22c55e",
      bg: "from-green-600 to-green-400",
    },
    {
      icon: User,
      label: "Formatting",
      score: breakdown.formatting,
      color: "#eab308",
      bg: "from-yellow-600 to-yellow-400",
    },
  ];

  const passCount = atsChecklist.filter((a) => a.pass).length;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-8 flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center"
          >
            <Sparkles size={22} className="text-blue-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              CV Analysis Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Results for:{" "}
              <span className="text-blue-400 font-semibold">{cvName}</span>
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-blue-500/50 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          <RefreshCw size={14} /> Re-analyze
        </motion.button>
      </motion.div>

      {/* Top Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {[
          {
            label: "CV Score",
            value: `${overallScore}`,
            icon: Award,
            color: "text-blue-400",
            bg: "from-blue-900/40 to-blue-800/10",
            border: "border-blue-500/20",
          },
          {
            label: "ATS Score",
            value: `${atsScore}%`,
            icon: Target,
            color: "text-cyan-400",
            bg: "from-cyan-900/40 to-cyan-800/10",
            border: "border-cyan-500/20",
          },
          {
            label: "ATS Passed",
            value: `${passCount}/${atsChecklist.length}`,
            icon: CheckCircle,
            color: "text-green-400",
            bg: "from-green-900/40 to-green-800/10",
            border: "border-green-500/20",
          },
          {
            label: "Job Matches",
            value: `${jobMatches.length}`,
            icon: Briefcase,
            color: "text-purple-400",
            bg: "from-purple-900/40 to-purple-800/10",
            border: "border-purple-500/20",
          },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-linear-to-br ${bg} border ${border} rounded-2xl p-4 text-center cursor-default`}
          >
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Score Circle */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate="show"
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 to-cyan-600/5" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-2xl" />

          <ScoreCircle score={overallScore} />
        </motion.div>

        {/* ATS Compatibility */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
        >
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-400" /> ATS Compatibility
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${atsScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500"
              />
            </div>
            <span className="text-cyan-400 font-bold text-sm">{atsScore}%</span>
          </div>

          <div className="space-y-3">
            {atsChecklist.map(({ label, pass }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${pass ? "bg-green-500/5" : "bg-red-500/5"}`}
              >
                <span className="text-gray-400 text-sm">{label}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                >
                  {pass ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400" />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="show"
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
        >
          <h3 className="text-white font-bold text-lg mb-6">Score Breakdown</h3>
          <div className="space-y-5">
            {scoreBreakdown.map(
              ({ icon: Icon, label, score, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg bg-linear-to-br ${bg} flex items-center justify-center`}
                      >
                        <Icon size={12} className="text-white" />
                      </div>
                      <span className="text-gray-400 text-sm">{label}</span>
                    </div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="text-white text-sm font-bold"
                      style={{ color }}
                    >
                      {score}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.4 + i * 0.15,
                        ease: "easeOut",
                      }}
                      className={`h-2.5 rounded-full bg-linear-to-r ${bg}`}
                    />
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/3 to-transparent" />
          <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" /> Skill Radar Analysis
          </h3>
          <p className="text-gray-600 text-xs mb-4">
            Your strengths across all CV dimensions
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <Radar
                name="CV"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-bl from-purple-600/3 to-transparent" />
          <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" /> Job Match
            Scores
          </h3>
          <p className="text-gray-600 text-xs mb-4">
            How well your CV matches each job role
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical" barSize={14}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="job"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#ffffff08" }}
              />
              <Bar
                dataKey="match"
                radius={[0, 8, 8, 0]}
                onMouseEnter={(_, index) => setActiveBar(index)}
                onMouseLeave={() => setActiveBar(null)}
              >
                {barData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={barColors[index % barColors.length]}
                    opacity={
                      activeBar === null || activeBar === index ? 1 : 0.4
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Job Matches Preview */}
      {jobMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Briefcase size={18} className="text-blue-400" /> Top Job Matches
            </h3>
            <motion.button
              whileHover={{ scale: 1.05, x: 3 }}
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-1 text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors"
            >
              View All <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="space-y-3">
            {jobMatches.slice(0, 3).map((job, i) => {
              const matchColor =
                job.match >= 80
                  ? "#22c55e"
                  : job.match >= 65
                    ? "#eab308"
                    : "#ef4444";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-4 cursor-pointer transition-all"
                  onClick={() => navigate("/jobs")}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${barColors[i] ? "" : ""} flex items-center justify-center shrink-0`}
                    style={{
                      background: `${barColors[i]}20`,
                      border: `1px solid ${barColors[i]}30`,
                    }}
                  >
                    <Briefcase size={16} style={{ color: barColors[i] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {job.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p
                        className="font-black text-lg"
                        style={{ color: matchColor }}
                      >
                        {job.match}%
                      </p>
                      <p className="text-gray-600 text-xs">match</p>
                    </div>
                    <div className="w-16 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${job.match}%` }}
                        transition={{ duration: 1, delay: 1 + i * 0.15 }}
                        className="h-2 rounded-full"
                        style={{ background: matchColor }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Bottom CTA Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            label: "View Suggestions",
            sub: "Fix issues to boost score",
            icon: Zap,
            path: "/suggestions",
            color: "from-yellow-600/20 to-orange-600/20",
            border: "border-yellow-500/20",
            iconColor: "text-yellow-400",
          },
          {
            label: "See Job Matches",
            sub: "Find your perfect role",
            icon: Target,
            path: "/jobs",
            color: "from-blue-600/20 to-cyan-600/20",
            border: "border-blue-500/20",
            iconColor: "text-blue-400",
          },
          {
            label: "Ask AI Assistant",
            sub: "Get personalized advice",
            icon: Sparkles,
            path: "/chat",
            color: "from-purple-600/20 to-pink-600/20",
            border: "border-purple-500/20",
            iconColor: "text-purple-400",
          },
        ].map(({ label, sub, icon: Icon, path, color, border, iconColor }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)}
            className={`bg-linear-to-br ${color} border ${border} rounded-2xl p-5 text-left transition-all hover:shadow-xl group`}
          >
            <Icon
              size={22}
              className={`${iconColor} mb-3 group-hover:scale-110 transition-transform`}
            />
            <p className="text-white font-bold text-sm">{label}</p>
            <p className="text-gray-500 text-xs mt-1">{sub}</p>
            <div
              className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: iconColor.replace("text-", "") }}
            >
              Go now <ArrowRight size={12} />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
