// src/components/QuestionRoute.tsx
import React from "react";
import { useParams } from "react-router-dom";
import QuestionsPage from "./QuestionsPage";

export default function QuestionRoute() {
  const { id } = useParams<{ id: string }>();
  return (
    <React.StrictMode>
      <QuestionsPage id={Number(id)} />
    </React.StrictMode>
  );
}
