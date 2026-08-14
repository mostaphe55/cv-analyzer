import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Check,
  ArrowRight,
} from "lucide-react";

export default function SignInForm({ onSignIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email) {
      setError("Enter your email address.");
      return;
    }
    if (!form.password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const name = form.email.split("@")[0];
      const user = {
        name,
        email: form.email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      };
      localStorage.setItem("cv_user", JSON.stringify(user));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => onSignIn(user), 1000);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="relative w-full max-w-md mx-auto"
      style={{
        background: "rgba(17,24,39,0.95)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "2.5rem",
        overflow: "hidden",
      }}
    >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400/60 to-transparent" />

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"
              >
                <Check size={32} className="text-green-400" />
              </motion.div>
              <h2 className="text-white text-xl font-semibold mb-2">
                Signed in
              </h2>
              <p className="text-gray-500 text-sm">
                Redirecting to your dashboard...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25"
                >
                  <FileText size={26} className="text-white" />
                </motion.div>
                <h2 className="text-white text-2xl font-semibold mb-1">
                  {isSignUp ? "Create account" : "Welcome back"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isSignUp
                    ? "Start analyzing your CV today"
                    : "Sign in to your CV Analyzer account"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        setError("");
                      }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(59,130,246,0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs font-medium">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setError("");
                      }}
                      className="w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(59,130,246,0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400 text-xs mt-2"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                  }}
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
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <FileText size={16} />
                    </motion.div>
                  ) : (
                    <>
                      {isSignUp ? "Create account" : "Sign in"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <span className="text-gray-600 text-xs">or</span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </div>

                {/* Google Button */}
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.02,
                    background: "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl text-gray-200 text-sm font-medium flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    />
                  </svg>
                  Continue with Google
                </motion.button>
              </form>

              {/* Toggle */}
              <p className="text-center mt-6 text-gray-500 text-sm">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
}
