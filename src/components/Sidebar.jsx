import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Upload,
  BarChart2,
  Lightbulb,
  Briefcase,
  MessageCircle,
  Clock,
  FileText,
  Menu,
  X,
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">
                CV Analyzer
              </h1>
              <p className="text-gray-500 text-xs">AI Powered</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto">
            <FileText size={18} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-gray-500 hover:text-white transition-colors ${collapsed ? "hidden" : "block"}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Collapse Toggle */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 text-gray-500 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${collapsed ? "justify-center" : ""}
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-blue-400 font-semibold mb-1">
              🎓 Student Project
            </p>
            <p className="text-xs text-gray-500">AI Course — Senior Level</p>
          </div>
        </div>
      )}
    </div>
  );
}
