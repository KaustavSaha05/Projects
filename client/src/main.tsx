import { createRoot } from "react-dom/client";
import App from "./App";
//import "./index.css";
import React from "react";

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);