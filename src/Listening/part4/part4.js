import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function Part4({ onComplete, isTest }) {
  const [shuffledTopics, setShuffledTopics] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  // Stores the two "sub-questions" for the current topic.
  const [currentSubQuestions, setCurrentSubQuestions] = useState([]);

  // Track which sub-question we are on (0 or 1)
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  // Track selected option for the *current* sub-question
  const [selectedOption, setSelectedOption] = useState(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // --- Review mode state ---
  // wrongItems: array of { topicIndex, subIndex } for wrong sub-questions
  const [wrongItems, setWrongItems] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  // For review, we store the prepared sub-question options per review item
  const [reviewSubQuestion, setReviewSubQuestion] = useState(null);

  useEffect(() => {
    shuffleTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleTopics = () => {
    let shuffled = [...data.part4].sort(() => Math.random() - 0.5);
    if (isTest) {
      shuffled = shuffled.slice(0, 2);
    }
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    resetQuestionState();
    setCorrectCount(0);
    setIncorrectCount(0);
    setWrongItems([]);
    setIsReviewMode(false);
    setReviewQueue([]);
    setCurrentReviewIdx(0);
    setReviewSubQuestion(null);

    if (shuffled.length > 0) {
      prepareSubQuestions(shuffled[0].subQuestions);
    }
  };

  const resetQuestionState = () => {
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);
    setCurrentSubIndex(0);
  };

  const prepareSubQuestions = (allOptions) => {
    const correctOptions = allOptions.filter((o) => o.answer);
    const incorrectOptions = allOptions.filter((o) => !o.answer);

    const shuffledIncorrect = [...incorrectOptions].sort(() => Math.random() - 0.5);

    // Group 1
    const group1Options = [
      correctOptions[0],
      shuffledIncorrect[0],
      shuffledIncorrect[1],
    ].filter(Boolean).sort(() => Math.random() - 0.5);

    // Group 2
    const group2Options = [
      correctOptions[1],
      shuffledIncorrect[2],
      shuffledIncorrect[3],
    ].filter(Boolean).sort(() => Math.random() - 0.5);

    setCurrentSubQuestions([
      { id: 0, options: group1Options },
      { id: 1, options: group2Options },
    ]);
  };

  // Build a review sub-question for one wrong item
  const buildReviewSubQuestion = (topic, subIdx) => {
    const allOptions = topic.subQuestions;
    const correctOptions = allOptions.filter((o) => o.answer);
    const incorrectOptions = allOptions.filter((o) => !o.answer);
    const shuffledIncorrect = [...incorrectOptions].sort(() => Math.random() - 0.5);

    if (subIdx === 0) {
      return [
        correctOptions[0],
        shuffledIncorrect[0],
        shuffledIncorrect[1],
      ].filter(Boolean).sort(() => Math.random() - 0.5);
    } else {
      return [
        correctOptions[1],
        shuffledIncorrect[2],
        shuffledIncorrect[3],
      ].filter(Boolean).sort(() => Math.random() - 0.5);
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option.text);

    if (option.answer) {
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        handleNextStep();
      }, 1000);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setResult("Incorrect. See correct answer.");
      setShowCorrect(true);

      // Track wrong answer (only in practice mode)
      const isWrong = !isTest;
      if (isWrong) {
        setWrongItems((prev) => [
          ...prev,
          { topicIndex: currentTopicIndex, subIndex: currentSubIndex },
        ]);
      }

      setTimeout(() => {
        handleNextStep(isWrong);
      }, 2000);
    }
  };

  const handleNextStep = (justAddedWrong) => {
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);

    if (currentSubIndex < 1) {
      setCurrentSubIndex(1);
    } else {
      nextTopic(justAddedWrong);
    }
  };

  const nextTopic = (justAddedWrong) => {
    if (currentTopicIndex < shuffledTopics.length - 1) {
      const nextIndex = currentTopicIndex + 1;
      setCurrentTopicIndex(nextIndex);
      setCurrentSubIndex(0);
      prepareSubQuestions(shuffledTopics[nextIndex].subQuestions);
    } else {
      // All topics done — read wrongItems via functional updater to avoid stale closure
      if (!isTest) {
        setWrongItems((prevWrong) => {
          // "justAddedWrong" tells us if the LAST answer was wrong and was just pushed inside setWrongItems.
          // prevWrong already reflects that because we updated wrongItems before calling nextTopic.
          if (prevWrong.length > 0) {
            const shuffledWrong = [...prevWrong].sort(() => Math.random() - 0.5);
            setReviewQueue(shuffledWrong);
            setCurrentReviewIdx(0);
            const first = shuffledWrong[0];
            const topic = shuffledTopics[first.topicIndex];
            setReviewSubQuestion(buildReviewSubQuestion(topic, first.subIndex));
            setIsReviewMode(true);
          } else {
            setResult("Hoàn hảo! Bạn làm đúng hết mà không sai câu nào!");
            if (typeof onComplete === "function") onComplete();
          }
          return prevWrong;
        });
      } else {
        setResult("Congratulations! You completed all topics!");
        if (typeof onComplete === "function") onComplete();
      }
    }
  };

  const handleReviewOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option.text);

    if (option.answer) {
      setTimeout(() => {
        goToNextReview();
      }, 1000);
    } else {
      setResult("Incorrect. See correct answer.");
      setShowCorrect(true);
      setTimeout(() => {
        goToNextReview();
      }, 2000);
    }
  };

  const goToNextReview = () => {
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);

    if (currentReviewIdx < reviewQueue.length - 1) {
      const nextIdx = currentReviewIdx + 1;
      setCurrentReviewIdx(nextIdx);
      const item = reviewQueue[nextIdx];
      const topic = shuffledTopics[item.topicIndex];
      setReviewSubQuestion(buildReviewSubQuestion(topic, item.subIndex));
    } else {
      setIsReviewMode(false);
      setResult("Tuyệt vời! Bạn đã ôn lại hết các câu sai!");
      if (typeof onComplete === "function") onComplete();
    }
  };

  // ---- Render ----

  // Review mode UI
  if (isReviewMode && reviewQueue.length > 0 && reviewSubQuestion) {
    const item = reviewQueue[currentReviewIdx];
    const topic = shuffledTopics[item.topicIndex];

    return (
      <div className="app-container">
        <h1 className="game-title">Multiple Choice Game - Part 4</h1>
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            ← Trang chủ
          </Link>
        </div>
        <p className="question-count" style={{ color: "#e67e22" }}>
          🔁 Ôn lại câu sai: {currentReviewIdx + 1} / {reviewQueue.length}
        </p>
        <p className="score-count">
          Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
        </p>

        <div className="question-section">
          <h2>Topic: {topic.name}</h2>
          <p style={{ color: "#888", marginBottom: 4 }}>
            Sub-question {item.subIndex + 1} / 2
          </p>

          <div className="sub-question-block" style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Choose the correct statement:</p>
            <div className="options">
              {reviewSubQuestion.map((option, optIndex) => (
                <button
                  key={optIndex}
                  className={`option-btn ${
                    selectedOption === option.text
                      ? option.answer
                        ? "correct"
                        : "incorrect"
                      : showCorrect && option.answer
                      ? "correct"
                      : ""
                  }`}
                  onClick={() => handleReviewOptionClick(option)}
                  disabled={!!selectedOption}
                >
                  {String.fromCharCode(65 + optIndex)}. {option.text}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="result-container">
              <p
                className={`result ${
                  result.includes("Incorrect") ? "incorrect" : "correct"
                }`}
              >
                {result}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentTopic = shuffledTopics[currentTopicIndex] || null;
  const activeSubQuestion = currentSubQuestions[currentSubIndex];

  if (!currentTopic || !activeSubQuestion) return <div>Loading...</div>;

  // Main quiz done screen
  if (
    result &&
    (result.includes("Hoàn hảo") || result.includes("Congratulations") || result.includes("Tuyệt vời"))
  ) {
    return (
      <div className="app-container">
        <h1 className="game-title">Multiple Choice Game - Part 4</h1>
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            ← Trang chủ
          </Link>
        </div>
        <div className="result-container" style={{ marginTop: 40 }}>
          <p className="result correct" style={{ fontSize: "1.2rem" }}>
            {result}
          </p>
          <p className="score-count" style={{ marginTop: 12 }}>
            Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="game-title">Multiple Choice Game - Part 4</h1>
      <div className="back-button-container">
        <Link to="/listening" className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length} - Question {currentSubIndex + 1}/2
      </p>
      <p className="score-count">
        Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
      </p>

      <div className="question-section">
        <h2>Topic: {currentTopic.name}</h2>

        <div className="sub-question-block" style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "bold" }}>Choose the correct statement:</p>
          <div className="options">
            {activeSubQuestion.options.map((option, optIndex) => (
              <button
                key={optIndex}
                className={`option-btn ${
                  selectedOption === option.text
                    ? option.answer
                      ? "correct"
                      : "incorrect"
                    : showCorrect && option.answer
                    ? "correct"
                    : ""
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedOption}
              >
                {String.fromCharCode(65 + optIndex)}. {option.text}
              </button>
            ))}
          </div>
        </div>

        {result && !result.includes("Bây giờ") && (
          <div className="result-container">
            <p
              className={`result ${
                result.includes("Incorrect") ? "incorrect" : "correct"
              }`}
            >
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Part4;
