import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function SpeakingPart4({ questions, onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState("prepare"); // "prepare" or "answer"
  const [shuffledTopics, setShuffledTopics] = useState([]);

  useEffect(() => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part4;
    const shuffled = [...dataQuestions].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setPhase("prepare");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      if (phase === "prepare" && currentQuestionIndex === 0) {
        setPhase("answer");
        setTimeLeft(120); // 2 minutes for answering
      } else if (phase === "answer") {
        if (currentQuestionIndex < 2) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setPhase("prepare");
          setTimeLeft(60);
        } else if (currentTopicIndex < shuffledTopics.length - 1) {
          setCurrentTopicIndex(currentTopicIndex + 1);
          setCurrentQuestionIndex(0);
          setPhase("prepare");
          setTimeLeft(60);
        } else {
          onComplete();
        }
      }
    }
    return () => clearInterval(timer);
  }, [
    timeLeft,
    phase,
    currentQuestionIndex,
    currentTopicIndex,
    onComplete,
    shuffledTopics.length,
  ]);

  const currentTopic = shuffledTopics[currentTopicIndex];

  if (!currentTopic || currentTopicIndex === null) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Speaking Practice - Part 6</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/speaking" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        {currentTopicIndex + 1}/{shuffledTopics.length}
      </p>
      <div className="question-section">
        <h2>{currentTopic.name}</h2>
        {currentTopic.questions.map((option, index) => (
          <h3>{option}</h3>
        ))}
        {phase === "prepare" ? (
          <p className="display-text">Preparation time: {timeLeft} seconds</p>
        ) : (
          <>
            <p className="question-text">
              Question {currentQuestionIndex + 1}:{" "}
              {currentTopic.questions[currentQuestionIndex] ||
                "No question available"}
            </p>
            <p className="timer">Answer time: {timeLeft} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}

export default SpeakingPart4;
