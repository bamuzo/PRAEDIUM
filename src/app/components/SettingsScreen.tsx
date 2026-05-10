import { useState } from "react";
import {
  TrendingUp, Wifi, Database, FileDown, ChevronRight,
  Settings, Zap, Moon, Sun, Droplets, Clock, FlaskConical,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/ThemeContext";

function Toggle({ on, onToggle, size = "md" }: { on: boolean; onToggle: () => void; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-11 h-6" : "w-14 h-7";
  const knob = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const offEnd = size === "sm" ? "1.625rem" : "1.75rem";

  return (
    <button
      onClick={onToggle}
      className={`relative ${w} rounded-full transition-all duration-300 flex-shrink-0`}
      style={{
        backgroundColor: on ? "#4CAF50" : "#CBCED4",
        boxShadow: on ? "0 0 12px rgba(76, 175, 80, 0.4)" : "none",
      }}
    >
      <motion.span
        className={`absolute top-0.5 ${knob} rounded-full bg-white shadow-md`}
        animate={{ left: on ? `calc(100% - ${offEnd})` : "0.125rem" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </button>
  );
}

function TimeInput({
  label,
  value,
  onChange,
  darkMode,
  t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  darkMode: boolean;
  t: ReturnType<typeof useAppContext>["t"];
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <p className="text-[10px] uppercase tracking-wider" style={{ color: t.sub }}>{label}</p>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors duration-200"
        style={{
          backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "#F1F8F2",
          border: `1px solid ${darkMode ? "rgba(76,175,80,0.25)" : "#C8E6C9"}`,
          color: t.text,
          colorScheme: darkMode ? "dark" : "light",
        }}
      />
    </div>
  );
}

function SectionCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { t } = useAppContext();
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 28, delay }}
      className="rounded-2xl overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
    >
      {children}
    </motion.div>
  );
}

function computePhotoperiod(on: string, off: string): string {
  const [onH, onM] = on.split(":").map(Number);
  const [offH, offM] = off.split(":").map(Number);
  const onMins  = onH * 60 + onM;
  const offMins = offH * 60 + offM;
  // light is ON from `on` to `off`
  const diff = offMins >= onMins ? offMins - onMins : 1440 - onMins + offMins;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function fmt12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const MISTING_INTERVALS = [5, 10, 15, 30];  // minutes
const MISTING_DURATIONS = [10, 15, 30, 45]; // seconds
const EC_TARGETS = [1.0, 1.5, 1.8, 2.0, 2.5];

export function SettingsScreen() {
  const {
    darkMode, setDarkMode,
    mistingEnabled, setMistingEnabled,
    mistingInterval, setMistingInterval,
    mistingDuration, setMistingDuration,
    ecTarget, setEcTarget,
    smartLighting, setSmartLighting,
    lightsOnTime, setLightsOnTime,
    lightsOffTime, setLightsOffTime,
    t,
  } = useAppContext();

  const [editingSchedule, setEditingSchedule] = useState(false);
  const photoperiod = computePhotoperiod(lightsOnTime, lightsOffTime);

  const menuItems = [
    {
      icon: <Database size={18} className="text-[#4CAF50]" />,
      label: "Database",
      value: "Local SQLite (Connected)",
      valueColor: "#4CAF50",
      action: false,
    },
    {
      icon: <Wifi size={18} className="text-[#29B6F6]" />,
      label: "Node 1 Wi-Fi",
      value: "Strong",
      valueColor: "#4CAF50",
      action: false,
    },
    {
      icon: <FileDown size={18} style={{ color: t.sub }} />,
      label: "Export Logs",
      value: "",
      valueColor: t.sub,
      action: true,
    },
  ];

  return (
    <>
      <style>{`
        .settings-scroll::-webkit-scrollbar { display: none; }
        .settings-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="time"]::-webkit-calendar-picker-indicator { opacity: 0.4; filter: ${darkMode ? "invert(1)" : "none"}; cursor: pointer; }
      `}</style>
      <div
        className="settings-scroll flex flex-col h-full overflow-y-auto pb-24 transition-colors duration-300"
        style={{ backgroundColor: t.bg }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="px-5 pt-12 pb-4 transition-colors duration-300"
          style={{ backgroundColor: t.header, boxShadow: t.headerShadow }}
        >
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-[#4CAF50]" />
            <h1 style={{ color: t.text }}>System Settings</h1>
          </div>
          <p className="text-xs mt-1" style={{ color: t.sub }}>Configuration & energy management</p>
        </motion.div>

        <div className="px-4 pt-5 flex flex-col gap-4">

          {/* ── Energy Savings Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.04 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1B3A1F 0%, #2E7D32 100%)",
              boxShadow: "0 6px 24px rgba(46, 125, 50, 0.35)",
            }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-[#81C784]" />
            <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full opacity-10 bg-[#A5D6A7]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Zap size={16} className="text-[#FFCA28]" />
                </div>
                <p className="text-white/70 text-xs uppercase tracking-wider">Energy Savings</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">Estimated Monthly Savings</p>
                  <p className="text-white font-semibold" style={{ fontSize: "2.2rem", lineHeight: 1.1 }}>$120.00</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2">
                  <TrendingUp size={16} className="text-[#81C784]" />
                  <span className="text-[#81C784] text-sm font-semibold">+18%</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex gap-4">
                <div><p className="text-white/50 text-xs">This Month</p><p className="text-white text-sm font-medium">$120.00</p></div>
                <div><p className="text-white/50 text-xs">Last Month</p><p className="text-white text-sm font-medium">$101.60</p></div>
                <div><p className="text-white/50 text-xs">Annual Est.</p><p className="text-white text-sm font-medium">$1,440</p></div>
              </div>
            </div>
          </motion.div>

          {/* ── Dark Mode ── */}
          <SectionCard delay={0.08}>
            <div className="p-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: darkMode ? "rgba(171,71,188,0.15)" : "#F3E5F5" }}
                >
                  {darkMode
                    ? <Moon size={20} className="text-[#CE93D8]" />
                    : <Sun size={20} className="text-[#AB47BC]" />}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: t.text }}>Dark Mode</p>
                  <p className="text-xs mt-0.5" style={{ color: t.sub }}>
                    {darkMode ? "Dark theme active" : "Light theme active"}
                  </p>
                </div>
              </div>
              <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            </div>
          </SectionCard>

          {/* ── Aeroponic Misting ── */}
          <SectionCard delay={0.12}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: darkMode ? "rgba(41,182,246,0.12)" : "#E1F5FE" }}
                  >
                    <Droplets size={20} className="text-[#29B6F6]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: t.text }}>Aeroponic Misting</p>
                    <p className="text-xs mt-0.5" style={{ color: t.sub }}>Fine-mist nutrient delivery to roots</p>
                  </div>
                </div>
                <Toggle on={mistingEnabled} onToggle={() => setMistingEnabled(!mistingEnabled)} />
              </div>

              <AnimatePresence>
                {mistingEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Active status pill */}
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4"
                      style={{ backgroundColor: darkMode ? "rgba(41,182,246,0.1)" : "#E1F5FE" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#29B6F6] animate-pulse" />
                      <p className="text-xs" style={{ color: "#29B6F6" }}>
                        Misting every {mistingInterval}min · {mistingDuration}s per cycle
                      </p>
                    </div>

                    {/* Interval picker */}
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: t.sub }}>Mist Interval</p>
                      <div className="flex gap-2">
                        {MISTING_INTERVALS.map((v) => (
                          <button
                            key={v}
                            onClick={() => setMistingInterval(v)}
                            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                            style={{
                              backgroundColor:
                                mistingInterval === v
                                  ? "#29B6F6"
                                  : darkMode ? "rgba(255,255,255,0.06)" : "#F0F7FF",
                              color: mistingInterval === v ? "#fff" : t.sub,
                            }}
                          >
                            {v}m
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration picker */}
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: t.sub }}>Spray Duration</p>
                      <div className="flex gap-2">
                        {MISTING_DURATIONS.map((v) => (
                          <button
                            key={v}
                            onClick={() => setMistingDuration(v)}
                            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                            style={{
                              backgroundColor:
                                mistingDuration === v
                                  ? "#29B6F6"
                                  : darkMode ? "rgba(255,255,255,0.06)" : "#F0F7FF",
                              color: mistingDuration === v ? "#fff" : t.sub,
                            }}
                          >
                            {v}s
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* EC Target */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FlaskConical size={12} className="text-[#AB47BC]" />
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: t.sub }}>
                          Nutrient EC Target
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {EC_TARGETS.map((v) => (
                          <button
                            key={v}
                            onClick={() => setEcTarget(v)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                            style={{
                              backgroundColor:
                                ecTarget === v
                                  ? "#AB47BC"
                                  : darkMode ? "rgba(255,255,255,0.06)" : "#FAF0FF",
                              color: ecTarget === v ? "#fff" : t.sub,
                            }}
                          >
                            {v} mS/cm
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          {/* ── Smart Off-Peak Lighting ── */}
          <SectionCard delay={0.16}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: darkMode ? "rgba(255,202,40,0.12)" : "#FFF8E1" }}
                  >
                    <Zap size={20} className="text-[#FFCA28]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: t.text }}>Smart Off-Peak Lighting</p>
                  </div>
                </div>
                <Toggle on={smartLighting} onToggle={() => setSmartLighting(!smartLighting)} />
              </div>
              <p className="text-xs leading-relaxed mt-1" style={{ color: t.sub }}>
                Shifts heavy LED usage to cheaper off-peak hours.
              </p>

              <AnimatePresence>
                {smartLighting && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 14 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Status pill — tap to expand schedule editor */}
                    <button
                      onClick={() => setEditingSchedule(!editingSchedule)}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                      style={{
                        backgroundColor: darkMode ? "rgba(76,175,80,0.12)" : "#E8F5E9",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                        <p className="text-xs font-medium" style={{ color: "#2E7D32" }}>
                          Lights ON {fmt12(lightsOnTime)} → OFF {fmt12(lightsOffTime)}
                          <span className="ml-1.5 opacity-60">({photoperiod} photoperiod)</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} style={{ color: "#4CAF50" }} />
                        <span className="text-[10px]" style={{ color: "#4CAF50" }}>
                          {editingSchedule ? "Done" : "Edit"}
                        </span>
                      </div>
                    </button>

                    {/* Inline schedule editor */}
                    <AnimatePresence>
                      {editingSchedule && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="rounded-xl p-4"
                            style={{
                              backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : "#F7FAF7",
                              border: `1px solid ${t.border}`,
                            }}
                          >
                            <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: t.sub }}>
                              Light Schedule (24h)
                            </p>
                            <div className="flex gap-3">
                              <TimeInput
                                label="Lights ON"
                                value={lightsOnTime}
                                onChange={setLightsOnTime}
                                darkMode={darkMode}
                                t={t}
                              />
                              <TimeInput
                                label="Lights OFF"
                                value={lightsOffTime}
                                onChange={setLightsOffTime}
                                darkMode={darkMode}
                                t={t}
                              />
                            </div>
                            <div
                              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                              style={{ backgroundColor: darkMode ? "rgba(255,202,40,0.08)" : "#FFF8E1" }}
                            >
                              <Sun size={11} className="text-[#FFCA28]" />
                              <p className="text-[10px]" style={{ color: darkMode ? "#FFCA28" : "#F59E0B" }}>
                                Photoperiod: <span className="font-semibold">{photoperiod}</span> of light per day
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          {/* ── System Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.2 }}
            className="rounded-2xl overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.divider}` }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: t.sub }}>System Info</p>
            </div>
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.24 + i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
                className="flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors"
                style={{
                  borderBottom: i < menuItems.length - 1 ? `1px solid ${t.divider2}` : "none",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.rowHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.metaBg }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: t.text }}>{item.label}</p>
                  {item.value && (
                    <p className="text-xs mt-0.5" style={{ color: item.valueColor }}>{item.value}</p>
                  )}
                </div>
                {item.action
                  ? <ChevronRight size={16} style={{ color: t.sub }} />
                  : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.valueColor }} />}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="text-center text-xs pb-2"
            style={{ color: t.sub }}
          >
            FarmOS v1.2.0 · Built with ♥ for sustainable farming
          </motion.p>
        </div>
      </div>
    </>
  );
}
