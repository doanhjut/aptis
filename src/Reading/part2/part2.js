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

/** part2: { topic, questions }; part2shorten: string[] — trả về mảng 5 câu/đoạn. */
const getQuestionList = (item) => {
  if (!item) return [];
  if (Array.isArray(item)) return item.slice(0, 5);
  if (item.questions && Array.isArray(item.questions)) return item.questions.slice(0, 5);
  return [];
};

/** part2: item.topic; part2shorten: không có — trả về chuỗi tiêu đề. */
const getTopic = (item) => {
  if (!item) return "";
  if (typeof item === "object" && item.topic) return item.topic;
  return "Part 2 (short)";
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
  
  // State to ensure consistency between visual and logical data
  const [currentInfo, setCurrentInfo] = useState({
    originalIndex: null,
    topic: "",
    correctAnswer: [],
  });
  
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

    // Load câu đầu tiên (truyền dataSource vì dataSentences có thể chưa kịp cập nhật khi đổi Full/Shorten)
    loadQuestion(indices[0], dataSource);
  }, [questions, selectedData]);

  // Load một câu hỏi theo index gốc (hỗ trợ part2: {topic,questions} và part2shorten: string[])
  // source: dùng khi vừa đổi data (useEffect) để tránh đọc dataSentences cũ
  const loadQuestion = (originalIndex, source) => {
    const data = source ?? dataSentences;
    const item = data[originalIndex];
    const list = getQuestionList(item);
    const topic = getTopic(item);

    if (list.length > 0) {
      setWords(shuffleArray(list));
      setInputValues(["", "", "", "", ""]);
      setResult(null);
      setShowCorrect(false);
      
      // Store current question details to ensure consistency
      setCurrentInfo({
        originalIndex: originalIndex,
        topic: topic || "No topic",
        correctAnswer: list
      });
    }
  };

  // Removed derived currentOriginalIndex and currentTopic to avoid desync
  // Use currentInfo instead

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
    const correctAnswer = currentInfo.correctAnswer; // Use stable state

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

    if (isCorrect) {
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
    }

    // Chỉ ghi nhận câu sai ở chế độ chính nếu không đúng hoàn toàn
    // Use currentInfo.originalIndex to ensure we track the actual displayed question
    if (!isReviewMode && !isCorrect && !wrongIndices.includes(currentInfo.originalIndex)) {
      setWrongIndices([...wrongIndices, currentInfo.originalIndex]);
    }
  };

  const resetSentence = () => {
    loadQuestion(currentInfo.originalIndex);
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
        <strong>{currentInfo.topic}</strong>
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

        <div className="input-slots">
          {inputValues.map((value, index) => (
            <div
              key={index}
              className={`input-slot${value ? " input-slot--filled" : ""}`}
              onClick={() => handleInputClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleInputClick(index);
                }
              }}
            >
              <span className="input-slot-num">{index + 1}</span>
              <span className="input-slot-content">
                {value || "— Chọn câu từ danh sách phía trên —"}
              </span>
            </div>
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
            {currentInfo.correctAnswer.join(" - ")}
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