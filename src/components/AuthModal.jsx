import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./auth/SignInForm";
import SignUpForm from "./auth/SignUpForm";

export default function AuthModal({ open, onClose, onSignIn }) {
  const [tab, setTab] = useState("signin");
  const gsiRef = useRef(null);
  const [gsiAvailable, setGsiAvailable] = useState(false);

  useEffect(() => {
    if (!open) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGsiAvailable(false);
      return;
    }

    const handleCredentialResponse = (response) => {
      try {
        const jwt = response.credential;
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        const user = { name: payload.name, email: payload.email, picture: payload.picture };
        onSignIn(user);
      } catch (e) {
        console.error("GSI parse error", e);
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
        setGsiAvailable(true);
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredentialResponse });
          if (gsiRef.current) {
            window.google.accounts.id.renderButton(gsiRef.current, { theme: "outline", size: "large" });
          }
        }
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.accounts && window.google.accounts.id) {
      setGsiAvailable(true);
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredentialResponse });
      if (gsiRef.current) window.google.accounts.id.renderButton(gsiRef.current, { theme: "outline", size: "large" });
    }

    return () => {
      try { window.google && window.google.accounts && window.google.accounts.id && window.google.accounts.id.cancel(); } catch (e) {}
    };
  }, [open]);

  const handleGoogleClick = () => {
    if (gsiAvailable && window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        console.error("GSI prompt error", e);
      }
    } else {
      alert("Google Sign-In is currently unavailable. You can sign in with email or try again shortly.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-xl rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/80 p-6 shadow-2xl border border-white/6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-600/10 to-indigo-600/5 blur-xl opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-white">Welcome back</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white">Close</button>
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => setTab("signin")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${tab === "signin" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-300"}`}>Sign in</button>
                <button onClick={() => setTab("signup")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${tab === "signup" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-300"}`}>Sign up</button>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="flex flex-col items-center gap-3">
                  <button type="button" onClick={handleGoogleClick} className="flex items-center gap-3 w-full max-w-sm justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:shadow-md">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.42-1.47 4.16-5.26 4.16-3.16 0-5.73-2.6-5.73-5.8s2.57-5.8 5.73-5.8c1.8 0 3.01.77 3.7 1.44l2.52-2.43C17.86 3.3 15.83 2.2 12.98 2.2 7.9 2.2 3.97 6.1 3.97 11s3.93 8.8 9.01 8.8c5.2 0 8.63-3.66 8.63-8.8 0-.59-.06-1.04-.26-1.9z" fill="#4285F4"/>
                    </svg>
                    Continue with Google
                  </button>
                  <div className="w-full max-w-sm" style={{ height: 0, overflow: 'hidden' }}>
                    <div ref={gsiRef} />
                  </div>
                </div>

                <div className="relative flex items-center justify-center text-xs text-slate-500">or</div>

                <div className="w-full max-w-lg">
                  {tab === "signin" ? (
                    <SignInForm onSignIn={onSignIn} />
                  ) : (
                    <SignUpForm onSignIn={onSignIn} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
