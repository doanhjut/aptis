import { useState, useEffect } from "react";
import "./part2.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function WritingPart2({ questions, onComplete }) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const questionsData =
      questions && questions.length > 0 ? questions : data.part2;
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setSelectedQuestion(shuffled[0]);
    setAnswer("");
    setWordCount(0);
  }, [questions]);

  const handleAnswerChange = (event) => {
    const value = event.target.value;
    setAnswer(value);
    setWordCount(value.trim().split(/\s+/).length);
  };

  const handleSubmit = () => {
    if (wordCount >= 20 && wordCount <= 30) {
      onComplete();
    }
  };

  if (!selectedQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Writing Practice - Part 2</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/writing" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <div className="question-section2">
        <p className="question-text">{selectedQuestion}</p>
        <div className="input-container">
          <textarea
            className="answer-input"
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Answer (20-30 words)"
            maxLength="150"
          />
          <span className="word-count">{wordCount} words</span>
        </div>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={wordCount < 20 || wordCount > 30}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default WritingPart2;
