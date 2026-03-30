/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect } from "react";
import "./part3.css";
import { data } from "../data.js";
import img1 from "../image/part3/1.png";
import img2 from "../image/part3/2.png";
import img3 from "../image/part3/3.png";
import img4 from "../image/part3/4.png";
import img5 from "../image/part3/5.png";
import img6 from "../image/part3/6.png";
import img7 from "../image/part3/7.png";
import img8 from "../image/part3/8.png";
import img9 from "../image/part3/9.png";
import img10 from "../image/part3/10.png";
import img11 from "../image/part3/11.png";
import img12 from "../image/part3/12.png";
import img13 from "../image/part3/13.png";
import img14 from "../image/part3/14.png";
import img15 from "../image/part3/15.png";
import img16 from "../image/part3/16.png";
import img17 from "../image/part3/17.png";
import img18 from "../image/part3/18.png";
import img20 from "../image/part3/20.png";
import img21 from "../image/part3/21.png";
import img22 from "../image/part3/22.png";
import img23 from "../image/part3/23.png";
import img24 from "../image/part3/24.png";
import img25 from "../image/part3/25.png";
import img26 from "../image/part3/26.png";
import img27 from "../image/part3/27.png";
import img28 from "../image/part3/28.png";
import img30 from "../image/part3/30.png";
import img32 from "../image/part3/32.png";
import img33 from "../image/part3/33.png";
import img36 from "../image/part3/36.png";
import img37 from "../image/part3/37.png";
import img38 from "../image/part3/38.png";
import { Link } from "react-router-dom";

const images = {
  1: img1, 2: img2, 3: img3, 4: img4, 5: img5, 6: img6, 7: img7, 8: img8, 9: img9,
  10: img10, 11: img11, 12: img12, 13: img13, 14: img14, 15: img15, 16: img16,
  17: img17, 18: img18, 20: img20, 21: img21, 22: img22, 23: img23,
  24: img24, 25: img25, 26: img26, 27: img27, 28: img28, 30: img30,
  32: img32, 33: img33, 36: img36, 37: img37, 38: img38
};

function SpeakingPart3({ questions, onComplete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [displayTime, setDisplayTime] = useState(5);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [subStep, setSubStep] = useState(0);

  useEffect(() => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part3;
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
      if (subStep < 2) {
        setSubStep(prev => prev + 1);
        setTimeLeft(45);
        setDisplayTime(5);
      } else {
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
      <h1 className="game-title">Image Practice - Part 3</h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/speaking" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        Pair {currentImageIndex + 1}/{shuffledImages.length} - Question {subStep + 1}/3
      </p>
      <div className="question-section">
        <h2>{currentQuestion}</h2>
        <img
          src={images[currentTopic.id]}
          alt={`Pair ${currentTopic.id}`}
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

export default SpeakingPart3;
