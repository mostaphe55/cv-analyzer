import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { generateJobLink } from "../utils/jobMatcher";
import AIJobSearchModal from "../components/AIJobSearchModal";

import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  ArrowRight,
  X,
  ExternalLink,
  Building2,
  Globe,
  Sparkles,
  Filter,
  Trophy,
  Medal,
} from "lucide-react";

const jobColors = [
  {
    grad: "from-blue-600 to-cyan-600",
    glow: "shadow-blue-600/20",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    grad: "from-purple-600 to-pink-600",
    glow: "shadow-purple-600/20",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    grad: "from-orange-600 to-yellow-600",
    glow: "shadow-orange-600/20",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
  {
    grad: "from-green-600 to-teal-600",
    glow: "shadow-green-600/20",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  {
    grad: "from-red-600 to-rose-600",
    glow: "shadow-red-600/20",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
  {
    grad: "from-indigo-600 to-violet-600",
    glow: "shadow-indigo-600/20",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
  },
];

const matchColor = (s) =>
  s >= 80 ? "text-green-400" : s >= 65 ? "text-yellow-400" : "text-red-400";

const matchGrad = (s) =>
  s >= 80
    ? "from-green-600 to-emerald-400"
    : s >= 65
      ? "from-yellow-600 to-amber-400"
      : "from-red-600 to-rose-400";

const matchLabel = (s) =>
  s >= 80 ? "Excellent Match" : s >= 65 ? "👍 Good Match" : "⚡ Partial Match";

const matchRank = (i) =>
  i === 0
    ? { icon: Trophy, color: "text-yellow-400", label: "Best Match" }
    : i === 1
      ? { icon: Medal, color: "text-gray-300", label: "2nd Best" }
      : i === 2
        ? { icon: Award, color: "text-orange-400", label: "3rd Best" }
        : null;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  },
};

// Job Detail Modal
function JobDetailModal({ job, index, onClose, onSearch }) {
  if (!job) return null;
  const color = jobColors[index % jobColors.length];
  const rank = matchRank(index);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Modal Hero */}
          <div
            className={`bg-linear-to-br ${color.grad} p-6 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg"
                >
                  <Briefcase size={26} className="text-white" />
                </motion.div>
                <div>
                  <h2 className="text-white font-black text-xl">{job.title}</h2>
                  <p className="text-white/70 text-sm">{job.company}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Match Score in Hero */}
            <div className="relative mt-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Match Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-white font-black text-4xl">
                    {job.match}%
                  </span>
                  <span className="text-white/60 text-sm mb-1">
                    {matchLabel(job.match)}
                  </span>
                </div>
              </div>
              {rank && (
                <div
                  className={`flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-2`}
                >
                  <rank.icon size={16} className={rank.color} />
                  <span className="text-white text-xs font-bold">
                    {rank.label}
                  </span>
                </div>
              )}
            </div>

            {/* Match bar */}
            <div className="relative mt-3 w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${job.match}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-2.5 rounded-full bg-white"
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  value: job.location || "Remote",
                  color: "text-blue-400",
                  bg: "from-blue-900/30 to-blue-800/10",
                },
                {
                  icon: Clock,
                  label: "Job Type",
                  value: job.type || "Full Time",
                  color: "text-cyan-400",
                  bg: "from-cyan-900/30 to-cyan-800/10",
                },
                {
                  icon: DollarSign,
                  label: "Salary",
                  value: job.salary || "Competitive",
                  color: "text-green-400",
                  bg: "from-green-900/30 to-green-800/10",
                },
                {
                  icon: Star,
                  label: "Source",
                  value: job.source,
                  color: "text-yellow-400",
                  bg: "from-yellow-900/30 to-yellow-800/10",
                },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-linear-to-br ${bg} border border-gray-800 rounded-2xl p-3`}
                >
                  <Icon size={14} className={`${color} mb-1`} />
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                </motion.div>
              ))}
            </div>
            {/* Skills You Have */}
            {job.skills?.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-400" /> Skills
                  You Already Have
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-1.5 rounded-xl font-semibold"
                    >
                      <CheckCircle size={10} /> {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            {/* Skills You Need */}
            {job.missing?.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <XCircle size={10} className="text-red-400" /> Skills You
                  Still Need
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.missing.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-xl font-semibold"
                    >
                      <XCircle size={10} /> {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            {/* Apply Button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSearch(job)}
              className={`w-full py-4 rounded-2xl text-white font-black text-base bg-linear-to-r ${color.grad} shadow-xl flex items-center justify-center gap-3 relative overflow-hidden`}
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <ExternalLink size={18} />
              Open Official Job
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function JobMatches() {
  const [jobs] = useState(() => {
    const saved = localStorage.getItem("cvAnalysis");

    if (!saved) return [];

    const data = JSON.parse(saved);

    return (data.jobMatches || []).map((job) => ({
      ...job,
      ...generateJobLink(job),
    }));
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [searchingJob, setSearchingJob] = useState(null);

  const navigate = useNavigate();

  const best = jobs.length > 0 ? Math.max(...jobs.map((j) => j.match)) : 0;

  const excellent = jobs.filter((j) => j.match >= 80).length;

  const good = jobs.filter((j) => j.match >= 65 && j.match < 80).length;

  const filtered = jobs
    .filter((j) => {
      if (filter === "excellent") return j.match >= 80;
      if (filter === "good") return j.match >= 65 && j.match < 80;
      if (filter === "partial") return j.match < 65;
      return true;
    })
    .sort((a, b) =>
      sortBy === "match" ? b.match - a.match : a.title?.localeCompare(b.title),
    );

  const startOfficialJobSearch = (job) => {
    if (!job) return;

    let openedWindow = null;

    if (job.applyUrl || job.website) {
      openedWindow = window.open("about:blank", "_blank");

      if (openedWindow) {
        openedWindow.opener = null;
        openedWindow.document.write(
          '<!doctype html><title>Opening job...</title><body style="font-family:system-ui;padding:24px;background:#111827;color:white">Opening official job page...</body>',
        );
        openedWindow.document.close();
      }
    }

    setSearchingJob({ ...job, openedWindow });
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <AIJobSearchModal
        job={searchingJob}
        onFinish={() => setSearchingJob(null)}
      />

      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            index={selectedIndex}
            onClose={() => setSelectedJob(null)}
            onSearch={startOfficialJobSearch}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8 flex-wrap gap-4"
      ></motion.div>
      {jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-16 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <Briefcase size={36} className="text-yellow-400" />
          </motion.div>

          <h2 className="text-white text-2xl font-bold mb-3">
            No Job Matches Yet!
          </h2>

          <p className="text-gray-500 mb-8">
            Upload your CV to get AI-powered job recommendations
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/upload")}
            className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/25"
          >
            Upload CV Now
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {[
              {
                label: "Jobs Found",
                value: jobs.length,
                icon: Briefcase,
                color: "text-white",
                bg: "from-gray-800 to-gray-900",
                border: "border-gray-700",
              },
              {
                label: "Excellent Matches",
                value: excellent,
                icon: Trophy,
                color: "text-yellow-400",
                bg: "from-yellow-900/40 to-yellow-800/10",
                border: "border-yellow-500/20",
              },
              {
                label: "Good Matches",
                value: good,
                icon: Award,
                color: "text-green-400",
                bg: "from-green-900/40 to-green-800/10",
                border: "border-green-500/20",
              },
              {
                label: "Best Score",
                value: `${best}%`,
                icon: Star,
                color: "text-blue-400",
                bg: "from-blue-900/40 to-blue-800/10",
                border: "border-blue-500/20",
              },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <motion.div
                key={label}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-linear-to-br ${bg} border ${border} rounded-2xl p-4 text-center cursor-default`}
              >
                <Icon size={18} className={`${color} mx-auto mb-2`} />
                <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Best Match Hero Banner */}
          {jobs[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-linear-to-r ${jobColors[0].grad} rounded-3xl p-6 mb-8 relative overflow-hidden cursor-pointer`}
              onClick={() => {
                setSelectedJob(jobs[0]);
                setSelectedIndex(0);
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xl"
                  >
                    <Trophy size={28} className="text-yellow-300" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                        🏆 Best Match
                      </span>
                    </div>
                    <h2 className="text-white font-black text-2xl">
                      {jobs[0].title}
                    </h2>
                    <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                      <Building2 size={12} /> {jobs[0].company} •
                      <MapPin size={12} /> {jobs[0].location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <motion.p
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-white font-black text-5xl"
                    >
                      {jobs[0].match}%
                    </motion.p>
                    <p className="text-white/60 text-xs">Match Score</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 3 }}
                    className="flex items-center gap-2 bg-white/20 border border-white/30 text-white font-bold px-4 py-2 rounded-xl text-sm"
                  >
                    View Details <ArrowRight size={14} />
                  </motion.div>
                </div>
              </div>

              {/* Match bar */}
              <div className="relative mt-5 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${jobs[0].match}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="h-2 rounded-full bg-white"
                />
              </div>
            </motion.div>
          )}

          {/* Filters and Sort */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6 flex-wrap gap-3"
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: "all", label: "All Jobs", count: jobs.length },
                { key: "excellent", label: "🔥 Excellent", count: excellent },
                { key: "good", label: "👍 Good", count: good },
                {
                  key: "partial",
                  label: "⚡ Partial",
                  count: jobs.length - excellent - good,
                },
              ].map(({ key, label, count }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all
                    ${
                      filter === key
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
                    }`}
                >
                  {label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${filter === key ? "bg-white/20" : "bg-gray-800"}`}
                  >
                    {count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
              <Filter size={12} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-400 text-xs outline-none cursor-pointer"
              >
                <option value="match">Sort by Match %</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </motion.div>

          {/* Jobs Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <AnimatePresence>
              {filtered.map((job, index) => {
                const originalIndex = jobs.indexOf(job);
                const color = jobColors[originalIndex % jobColors.length];
                const {
                  title,
                  company,
                  location,
                  type,
                  salary,
                  match,
                  skills = [],
                  missing = [],
                } = job;
                const rank = matchRank(originalIndex);

                return (
                  <motion.div
                    key={`${title}-${index}`}
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -6, scale: 1.01 }}
                    className={`bg-gray-900 border border-gray-800 hover:${color.border} rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-2xl hover:${color.glow} cursor-pointer group`}
                    onClick={() => {
                      setSelectedJob(job);
                      setSelectedIndex(originalIndex);
                    }}
                  >
                    {/* Card Top Gradient Bar */}
                    <div
                      className={`h-1.5 w-full bg-linear-to-r ${color.grad}`}
                    />

                    <div className="p-5">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 15 }}
                            className={`w-12 h-12 rounded-2xl bg-linear-to-br ${color.grad} flex items-center justify-center shadow-lg ${color.glow}`}
                          >
                            <Briefcase size={20} className="text-white" />
                          </motion.div>
                          <div className="min-w-0">
                            <h3 className="text-white font-bold text-base truncate">
                              {title}
                            </h3>
                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <Building2 size={10} /> {company}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`text-2xl font-black ${matchColor(match)}`}
                          >
                            {match}%
                          </motion.div>
                          {rank && (
                            <div
                              className={`flex items-center gap-1 text-xs font-bold ${rank.color}`}
                            >
                              <rank.icon size={10} />
                              {rank.label}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Match Bar */}
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${match}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: index * 0.1,
                          }}
                          className={`h-2 rounded-full bg-linear-to-r ${matchGrad(match)}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        {matchLabel(match)}
                      </p>

                      {/* Job Details */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          { icon: MapPin, text: location || "Remote" },
                          { icon: Clock, text: type || "Full Time" },
                          { icon: DollarSign, text: salary || "Competitive" },
                          { icon: Globe, text: job.source },
                        ].map(({ icon: Icon, text }) => (
                          <div
                            key={text}
                            className="flex items-center gap-1.5 text-gray-400 text-xs"
                          >
                            <Icon
                              size={11}
                              className="text-gray-600 shrink-0"
                            />
                            <span className="truncate">{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle size={9} className="text-green-400" />{" "}
                            You Have
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.slice(0, 3).map((s, i) => (
                              <motion.span
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-lg font-semibold"
                              >
                                <CheckCircle size={9} /> {s}
                              </motion.span>
                            ))}
                            {skills.length > 3 && (
                              <span className="text-gray-500 text-xs px-2 py-1">
                                +{skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {missing.length > 0 && (
                        <div className="mb-5">
                          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <XCircle size={9} className="text-red-400" /> You
                            Need
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missing.slice(0, 3).map((s, i) => (
                              <motion.span
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-1 rounded-lg font-semibold"
                              >
                                <XCircle size={9} /> {s}
                              </motion.span>
                            ))}
                            {missing.length > 3 && (
                              <span className="text-gray-500 text-xs px-2 py-1">
                                +{missing.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startOfficialJobSearch(job);
                        }}
                        className={`w-full py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r ${color.grad} flex items-center justify-center gap-2 relative overflow-hidden shadow-lg`}
                      >
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            repeatDelay: 2,
                          }}
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                        <ExternalLink size={14} />
                        Open Official Job
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 bg-linear-to-r from-blue-600/10 via-cyan-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25"
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-2">
              Want Better Job Matches?
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Improve your CV based on the suggestions to unlock higher match
              scores!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/suggestions")}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
              >
                <Zap size={16} /> View Suggestions <ArrowRight size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/chat")}
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white font-semibold px-8 py-3 rounded-2xl hover:border-blue-500/50 transition-all"
              >
                <Sparkles size={16} /> Ask AI Assistant
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
