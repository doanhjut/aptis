import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

// Group part1 questions into topics, each with 3 questions
const topics = [];
const questionsPerTopic = 3;
const shuffledQuestions = [...data.part1].sort(() => Math.random() - 0.5);
for (let i = 0; i < shuffledQuestions.length; i += questionsPerTopic) {
  topics.push({
    name: `Topic ${topics.length + 1}`,
    questions: shuffledQuestions.slice(i, i + questionsPerTopic),
  });
}

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
      if (
        currentQuestionIndex < 2 &&
        currentTopicIndex < shuffledTopics.length
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentTopicIndex(currentTopicIndex + 1);
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
          <Link to="/listening" className="back-button">
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
