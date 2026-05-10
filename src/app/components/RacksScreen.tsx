import { useState } from "react";
import { Thermometer, Droplets, Sun, Layers, ChevronDown, FlaskConical } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/ThemeContext";

const racks = [
  { id: 1, name: "Rack 1 (Leafy Greens)" },
  { id: 2, name: "Rack 2 (Herbs)" },
  { id: 3, name: "Rack 3 (Microgreens)" },
];

type Status = "normal" | "warning" | "critical";

interface RackMetrics {
  temp:     { value: string; status: Status; data: { v: number }[] };
  humidity: { value: string; status: Status; data: { v: number }[] };
  light:    { value: string; status: Status; data: { v: number }[] };
  ec:       { value: string; status: Status; data: { v: number }[] };
}

const rackData: RackMetrics[] = [
  // Rack 1 — Leafy Greens
  {
    temp:     { value: "23.5", status: "normal",  data: [{v:22.8},{v:23.1},{v:23.4},{v:23.2},{v:23.6},{v:23.5},{v:23.8},{v:23.5},{v:23.7},{v:23.5}] },
    humidity: { value: "65",   status: "normal",  data: [{v:62},{v:63},{v:65},{v:64},{v:66},{v:65},{v:67},{v:65},{v:64},{v:65}] },
    light:    { value: "850",  status: "warning", data: [{v:820},{v:835},{v:840},{v:855},{v:848},{v:850},{v:858},{v:852},{v:849},{v:850}] },
    ec:       { value: "1.8",  status: "normal",  data: [{v:1.7},{v:1.75},{v:1.8},{v:1.78},{v:1.82},{v:1.8},{v:1.79},{v:1.81},{v:1.8},{v:1.8}] },
  },
  // Rack 2 — Herbs
  {
    temp:     { value: "25.2", status: "warning", data: [{v:24.5},{v:24.9},{v:25.1},{v:25.4},{v:25.2},{v:25.6},{v:25.3},{v:25.1},{v:25.4},{v:25.2}] },
    humidity: { value: "58",   status: "warning", data: [{v:61},{v:60},{v:59},{v:58},{v:57},{v:58},{v:59},{v:57},{v:58},{v:58}] },
    light:    { value: "920",  status: "normal",  data: [{v:900},{v:908},{v:915},{v:918},{v:922},{v:920},{v:925},{v:919},{v:921},{v:920}] },
    ec:       { value: "2.4",  status: "warning", data: [{v:1.9},{v:2.0},{v:2.1},{v:2.2},{v:2.3},{v:2.35},{v:2.38},{v:2.4},{v:2.4},{v:2.4}] },
  },
  // Rack 3 — Microgreens
  {
    temp:     { value: "22.1", status: "normal",   data: [{v:21.8},{v:22.0},{v:22.2},{v:22.1},{v:22.3},{v:22.0},{v:22.1},{v:22.2},{v:22.0},{v:22.1}] },
    humidity: { value: "70",   status: "normal",   data: [{v:68},{v:69},{v:70},{v:69},{v:71},{v:70},{v:72},{v:70},{v:71},{v:70}] },
    light:    { value: "640",  status: "critical", data: [{v:810},{v:780},{v:740},{v:710},{v:690},{v:665},{v:648},{v:641},{v:638},{v:640}] },
    ec:       { value: "1.2",  status: "warning",  data: [{v:1.6},{v:1.5},{v:1.4},{v:1.35},{v:1.3},{v:1.25},{v:1.22},{v:1.2},{v:1.2},{v:1.2}] },
  },
];

const STATUS_COLORS: Record<Status, string> = {
  normal:   "#4CAF50",
  warning:  "#F59E0B",
  critical: "#EF5350",
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  data: { v: number }[];
  color: string;
  lightBg: string;
  darkBg: string;
  status?: Status;
  delay?: number;
  darkMode: boolean;
}

function MetricCard({ icon, label, value, unit, data, color, lightBg, darkBg, status = "normal", delay = 0, darkMode }: MetricCardProps) {
  const { t } = useAppContext();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26, delay }}
      className="rounded-2xl overflow-hidden relative transition-colors duration-300"
      style={{
        backgroundColor: darkMode ? darkBg : lightBg,
        border: `1px solid ${t.border}`,
      }}
    >
      {/* Sparkline background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}22` }}
            >
              {icon}
            </div>
            <span className="text-xs font-medium" style={{ color: t.sub }}>{label}</span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
            style={{
              backgroundColor: `${STATUS_COLORS[status]}18`,
              color: STATUS_COLORS[status],
            }}
          >
            {status}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-semibold" style={{ fontSize: "2rem", lineHeight: 1.1, color: t.text }}>
            {value}
          </span>
          <span className="text-sm" style={{ color: t.sub }}>{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function RacksScreen() {
  const [selectedRack, setSelectedRack] = useState(0);
  const [open, setOpen] = useState(false);
  const { t, darkMode } = useAppContext();

  const current = rackData[selectedRack];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto pb-20 transition-colors duration-300"
      style={{ backgroundColor: t.bg }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="px-5 pt-12 pb-4 transition-colors duration-300"
        style={{ backgroundColor: t.header, boxShadow: t.headerShadow }}
      >
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-[#4CAF50]" />
          <h1 style={{ color: t.text }}>Node Telemetry</h1>
        </div>
        <p className="text-xs mt-1" style={{ color: t.sub }}>Live sensor data — updates every 30s</p>
      </motion.div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        {/* Rack Selector */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.05 }}
          className="relative"
        >
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors duration-300"
            style={{
              backgroundColor: t.card,
              border: `1px solid ${t.inputBorder}`,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              color: t.text,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-sm font-medium">{racks[selectedRack].name}</span>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} style={{ color: t.sub }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-10"
                style={{
                  backgroundColor: t.card,
                  border: `1px solid ${t.inputBorder}`,
                  boxShadow: darkMode
                    ? "0 8px 24px rgba(0,0,0,0.4)"
                    : "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                {racks.map((rack, i) => (
                  <button
                    key={rack.id}
                    onClick={() => { setSelectedRack(i); setOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors"
                    style={{
                      color: i === selectedRack ? "#4CAF50" : t.text,
                      borderBottom: i < racks.length - 1 ? `1px solid ${t.divider}` : "none",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {i === selectedRack && <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />}
                    {rack.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Metric Cards — keyed by rack so they re-animate on switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRack}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="flex flex-col gap-4"
          >
            <MetricCard
              icon={<Thermometer size={16} className="text-[#EF5350]" />}
              label="Temperature"
              value={current.temp.value}
              unit="°C"
              data={current.temp.data}
              color="#EF5350"
              lightBg="#FFF8F8"
              darkBg="#2C1414"
              status={current.temp.status}
              delay={0.04}
              darkMode={darkMode}
            />
            <MetricCard
              icon={<Droplets size={16} className="text-[#29B6F6]" />}
              label="Humidity"
              value={current.humidity.value}
              unit="%"
              data={current.humidity.data}
              color="#29B6F6"
              lightBg="#F0F7FF"
              darkBg="#0F1E2E"
              status={current.humidity.status}
              delay={0.09}
              darkMode={darkMode}
            />
            <MetricCard
              icon={<Sun size={16} className="text-[#FFCA28]" />}
              label="Light Level"
              value={current.light.value}
              unit="Lux"
              data={current.light.data}
              color="#FFCA28"
              lightBg="#FFFDF0"
              darkBg="#221E00"
              status={current.light.status}
              delay={0.14}
              darkMode={darkMode}
            />
            <MetricCard
              icon={<FlaskConical size={16} className="text-[#AB47BC]" />}
              label="Nutrient EC"
              value={current.ec.value}
              unit="mS/cm"
              data={current.ec.data}
              color="#AB47BC"
              lightBg="#FAF0FF"
              darkBg="#1E102A"
              status={current.ec.status}
              delay={0.19}
              darkMode={darkMode}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
