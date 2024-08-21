// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategorySelect from "./components/CategorySelect";
import QuestionsPage from "./components/QuestionsPage";

export default function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<CategorySelect />} />
          <Route path="/questions/:id" element={<QuestionsPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
