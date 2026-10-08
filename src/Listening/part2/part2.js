import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newListeningData } from "../dataNew";
import "./part2.css";

const emptyAssignments = () => ({ A: "", B: "", C: "", D: "" });

function getExercises(questions) {
  if (Array.isArray(questions) && questions.length > 0) {
    return [...questions];
  }

  return [...newListeningData.part2].sort(() => Math.random() - 0.5);
}

function ListeningPart2({
  questions,
  onComplete,
  backPath = "/listening/new",
}) {
  const [exercises, setExercises] = useState(() => getExercises(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assignments, setAssignments] = useState(emptyAssignments);
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [wrongExercises, setWrongExercises] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewExercises, setReviewExercises] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [resumeIndex, setResumeIndex] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const advanceTimer = useRef(null);

  useEffect(() => {
    setExercises(getExercises(questions));
    setCurrentIndex(0);
    setAssignments(emptyAssignments());
    setResult(null);
    setShowCorrect(false);
    setIsAdvancing(false);
    setWrongExercises([]);
    setIsReviewMode(false);
    setReviewExercises([]);
    setReviewIndex(0);
    setResumeIndex(null);
    setIsComplete(false);
  }, [questions]);

  useEffect(
    () => () => {
      clearTimeout(advanceTimer.current);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const currentExercise = isReviewMode
    ? reviewExercises[reviewIndex]
    : exercises[currentIndex];

  const returnToMainExercise = () => {
    clearTimeout(advanceTimer.current);
    const nextIndex = resumeIndex ?? currentIndex;
    setIsReviewMode(false);
    setReviewExercises([]);
    setReviewIndex(0);
    setAssignments(emptyAssignments());
    setShowCorrect(false);
    setIsAdvancing(false);
    setResumeIndex(null);

    if (nextIndex >= exercises.length) {
      setIsComplete(true);
      setResult("Hoàn thành Part 2!");
      if (typeof onComplete === "function") onComplete();
      return;
    }

    setCurrentIndex(nextIndex);
    setResult(null);
  };

  const handleAssignment = (speaker, answer) => {
    if (isAdvancing) return;
    setAssignments((current) => ({ ...current, [speaker]: answer }));
    setResult(null);
    setShowCorrect(false);
  };

  const handleCheck = () => {
    const allAssigned = currentExercise.speakers.every(
      ({ speaker }) => assignments[speaker],
    );
    if (!allAssigned) {
      setResult("Hãy chọn đáp án cho cả bốn người nói.");
      return;
    }

    const isCorrect = currentExercise.speakers.every(
      ({ speaker, correctAnswer }) => assignments[speaker] === correctAnswer,
    );

    if (!isCorrect) {
      setResult("Sai rồi. Hãy xem đáp án đúng và thử lại.");
      setShowCorrect(true);
      setWrongExercises((current) =>
        current.some((exercise) => exercise === currentExercise)
          ? current
          : [...current, currentExercise],
      );
      return;
    }

    setResult("Đúng rồi!");
    setShowCorrect(false);
    setIsAdvancing(true);
    advanceTimer.current = setTimeout(() => {
      if (isReviewMode) {
        if (reviewIndex < reviewExercises.length - 1) {
          setReviewIndex((index) => index + 1);
          setAssignments(emptyAssignments());
          setResult(null);
          setIsAdvancing(false);
        } else {
          returnToMainExercise();
        }
        return;
      }

      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((index) => index + 1);
        setAssignments(emptyAssignments());
        setResult(null);
        setIsAdvancing(false);
      } else if (typeof onComplete === "function") {
        onComplete();
      } else {
        setResult("Hoàn thành Part 2!");
        setIsAdvancing(false);
      }
    }, 1000);
  };

  const startWrongReview = () => {
    if (wrongExercises.length === 0 || isAdvancing) return;
    clearTimeout(advanceTimer.current);
    setResumeIndex(showCorrect ? currentIndex + 1 : currentIndex);
    setReviewExercises([...wrongExercises].sort(() => Math.random() - 0.5));
    setReviewIndex(0);
    setAssignments(emptyAssignments());
    setResult(null);
    setShowCorrect(false);
    setIsReviewMode(true);
    setWrongExercises([]);
  };

  const speakTranscript = (transcript) => {
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech!");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(transcript);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  if (!currentExercise) {
    return <div className="app-container">Không có bài tập Part 2.</div>;
  }

  if (isComplete) {
    return (
      <div className="app-container app-container--part2">
        <h1 className="game-title">Listening Aptis - Part 2</h1>
        <p className="result correct">Hoàn thành Part 2!</p>
      </div>
    );
  }

  return (
    <div className="app-container app-container--part2">
      <div className="back-button-container">
        <Link to={backPath} className="back-button">
          ← Quay lại
        </Link>
      </div>
      <h1 className="game-title">Listening Aptis - Part 2</h1>
      <p className="question-count">
        {isReviewMode
          ? `Ôn câu sai: ${reviewIndex + 1}/${reviewExercises.length}`
          : `Bài ${currentIndex + 1}/${exercises.length}`}
      </p>
      {isReviewMode && (
        <button
          type="button"
          className="review-button"
          onClick={returnToMainExercise}
        >
          Tiếp tục bài đang làm
        </button>
      )}
      {wrongExercises.length > 0 && (
        <button
          type="button"
          className="review-button"
          onClick={startWrongReview}
          disabled={isAdvancing}
        >
          Ôn câu sai ({wrongExercises.length})
        </button>
      )}

      <div className="part2-section">
        <h2>{currentExercise.name}</h2>
        <p className="part2-instructions">
          Nghe từng người nói và chọn một đáp án khác nhau cho mỗi người.
        </p>

        <div className="speaker-list">
          {currentExercise.speakers.map(({ speaker, transcript }) => {
            const usedByAnotherSpeaker = new Set(
              Object.entries(assignments)
                .filter(([assignedSpeaker]) => assignedSpeaker !== speaker)
                .map(([, answer]) => answer)
                .filter(Boolean),
            );

            return (
              <div className="speaker-row" key={speaker}>
                <div className="speaker-heading">
                  <label htmlFor={`speaker-${speaker}`}>Speaker {speaker}</label>
                  <button
                    type="button"
                    className="speak-button"
                    onClick={() => speakTranscript(transcript)}
                  >
                    🔊 Nghe Speaker {speaker}
                  </button>
                </div>
                <select
                  id={`speaker-${speaker}`}
                  data-speaker={speaker}
                  value={assignments[speaker]}
                  onChange={(event) =>
                    handleAssignment(speaker, event.target.value)
                  }
                  disabled={isAdvancing}
                >
                  <option value="">-- Chọn đáp án --</option>
                  {currentExercise.options.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={usedByAnotherSpeaker.has(option)}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {result && (
          <p className={`result ${result === "Đúng rồi!" ? "correct" : "incorrect"}`}>
            {result}
          </p>
        )}

        {showCorrect && (
          <div className="correct-answer part2-correct-answers">
            <h3>Đáp án đúng:</h3>
            {currentExercise.speakers.map(({ speaker, correctAnswer }) => (
              <p key={speaker}>
                {speaker}: {correctAnswer}
              </p>
            ))}
          </div>
        )}

        <button
          type="button"
          className="check-button"
          onClick={handleCheck}
          disabled={isAdvancing}
        >
          Kiểm tra đáp án
        </button>
      </div>
    </div>
  );
}

export default ListeningPart2;
