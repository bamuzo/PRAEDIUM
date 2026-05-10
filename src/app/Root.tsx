import { useLocation, Outlet, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { BottomNav } from "./components/BottomNav";
import { useRef } from "react";
import { AppProvider, useAppContext } from "./context/ThemeContext";

type Screen = "home" | "alerts" | "racks" | "settings";

const ORDER: Record<string, number> = {
  "/": 0,
  "/alerts": 1,
  "/racks": 2,
  "/settings": 3,
};

const pathToScreen: Record<string, Screen> = {
  "/": "home",
  "/alerts": "alerts",
  "/racks": "racks",
  "/settings": "settings",
};

function RootInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, t } = useAppContext();
  const prevIndexRef = useRef(ORDER[location.pathname] ?? 0);

  const currentIndex = ORDER[location.pathname] ?? 0;
  const direction = currentIndex >= prevIndexRef.current ? 1 : -1;

  const handleNav = (screen: Screen) => {
    const paths: Record<Screen, string> = {
      home: "/",
      alerts: "/alerts",
      racks: "/racks",
      settings: "/settings",
    };
    prevIndexRef.current = currentIndex;
    navigate(paths[screen]);
  };

  const activeScreen: Screen = pathToScreen[location.pathname] ?? "home";

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: darkMode ? "#08120A" : "#E8F0E9" }}
    >
      {/* Phone frame */}
      <div
        className="relative overflow-hidden w-full transition-colors duration-300"
        style={{
          backgroundColor: t.bg,
          maxWidth: 390,
          height: "min(844px, 100dvh - 2rem)",
          borderRadius: "2.5rem",
          boxShadow: darkMode
            ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-8 z-30">
          <span className="text-[11px] font-semibold" style={{ color: t.text }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-1 rounded-sm" style={{ height: h, backgroundColor: t.text }} />
              ))}
            </div>
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path d="M7 8.5C7.83 8.5 8.5 9.17 8.5 10S7.83 11.5 7 11.5 5.5 10.83 5.5 10 6.17 8.5 7 8.5Z" fill={t.text} />
              <path d="M1 4.5C2.67 2.83 4.72 2 7 2s4.33.83 6 2.5" stroke={t.text} strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M3.5 7C4.5 6 5.67 5.5 7 5.5s2.5.5 3.5 1.5" stroke={t.text} strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-sm border relative" style={{ borderColor: t.text }}>
                <div
                  className="absolute inset-0.5 rounded-sm"
                  style={{ right: "20%", backgroundColor: t.text }}
                />
              </div>
              <div className="w-0.5 h-1.5 rounded-r-sm" style={{ backgroundColor: t.text }} />
            </div>
          </div>
        </div>

        {/* Animated page area */}
        <div className="absolute inset-0 pt-10 overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 340, damping: 38, mass: 0.9 },
                opacity: { duration: 0.18 },
              }}
              className="absolute inset-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <BottomNav active={activeScreen} onChange={handleNav} alertCount={activeScreen !== "alerts" ? 1 : 0} />
      </div>
    </div>
  );
}

export function Root() {
  return (
    <AppProvider>
      <RootInner />
    </AppProvider>
  );
}
