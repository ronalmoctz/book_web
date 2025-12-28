import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InsertBook } from "./pages/InsertBook";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/InsertBook" element={<InsertBook />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
