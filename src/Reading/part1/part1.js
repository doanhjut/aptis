import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function ReadingPart1({ questions, onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [results, setResults] = useState({});
  const [showCorrect, setShowCorrect] = useState({});
  const [shuffledTopics, setShuffledTopics] = useState([]);

  useEffect(() => {
    const topicList = questions && questions.length > 0 ? questions : data.part1;
    const shuffled = [...topicList].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setSelectedOptions({});
    setResults({});
    setShowCorrect({});
  }, [questions]);

  const handleOptionClick = (questionIndex, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = () => {
    const currentTopic = shuffledTopics[currentTopicIndex];
    let allCorrect = true;
    const newResults = {};
    const newShowCorrect = {};

    currentTopic.questions.forEach((question, index) => {
      const selected = selectedOptions[index];
      if (selected === question.answer) {
        newResults[index] = "Correct!";
      } else {
        newResults[index] = "Incorrect, try again or show correct answer.";
        newShowCorrect[index] = true;
        allCorrect = false;
      }
    });

    setResults(newResults);
    setShowCorrect(newShowCorrect);

    if (allCorrect) {
      setTimeout(() => {
        if (currentTopicIndex < shuffledTopics.length - 1) {
          setCurrentTopicIndex(currentTopicIndex + 1);
          setSelectedOptions({});
          setResults({});
          setShowCorrect({});
        } else {
          setResults({ final: "Congratulations! You completed all topics!" });
          onComplete();
        }
      }, 1000);
    }
  };

  const currentTopic = shuffledTopics[currentTopicIndex];

  if (!currentTopic) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Multiple Choice Game - Part 1</h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/reading" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length}
      </p>
      <div className="question-section">
        <h2>{currentTopic.name}</h2>
        {currentTopic.questions.map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">
              Question {index + 1}: {question.text}
            </p>
            <div className="options">
              {question.options.map((option, optIndex) => (
                <button
                  key={optIndex}
                  className={`option-btn ${
                    selectedOptions[index] === option
                      ? option === question.answer
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleOptionClick(index, option)}
                >
                  {String.fromCharCode(65 + optIndex)}. {option}
                </button>
              ))}
            </div>
            {results[index] && (
              <p
                className={`result ${
                  results[index].includes("Correct") ? "correct" : "incorrect"
                }`}
              >
                {results[index]}
              </p>
            )}
            {showCorrect[index] && (
              <div className="correct-answer">
                <p>Correct answer: {question.answer}</p>
              </div>
            )}
          </div>
        ))}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={Object.keys(selectedOptions).length !== currentTopic.questions.length}
        >
          Submit Topic
        </button>
        {results.final && (
          <p className="result correct">{results.final}</p>
        )}
      </div>
    </div>
  );
}

export default ReadingPart1;