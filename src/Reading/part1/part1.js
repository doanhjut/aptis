import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function ReadingPart1({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    shuffleQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleQuestions = () => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part1;
    const shuffled = [...dataQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setResult(null);
    setShowCorrect(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (option === currentQuestion.answer) {
      setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption("");
          setResult(null);
          setShowCorrect(false);
        } else {
          setResult("Congratulations! You completed all questions!");
          onComplete();
        }
      }, 1000);
    } else {
      setResult("Incorrect, try again or show correct answer.");
      setShowCorrect(true);
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex] || null;

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Multiple Choice Game - Part 1</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="question-count">
        {currentQuestionIndex + 1}/{shuffledQuestions.length}
      </p>
      <div className="question-section">
        <p className="question-text">{currentQuestion.text}</p>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedOption === option
                  ? option === currentQuestion.answer
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
              // disabled={selectedOption !== ''}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
        {result && (
          <p
            className={`result ${
              result.includes("Congratulations") ? "correct" : "incorrect"
            }`}
          >
            {result}
          </p>
        )}
        {showCorrect && (
          <div className="correct-answer">
            <p>Correct answer: {currentQuestion.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingPart1;
