import { useState, useEffect } from "react";
import "./part3.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function ReadingPart3({ questions, onComplete }) {
  const [dataSentences, setDataSentences] = useState([]);

  // Quản lý thứ tự câu hỏi random
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [currentIdxInShuffle, setCurrentIdxInShuffle] = useState(0);

  // Ôn lại câu sai
  const [wrongIndices, setWrongIndices] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIndices, setReviewIndices] = useState([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Trạng thái cho câu hỏi hiện tại
  const [userAnswers, setUserAnswers] = useState([[], [], [], []]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
  const [usedOptions, setUsedOptions] = useState(new Set());
  const [shuffledOptions, setShuffledOptions] = useState([]); // Cố định thứ tự options
  const [shuffledSubQuestions, setShuffledSubQuestions] = useState([]); // Thứ tự câu hỏi con đã trộn
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  
  // Score tracking - count individual sub-questions (7 total)
  const [correctCount, setCorrectCount] = useState(0);

  // Khởi tạo dữ liệu và random câu hỏi
  useEffect(() => {
    const sourceData = Array.isArray(questions) && questions.length > 0 ? questions : data.part3;
    setDataSentences(sourceData);

    const indices = Array.from({ length: sourceData.length }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
    setCurrentIdxInShuffle(0);

    // Reset ôn tập
    setWrongIndices([]);
    setIsReviewMode(false);
    setReviewIndices([]);
    setCurrentReviewIdx(0);
  }, [questions]);

  // Khi chuyển câu hỏi (chính hoặc ôn lại) → load và shuffle options một lần
  useEffect(() => {
    const currentOriginalIndex = isReviewMode
      ? reviewIndices[currentReviewIdx]
      : shuffledIndices[currentIdxInShuffle];

    if (currentOriginalIndex === undefined || !dataSentences[currentOriginalIndex]) return;

    const currentQuestion = dataSentences[currentOriginalIndex];

    // Shuffle options một lần và giữ nguyên
    const optionsArray = currentQuestion.options.split("/");
    const shuffledOpts = [...optionsArray].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffledOpts);

    // Shuffle sub-questions một lần và giữ nguyên
    const subQuestionsWithIndex = currentQuestion.subQuestions.map((sq, idx) => ({
      ...sq,
      originalIndex: idx
    }));
    const shuffledSubs = [...subQuestionsWithIndex].sort(() => Math.random() - 0.5);
    setShuffledSubQuestions(shuffledSubs);

    // Reset trạng thái câu hỏi
    setUserAnswers([[], [], [], []]);
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  }, [currentIdxInShuffle, currentReviewIdx, isReviewMode, dataSentences]);

  // Xác định câu hỏi hiện tại
  const currentOriginalIndex = isReviewMode
    ? reviewIndices[currentReviewIdx]
    : shuffledIndices[currentIdxInShuffle];

  const currentQuestion = dataSentences[currentOriginalIndex];
  if (!currentQuestion) return null;

  const handleOptionClick = (option) => {
    if (usedOptions.has(option)) return;

    const currentShuffledSub = shuffledSubQuestions[currentSubQuestion];
    if (!currentShuffledSub) return;

    const originalIndex = currentShuffledSub.originalIndex;
    const maxAnswers = 2; // Luôn cho phép chọn tối đa 2 đáp án

    if (userAnswers[originalIndex].length < maxAnswers) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[originalIndex] = [...newUserAnswers[originalIndex], option];
      setUserAnswers(newUserAnswers);

      setUsedOptions(new Set([...usedOptions, option]));

      // Không tự động chuyển câu, người dùng sẽ click vào câu khác để chọn
    }
  };

  const handleAnswerClick = (originalIndex, answerIndex) => {
    const newUserAnswers = [...userAnswers];
    const removedAnswer = newUserAnswers[originalIndex][answerIndex];
    newUserAnswers[originalIndex].splice(answerIndex, 1);
    setUserAnswers(newUserAnswers);

    const newUsedOptions = new Set(usedOptions);
    newUsedOptions.delete(removedAnswer);
    setUsedOptions(newUsedOptions);
  };

  const handleSubQuestionClick = (shuffledIndex) => {
    setCurrentSubQuestion(shuffledIndex);
  };

  const checkAnswer = () => {
    let isCorrect = true;
    let subQuestionsCorrect = 0;

    // Count how many sub-questions are correct
    for (let i = 0; i < 4; i++) {
      const userAnswer = [...userAnswers[i]].sort();
      const correctAnswer = [...currentQuestion.answers[i]].sort();

      if (
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans, idx) => ans === correctAnswer[idx])
      ) {
        subQuestionsCorrect++;
      } else {
        isCorrect = false;
      }
    }

    if (isCorrect) {
      setResult("Đúng rồi!");
    } else {
      setResult(`Sai rồi (${subQuestionsCorrect}/4 đúng), hãy thử lại hoặc xem đáp án đúng.`);
      setShowCorrect(true);
    }
    
    // Calculate new total score
    const newTotalScore = !isReviewMode ? correctCount + subQuestionsCorrect : correctCount;
    
    // Count correct sub-questions only in main mode (partial credit)
    if (!isReviewMode) {
      setCorrectCount(newTotalScore);
    }

    setTimeout(() => {
      if (isReviewMode) {
        // Ôn lại: chuyển câu tiếp
        if (currentReviewIdx < reviewIndices.length - 1) {
          setCurrentReviewIdx(currentReviewIdx + 1);
        } else {
          setResult("Tuyệt vời! Bạn đã làm đúng hết các câu sai trước đó!");
          setIsReviewMode(false);
          // Gọi onComplete để chuyển sang Part 4
          if (onComplete) {
            setTimeout(() => {
              onComplete(correctCount); // Use current count in review mode
            }, 2000);
          }
        }
      } else {
        // Chế độ chính: chuyển câu tiếp
        if (currentIdxInShuffle < dataSentences.length - 1) {
          setCurrentIdxInShuffle(currentIdxInShuffle + 1);
        } else {
          // Hoàn thành vòng chính
          if (wrongIndices.length > 0) {
            const shuffledWrong = [...wrongIndices].sort(() => Math.random() - 0.5);
            setReviewIndices(shuffledWrong);
            setCurrentReviewIdx(0);
            setIsReviewMode(true);
            setResult("Bây giờ ôn lại các câu bạn làm sai...");
          } else {
            setResult("Hoàn hảo! Bạn làm đúng hết mà không sai câu nào!");
            // Gọi onComplete để chuyển sang Part 4 - use NEW total score
            if (onComplete) {
              setTimeout(() => {
                onComplete(newTotalScore);
              }, 2000);
            }
          }
        }
      }
    }, 1500);

    // Chỉ ghi nhận sai ở chế độ chính nếu không đúng hoàn toàn
    if (!isReviewMode && !isCorrect && !wrongIndices.includes(currentOriginalIndex)) {
      setWrongIndices([...wrongIndices, currentOriginalIndex]);
    }
  };

  const resetQuestion = () => {
    setUserAnswers([[], [], [], []]);
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  };

  const startReviewManually = () => {
    if (wrongIndices.length === 0) {
      setResult("Chưa có câu nào sai để ôn lại!");
      return;
    }
    const shuffledWrong = [...wrongIndices].sort(() => Math.random() - 0.5);
    setReviewIndices(shuffledWrong);
    setCurrentReviewIdx(0);
    setIsReviewMode(true);
    setResult(null);
  };

  return (
    <div className="app-container3">
      <h1 className="game-title">Reading Aptis - Part 3</h1>

      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/reading" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}

      <p className="sentence-info">
        {isReviewMode
          ? `Ôn lại câu sai ${currentReviewIdx + 1} / ${reviewIndices.length}`
          : `Câu hỏi ${currentIdxInShuffle + 1} / ${dataSentences.length}`}
      </p>

      <div className="word-section">
        <h2 className="question-title">{currentQuestion?.main}</h2>

        <div className="sub-questions">
          {shuffledSubQuestions.map((sub, shuffledIndex) => {
            const originalIndex = sub.originalIndex;
            return (
              <div
                key={shuffledIndex}
                className={`sub-question ${
                  shuffledIndex === currentSubQuestion ? "active" : ""
                } ${userAnswers[originalIndex].length >= 2 ? "completed" : ""}`}
                onClick={() => handleSubQuestionClick(shuffledIndex)}
                style={{ cursor: "pointer" }}
              >
                <div className="sub-question-text">{sub.text}</div>
                <div className="answer-boxes">
                  {Array.from({ length: 2 }, (_, boxIndex) => (
                    <div
                      key={boxIndex}
                      className={`answer-box ${
                        userAnswers[originalIndex][boxIndex] ? "filled" : "empty"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (userAnswers[originalIndex][boxIndex]) {
                          handleAnswerClick(originalIndex, boxIndex);
                        }
                      }}
                    >
                      {userAnswers[originalIndex][boxIndex] || ""}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="current-question-indicator">
          {currentSubQuestion < shuffledSubQuestions.length && (
            <p>
              Đang chọn cho:{" "}
              <strong>
                {shuffledSubQuestions[currentSubQuestion]?.text}
              </strong>
            </p>
          )}
        </div>

        {/* Options cố định thứ tự */}
        <div className="option-list">
          {shuffledOptions.map((option, index) => (
            <span
              key={index}
              className={`word-item ${usedOptions.has(option) ? "disabled" : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </span>
          ))}
        </div>
      </div>

      {result && (
        <div className={`result ${result.includes("Đúng") || result.includes("Tuyệt vời") || result.includes("Hoàn hảo") ? "correct" : "incorrect"}`}>
          {result}
        </div>
      )}

      {showCorrect && (
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
        <button onClick={checkAnswer} className="check-button">
          Kiểm tra đáp án
        </button>
        <button onClick={resetQuestion} className="try-again-button">
          Thử lại
        </button>

        {!isReviewMode && wrongIndices.length > 0 && (
          <button onClick={startReviewManually} className="review-button">
            Ôn lại câu sai ({wrongIndices.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadingPart3;