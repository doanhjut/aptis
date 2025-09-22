import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data";

function ReadingPart4({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValues, setInputValues] = useState(Array(7).fill(""));
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [currentSubIndex, setCurrentSubIndex] = useState(0); // Theo dõi đoạn văn hiện tại
  const [dataSentences, setDataSentences] = useState([]);

  useEffect(() => {
    const dataSentences =
      Array.isArray(questions) && questions.length > 0 ? questions : data.part4;
    setDataSentences(dataSentences);
  }, [questions]);

  useEffect(() => {
    setInputValues(Array(7).fill(""));
    setDisabledOptions(new Set());
    setResult(null);
    setShowCorrect(false);
    setCurrentSubIndex(0); // Reset về đoạn đầu tiên
  }, [currentQuestionIndex]);

  const handleOptionClick = (option) => {
    if (inputValues[currentSubIndex] === "" && !disabledOptions.has(option)) {
      const newInputValues = [...inputValues];
      newInputValues[currentSubIndex] = option;
      setInputValues(newInputValues);
      setDisabledOptions(new Set(disabledOptions).add(option));

      // Chuyển sang đoạn văn tiếp theo nếu đã chọn
      if (currentSubIndex < 6) {
        setCurrentSubIndex(currentSubIndex + 1);
      }
    }
  };

  const handleInputClick = (index) => {
    const newInputValues = [...inputValues];
    const removedOption = newInputValues[index];
    newInputValues[index] = "";
    setInputValues(newInputValues);

    if (removedOption) {
      setDisabledOptions(new Set(disabledOptions).delete(removedOption));
      // Reset currentSubIndex nếu xóa tiêu đề của đoạn hiện tại
      setCurrentSubIndex(Math.max(0, index));
    }
  };

  const checkAnswer = () => {
    const userAnswers = inputValues.map((val) => val.trim()).filter(Boolean);
    const correctAnswer = dataSentences[currentQuestionIndex].answers;
    const isCorrect = userAnswers.every(
      (answer, index) => answer === correctAnswer[index]
    );
    setResult(
      isCorrect ? "Correct!" : "Incorrect, try again or show correct answer."
    );
    if (isCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < dataSentences.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          onComplete();
          setResult("Congratulations! You completed all questions!");
        }
      }, 1000);
    } else {
      setShowCorrect(true);
    }
  };

  const resetQuestion = () => {
    setInputValues(Array(7).fill(""));
    setDisabledOptions(new Set());
    setResult(null);
    setShowCorrect(false);
    setCurrentSubIndex(0);
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const listOptionRender = (currentQuestion) => {
    if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
      console.error("Invalid currentQuestion or options");
      return [];
    }
    return shuffleArray([...currentQuestion.options]);
  };

  const currentQuestion = dataSentences[currentQuestionIndex];

  return (
    <div className="app-container4">
      <h1 className="game-title">Word Order Game - Part 4</h1>
      <p className="sentence-info">
        Topic {currentQuestionIndex + 1} of {dataSentences.length}
      </p>
      <div className="option-list4">
        {listOptionRender(currentQuestion).map((option, index) => (
          <span
            key={index}
            className={`word-item ${
              disabledOptions.has(option) ? "disabled" : ""
            }`}
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
                className="input-field"
                onClick={() => handleInputClick(index)}
              >
                {inputValues[index] ||
                  (index === currentSubIndex ? " (Select title)" : " ")}
              </span>
              <p>{sub.text}</p>
            </div>
          ))}
        </div>
      </div>
      {result && (
        <div
          className={`result ${
            result.includes("Correct") ? "correct" : "incorrect"
          }`}
        >
          {result}
        </div>
      )}
      {showCorrect && (
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
      </div>
    </div>
  );
}

export default ReadingPart4;
