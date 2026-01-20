import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function ReadingPart4({ questions, onComplete }) {
  const [inputValues, setInputValues] = useState(Array(7).fill(""));
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  // Quản lý thứ tự câu hỏi
  const [dataSentences, setDataSentences] = useState([]);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [currentQuestionIdxInShuffle, setCurrentQuestionIdxInShuffle] = useState(0);

  // Tính năng review câu sai
  const [wrongQuestionIndices, setWrongQuestionIndices] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [shuffledWrongIndices, setShuffledWrongIndices] = useState([]);
  const [currentWrongIdxInShuffle, setCurrentWrongIdxInShuffle] = useState(0);

  // NEW: Lưu thứ tự options đã shuffle cho câu hỏi hiện tại
  const [shuffledOptions, setShuffledOptions] = useState([]);
  
  // Score tracking - count correct sub-questions (7 total)
  const [correctCount, setCorrectCount] = useState(0);

  // Khởi tạo dữ liệu
  useEffect(() => {
    const sourceData = Array.isArray(questions) && questions.length > 0 ? questions : data.part4;
    setDataSentences(sourceData);

    const indices = Array.from({ length: sourceData.length }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
    setCurrentQuestionIdxInShuffle(0);

    // Reset mọi thứ khi load lại
    setWrongQuestionIndices([]);
    setIsReviewMode(false);
    setShuffledWrongIndices([]);
    setCurrentWrongIdxInShuffle(0);
    setShuffledOptions([]); // reset options shuffle
  }, [questions]);

  // Khi chuyển câu hỏi (chính hoặc review) → shuffle options một lần duy nhất
  useEffect(() => {
    const currentIndex = isReviewMode 
      ? shuffledWrongIndices[currentWrongIdxInShuffle]
      : shuffledIndices[currentQuestionIdxInShuffle];
    
    const currentQuestion = dataSentences[currentIndex];
    
    if (currentQuestion && Array.isArray(currentQuestion.options)) {
      // Shuffle chỉ một lần và lưu vào state
      const newShuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(newShuffled);
    }

    // Reset các state khác
    setInputValues(Array(7).fill(""));
    setDisabledOptions(new Set());
    setResult(null);
    setShowCorrect(false);
    setCurrentSubIndex(0);
  }, [currentQuestionIdxInShuffle, currentWrongIdxInShuffle, isReviewMode, dataSentences]);

  // Xác định câu hỏi hiện tại
  const currentIndex = isReviewMode 
    ? shuffledWrongIndices[currentWrongIdxInShuffle]
    : shuffledIndices[currentQuestionIdxInShuffle];
  const currentQuestion = dataSentences[currentIndex];

  const handleOptionClick = (option) => {
    if (inputValues[currentSubIndex] === "" && !disabledOptions.has(option)) {
      const newInputValues = [...inputValues];
      newInputValues[currentSubIndex] = option;
      setInputValues(newInputValues);
      setDisabledOptions(new Set([...disabledOptions, option]));

      if (currentSubIndex < 6) {
        setCurrentSubIndex(currentSubIndex + 1);
      }
    }
  };

  const handleInputClick = (index) => {
    if (inputValues[index] !== "") {
      const removedOption = inputValues[index];
      const newInputValues = [...inputValues];
      newInputValues[index] = "";
      setInputValues(newInputValues);

      const newDisabled = new Set(disabledOptions);
      newDisabled.delete(removedOption);
      setDisabledOptions(newDisabled);

      if (index <= currentSubIndex) {
        setCurrentSubIndex(index);
      }
    }
  };

  const checkAnswer = () => {
    const userAnswers = inputValues.map((val) => val.trim());
    const correctAnswer = currentQuestion.answers;

    const isCorrect = userAnswers.every((answer, idx) => answer === correctAnswer[idx]);

    if (isCorrect) {
      setResult("Correct!");
      
      // Count correct answers only in main mode
      if (!isReviewMode) {
        setCorrectCount(correctCount + 7); // All 7 sub-questions correct
      }

      setTimeout(() => {
        if (isReviewMode) {
          if (currentWrongIdxInShuffle < shuffledWrongIndices.length - 1) {
            setCurrentWrongIdxInShuffle(currentWrongIdxInShuffle + 1);
          } else {
            setResult("Congratulations! You completed reviewing wrong questions!");
            setIsReviewMode(false);
            // Pass score to parent
            if (onComplete) {
              setTimeout(() => {
                onComplete(correctCount);
              }, 1500);
            }
          }
        } else {
          if (currentQuestionIdxInShuffle < dataSentences.length - 1) {
            setCurrentQuestionIdxInShuffle(currentQuestionIdxInShuffle + 1);
          } else {
            if (wrongQuestionIndices.length > 0) {
              const shuffledWrong = [...wrongQuestionIndices].sort(() => Math.random() - 0.5);
              setShuffledWrongIndices(shuffledWrong);
              setCurrentWrongIdxInShuffle(0);
              setIsReviewMode(true);
              setResult("Now reviewing wrong questions...");
            } else {
              setResult("Congratulations! You completed all questions with no mistakes!");
              // Pass score to parent
              if (onComplete) {
                setTimeout(() => {
                  onComplete(correctCount + 7); // Include current correct answers
                }, 1500);
              }
            }
          }
        }
      }, 1000);
    } else {
      setResult("Incorrect, try again or show correct answer.");
      setShowCorrect(true);

      if (!isReviewMode && !wrongQuestionIndices.includes(currentIndex)) {
        setWrongQuestionIndices([...wrongQuestionIndices, currentIndex]);
      }
    }
  };

  const resetQuestion = () => {
    setInputValues(Array(7).fill(""));
    setDisabledOptions(new Set());
    setResult(null);
    setShowCorrect(false);
    setCurrentSubIndex(0);
  };

  const startReview = () => {
    if (wrongQuestionIndices.length > 0) {
      const shuffledWrong = [...wrongQuestionIndices].sort(() => Math.random() - 0.5);
      setShuffledWrongIndices(shuffledWrong);
      setCurrentWrongIdxInShuffle(0);
      setIsReviewMode(true);
      setResult(null);
    } else {
      setResult("No wrong questions to review!");
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="app-container4">
      <h1 className="game-title">Reading Aptis - Part 4</h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/reading" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="sentence-info">
        {isReviewMode 
          ? `Review Question ${currentWrongIdxInShuffle + 1} of ${shuffledWrongIndices.length}`
          : `Question ${currentQuestionIdxInShuffle + 1} of ${dataSentences.length}`
        }
      </p>

      {/* Options giờ giữ nguyên thứ tự cố định trong suốt câu hỏi */}
      <div className="option-list4">
        {shuffledOptions.map((option, index) => (
          <span
            key={index}
            className={`word-item ${disabledOptions.has(option) ? "disabled" : ""}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </span>
        ))}
      </div>

      <div className="word-section4">
        <h2 className="question-title">{currentQuestion?.main}</h2>
        <div className="sub-questions">
          {currentQuestion?.subQuestions.map((sub, index) => (
            <div key={index} className="sub-question">
              <span
                className={`input-field ${index === currentSubIndex ? "active" : ""}`}
                onClick={() => handleInputClick(index)}
              >
                {inputValues[index] || (index === currentSubIndex ? "(Click to select title)" : "__________")}
              </span>
              <p>{sub.text}</p>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className={`result ${result.includes("Correct") || result.includes("Congratulations") ? "correct" : "incorrect"}`}>
          {result}
        </div>
      )}

      {showCorrect && !result.includes("Correct") && !result.includes("Congratulations") && (
        <div className="correct-answer">
          <p>Correct answer: {currentQuestion.answers.join(" / ")}</p>
        </div>
      )}

      <div className="button-container">
        <button onClick={checkAnswer} className="check-button">
          Check Answer
        </button>
        <button onClick={resetQuestion} className="try-again-button">
          Try Again
        </button>
        {!isReviewMode && wrongQuestionIndices.length > 0 && (
          <button onClick={startReview} className="review-button">
            Review Wrong Questions ({wrongQuestionIndices.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadingPart4;