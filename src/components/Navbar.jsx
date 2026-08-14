import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./AuthModal";
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
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const gsiButtonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const handleCredentialResponse = (response) => {
      try {
        const jwt = response.credential;
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        setUser({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
        setOpen(true);
      } catch (e) {
        console.error("Failed to parse credential:", e);
      }
    };

    const existing = document.getElementById("gsi-client-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "gsi-client-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          });
          if (gsiButtonRef.current) {
            window.google.accounts.id.renderButton(gsiButtonRef.current, {
              theme: "filled_blue",
              size: "large",
            });
          }
        }
      };
      document.head.appendChild(script);
    } else if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.id
    ) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      if (gsiButtonRef.current) {
        window.google.accounts.id.renderButton(gsiButtonRef.current, {
          theme: "filled_blue",
          size: "large",
        });
      }
    }

    return () => {
      // cleanup: no global teardown API for gsi button; disable auto select if available
      try {
        if (
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          window.google.accounts.id.cancel();
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cv_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

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

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  onClick={() => setOpen((s) => !s)}
                >
                  <div className="absolute inset-0 rounded-xl blur-xl bg-cyan-500/30" />

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-xl">
                    <User size={18} className="text-white" />

                    <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-green-400" />
                  </div>
                </motion.button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-64 rounded-lg border border-white/10 bg-slate-900 p-4 shadow-xl z-50">
                    {!user ? (
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-slate-300">
                          Sign in to save settings and see personalized
                          suggestions
                        </p>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => setModalOpen(true)}
                            className="flex-1 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white"
                          >
                            Sign in
                          </button>
                          <button
                            onClick={() => setModalOpen(true)}
                            className="flex-1 rounded-md border border-white/10 px-3 py-2 text-sm text-white"
                          >
                            Sign up
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">
                          Sign in with Google or email to personalize your
                          experience.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="h-12 w-12 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-xs text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="flex-1 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white"
                            onClick={() => {
                              window.location.href = "/dashboard";
                            }}
                          >
                            View Dashboard
                          </button>
                          <button
                            className="flex-1 rounded-md border border-white/10 px-3 py-2 text-sm text-white"
                            onClick={() => {
                              setUser(null);
                              try {
                                window.google &&
                                  window.google.accounts &&
                                  window.google.accounts.id &&
                                  window.google.accounts.id.disableAutoSelect &&
                                  window.google.accounts.id.disableAutoSelect();
                              } catch (e) {}
                              setOpen(false);
                            }}
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <AuthModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onSignIn={(u) => {
                    setUser(u);
                    setModalOpen(false);
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
