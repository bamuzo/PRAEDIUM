import { createContext, useContext, useState, ReactNode } from "react";

export const light = {
  bg:          "#F7FAF7",
  card:        "#FFFFFF",
  header:      "#FFFFFF",
  headerShadow:"0 1px 4px rgba(0,0,0,0.06)",
  text:        "#1B3A1F",
  sub:         "#9E9E9E",
  border:      "rgba(0,0,0,0.06)",
  divider:     "#F0F0F0",
  divider2:    "#F5F5F5",
  inputBg:     "#FFFFFF",
  inputBorder: "#E0E0E0",
  rowHover:    "#FAFAFA",
  metaBg:      "#F7FAF7",
  pill:        "#F1F8F2",
  pillText:    "#1B3A1F",
};

export const dark = {
  bg:          "#0F1B11",
  card:        "#192B1A",
  header:      "#13221A",
  headerShadow:"0 1px 4px rgba(0,0,0,0.3)",
  text:        "#E4F0E5",
  sub:         "#6B8E70",
  border:      "rgba(255,255,255,0.07)",
  divider:     "rgba(255,255,255,0.06)",
  divider2:    "rgba(255,255,255,0.05)",
  inputBg:     "#1C2F1E",
  inputBorder: "rgba(255,255,255,0.12)",
  rowHover:    "rgba(255,255,255,0.04)",
  metaBg:      "#172618",
  pill:        "#1E3320",
  pillText:    "#A5D6A7",
};

export type Theme = typeof light;

interface AppSettings {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;

  mistingEnabled: boolean;
  setMistingEnabled: (v: boolean) => void;
  mistingInterval: number;       // minutes between cycles
  setMistingInterval: (v: number) => void;
  mistingDuration: number;       // seconds per cycle
  setMistingDuration: (v: number) => void;
  ecTarget: number;              // mS/cm
  setEcTarget: (v: number) => void;

  smartLighting: boolean;
  setSmartLighting: (v: boolean) => void;
  lightsOnTime: string;          // "HH:MM" 24h
  setLightsOnTime: (v: string) => void;
  lightsOffTime: string;         // "HH:MM" 24h
  setLightsOffTime: (v: string) => void;

  t: Theme;
}

const AppContext = createContext<AppSettings | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mistingEnabled, setMistingEnabled] = useState(false);
  const [mistingInterval, setMistingInterval] = useState(10);
  const [mistingDuration, setMistingDuration] = useState(15);
  const [ecTarget, setEcTarget] = useState(1.8);
  const [smartLighting, setSmartLighting] = useState(true);
  const [lightsOnTime, setLightsOnTime] = useState("06:00");
  const [lightsOffTime, setLightsOffTime] = useState("22:00");

  const t: Theme = darkMode ? dark : light;

  return (
    <AppContext.Provider
      value={{
        darkMode, setDarkMode,
        mistingEnabled, setMistingEnabled,
        mistingInterval, setMistingInterval,
        mistingDuration, setMistingDuration,
        ecTarget, setEcTarget,
        smartLighting, setSmartLighting,
        lightsOnTime, setLightsOnTime,
        lightsOffTime, setLightsOffTime,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
