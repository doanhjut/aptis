import { useState, useEffect, useRef } from "react";
import "./part3.css";
import { data } from "../data";
import { Link } from "react-router-dom";
import { shortPart3Questions } from "../shortPart3";

const emptyAnswers = (count) => Array.from({ length: count }, () => []);

function ListeningPart3({
  questions,
  onComplete,
  backPath = "/listening",
  mode = "full",
}) {
  const [dataSentences, setDataSentences] = useState([]);

  // Quản lý thứ tự câu hỏi random
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [currentIdxInShuffle, setCurrentIdxInShuffle] = useState(0);

  // Ôn lại câu sai
  const [wrongIndices, setWrongIndices] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIndices, setReviewIndices] = useState([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [resumeIndex, setResumeIndex] = useState(null);
  const [canReturnToMain, setCanReturnToMain] = useState(false);
  const advanceTimer = useRef(null);

  // Trạng thái cho câu hỏi hiện tại
  const [userAnswers, setUserAnswers] = useState([[], [], [], []]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
  const [usedOptions, setUsedOptions] = useState(new Set());
  const [shuffledOptions, setShuffledOptions] = useState([]); // Cố định thứ tự options
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedBoth, setSelectedBoth] = useState(() => new Set());
  // Khởi tạo dữ liệu và random câu hỏi
  useEffect(() => {
    const sourceData =
      Array.isArray(questions) && questions.length > 0 ? questions : data.part3;
    const prepared =
      mode === "short" ? shortPart3Questions(sourceData) : sourceData;
    setDataSentences(prepared);

    const indices = Array.from({ length: prepared.length }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
    setCurrentIdxInShuffle(0);

    // Reset ôn tập
    setWrongIndices([]);
    setIsReviewMode(false);
    setReviewIndices([]);
    setCurrentReviewIdx(0);
    setResumeIndex(null);
    setCanReturnToMain(false);
  }, [questions, mode]);

  // Khi chuyển câu hỏi → load và shuffle options một lần
  useEffect(() => {
    const currentOriginalIndex = isReviewMode
      ? reviewIndices[currentReviewIdx]
      : shuffledIndices[currentIdxInShuffle];

    if (
      currentOriginalIndex === undefined ||
      !dataSentences[currentOriginalIndex]
    )
      return;

    const currentQuestion = dataSentences[currentOriginalIndex];

    // Shuffle options một lần và giữ nguyên
    const optionsArray = currentQuestion.options.split("/");
    const shuffledOpts = [...optionsArray].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffledOpts);

    // Reset trạng thái câu hỏi
    setUserAnswers(emptyAnswers(currentQuestion.subQuestions.length));
    setSelectedBoth(new Set());
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  }, [currentIdxInShuffle, currentReviewIdx, isReviewMode, dataSentences]);

  useEffect(
    () => () => clearTimeout(advanceTimer.current),
    [],
  );

  // Xác định câu hỏi hiện tại
  const currentOriginalIndex = isReviewMode
    ? reviewIndices[currentReviewIdx]
    : shuffledIndices[currentIdxInShuffle];

  const currentQuestion = dataSentences[currentOriginalIndex];
  if (!currentQuestion) return null;

  const handleOptionClick = (option) => {
    const maxAnswers =
      currentQuestion.subQuestions[currentSubQuestion].expectedAnswers;

    if (userAnswers[currentSubQuestion].length < maxAnswers) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentSubQuestion] = [
        ...newUserAnswers[currentSubQuestion],
        option,
      ];
      setUserAnswers(newUserAnswers);

      setUsedOptions(new Set([...usedOptions, option]));

      // Chuyển sang câu con tiếp theo nếu đủ
      if (
        newUserAnswers[currentSubQuestion].length === maxAnswers &&
        currentSubQuestion < currentQuestion.subQuestions.length - 1
      ) {
        setCurrentSubQuestion(currentSubQuestion + 1);
      }
    }
  };

  const handleAnswerClick = (subIndex, answerIndex) => {
    const newUserAnswers = [...userAnswers];
    const removedAnswer = newUserAnswers[subIndex][answerIndex];
    newUserAnswers[subIndex].splice(answerIndex, 1);
    setUserAnswers(newUserAnswers);

    const newUsedOptions = new Set(usedOptions);
    newUsedOptions.delete(removedAnswer);
    setUsedOptions(newUsedOptions);

    // Quay lại câu con bị xóa nếu cần
    if (subIndex <= currentSubQuestion) {
      setCurrentSubQuestion(subIndex);
    }
  };

  const scheduleAdvance = () => {
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (isReviewMode) {
        if (currentReviewIdx < reviewIndices.length - 1) {
          setCurrentReviewIdx(currentReviewIdx + 1);
        } else if (canReturnToMain) {
          returnToMainQuestion();
        } else {
          setResult("Tuyệt vời! Bạn đã làm đúng hết các câu sai trước đó!");
          setIsReviewMode(false);
          if (onComplete) onComplete();
        }
      } else if (currentIdxInShuffle < dataSentences.length - 1) {
        setCurrentIdxInShuffle(currentIdxInShuffle + 1);
      } else if (wrongIndices.length > 0) {
        setCanReturnToMain(false);
        setResumeIndex(null);
        const shuffledWrong = [...wrongIndices].sort(() => Math.random() - 0.5);
        setReviewIndices(shuffledWrong);
        setCurrentReviewIdx(0);
        setIsReviewMode(true);
        setResult("Bây giờ ôn lại các câu bạn làm sai...");
      } else {
        setResult("Hoàn hảo! Bạn làm đúng hết mà không sai câu nào!");
        if (onComplete) onComplete();
      }
    }, 1500);
  };

  const rememberWrongQuestion = () => {
    if (!isReviewMode && !wrongIndices.includes(currentOriginalIndex)) {
      setWrongIndices([...wrongIndices, currentOriginalIndex]);
    }
  };

  const checkAnswer = () => {
    let isCorrect = true;

    for (let i = 0; i < currentQuestion.subQuestions.length; i++) {
      const userAnswer = [...userAnswers[i]].sort();
      const correctAnswer = [...currentQuestion.answers[i]].sort();

      if (
        userAnswer.length !== correctAnswer.length ||
        !userAnswer.every((ans, idx) => ans === correctAnswer[idx])
      ) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setResult("Đúng rồi!");
      setShowCorrect(false);
      scheduleAdvance();
    } else {
      setResult("Sai rồi, hãy thử lại hoặc xem đáp án đúng.");
      setShowCorrect(true);
      rememberWrongQuestion();
    }
  };

  const toggleBoth = (index) => {
    setSelectedBoth((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const submitBoth = () => {
    const expected = currentQuestion.answers
      .map((answer, index) => (answer[0] === "B" ? index : -1))
      .filter((index) => index >= 0);
    const selected = [...selectedBoth].sort((left, right) => left - right);
    const isCorrect =
      expected.length === selected.length &&
      expected.every((index, position) => index === selected[position]);

    if (isCorrect) {
      setResult("Đúng rồi!");
      setShowCorrect(false);
      scheduleAdvance();
      return;
    }

    setResult("Chưa đúng. Sửa các câu được đánh dấu rồi nộp lại.");
    setShowCorrect(true);
    rememberWrongQuestion();
  };

  const speakDialogue = () => {
    if ("speechSynthesis" in window) {
      // Dừng nếu đang nói
      window.speechSynthesis.cancel();

      const text = currentQuestion?.dialogue || "";
      const utterance = new SpeechSynthesisUtterance(text);

      // Tùy chỉnh giọng nói (tùy browser và hệ điều hành)
      utterance.lang = "en-US"; // hoặc 'en-GB' cho giọng Anh Anh
      utterance.rate = 0.9; // Tốc độ nói (0.8 - 1.0 là tự nhiên)
      utterance.pitch = 1; // Độ cao giọng
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech!");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetQuestion = () => {
    setUserAnswers(emptyAnswers(currentQuestion.subQuestions.length));
    setSelectedBoth(new Set());
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  };

  const returnToMainQuestion = () => {
    clearTimeout(advanceTimer.current);
    const nextIndex = resumeIndex ?? currentIdxInShuffle;
    setIsReviewMode(false);
    setReviewIndices([]);
    setCurrentReviewIdx(0);
    setCanReturnToMain(false);
    setResumeIndex(null);
    resetQuestion();

    if (nextIndex >= dataSentences.length) {
      setResult("Tuyệt vời! Bạn đã ôn lại hết các câu sai!");
      if (onComplete) onComplete();
      return;
    }

    setCurrentIdxInShuffle(nextIndex);
    setResult(null);
  };

  const startReviewManually = () => {
    if (wrongIndices.length === 0) {
      setResult("Chưa có câu nào sai để ôn lại!");
      return;
    }
    clearTimeout(advanceTimer.current);
    setResumeIndex(showCorrect ? currentIdxInShuffle + 1 : currentIdxInShuffle);
    setCanReturnToMain(true);
    const shuffledWrong = [...wrongIndices].sort(() => Math.random() - 0.5);
    setReviewIndices(shuffledWrong);
    setCurrentReviewIdx(0);
    setIsReviewMode(true);
    resetQuestion();
  };

  return (
    <div className="app-container3">
      <h1 className="game-title">
        {mode === "short"
          ? "Listening Aptis - Part 3 ngắn"
          : "Listening Aptis - Part 3"}
      </h1>
      {mode === "short" && (
        <p className="sentence-info">
          Chọn các câu có đáp án B, rồi bấm Nộp bài. Sai thì sửa lại cho đúng.
        </p>
      )}

      <div className="back-button-container">
        <Link to={backPath} className="back-button">
          ← Trang chủ
        </Link>
      </div>

      <p className="sentence-info">
        {isReviewMode
          ? `Ôn câu sai: ${currentReviewIdx + 1} / ${reviewIndices.length}`
          : `Câu hỏi ${currentIdxInShuffle + 1} / ${dataSentences.length}`}
      </p>
      {isReviewMode && canReturnToMain && (
        <button type="button" className="review-button" onClick={returnToMainQuestion}>
          Tiếp tục bài đang làm
        </button>
      )}

      <div className="word-section">
        <h2 className="question-title">{currentQuestion?.main}</h2>
        <div className="dialogue-section">
          <div className="dialogue-header">
            <h3>Hội thoại</h3>
            <button
              onClick={speakDialogue}
              className="speak-button"
              disabled={isSpeaking}
            >
              {isSpeaking ? "Đang đọc..." : "🔊 Nghe hội thoại"}
            </button>
            {isSpeaking && (
              <button onClick={stopSpeaking} className="stop-button">
                Dừng
              </button>
            )}
          </div>
          {/* <pre className="dialogue">{currentQuestion?.dialogue}</pre> */}
        </div>

        {mode === "short" ? (
          <div className="sub-questions">
            {currentQuestion.subQuestions.map((sub, index) => {
              const isBoth = currentQuestion.answers[index][0] === "B";
              const isSelected = selectedBoth.has(index);
              const mark = !showCorrect
                ? ""
                : isBoth && isSelected
                  ? "both-correct"
                  : isBoth
                    ? "both-missed"
                    : isSelected
                      ? "both-extra"
                      : "";

              return (
                <button
                  type="button"
                  key={index}
                  className={`sub-question both-choice ${
                    isSelected ? "selected" : ""
                  } ${mark}`}
                  onClick={() => toggleBoth(index)}
                >
                  <div className="sub-question-text">{sub.text}</div>
                  {mark === "both-missed" && (
                    <div className="both-note">Đáp án B. Hãy chọn câu này.</div>
                  )}
                  {mark === "both-extra" && (
                    <div className="both-note">Không phải B. Hãy bỏ chọn.</div>
                  )}
                  {mark === "both-correct" && (
                    <div className="both-note">Đúng, đây là đáp án B.</div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className="sub-questions">
              {currentQuestion?.subQuestions.map((sub, index) => (
                <div
                  key={index}
                  className={`sub-question ${
                    index === currentSubQuestion ? "active" : ""
                  } ${
                    userAnswers[index].length === sub.expectedAnswers
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="sub-question-text">{sub.text}</div>
                  <div className="answer-boxes">
                    {Array.from({ length: sub.expectedAnswers }, (_, boxIndex) => (
                      <div
                        key={boxIndex}
                        className={`answer-box ${
                          userAnswers[index][boxIndex] ? "filled" : "empty"
                        }`}
                        style={{color:'black', fontWeight:'bold'}}
                        onClick={() =>
                          userAnswers[index][boxIndex] &&
                          handleAnswerClick(index, boxIndex)
                        }
                      >
                        {userAnswers[index][boxIndex] || ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="current-question-indicator">
              {currentSubQuestion < currentQuestion.subQuestions.length && (
                <p>
                  Đang chọn cho:{" "}
                  <strong>
                    {currentQuestion?.subQuestions[currentSubQuestion].text}
                  </strong>
                </p>
              )}
            </div>

            <div className="option-list">
              {shuffledOptions.map((option, index) => (
                <span
                  key={index}
                  className={`word-item`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {result && (
        <div
          className={`result ${
            result.includes("Đúng") ||
            result.includes("Tuyệt vời") ||
            result.includes("Hoàn hảo")
              ? "correct"
              : "incorrect"
          }`}
        >
          {result}
        </div>
      )}

      {showCorrect && mode !== "short" && (
        <div className="correct-answer">
          <h3>Đáp án đúng:</h3>
          {currentQuestion.subQuestions.map((sub, index) => (
            <div key={index}>
              <strong>{sub.text}:</strong>{" "}
              {currentQuestion.answers[index].join(", ")}
            </div>
          ))}
        </div>
      )}

      <div className="button-container">
        <button
          onClick={mode === "short" ? submitBoth : checkAnswer}
          className="check-button"
        >
          {mode === "short" ? "Nộp bài" : "Kiểm tra đáp án"}
        </button>
        <button onClick={resetQuestion} className="try-again-button">
          Thử lại
        </button>

        {!isReviewMode && wrongIndices.length > 0 && (
          <button onClick={startReviewManually} className="review-button">
            Ôn câu sai ({wrongIndices.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default ListeningPart3;
