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
  const [sentenceIndices, setSentenceIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [inputValues, setInputValues] = useState(["", "", "", "", ""]);
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [dataSentences, setDataSentences] = useState([]);
  const [selectedData, setSelectedData] = useState("part2"); // Trạng thái để chọn dữ liệu

  useEffect(() => {
    // Nếu questions không null, sử dụng questions; nếu null, sử dụng data dựa trên selectedData
    const dataSource = questions
      ? questions
      : selectedData === "part2"
      ? data.part2
      : data.part2shorten;
    setDataSentences(dataSource);

    // Tạo mảng chỉ số ngẫu nhiên khi component mount hoặc khi dataSource thay đổi
    const indices = shuffleArray(
      Array.from({ length: dataSource.length }, (_, i) => i)
    );
    setSentenceIndices(indices);
    setCurrentIndex(0);
    setWords(shuffleArray(dataSource[indices[0]]));
    setInputValues(["", "", "", "", ""]);
    setResult(null);
    setShowCorrect(false);
  }, [questions, selectedData]);

  const handleWordClick = (word) => {
    const firstEmptyIndex = inputValues.indexOf("");
    if (firstEmptyIndex !== -1) {
      const newInputValues = [...inputValues];
      newInputValues[firstEmptyIndex] = word;
      setInputValues(newInputValues);
      setWords(words.filter((w) => w !== word));
    }
  };

  const handleInputClick = (index) => {
    const newInputValues = [...inputValues];
    const removedWord = newInputValues[index];
    newInputValues[index] = "";
    for (let i = index + 1; i < newInputValues.length; i++) {
      newInputValues[i - 1] = newInputValues[i];
      newInputValues[i] = "";
    }
    setInputValues(newInputValues);
    if (removedWord) {
      setWords([...words, removedWord]);
    }
  };

  const checkAnswer = () => {
    const userAnswer = inputValues.map((val) => val.trim()).filter(Boolean);
    const correctAnswer = dataSentences[sentenceIndices[currentIndex]].slice(
      0,
      5
    );
    const isCorrect = userAnswer.every(
      (word, index) => word === correctAnswer[index]
    );
    setResult(
      isCorrect ? "Correct!" : "Incorrect, try again or show correct answer."
    );
    if (isCorrect) {
      setTimeout(() => {
        if (currentIndex < sentenceIndices.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setWords(
            shuffleArray(dataSentences[sentenceIndices[currentIndex + 1]])
          );
          setInputValues(["", "", "", "", ""]);
          setResult(null);
          setShowCorrect(false);
        } else {
          onComplete();
          const newIndices = shuffleArray(
            Array.from({ length: dataSentences.length }, (_, i) => i)
          );
          setSentenceIndices(newIndices);
          setCurrentIndex(0);
          setWords(shuffleArray(dataSentences[newIndices[0]]));
          setInputValues(["", "", "", "", ""]);
          setResult("New round started!");
          setShowCorrect(false);
        }
      }, 1000);
    } else {
      setShowCorrect(true);
    }
  };

  const resetSentence = () => {
    setWords(shuffleArray(dataSentences[sentenceIndices[currentIndex]]));
    setInputValues(["", "", "", "", ""]);
    setResult(null);
    setShowCorrect(false);
  };

  const handleDataChange = (e) => {
    setSelectedData(e.target.value);
  };

  return (
    <div className="app-container">
      <h1 className="game-title">Reading aptis</h1>
      {/* Chỉ hiển thị dropdown khi questions là null */}
      {(!questions || questions.length == 0) && (
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            Back to Home
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
      <p className="sentence-info">
        Sentence {currentIndex + 1} of {dataSentences.length}
      </p>
      <div className="word-section">
        <div className="word-list">
          {words.slice(0, 5).map((word) => (
            <span
              key={word}
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
            result.includes("Correct") ? "correct" : "incorrect"
          }`}
        >
          {result}
        </div>
      )}
      {showCorrect && (
        <div className="correct-answer">
          <p>
            Correct answer:{" "}
            {dataSentences[sentenceIndices[currentIndex]]
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
      </div>
    </div>
  );
}

export default ReadingPart2;
