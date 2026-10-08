import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newListeningData } from "../dataNew";
import ListeningPart1 from "../part1/part1";
import ListeningPart2 from "../part2/part2";
import ListeningPart3 from "../part3/part3";
import ListeningPart4 from "../part4/part4";
import "./test.css";

const randomSelection = (items, count) =>
  [...items].sort(() => Math.random() - 0.5).slice(0, count);

function ListeningTestNew() {
  const [selectedQuestions, setSelectedQuestions] = useState(null);
  const [currentPart, setCurrentPart] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setSelectedQuestions({
      part1: randomSelection(newListeningData.part1, 13),
      part2: randomSelection(newListeningData.part2, 1),
      part3: randomSelection(newListeningData.part3, 1),
      part4: randomSelection(newListeningData.part4, 2),
    });
  }, []);

  const handleComplete = () => {
    if (currentPart < 4) {
      setCurrentPart((part) => part + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (!selectedQuestions) {
    return <div className="test-container">Đang chuẩn bị bài kiểm tra...</div>;
  }

  return (
    <div className="test-container">
      <h1>Aptis Listening - 15 đề mới</h1>
      <div className="test-progress">
        <div className="progress-indicator">Part {currentPart} of 4</div>
      </div>
      <div className="back-button-container">
        <Link to="/listening/new" className="back-button">
          ← 15 đề mới
        </Link>
      </div>

      {isComplete ? (
        <div className="question-section">
          <h2>Bạn đã hoàn thành bài kiểm tra!</h2>
          <Link to="/listening/new" className="start-button">
            Quay lại 15 đề mới
          </Link>
        </div>
      ) : (
        <div className="part-section">
          {currentPart === 1 && (
            <ListeningPart1
              questions={selectedQuestions.part1}
              onComplete={handleComplete}
              backPath="/listening/new"
            />
          )}
          {currentPart === 2 && (
            <ListeningPart2
              questions={selectedQuestions.part2}
              onComplete={handleComplete}
              backPath="/listening/new"
            />
          )}
          {currentPart === 3 && (
            <ListeningPart3
              questions={selectedQuestions.part3}
              onComplete={handleComplete}
              backPath="/listening/new"
            />
          )}
          {currentPart === 4 && (
            <ListeningPart4
              questions={selectedQuestions.part4}
              onComplete={handleComplete}
              backPath="/listening/new"
              isTest
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ListeningTestNew;
