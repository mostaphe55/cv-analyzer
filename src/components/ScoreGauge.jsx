import { motion } from "framer-motion";

const scoreColor = (score) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const scoreTrack = (score) => {
  if (score >= 80) return "from-green-500 to-emerald-400";
  if (score >= 60) return "from-yellow-500 to-amber-400";
  return "from-red-500 to-rose-400";
};

export default function ScoreGauge({ score = 0, label = "Score", size = 160 }) {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${safeScore}%`}
    >
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(31 41 55)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`bg-linear-to-r ${scoreTrack(safeScore)} ${scoreColor(safeScore)}`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black ${scoreColor(safeScore)}`}>
          {safeScore}%
        </span>
        <span className="mt-1 max-w-24 truncate text-xs font-semibold uppercase text-gray-500">
          {label}
        </span>
      </div>
    </div>
  );
}
