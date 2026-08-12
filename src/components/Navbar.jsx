import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Upload,
  BarChart2,
  Lightbulb,
  Briefcase,
  MessageCircle,
  Clock,
  FileText,
  User,
  Bell,
  Sparkles,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Upload, label: "Upload CV", path: "/upload" },
  { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
  { icon: Lightbulb, label: "Suggestions", path: "/suggestions" },
  { icon: Briefcase, label: "Job Matches", path: "/jobs" },
  { icon: MessageCircle, label: "AI Assistant", path: "/chat" },
  { icon: Clock, label: "History", path: "/history" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="mx-auto w-[98%] max-w-[1850px]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">
          <div className="flex items-center justify-between px-7 py-3">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 shrink-0">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-2xl blur-xl bg-cyan-500/40" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl">
                  <FileText size={20} className="text-white" />
                </div>
              </motion.div>

              <div>
                <h1 className="text-lg font-black text-white">
                  AI Resume Suite
                </h1>

                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Sparkles size={10} />
                  Intelligent Career Assistant
                </p>
              </div>
            </NavLink>

            {/* Navigation */}
            <nav className="hidden xl:flex items-center gap-3">
              {navItems.map(({ icon: Icon, label, path }) => (
                <NavLink key={path} to={path}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 overflow-hidden

                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                          }}
                        />
                      )}

                      <Icon size={16} className="relative z-10" />

                      <span className="relative z-10 text-[13px] font-semibold whitespace-nowrap">
                        {label}
                      </span>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3 shrink-0">
              <NavLink
                to="/upload"
                className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105"
              >
                <Upload size={16} />
                Start Analysis
              </NavLink>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900"
              >
                <Bell size={18} className="text-slate-300" />

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-slate-900" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-xl blur-xl bg-cyan-500/30" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-xl">
                  <User size={18} className="text-white" />

                  <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-green-400" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
