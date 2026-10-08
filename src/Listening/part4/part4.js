import { useState, useEffect, useRef } from "react";
import "./part4.css";
import { data } from "../data.js";
import part4Prompts from "../part4Prompts.json";
import { Link } from "react-router-dom";

function Part4({
  onComplete,
  isTest,
  questions,
  backPath = "/listening",
}) {
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
  const [resumePosition, setResumePosition] = useState(null);
  const [canReturnToMain, setCanReturnToMain] = useState(false);
  const advanceTimer = useRef(null);

  useEffect(() => {
    shuffleTopics();
    return () => clearTimeout(advanceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, isTest]);

  const shuffleTopics = () => {
    const source =
      Array.isArray(questions) && questions.length > 0 ? questions : data.part4;
    let shuffled = [...source].sort(() => Math.random() - 0.5);
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
    setResumePosition(null);
    setCanReturnToMain(false);

    if (shuffled.length > 0) {
      prepareSubQuestions(shuffled[0]);
    }
  };

  const resetQuestionState = () => {
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);
    setCurrentSubIndex(0);
  };

  const questionGroups = (topic) => {
    const allOptions = topic.subQuestions || [];
    const sourceGroups = [allOptions.slice(0, 3), allOptions.slice(3, 6)];
    const prompts = (
      part4Prompts[`${topic.testNumber}-${topic.questionNumber}`] || []
    ).map((prompt) => prompt.replace(/^[\s·.\d]+/, "").replace(/\?+$/, "?"));

    if (
      allOptions.length === 6 &&
      sourceGroups.every((group) => group.filter((option) => option.answer).length === 1)
    ) {
      return sourceGroups.map((group, id) => ({
        id,
        prompt: prompts[id] || "Choose the correct statement:",
        options: [...group].sort(() => Math.random() - 0.5),
      }));
    }

    const correctOptions = allOptions.filter((option) => option.answer);
    const incorrectOptions = [...allOptions.filter((option) => !option.answer)].sort(
      () => Math.random() - 0.5,
    );
    return [0, 1].map((id) => ({
      id,
      prompt: "Choose the correct statement:",
      options: [
        correctOptions[id],
        incorrectOptions[id * 2],
        incorrectOptions[id * 2 + 1],
      ]
        .filter(Boolean)
        .sort(() => Math.random() - 0.5),
    }));
  };

  const prepareSubQuestions = (topic) => {
    setCurrentSubQuestions(questionGroups(topic));
  };

  // Build a review sub-question for one wrong item
  const buildReviewSubQuestion = (topic, subIdx) => questionGroups(topic)[subIdx];

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option.text);

    if (option.answer) {
      setCorrectCount((prev) => prev + 1);
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
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

      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
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
      prepareSubQuestions(shuffledTopics[nextIndex]);
    } else {
      // All topics done — read wrongItems via functional updater to avoid stale closure
      if (!isTest) {
        setWrongItems((prevWrong) => {
          // "justAddedWrong" tells us if the LAST answer was wrong and was just pushed inside setWrongItems.
          // prevWrong already reflects that because we updated wrongItems before calling nextTopic.
          if (prevWrong.length > 0) {
            setCanReturnToMain(false);
            setResumePosition(null);
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
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        goToNextReview();
      }, 1000);
    } else {
      setResult("Incorrect. See correct answer.");
      setShowCorrect(true);
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        goToNextReview();
      }, 2000);
    }
  };

  const nextPositionAfterCurrentAnswer = () => {
    if (!selectedOption) {
      return { topicIndex: currentTopicIndex, subIndex: currentSubIndex };
    }
    if (currentSubIndex < 1) {
      return { topicIndex: currentTopicIndex, subIndex: 1 };
    }
    return { topicIndex: currentTopicIndex + 1, subIndex: 0 };
  };

  const returnToMainQuestion = () => {
    clearTimeout(advanceTimer.current);
    const nextPosition = resumePosition || nextPositionAfterCurrentAnswer();
    setIsReviewMode(false);
    setReviewQueue([]);
    setReviewSubQuestion(null);
    setSelectedOption(null);
    setShowCorrect(false);
    setCanReturnToMain(false);

    if (nextPosition.topicIndex >= shuffledTopics.length) {
      setResult("Tuyệt vời! Bạn đã ôn lại hết các câu sai!");
      if (typeof onComplete === "function") onComplete();
      return;
    }

    setCurrentTopicIndex(nextPosition.topicIndex);
    setCurrentSubIndex(nextPosition.subIndex);
    prepareSubQuestions(shuffledTopics[nextPosition.topicIndex]);
    setResult(null);
    setResumePosition(null);
  };

  const startReviewNow = () => {
    if (isTest || wrongItems.length === 0) return;
    clearTimeout(advanceTimer.current);
    setResumePosition(nextPositionAfterCurrentAnswer());
    setCanReturnToMain(true);
    const shuffledWrong = [...wrongItems].sort(() => Math.random() - 0.5);
    const first = shuffledWrong[0];
    setReviewQueue(shuffledWrong);
    setCurrentReviewIdx(0);
    setReviewSubQuestion(
      buildReviewSubQuestion(shuffledTopics[first.topicIndex], first.subIndex),
    );
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);
    setIsReviewMode(true);
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
    } else if (canReturnToMain) {
      returnToMainQuestion();
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
          <Link to={backPath} className="back-button">
            ← Trang chủ
          </Link>
        </div>
        <p className="question-count" style={{ color: "#e67e22" }}>
          🔁 Ôn lại câu sai: {currentReviewIdx + 1} / {reviewQueue.length}
        </p>
        {canReturnToMain && (
          <button
            type="button"
            className="review-now-button"
            onClick={returnToMainQuestion}
          >
            Tiếp tục bài đang làm
          </button>
        )}
        {wrongItems.length > reviewQueue.length && (
          <button
            type="button"
            className="review-now-button"
            onClick={startReviewNow}
          >
            Ôn câu sai ({wrongItems.length})
          </button>
        )}
        <p className="score-count">
          Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
        </p>

        <div className="question-section">
          <h2>Topic: {topic.name}</h2>
          <p style={{ color: "#888", marginBottom: 4 }}>
            Sub-question {item.subIndex + 1} / 2
          </p>

          <div className="sub-question-block" style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold" }}>{reviewSubQuestion.prompt}</p>
            <div className="options">
              {reviewSubQuestion.options.map((option, optIndex) => (
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
          <Link to={backPath} className="back-button">
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
        <Link to={backPath} className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length} - Question {currentSubIndex + 1}/2
      </p>
      <p className="score-count">
        Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
      </p>
      {!isTest && wrongItems.length > 0 && (
        <button
          type="button"
          className="review-now-button"
          onClick={startReviewNow}
        >
          Ôn câu sai ({wrongItems.length})
        </button>
      )}

      <div className="question-section">
        <h2>Topic: {currentTopic.name}</h2>

        <div className="sub-question-block" style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "bold" }}>{activeSubQuestion.prompt}</p>
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
