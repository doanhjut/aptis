import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function ListeningPart1({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

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
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setCorrectCount(correctCount + 1);
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
      setIncorrectCount(incorrectCount + 1);
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
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        {currentQuestionIndex + 1}/{shuffledQuestions.length}
      </p>
      <p className="score-count">
        Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
      </p>
      <div className="question-section">
        <p className="question-text">{currentQuestion.question}</p>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedOption === option
                  ? option === currentQuestion.correctAnswer
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
              // disabled={selectedOption !== ""}
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
            <p>Correct answer: {currentQuestion.correctAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeningPart1;
