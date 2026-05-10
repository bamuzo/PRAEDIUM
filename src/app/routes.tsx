import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomeScreen } from "./components/HomeScreen";
import { AlertsScreen } from "./components/AlertsScreen";
import { RacksScreen } from "./components/RacksScreen";
import { SettingsScreen } from "./components/SettingsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeScreen },
      { path: "alerts", Component: AlertsScreen },
      { path: "racks", Component: RacksScreen },
      { path: "settings", Component: SettingsScreen },
    ],
  },
]);
