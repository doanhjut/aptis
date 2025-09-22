import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";

const topics = data.part1.map((question, index) => ({
  name: `Topic ${index + 1}`,
  questions: question.questions.slice(0, 3) // Only use the question text, pad with empty strings if needed
}));

function SpeakingPart1({ question, onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [displayTime, setDisplayTime] = useState(5);
  const [shuffledTopics, setShuffledTopics] = useState([]);

  useEffect(() => {
    const topic = question && question.length > 0 ? question : topics;
    const shuffled = [...topic].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setDisplayTime(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let displayTimer;
    if (displayTime > 0) {
      displayTimer = setTimeout(() => setDisplayTime(displayTime - 1), 1000);
    } else if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      if (currentQuestionIndex < 2) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(30);
        setDisplayTime(5);
      } else if (currentTopicIndex < shuffledTopics.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
        setCurrentQuestionIndex(0);
        setTimeLeft(30);
        setDisplayTime(5);
      } else {
        onComplete();
      }
    }
    return () => clearTimeout(displayTimer);
  }, [displayTime, timeLeft, currentQuestionIndex, currentTopicIndex, onComplete, shuffledTopics.length]);

  const currentTopic = shuffledTopics[currentTopicIndex];

  if (!currentTopic || currentTopicIndex === null) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Speaking Practice - Part 5</h1>
      <p className="question-count">{currentTopicIndex + 1}/{shuffledTopics.length}</p>
      <div className="question-section">
        <h2>{currentTopic.name}</h2>
        {displayTime > 0 ? (
          <p className="display-text">Chuẩn bị: {displayTime} seconds</p>
        ) : (
          <>
            <p className="question-text">
              Question {currentQuestionIndex + 1}: {currentTopic.questions[currentQuestionIndex] || "No question available"}
            </p>
            <p className="timer">Thời gian nói: {timeLeft} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}

export default SpeakingPart1;