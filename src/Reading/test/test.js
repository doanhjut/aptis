import { useEffect, useState } from "react";
import { data } from "../data.js";
import "./test.css";
import Part1 from "../part1/part1.js";
import Part2 from "../part2/part2.js";
import Part3 from "../part3/part3.js";
import Part4 from "../part4/part4.js";
import ResultsDisplay from "../components/ResultsDisplay.js";
import { Link } from "react-router-dom";

function Test() {
  const [part1QuestionsSelected, setPart1QuestionsSelected] = useState([]);
  const [part2Items, setPart2Items] = useState([]);
  const [part3Topic, setPart3Topic] = useState("");
  const [part4Topic, setPart4Topic] = useState("");

  const [currentPart, setCurrentPart] = useState(1);
  
  // Score tracking
  const [part1Score, setPart1Score] = useState(0);
  const [part2Score, setPart2Score] = useState(0);
  const [part3Score, setPart3Score] = useState(0);
  const [part4Score, setPart4Score] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleComplete = (score = 0) => {
    // Store score for current part
    if (currentPart === 1) setPart1Score(score);
    if (currentPart === 2) setPart2Score(score);
    if (currentPart === 3) setPart3Score(score);
    if (currentPart === 4) setPart4Score(score);
    
    if (currentPart < 4) {
      setCurrentPart(currentPart + 1);
    } else {
      // Show results after Part 4
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    // Reset all scores and state
    setPart1Score(0);
    setPart2Score(0);
    setPart3Score(0);
    setPart4Score(0);
    setCurrentPart(1);
    setShowResults(false);
    
    // Re-shuffle questions
    const shuffledPart1 = [...data.part1].sort(() => Math.random() - 0.5);
    setPart1QuestionsSelected(shuffledPart1.slice(0, 1));

    const shuffledPart2 = [...data.part2].sort(() => Math.random() - 0.5);
    setPart2Items(shuffledPart2.slice(0, 2));

    const shuffledPart3 = [...data.part3].sort(() => Math.random() - 0.5);
    setPart3Topic(shuffledPart3.slice(0, 1));

    const shuffledPart4 = [...data.part4].sort(() => Math.random() - 0.5);
    setPart4Topic(shuffledPart4.slice(0, 1));
  };

  useEffect(() => {
    // Part 1: Randomly select 1 topic (which contains 5 questions)
    const shuffledPart1 = [...data.part1].sort(() => Math.random() - 0.5);
    setPart1QuestionsSelected(shuffledPart1.slice(0, 1));

    // Part 2: Randomly select 2 passages (each has 5 questions = 10 total)
    const part2Data = [...data.part2];
    const shuffledPart2 = [...part2Data].sort(() => Math.random() - 0.5);
    setPart2Items(shuffledPart2.slice(0, 2));

    // Part 3: Randomly select 1 topic (assuming a simple topic selection)
    const part3Topics = [...data.part3];
    const shuffledPart3 = [...part3Topics].sort(() => Math.random() - 0.5);
    setPart3Topic(shuffledPart3.slice(0, 1));

    // Part 4: Randomly select 1 topic from part4Questions
    const shuffledPart4 = [...data.part4].sort(() => Math.random() - 0.5);
    setPart4Topic(shuffledPart4.slice(0, 1));
  }, []);

  // Show results screen
  if (showResults) {
    return (
      <ResultsDisplay
        part1Score={part1Score}
        part2Score={part2Score}
        part3Score={part3Score}
        part4Score={part4Score}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="test-container">
      <h1>APTIS Reading Test</h1>
      <div className="test-progress">
        <div className="progress-indicator">
          Part {currentPart} of 4
        </div>
      </div>
      <div className="back-button-container">
        <Link to="/reading" className="back-button">
          Back to Home
        </Link>
      </div>
      {/* Part 1 */}
      {Array.isArray(part1QuestionsSelected) &&
      part1QuestionsSelected.length > 0 ? (
        <div className="part-section">
          {currentPart === 1 && (
            <Part1
              questions={part1QuestionsSelected}
              onComplete={handleComplete}
            />
          )}
          {currentPart === 2 && (
            <Part2
              questions={Array.isArray(part2Items) ? part2Items : []}
              onComplete={handleComplete}
            />
          )}
          {currentPart === 3 && (
            <Part3
              questions={Array.isArray(part3Topic) ? part3Topic : []}
              onComplete={handleComplete}
            />
          )}
          {currentPart === 4 && (
            <Part4
              questions={Array.isArray(part4Topic) ? part4Topic : []}
              onComplete={handleComplete}
            />
          )}
        </div>
      ) : (
        <div>No questions available for Part 1.</div>
      )}
    </div>
  );
}

export default Test;
