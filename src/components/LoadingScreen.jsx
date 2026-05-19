import { Loader } from "lucide-react";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
        <Loader size={28} className="text-white animate-spin" />
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
