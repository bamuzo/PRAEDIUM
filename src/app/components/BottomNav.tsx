import { Home, Bell, Layers, Settings, LucideIcon } from "lucide-react";
import { useAppContext } from "../context/ThemeContext";

type Screen = "home" | "alerts" | "racks" | "settings";

interface BottomNavProps {
  active: Screen;
  onChange: (s: Screen) => void;
  alertCount?: number;
}

const navItems: { id: Screen; icon: LucideIcon; label: string }[] = [
  { id: "home",     icon: Home,     label: "Home"     },
  { id: "alerts",   icon: Bell,     label: "Alerts"   },
  { id: "racks",    icon: Layers,   label: "Racks"    },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function BottomNav({ active, onChange, alertCount = 0 }: BottomNavProps) {
  const { t, darkMode } = useAppContext();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2 pt-2 pb-5 z-50 transition-colors duration-300"
      style={{
        backgroundColor: t.header,
        borderTop: `1px solid ${t.divider}`,
        boxShadow: darkMode
          ? "0 -4px 20px rgba(0,0,0,0.3)"
          : "0 -4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {navItems.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        const color = isActive ? "#4CAF50" : t.sub;

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-1 flex-1 py-1 relative"
          >
            {/* Alert badge */}
            {id === "alerts" && alertCount > 0 && (
              <span
                className="absolute -top-0.5 translate-x-3 w-4 h-4 rounded-full bg-[#EF5350] text-white flex items-center justify-center z-10"
                style={{ fontSize: "10px", fontWeight: 600 }}
              >
                {alertCount}
              </span>
            )}

            <div
              className="flex items-center justify-center rounded-2xl transition-all duration-200"
              style={{
                width: 48,
                height: 32,
                backgroundColor: isActive
                  ? (darkMode ? "rgba(76,175,80,0.18)" : "#E8F5E9")
                  : "transparent",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} color={color} />
            </div>

            <span style={{ fontSize: "10px", color, fontWeight: isActive ? 600 : 400 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
