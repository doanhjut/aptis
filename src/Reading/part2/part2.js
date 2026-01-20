import { useState, useEffect } from "react";
import "./part2.css";
import { data } from "../data";
import { Link } from "react-router-dom";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function ReadingPart2({ questions, onComplete }) {
  const [dataSentences, setDataSentences] = useState([]);
  const [sentenceIndices, setSentenceIndices] = useState([]); // Thứ tự random câu hỏi chính
  const [currentIndex, setCurrentIndex] = useState(0);

  const [words, setWords] = useState([]); // 5 từ đang hiển thị để chọn
  const [inputValues, setInputValues] = useState(["", "", "", "", ""]);
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const [selectedData, setSelectedData] = useState("part2");

  // Tính năng ôn câu sai
  const [wrongIndices, setWrongIndices] = useState([]); // Lưu index gốc của câu sai
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIndices, setReviewIndices] = useState([]); // Thứ tự random cho ôn lại
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  // Score tracking - only count first attempts
  const [correctCount, setCorrectCount] = useState(0);

  // Khởi tạo dữ liệu khi component mount hoặc thay đổi nguồn
  useEffect(() => {
    const dataSource = questions
      ? questions
      : selectedData === "part2"
      ? data.part2
      : data.part2shorten;

    setDataSentences(dataSource);

    // Random thứ tự câu hỏi chính
    const indices = shuffleArray(
      Array.from({ length: dataSource.length }, (_, i) => i)
    );
    setSentenceIndices(indices);
    setCurrentIndex(0);

    // Reset ôn tập
    setWrongIndices([]);
    setIsReviewMode(false);
    setReviewIndices([]);
    setCurrentReviewIndex(0);
    setCorrectCount(0); // Reset score

    // Load câu đầu tiên
    loadQuestion(indices[0]);
  }, [questions, selectedData]);

  // Load một câu hỏi theo index gốc
  const loadQuestion = (originalIndex) => {
    const item = dataSentences[originalIndex];
    if (item) {
      setWords(shuffleArray(item.questions.slice(0, 5)));
      setInputValues(["", "", "", "", ""]);
      setResult(null);
      setShowCorrect(false);
    }
  };

  // Xác định index hiện tại (chính hoặc review)
  const currentOriginalIndex = isReviewMode
    ? reviewIndices[currentReviewIndex]
    : sentenceIndices[currentIndex];

  const currentTopic = dataSentences.length > 0 && currentOriginalIndex !== undefined
    ? dataSentences[currentOriginalIndex]?.topic || "No topic"
    : "";

  const handleWordClick = (word) => {
    const firstEmptyIndex = inputValues.indexOf("");
    if (firstEmptyIndex !== -1) {
      const newInputValues = [...inputValues];
      newInputValues[firstEmptyIndex] = word;
      setInputValues(newInputValues);
      setWords(words.filter((w) => w !== word));
    }
  };

  // Sửa lỗi: khi xóa từ ở giữa → dịch chuyển các từ sau lên
  const handleInputClick = (index) => {
    if (inputValues[index] === "") return;

    const removedWord = inputValues[index];
    const newInputValues = [...inputValues];

    // Dịch chuyển các từ phía sau lên
    for (let i = index; i < newInputValues.length - 1; i++) {
      newInputValues[i] = newInputValues[i + 1];
    }
    newInputValues[newInputValues.length - 1] = "";

    setInputValues(newInputValues);
    setWords([...words, removedWord]);
  };

  const checkAnswer = () => {
    const userAnswer = inputValues.map((val) => val.trim());
    const correctAnswer = dataSentences[currentOriginalIndex].questions.slice(0, 5);

    // Count how many positions are correct (partial credit)
    let correctPositions = 0;
    userAnswer.forEach((word, i) => {
      if (word === correctAnswer[i]) {
        correctPositions++;
      }
    });

    const isCorrect = correctPositions === 5; // All 5 positions correct

    if (isCorrect) {
      setResult("Correct!");
    } else {
      setResult(`Incorrect (${correctPositions}/5 correct), try again or show correct answer.`);
      setShowCorrect(true);
    }
    
    // Calculate new total score
    const newTotalScore = !isReviewMode ? correctCount + correctPositions : correctCount;
    
    // Count correct positions only in main mode (not review)
    if (!isReviewMode) {
      setCorrectCount(newTotalScore);
    }

    setTimeout(() => {
      if (isReviewMode) {
        // Trong chế độ ôn lại
        if (currentReviewIndex < reviewIndices.length - 1) {
          setCurrentReviewIndex(currentReviewIndex + 1);
          loadQuestion(reviewIndices[currentReviewIndex + 1]);
        } else {
          setResult("Congratulations! You mastered all wrong questions!");
          setIsReviewMode(false);
          // Chuyển sang Part 3
          if (onComplete) {
            setTimeout(() => {
              onComplete(correctCount); // Use current count in review mode
            }, 1500);
          }
        }
      } else {
        // Chế độ chính
        if (currentIndex < sentenceIndices.length - 1) {
          setCurrentIndex(currentIndex + 1);
          loadQuestion(sentenceIndices[currentIndex + 1]);
        } else {
          // Hoàn thành vòng chính
          if (wrongIndices.length > 0) {
            // Tự động vào chế độ ôn lại
            const shuffledWrong = shuffleArray([...wrongIndices]);
            setReviewIndices(shuffledWrong);
            setCurrentReviewIndex(0);
            setIsReviewMode(true);
            loadQuestion(shuffledWrong[0]);
            setResult("Now reviewing the questions you got wrong...");
          } else {
            setResult("Perfect! You got everything correct!");
            // Chuyển sang Part 3 - use NEW total score
            if (onComplete) {
              setTimeout(() => {
                onComplete(newTotalScore);
              }, 1500);
            }
          }
        }
      }
    }, 1000);

    // Chỉ ghi nhận câu sai ở chế độ chính nếu không đúng hoàn toàn
    if (!isReviewMode && !isCorrect && !wrongIndices.includes(currentOriginalIndex)) {
      setWrongIndices([...wrongIndices, currentOriginalIndex]);
    }
  };

  const resetSentence = () => {
    loadQuestion(currentOriginalIndex);
  };

  const startNewRound = () => {
    const indices = shuffleArray(
      Array.from({ length: dataSentences.length }, (_, i) => i)
    );
    setSentenceIndices(indices);
    setCurrentIndex(0);
    setWrongIndices([]);
    setIsReviewMode(false);
    loadQuestion(indices[0]);
    setResult("New round started!");
  };

  const startReviewManually = () => {
    if (wrongIndices.length === 0) {
      setResult("No wrong questions to review yet!");
      return;
    }
    const shuffledWrong = shuffleArray([...wrongIndices]);
    setReviewIndices(shuffledWrong);
    setCurrentReviewIndex(0);
    setIsReviewMode(true);
    loadQuestion(shuffledWrong[0]);
    setResult(null);
  };

  const handleDataChange = (e) => {
    setSelectedData(e.target.value);
  };

  return (
    <div className="app-container">
      <h1 className="game-title">Reading Aptis - Part 2</h1>

      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/reading" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}

      {!questions && (
        <div className="data-selector">
          <label htmlFor="data-select">Choose data set: </label>
          <select
            id="data-select"
            value={selectedData}
            onChange={handleDataChange}
            className="data-select"
          >
            <option value="part2">Full Data (part2)</option>
            <option value="part2shorten">Shortened Data (part2shorten)</option>
          </select>
        </div>
      )}

      <div className="topic-display">
        <strong>{currentTopic}</strong>
      </div>

      <p className="sentence-info">
        {isReviewMode
          ? `Review ${currentReviewIndex + 1} of ${reviewIndices.length} wrong questions`
          : `Question ${currentIndex + 1} of ${dataSentences.length}`}
      </p>

      <div className="word-section">
        <div className="word-list">
          {words.map((word, i) => (
            <span
              key={i}
              className="word-item"
              onClick={() => handleWordClick(word)}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="input-grid">
          {inputValues.map((value, index) => (
            <span
              key={index}
              className="input-field"
              onClick={() => handleInputClick(index)}
            >
              {value || " "}
            </span>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`result ${
            result.includes("Correct") ||
            result.includes("Congratulations") ||
            result.includes("Perfect") ||
            result.includes("New round")
              ? "correct"
              : "incorrect"
          }`}
        >
          {result}
        </div>
      )}

      {showCorrect && (
        <div className="correct-answer">
          <p>
            Correct answer:{" "}
            {dataSentences[currentOriginalIndex]?.questions
              .slice(0, 5)
              .join(" - ")}
          </p>
        </div>
      )}

      <div className="button-container">
        <button onClick={checkAnswer} className="check-button">
          Check Answer
        </button>
        <button onClick={resetSentence} className="try-again-button">
          Try Again
        </button>

        {!isReviewMode && wrongIndices.length > 0 && (
          <button onClick={startReviewManually} className="review-button">
            Review Wrong Questions ({wrongIndices.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadingPart2;