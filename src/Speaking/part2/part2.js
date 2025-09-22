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

function SpeakingPart2({ onComplete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [displayTime, setDisplayTime] = useState(5);
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    const shuffled = [...data.part2].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setCurrentImageIndex(0);
    setTimeLeft(45);
    setDisplayTime(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let displayTimer;
    if (displayTime > 0) {
      displayTimer = setTimeout(() => setDisplayTime(displayTime - 1), 1000);
    } else if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      if (currentImageIndex < shuffledImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setTimeLeft(45);
        setDisplayTime(5);
      } else {
        onComplete();
      }
    }
    return () => clearTimeout(displayTimer);
  }, [
    displayTime,
    timeLeft,
    currentImageIndex,
    onComplete,
    shuffledImages.length,
  ]);

  const currentImage = () => {
    console.log(shuffledImages[currentImageIndex] === 1);
    
    switch (shuffledImages[currentImageIndex]) {
      case 1:
        return img1;
      case 2:
        return img2;
      case 3:
        return img3;
      case 4:
        return img4;
      case 5:
        return img5;
      case 6:
        return img6;
      case 7:
        return img7;
      case 8:
        return img8;
      default:
        break;
    }
    return img1;
  };

  if (!currentImage() || currentImageIndex === null)
    return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Image Practice - Part 2</h1>
      <p className="question-count">
        {currentImageIndex + 1}/{shuffledImages.length}
      </p>
      <div className="question-section">
        <h2>Image Description</h2>
        {displayTime > 0 ? (
          <p className="display-text">
            Prepare to describe: {displayTime} seconds
          </p>
        ) : (
          <>
            <img
              src={currentImage()}
              alt={`Image ${currentImageIndex + 1}`}
              className="image-display"
            />
            <p className="timer">Time left: {timeLeft} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}

export default SpeakingPart2;
