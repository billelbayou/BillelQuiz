// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategorySelect from "./components/CategorySelect";
import QuestionRoute from "./components/QuestionRoute";

export default function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<CategorySelect />} />
          <Route path="/questions/:id" element={<QuestionRoute />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
