import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decode } from "html-entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { useNavigate } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const [questionData, setQuestionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answersArr, setAnswersArr] = useState<
    { value: string; correct: boolean }[]
  >([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=1&category=${id}`
        );
        const data = await response.json();
        setQuestionData(data.results[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the questions:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestions();
    }
  }, [id]);

  useEffect(() => {
    if (questionData) {
      const shuffledAnswers = questionData.incorrect_answers.map(
        (answer: string) => ({
          value: answer,
          correct: false,
        })
      );

      const randomIndex = Math.floor(
        Math.random() * (shuffledAnswers.length + 1)
      );
      shuffledAnswers.splice(randomIndex, 0, {
        value: questionData.correct_answer,
        correct: true,
      });

      setAnswersArr(shuffledAnswers);
    }
  }, [questionData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedAnswer) {
      const isCorrect = answersArr.find(
        (answer) => answer.value === selectedAnswer
      )?.correct;
      if (isCorrect) {
        setFeedback("Correct! Well done!");
        setFeedbackType("yes");
      } else {
        setFeedback("Incorrect. Try again!");
        setFeedbackType("no");
      }
      setIsSubmitted(true); // Set form as submitted
    } else {
      setFeedback("Please select an answer.");
      setFeedbackType("undefined");
    }
  };

  const handlePlayAgain = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setIsSubmitted(false);
    setLoading(true);
    if (id) {
      // Fetch a new question
      fetch(`https://opentdb.com/api.php?amount=1&category=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setQuestionData(data.results[0]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching the questions:", error);
          setLoading(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="bg-[#EFF0F3] w-full h-screen flex justify-center items-center">
        <FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl" />
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="bg-[#EFF0F3] w-full h-screen flex justify-center items-center">
        <p className="text-4xl font-bold">No question found.</p>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <section className="w-full h-screen bg-[#EFF0F3] flex flex-col items-center justify-center py-24">
        <button onClick={() => navigate("/")} className="relative mb-5 text-gray-600 left-[-192px] translate-x-[50%]">
          <FontAwesomeIcon icon={faHouse} size="xl" />
        </button>
        <div className="mb-10 h-fit w-96 bg-white text-xl font-bold flex items-center justify-center p-10 rounded-xl leading-8 shadow-xl">
          {decode(questionData.question)}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          {answersArr.map((item, index: number) => (
            <div
              key={index}
              className={`w-96 h-10 mb-2 text-lg font-semibold rounded-lg overflow-hidden ${
                isSubmitted
                  ? item.correct
                    ? "bg-green-500"
                    : selectedAnswer === item.value
                    ? "bg-red-500"
                    : "bg-white"
                  : "bg-white"
              }`}
            >
              <input
                type="radio"
                id={`${index}`}
                name="correct_answer"
                value={decode(item.value)}
                onChange={handleChange}
                checked={selectedAnswer === decode(item.value)}
                disabled={isSubmitted}
              />
              <label
                htmlFor={`${index}`}
                className="w-full h-full flex items-center justify-center cursor-pointer"
              >
                {decode(item.value)}
              </label>
            </div>
          ))}
          {feedback && (
            <p
              className={`mt-4 mx-auto text-lg font-semibold border py-2 px-4 w-fit rounded-xl ${
                feedbackType === "yes"
                  ? "bg-green-500"
                  : feedbackType === "no"
                  ? "bg-red-300"
                  : "bg-white"
              }`}
            >
              {feedback}
            </p>
          )}
          <div className="flex justify-evenly mt-4">
            <button
              type="submit"
              className={`text-xl font-semibold w-fit h-fit py-2 px-4 border rounded-xl shadow-lg ${
                isSubmitted ? "hidden" : ""
              }`}
            >
              Submit
            </button>
            {isSubmitted && (
              <button
                className="text-xl font-semibold w-fit h-fit py-2 px-4 border-2 rounded-xl shadow-xl"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
            )}
          </div>
        </form>
      </section>
    </React.StrictMode>
  );
}
