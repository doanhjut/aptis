import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

// Use the topics from data.part1 directly (they already have the correct structure)
const topics = [...data.part1];

function SpeakingPart1({ questions, onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [displayTime, setDisplayTime] = useState(5);
  const [shuffledTopics, setShuffledTopics] = useState([]);

  useEffect(() => {
    const topicList = questions && questions.length > 0 ? questions : topics;
    const shuffled = [...topicList].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setDisplayTime(5);
  }, [questions]);

  useEffect(() => {
    let displayTimer;
    if (displayTime > 0) {
      displayTimer = setTimeout(() => setDisplayTime(displayTime - 1), 1000);
    } else if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Move to next question in current topic
      if (currentQuestionIndex < currentTopic.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(30);
        setDisplayTime(5);
      } 
      // Move to next topic
      else if (currentTopicIndex < shuffledTopics.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
        setCurrentQuestionIndex(0);
        setTimeLeft(30);
        setDisplayTime(5);
      } 
      // All topics completed
      else {
        onComplete();
      }
    }
    return () => clearTimeout(displayTimer);
  }, [
    displayTime,
    timeLeft,
    currentQuestionIndex,
    currentTopicIndex,
    shuffledTopics.length,
    onComplete,
  ]);

  const currentTopic = shuffledTopics[currentTopicIndex];

  if (!currentTopic || currentTopicIndex === null) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Speaking Practice - Part 1</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/speaking" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length}
      </p>
      <div className="question-section">
        <h2>{currentTopic.name}</h2>
        {displayTime > 0 ? (
          <p className="display-text">Chuẩn bị: {displayTime} seconds</p>
        ) : (
          <>
            <p className="question-text">
              Question {currentQuestionIndex + 1}:{" "}
              {currentTopic.questions[currentQuestionIndex] ||
                "No question available"}
            </p>
            <p className="timer">Thời gian nói: {timeLeft} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}

export default SpeakingPart1;
