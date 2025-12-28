import ReactDOM from "react-dom/client";

import App from "./components/App";
import SettingsProvider from "./hooks/useSettings";

import "./css/main.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);
