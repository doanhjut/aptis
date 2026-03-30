import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function SpeakingPart4({ questions, onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState("prepare"); // "prepare" or "answer"
  const [shuffledTopics, setShuffledTopics] = useState([]);

  useEffect(() => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part4;
    const shuffled = [...dataQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setTimeLeft(60);
    setPhase("prepare");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      if (phase === "prepare") {
        setPhase("answer");
        setTimeLeft(120); // 120s (2 minutes) to answer all 3 questions
      } else {
        // Finished answering for this topic
        if (currentTopicIndex < shuffledTopics.length - 1) {
          setCurrentTopicIndex(currentTopicIndex + 1);
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
    currentTopicIndex,
    onComplete,
    shuffledTopics.length,
  ]);

  const currentTopic = shuffledTopics[currentTopicIndex];

  if (!currentTopic || currentTopicIndex === null) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Speaking Practice - Part 4</h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/speaking" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length}
      </p>
      <div className="question-section">
        <h2>{currentTopic.name}</h2>
        <div className="questions-list">
          {currentTopic.questions.map((option, index) => (
            <h3 key={index} className="question-item">
              Q{index + 1}: {option}
            </h3>
          ))}
        </div>
        
        <div className="status-section">
          {phase === "prepare" ? (
            <div className="prep-phase">
              <p className="label">Preparation time</p>
              <p className="timer highlight">{timeLeft} seconds</p>
            </div>
          ) : (
            <div className="answer-phase">
              <p className="label">Answering time (Speak now!)</p>
              <p className="timer">{timeLeft} seconds</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeakingPart4;
