import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Inject Layer 8 Brand Visual Stylesheets before DOM construction runs
import "./styles/theme.css";

// Hydrate and mount the master system tree layout node
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
