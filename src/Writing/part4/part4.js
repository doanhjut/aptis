import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data";
import { Link } from "react-router-dom";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const countWords = (text) => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

function WritingPart4({ questions, onComplete }) {
  const [questionIndices, setQuestionIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [informalEmail, setInformalEmail] = useState("");
  const [formalEmail, setFormalEmail] = useState("");
  const [result, setResult] = useState(null);
  const [dataQuestions, setDataQuestions] = useState([]);

  useEffect(() => {
    const dataSource = questions ? [questions] : data.part4;
    setDataQuestions(dataSource);
    const indices = shuffleArray(
      Array.from({ length: dataSource.length }, (_, i) => i)
    );
    setQuestionIndices(indices);
    setCurrentIndex(0);
    setInformalEmail("");
    setFormalEmail("");
    setResult(null);
  }, [questions]);

  const handleCheckAnswer = () => {
    const informalWordCount = countWords(informalEmail);
    const formalWordCount = countWords(formalEmail);
    const isInformalValid = informalWordCount >= 40 && informalWordCount <= 50;
    const isFormalValid = formalWordCount >= 120 && formalWordCount <= 150;

    if (isInformalValid && isFormalValid) {
      setResult("Correct! Both emails meet the word count requirements.");
      setTimeout(() => {
        if (currentIndex < questionIndices.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setInformalEmail("");
          setFormalEmail("");
          setResult(null);
        } else {
          onComplete();
          const newIndices = shuffleArray(
            Array.from({ length: dataQuestions.length }, (_, i) => i)
          );
          setQuestionIndices(newIndices);
          setCurrentIndex(0);
          setInformalEmail("");
          setFormalEmail("");
          setResult("New round started!");
        }
      }, 1000);
    } else {
      let errorMessage = "Incorrect. ";
      if (!isInformalValid) {
        errorMessage += `Informal email (${informalWordCount} words) should be 40-50 words. `;
      }
      if (!isFormalValid) {
        errorMessage += `Formal email (${formalWordCount} words) should be 120-150 words.`;
      }
      setResult(errorMessage);
    }
  };

  const handleTryAgain = () => {
    setInformalEmail("");
    setFormalEmail("");
    setResult(null);
  };

  const currentQuestion = dataQuestions[questionIndices[currentIndex]];

  return (
    <div className="app-container4 max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/writing" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <h1 className="game-title text-3xl font-bold text-center mb-4">
        Email Writing Task
      </h1>
      <p className="question-info text-lg text-center mb-4">
        Question {currentIndex + 1} of {dataQuestions.length}
      </p>
      {currentQuestion && (
        <div className="question-section space-y-6" style={{ width: "90%" }}>
          <div className="topic-section">
            <h2 className="text-xl font-semibold">
              Topic: {currentQuestion.topic}
            </h2>
          </div>
          <div className="email-section">
            <h3 className="text-lg font-medium mb-2">
              Informal Email (40-50 words)
            </h3>
            <p className="mb-2">{currentQuestion.informalPrompt}</p>
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={informalEmail}
              onChange={(e) => setInformalEmail(e.target.value)}
              placeholder="Write your informal email here..."
            />
            <p className="text-sm text-gray-600 mt-1">
              Word count: {countWords(informalEmail)}
            </p>
          </div>
          <div className="email-section">
            <h3 className="text-lg font-medium mb-2">
              Formal Email (120-150 words)
            </h3>
            <p className="mb-2">{currentQuestion.formalPrompt}</p>
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="8"
              value={formalEmail}
              onChange={(e) => setFormalEmail(e.target.value)}
              placeholder="Write your formal email here..."
            />
            <p className="text-sm text-gray-600 mt-1">
              Word count: {countWords(formalEmail)}
            </p>
          </div>
        </div>
      )}
      {result && (
        <div
          className={`result mt-4 p-3 rounded-md text-center ${
            result.includes("Correct")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {result}
        </div>
      )}
      <div className="button-container flex justify-center space-x-4 mt-6">
        <button
          onClick={handleCheckAnswer}
          className="check-button bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Check Answer
        </button>
        <button
          onClick={handleTryAgain}
          className="try-again-button bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default WritingPart4;
