import { useState, useEffect } from "react";
import "./part3.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function WritingPart3({ questions, onComplete }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [answers, setAnswers] = useState({});
  const [wordCounts, setWordCounts] = useState({});

  useEffect(() => {
    const questionsData =
      questions && questions.length > 0 ? questions : data.part3;
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setSelectedTopic(shuffled[0]);
    setAnswers({});
    setWordCounts({});
  }, [questions]);

  const handleAnswerChange = (index) => (event) => {
    const value = event.target.value;
    setAnswers((prev) => ({ ...prev, [index]: value }));
    setWordCounts((prev) => ({
      ...prev,
      [index]: value.trim().split(/\s+/).length,
    }));
  };

  const handleSubmit = () => {
    onComplete();
  };

  const isSubmitEnabled = () => {
    if (!selectedTopic || !selectedTopic.questions) return false;
    return selectedTopic.questions.every((_, index) => {
      const wordCount = wordCounts[index] || 0;
      return wordCount >= 30 && wordCount <= 50;
    });
  };

  if (!selectedTopic || !selectedTopic.questions) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Writing Practice - Part 3</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <div className="question-section3">
        <h2>
          {selectedTopic.name.charAt(0).toUpperCase() +
            selectedTopic.name.slice(1)}
        </h2>
        {selectedTopic.questions.map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">{question}</p>
            <div className="input-container">
              <textarea
                className="answer-input"
                value={answers[index] || ""}
                onChange={handleAnswerChange(index)}
                placeholder="Answer (30-50 words)"
                maxLength="200"
                style={{ width: "90%" }}
              />
              <span className="word-count">{wordCounts[index] || 0} words</span>
            </div>
          </div>
        ))}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default WritingPart3;
