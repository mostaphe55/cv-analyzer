import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Globe } from "lucide-react";

const steps = [
  "Connecting to Somali employment sources...",
  "Searching ShaqoQaran...",
  "Searching ShaqoJobs...",
  "Searching SomaliJobs...",
  "Searching Hormuud Careers...",
  "Searching Dahabshiil Careers...",
  "Searching Premier Bank Careers...",
  "Matching your CV...",
  "Finding official vacancy...",
  "Preparing official application page...",
];

export default function AIJobSearchModal({ job, onFinish }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!job) return;

    const interval = setInterval(() => {
      setCurrent((c) => {
        if (c >= steps.length - 1) {
          clearInterval(interval);

          setTimeout(() => {
            window.open(job.applyUrl, "_blank", "noopener,noreferrer");
            onFinish();
          }, 800);

          return c;
        }

        return c + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [job]);

  if (!job) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-[520px] rounded-3xl bg-gray-900 border border-blue-500/20 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center"
            >
              <Search className="text-white" />
            </motion.div>

            <div>
              <h2 className="text-white text-xl font-bold">
                AI Employment Agent
              </h2>

              <p className="text-gray-400 text-sm">
                Searching official Somali job portals...
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                {index < current ? (
                  <CheckCircle2 className="text-green-400" size={18} />
                ) : index === current ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Search className="text-blue-400" size={18} />
                  </motion.div>
                ) : (
                  <Globe className="text-gray-600" size={18} />
                )}

                <span
                  className={index <= current ? "text-white" : "text-gray-500"}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-8 h-2 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              animate={{
                width: `${((current + 1) / steps.length) * 100}%`,
              }}
              className="h-full bg-blue-500"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
