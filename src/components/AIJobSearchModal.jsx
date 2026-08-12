import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  CheckCircle2,
  Globe,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { JOB_SOURCES } from "../data/jobSources.js";

const portals = JOB_SOURCES.map((source) => source.name);

export default function AIJobSearchModal({ open, job, onClose, onFinish }) {
  const [step, setStep] = useState(0);
  const isOpen = open ?? Boolean(job);
  const close = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }

    if (onFinish) {
      onFinish();
    }
  }, [onClose, onFinish]);
  const applyUrl = job?.applyUrl || job?.website;

  useEffect(() => {
    if (!isOpen || !job) return;

    const timers = [];

    timers.push(setTimeout(() => setStep(0), 0));

    timers.push(setTimeout(() => setStep(1), 600));

    timers.push(setTimeout(() => setStep(2), 1300));

    timers.push(setTimeout(() => setStep(3), 2000));

    timers.push(
      setTimeout(() => {
        if (applyUrl) {
          if (job.openedWindow && !job.openedWindow.closed) {
            job.openedWindow.location.href = applyUrl;
          } else {
            window.open(applyUrl, "_blank", "noopener,noreferrer");
          }
        }

        close();
      }, 3200),
    );

    return () => timers.forEach(clearTimeout);
  }, [isOpen, job, applyUrl, close]);

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-xl rounded-3xl overflow-hidden border border-blue-500/20 bg-gray-900 shadow-2xl"
        >
          {/* Header */}

          <div className="bg-linear-to-r from-blue-700 via-cyan-600 to-purple-700 p-8 text-center relative overflow-hidden">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
              className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center border border-white/20"
            >
              <Brain className="text-white" size={40} />
            </motion.div>

            <h2 className="text-white text-3xl font-black mt-5">
              AI Job Search
            </h2>

            <p className="text-white/70 mt-2">
              Searching official Somali job sources...
            </p>
          </div>

          {/* Body */}

          <div className="p-8">
            {/* Progress */}

            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-8">
              <motion.div
                animate={{
                  width:
                    step === 0
                      ? "20%"
                      : step === 1
                        ? "45%"
                        : step === 2
                          ? "75%"
                          : "100%",
                }}
                transition={{
                  duration: 0.6,
                }}
                className="h-full bg-linear-to-r from-blue-500 via-cyan-400 to-green-400"
              />
            </div>

            <div className="space-y-4">
              {portals.map((portal, index) => (
                <motion.div
                  key={portal}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between rounded-xl bg-gray-800 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-cyan-400" />

                    <span className="text-white font-semibold">{portal}</span>
                  </div>

                  {step > index ? (
                    <CheckCircle2 className="text-green-400" size={20} />
                  ) : (
                    <Search
                      className="text-yellow-400 animate-pulse"
                      size={18}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-3">
                <Sparkles size={18} />
                Best AI Match
              </div>

              <h3 className="text-white text-xl font-black">
                {job.title || "Recommended role"}
              </h3>

              <p className="text-gray-400 mt-1">
                {job.location || "Location flexible"}
              </p>

              <p className="text-green-400 font-bold mt-3">
                {job.match || 0}% Match
              </p>
            </div>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 2,
              }}
              className="text-center mt-8"
            >
              {applyUrl ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-5 py-3 rounded-xl text-green-400 font-bold"
                >
                  <ExternalLink size={18} />
                  Opening Official Search...
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-5 py-3 rounded-xl text-yellow-400 font-bold">
                  <Search size={18} />
                  No official link available
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
