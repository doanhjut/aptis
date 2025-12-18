import { useState, useEffect } from "react";
import "./part3.css";
import { data } from "../data";
import { Link } from "react-router-dom";

function ReadingPart3({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([[], [], [], []]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
  const [usedOptions, setUsedOptions] = useState(new Set());
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [dataSentences, setDataSentences] = useState([]);

  useEffect(() => {
    const dataSentences =
      Array.isArray(questions) && questions.length > 0 ? questions : data.part3;
    setDataSentences(dataSentences);
  }, [questions]);

  useEffect(() => {
    resetQuestion();
  }, [currentQuestionIndex]);

  const resetQuestion = () => {
    setUserAnswers([[], [], [], []]);
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  };

  const handleOptionClick = (option) => {
    if (usedOptions.has(option)) return;

    const currentQuestion = dataSentences[currentQuestionIndex];
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

      // Nếu đã đủ số câu trả lời cho câu hỏi hiện tại, chuyển sang câu hỏi tiếp theo
      if (newUserAnswers[currentSubQuestion].length === maxAnswers) {
        if (currentSubQuestion < 3) {
          setCurrentSubQuestion(currentSubQuestion + 1);
        }
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

    // Nếu xóa câu trả lời từ câu hỏi hiện tại hoặc trước đó, quay lại câu hỏi đó
    if (subIndex <= currentSubQuestion) {
      setCurrentSubQuestion(subIndex);
    }
  };

  const checkAnswer = () => {
    const currentQuestion = dataSentences[currentQuestionIndex];
    let isCorrect = true;

    for (let i = 0; i < 4; i++) {
      const userAnswer = userAnswers[i].sort();
      const correctAnswer = currentQuestion.answers[i].sort();

      if (
        userAnswer.length !== correctAnswer.length ||
        !userAnswer.every((answer, index) => answer === correctAnswer[index])
      ) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setResult("Đúng rồi!");
      setTimeout(() => {
        if (currentQuestionIndex < dataSentences.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          onComplete();
          setResult("Chúc mừng! Bạn đã hoàn thành tất cả các câu hỏi!");
        }
      }, 1500);
    } else {
      setResult("Sai rồi, hãy thử lại hoặc xem đáp án đúng.");
      setShowCorrect(true);
    }
  };

  const currentQuestion = dataSentences[currentQuestionIndex];
  const availableOptions = currentQuestion?.options.split("/");

  return (
    <div className="app-container3">
      <h1 className="game-title">Trò chơi sắp xếp từ - Phần 3</h1>
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/reading" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
      <p className="sentence-info">
        Câu hỏi {currentQuestionIndex + 1} / {dataSentences.length}
      </p>

      <div className="word-section">
        <h2 className="question-title">{currentQuestion?.main}</h2>

        <div className="sub-questions">
          {currentQuestion?.subQuestions.map((sub, index) => (
            <div
              key={index}
              className={`sub-question ${
                index === currentSubQuestion ? "active" : ""
              } ${userAnswers[index].length > 0 ? "completed" : ""}`}
            >
              <div className="sub-question-text">{sub.text}</div>
              <div className="answer-boxes">
                {Array.from({ length: sub.expectedAnswers }, (_, boxIndex) => (
                  <div
                    key={boxIndex}
                    className={`answer-box ${
                      userAnswers[index][boxIndex] ? "filled" : "empty"
                    }`}
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
          {currentSubQuestion < 4 && (
            <p>
              Chọn một lựa chọn cho:{" "}
              <strong>
                {currentQuestion?.subQuestions[currentSubQuestion].text}
              </strong>
            </p>
          )}
        </div>

        <div className="option-list">
          {availableOptions?.map((option, index) => (
            <span
              key={index}
              className={`word-item ${
                usedOptions.has(option) ? "disabled" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </span>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`result ${
            result.includes("Đúng") ? "correct" : "incorrect"
          }`}
        >
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
      </div>
    </div>
  );
}

export default ReadingPart3;
