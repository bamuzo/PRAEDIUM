import { useState } from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Trash2, BellDot } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useAppContext } from "../context/ThemeContext";

type Priority = "critical" | "notice" | "done";

interface Task {
  id: number;
  priority: Priority;
  originalPriority: Priority;
  text: string;
  checked: boolean;
}

const priorityConfig: Record<
  Priority,
  { label: string; color: string; bg: string; darkBg: string; icon: React.ReactNode; borderColor: string; darkBorder: string }
> = {
  critical: {
    label: "Critical",
    color: "#EF5350",
    bg: "#FFF5F5",
    darkBg: "#2C1414",
    icon: <AlertOctagon size={15} className="text-[#EF5350]" />,
    borderColor: "#FFCDD2",
    darkBorder: "rgba(239,83,80,0.25)",
  },
  notice: {
    label: "Notice",
    color: "#F59E0B",
    bg: "#FFFBEB",
    darkBg: "#261E0A",
    icon: <AlertTriangle size={15} className="text-[#F59E0B]" />,
    borderColor: "#FDE68A",
    darkBorder: "rgba(245,158,11,0.25)",
  },
  done: {
    label: "Done",
    color: "#BDBDBD",
    bg: "#FAFAFA",
    darkBg: "#1A241C",
    icon: <CheckCircle2 size={15} className="text-[#BDBDBD]" />,
    borderColor: "#E0E0E0",
    darkBorder: "rgba(255,255,255,0.08)",
  },
};

const initialTasks: Task[] = [
  {
    id: 1,
    priority: "critical",
    originalPriority: "critical",
    text: "Reservoir 1 is empty. Refill water immediately to prevent crop damage.",
    checked: false,
  },
  {
    id: 2,
    priority: "notice",
    originalPriority: "notice",
    text: "Light intensity dropping in Rack 3. Dust the LED panels.",
    checked: false,
  },
  {
    id: 3,
    priority: "done",
    originalPriority: "notice",
    text: "Top off buffer solution in Rack 2.",
    checked: true,
  },
];

const SWIPE_DISMISS_THRESHOLD = -110;
const SWIPE_CONFIRM_THRESHOLD = 80;

function SwipeableTaskCard({
  task,
  onDismiss,
  onToggle,
  darkMode,
}: {
  task: Task;
  onDismiss: (id: number) => void;
  onToggle: (id: number) => void;
  darkMode: boolean;
}) {
  const cfg = priorityConfig[task.priority];
  const isDone = task.checked;
  const x = useMotionValue(0);

  const trashOpacity = useTransform(x, [-140, -60], [1, 0]);
  const trashScale  = useTransform(x, [-140, -60], [1, 0.6]);
  const checkOpacity = useTransform(x, [60, 140], [1, 0]);
  const checkScale  = useTransform(x, [60, 140], [1, 0.6]);
  const cardScale   = useTransform(x, [-160, 0, 160], [0.97, 1, 0.97]);
  const cardOpacity = useTransform(x, [-180, -120, 0, 120, 180], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < SWIPE_DISMISS_THRESHOLD) {
      onDismiss(task.id);
    } else if (info.offset.x > SWIPE_CONFIRM_THRESHOLD && !isDone) {
      onToggle(task.id);
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const cardBg     = darkMode ? cfg.darkBg    : cfg.bg;
  const cardBorder = darkMode ? cfg.darkBorder : cfg.borderColor;

  return (
    <div className="relative select-none" style={{ touchAction: "pan-y" }}>
      {/* Left (dismiss) background */}
      <div
        className="absolute inset-0 rounded-2xl flex items-center justify-end pr-5"
        style={{ backgroundColor: "#EF5350" }}
      >
        <motion.div style={{ opacity: trashOpacity, scale: trashScale }}>
          <Trash2 size={22} className="text-white" />
        </motion.div>
      </div>

      {/* Right (complete) background */}
      <div
        className="absolute inset-0 rounded-2xl flex items-center justify-start pl-5"
        style={{ backgroundColor: "#4CAF50" }}
      >
        <motion.div style={{ opacity: checkOpacity, scale: checkScale }}>
          <CheckCircle2 size={22} className="text-white" />
        </motion.div>
      </div>

      {/* Draggable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -160, right: 120 }}
        dragElastic={{ left: 0.2, right: 0.2 }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="relative rounded-2xl overflow-hidden cursor-grab"
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{
          x,
          scale: cardScale,
          opacity: cardOpacity,
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: isDone ? "none" : `0 2px 14px ${cfg.color}16`,
        }}
      >
        {/* Priority strip */}
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{
            backgroundColor: `${cfg.color}15`,
            borderBottom: `1px solid ${cardBorder}`,
          }}
        >
          {cfg.icon}
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          <span className="flex-1" />
          <span className="text-[10px]" style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "#BDBDBD" }}>
            ← swipe to dismiss
          </span>
        </div>

        {/* Body */}
        <div className="px-4 py-4 flex items-start gap-3">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: isDone ? "#4CAF50" : cfg.color,
              backgroundColor: isDone ? "#4CAF50" : "transparent",
            }}
          >
            {isDone && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <p
            className="text-sm leading-relaxed flex-1"
            style={{
              color: isDone ? (darkMode ? "rgba(255,255,255,0.3)" : "#BDBDBD") : (darkMode ? "#E4F0E5" : "#1B1B1B"),
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            {task.text}
          </p>
        </div>

        {/* Swipe hint bar */}
        <div className="px-4 pb-3 flex items-center gap-4">
          <div className="flex items-center gap-1 opacity-30">
            <div className="w-4 h-0.5 rounded-full bg-[#EF5350]" />
            <span className="text-[9px] text-[#EF5350]">dismiss</span>
          </div>
          {!isDone && (
            <div className="flex items-center gap-1 opacity-30">
              <span className="text-[9px] text-[#4CAF50]">complete</span>
              <div className="w-4 h-0.5 rounded-full bg-[#4CAF50]" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function AlertsScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { t, darkMode } = useAppContext();

  const toggleCheck = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nowChecked = !task.checked;
        return { ...task, checked: nowChecked, priority: nowChecked ? "done" : task.originalPriority };
      })
    );
  };

  const dismiss = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const activeCount = tasks.filter((t) => !t.checked).length;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto pb-20 transition-colors duration-300"
      style={{ backgroundColor: t.bg }}
    >
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 transition-colors duration-300"
        style={{ backgroundColor: t.header, boxShadow: t.headerShadow }}
      >
        <div className="flex items-center gap-2 mb-1">
          <BellDot size={20} className="text-[#4CAF50]" />
          <h1 style={{ color: t.text }}>AI Action Center</h1>
        </div>
        <p className="text-sm" style={{ color: t.sub }}>Tasks generated from real-time node data</p>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                backgroundColor: darkMode ? "rgba(245,158,11,0.15)" : "#FFF3E0",
                border: `1px solid ${darkMode ? "rgba(245,158,11,0.3)" : "#FFE0B2"}`,
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[#D97706] text-xs font-medium">
                {activeCount} task{activeCount !== 1 ? "s" : ""} pending
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gesture hint */}
      <div className="mx-4 mt-4 mb-1 flex items-center gap-2 opacity-50">
        <div className="flex-1 h-px" style={{ backgroundColor: t.divider }} />
        <span className="text-[10px] whitespace-nowrap" style={{ color: t.sub }}>swipe cards to act</span>
        <div className="flex-1 h-px" style={{ backgroundColor: t.divider }} />
      </div>

      <div className="px-4 pt-3 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.28, ease: "easeInOut" } }}
              transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
            >
              <SwipeableTaskCard task={task} onDismiss={dismiss} onToggle={toggleCheck} darkMode={darkMode} />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: darkMode ? "#1E3320" : "#E8F5E9" }}
              >
                <CheckCircle2 size={32} className="text-[#4CAF50]" />
              </div>
              <p className="font-medium" style={{ color: t.text }}>All clear!</p>
              <p className="text-sm text-center" style={{ color: t.sub }}>
                No pending tasks. Your farm is running smoothly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
