import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data.js";

function Part4({ onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [shuffledTopics, setShuffledTopics] = useState([]);
  const [shuffledSubQuestions, setShuffledSubQuestions] = useState([]);

  useEffect(() => {
    shuffleTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleTopics = () => {
    const shuffled = [...data.part4].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setShowCorrect(false);
    shuffleSubQuestions(shuffled[0]?.subQuestions || []);
  };

  const shuffleSubQuestions = (subQuestions) => {
    const shuffled = [...subQuestions].sort(() => Math.random() - 0.5);
    setShuffledSubQuestions(shuffled);
  };

  const currentTopic = shuffledTopics[currentTopicIndex] || null;

  useEffect(() => {
    if (currentTopic) {
      shuffleSubQuestions(currentTopic.subQuestions);
    }
  }, [currentTopicIndex, currentTopic]);

  const handleOptionClick = (subQuestion) => {
    const isCorrect = subQuestion.answer;
    const updatedSelected = [...selectedAnswers, subQuestion.text];

    if (isCorrect) {
      if (updatedSelected.filter((text) => currentTopic.subQuestions.find((q) => q.text === text).answer).length === 2) {
        setTimeout(() => {
          if (currentTopicIndex < shuffledTopics.length - 1) {
            setCurrentTopicIndex(currentTopicIndex + 1);
            setSelectedAnswers([]);
            setResult(null);
            setShowCorrect(false);
            shuffleSubQuestions(shuffledTopics[currentTopicIndex + 1].subQuestions);
          } else {
            setResult("Congratulations! You completed all topics!");
            onComplete();
          }
        }, 1000);
      } else {
        setSelectedAnswers(updatedSelected);
        setResult("Select another correct answer.");
      }
    } else {
      setResult("Incorrect, try again or show correct answers.");
      setShowCorrect(true);
    }
  };

  if (!currentTopic) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Multiple Choice Game - Part 4</h1>
      <p className="question-count">{currentTopicIndex + 1}/{shuffledTopics.length}</p>
      <div className="question-section">
        <h2>Topic: {currentTopic.name}</h2>
        <p>Chọn 2 câu đúng:</p>
        <div className="options">
          {shuffledSubQuestions.map((subQuestion, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedAnswers.includes(subQuestion.text)
                  ? subQuestion.answer
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              onClick={() => handleOptionClick(subQuestion)}
              disabled={selectedAnswers.length === 2 && !selectedAnswers.includes(subQuestion.text)}
            >
              {String.fromCharCode(65 + index)}. {subQuestion.text}
            </button>
          ))}
        </div>
        {result && (
          <p className={`result ${result.includes("Congratulations") ? "correct" : "incorrect"}`}>{result}</p>
        )}
        {showCorrect && (
          <div className="correct-answer">
            <p>Correct answers: {currentTopic.subQuestions.filter((q) => q.answer).map((q) => q.text).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Part4;