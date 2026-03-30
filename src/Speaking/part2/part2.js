/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect } from "react";
import "./part2.css";
import { data } from "../data.js";
import img1 from "../image/part2/1.png";
import img2 from "../image/part2/2.png";
import img3 from "../image/part2/3.png";
import img4 from "../image/part2/4.png";
import img5 from "../image/part2/5.png";
import img6 from "../image/part2/6.png";
import img7 from "../image/part2/7.png";
import img8 from "../image/part2/8.png";
import img9 from "../image/part2/9.png";
import img10 from "../image/part2/10.png";
import img11 from "../image/part2/11.png";
import img12 from "../image/part2/12.png";
import img13 from "../image/part2/13.png";
import img14 from "../image/part2/14.png";
import img15 from "../image/part2/15.png";
import img16 from "../image/part2/16.png";
import img17 from "../image/part2/17.png";
import img18 from "../image/part2/18.png";
import img19 from "../image/part2/19.png";
import img20 from "../image/part2/20.png";
import img21 from "../image/part2/21.png";
import img22 from "../image/part2/22.png";
import img23 from "../image/part2/23.png";
import img24 from "../image/part2/24.png";
import img25 from "../image/part2/25.png";
import img26 from "../image/part2/26.png";
import img27 from "../image/part2/27.png";
import img28 from "../image/part2/28.png";
import img29 from "../image/part2/29.png";
import img30 from "../image/part2/30.png";
import img31 from "../image/part2/31.png";
import img32 from "../image/part2/32.png";
import img33 from "../image/part2/33.png";
import { Link } from "react-router-dom";

const images = {
  1: img1, 2: img2, 3: img3, 4: img4, 5: img5, 6: img6, 7: img7, 8: img8, 9: img9,
  10: img10, 11: img11, 12: img12, 13: img13, 14: img14, 15: img15, 16: img16,
  17: img17, 18: img18, 19: img19, 20: img20, 21: img21, 22: img22, 23: img23,
  24: img24, 25: img25, 26: img26, 27: img27, 28: img28, 29: img29, 30: img30,
  31: img31, 32: img32, 33: img33
};

function SpeakingPart2({ questions, onComplete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [displayTime, setDisplayTime] = useState(5);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [subStep, setSubStep] = useState(0); // 0, 1, 2 for the 3 questions

  useEffect(() => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part2;
    const shuffled = [...dataQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    setShuffledImages(shuffled);
    setCurrentImageIndex(0);
    setSubStep(0);
    setTimeLeft(45);
    setDisplayTime(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (displayTime > 0) {
      timer = setTimeout(() => setDisplayTime(displayTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Time left reached 0 (Speaking finished for this sub-step)
      if (subStep < 2) {
        // Move to next sub-step (question 2 or 3 for same image)
        setSubStep(prev => prev + 1);
        setTimeLeft(45);
        setDisplayTime(5); // 5s preparation before next question
      } else {
        // Finished all 3 sub-steps for current image
        if (currentImageIndex < shuffledImages.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
          setSubStep(0);
          setTimeLeft(45);
          setDisplayTime(5);
        } else {
          onComplete();
        }
      }
    }
  }, [
    displayTime,
    timeLeft,
    currentImageIndex,
    onComplete,
    shuffledImages.length,
    subStep
  ]);

  const currentTopic = shuffledImages[currentImageIndex];
  if (!currentTopic || currentImageIndex === null)
    return <div>Loading...</div>;

  const currentQuestion = currentTopic.questions[subStep];

  return (
    <div className="app-container">
      <h1 className="game-title">Image Practice - Part 2</h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/speaking" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        Image {currentImageIndex + 1}/{shuffledImages.length} - Question {subStep + 1}/3
      </p>
      <div className="question-section">
        <h2>{currentQuestion}</h2>
        <img
          src={images[currentTopic.id]}
          alt={`Image ${currentTopic.id}`}
          className="image-display"
        />
        {displayTime > 0 ? (
          <p className="display-text">
            Prepare: {displayTime} seconds
          </p>
        ) : (
          <>
            <p className="timer">Time left: {timeLeft} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}

export default SpeakingPart2;
