import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function WritingPart1({ questions, onComplete }) {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const questionsData =
      questions && questions.length > 0 ? questions : data.part1;
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 5));
    setAnswers({});
    setCurrentQuestionIndex(0);
  }, [questions]);

  const handleAnswerChange = (event) => {
    const answer = event.target.value;
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || "";
  const wordCount = currentAnswer.trim().split(/\s+/).length;

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Writing Practice - Part 1</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/writing" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="question-count">
        {currentQuestionIndex + 1}/{selectedQuestions.length}
      </p>
      <div className="question-section1">
        <p className="question-text">{currentQuestion}</p>
        <div className="input-container">
          <textarea
            className="answer-input"
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder="Answer (1-5 words)"
            maxLength="10"
          />
          <span className="word-count">{wordCount} words</span>
        </div>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={currentAnswer.trim() === ""}
        >
          Next
        </button>
      </div>

      {showSummary && (
        <div className="summary-popup">
          <div className="summary-content">
            <h2>Summary of Your Answers</h2>
            {selectedQuestions.map((question, index) => (
              <p key={index}>
                {question}: {answers[index] || "No answer"}
              </p>
            ))}
            <button className="close-btn" onClick={onComplete}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WritingPart1;
