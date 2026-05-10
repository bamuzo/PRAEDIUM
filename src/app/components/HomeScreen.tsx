import {
  Thermometer,
  Droplets,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  Sun,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/ThemeContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 300, damping: 28, delay },
});

export function HomeScreen() {
  const navigate = useNavigate();
  const { t, darkMode } = useAppContext();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

  const tiles = [
    {
      label: "Avg Temp",
      value: "24°C",
      icon: <Thermometer size={22} className="text-[#EF5350]" />,
      bg: darkMode ? "#2C1A1A" : "#FFF5F5",
      onClick: undefined as (() => void) | undefined,
    },
    {
      label: "Avg Humidity",
      value: "65%",
      icon: <Droplets size={22} className="text-[#29B6F6]" />,
      bg: darkMode ? "#1A2230" : "#F0F7FF",
      onClick: undefined as (() => void) | undefined,
    },
    {
      label: "Active Alerts",
      value: "1",
      icon: <AlertTriangle size={22} className="text-[#F59E0B]" />,
      bg: darkMode ? "#2A2010" : "#FFFBEB",
      badge: true,
      onClick: () => navigate("/alerts"),
    },
    {
      label: "Energy Mode",
      value: "Eco",
      icon: <Leaf size={22} className="text-[#4CAF50]" />,
      bg: darkMode ? "#152418" : "#F1F8F2",
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto pb-20 transition-colors duration-300"
      style={{ backgroundColor: t.bg }}
    >
      {/* Header */}
      <motion.div
        {...fadeUp(0)}
        className="flex items-center justify-between px-5 pt-12 pb-4 transition-colors duration-300"
        style={{ backgroundColor: t.header, boxShadow: t.headerShadow }}
      >
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: t.sub }}>Dashboard</p>
          <h1 className="mt-0.5" style={{ color: t.text }}>Farm Overview</h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: darkMode ? "#1E3320" : "#E8F5E9",
            borderColor: darkMode ? "rgba(76,175,80,0.3)" : "#C8E6C9",
          }}
        >
          <User size={20} className="text-[#4CAF50]" />
        </div>
      </motion.div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        {/* Hero Status Banner */}
        <motion.div
          {...fadeUp(0.05)}
          className="rounded-2xl px-5 py-5 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
          }}
        >
          <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={26} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs uppercase tracking-wider mb-0.5">System Status</p>
            <p className="text-white font-semibold text-base leading-snug">
              Optimal — All racks operating normally.
            </p>
          </div>
        </motion.div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              {...fadeUp(0.08 + i * 0.05)}
              className="rounded-2xl p-4 flex flex-col gap-2 transition-colors duration-300"
              style={{
                backgroundColor: tile.bg,
                border: `1px solid ${t.border}`,
                cursor: tile.onClick ? "pointer" : "default",
              }}
              onClick={tile.onClick}
              whileTap={tile.onClick ? { scale: 0.96 } : {}}
            >
              <div className="flex items-center justify-between">
                {tile.icon}
                {tile.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: "#F59E0B" }}
                  >
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs" style={{ color: t.sub }}>{tile.label}</p>
                <p
                  className="font-semibold text-xl mt-0.5"
                  style={{ color: tile.badge ? "#D97706" : t.text }}
                >
                  {tile.value}
                </p>
              </div>
              {tile.onClick && (
                <p className="text-[10px] text-[#F59E0B] opacity-70 -mt-1">Tap to view →</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Weather / Time Widget */}
        <motion.div
          {...fadeUp(0.22)}
          className="rounded-2xl px-5 py-4 flex items-center justify-between transition-colors duration-300"
          style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: darkMode ? "#2A2410" : "#FFF8E1" }}
            >
              <Sun size={20} className="text-[#FFCA28]" />
            </div>
            <div>
              <p className="text-xs" style={{ color: t.sub }}>Local Weather</p>
              <p className="font-medium text-sm" style={{ color: t.text }}>Partly Cloudy · 28°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg" style={{ color: t.text }}>{timeStr}</p>
            <p className="text-xs" style={{ color: t.sub }}>{dateStr}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
