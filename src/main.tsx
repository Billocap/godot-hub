import ReactDOM from "react-dom/client";

import App from "./components/App";
import SettingsProvider from "./hooks/controllers/useSettings";
import VersionsProvider from "./hooks/controllers/useVersions";

import "./css/main.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <SettingsProvider>
    <VersionsProvider>
      <App />
    </VersionsProvider>
  </SettingsProvider>
);
