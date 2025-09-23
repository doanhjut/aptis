import { useEffect, useState } from "react";
import { data } from "../data.js";
import "./test.css";
import Part1 from "../part1/part1.js";
import Part2 from "../part2/part2.js";
import Part3 from "../part3/part3.js";
import Part4 from "../part4/part4.js";
import { Link } from "react-router-dom";

function SpeakingTest() {
  const [part1QuestionsSelected, setPart1QuestionsSelected] = useState([]);
  const [part2Items, setPart2Items] = useState([]);
  const [part3Topic, setPart3Topic] = useState("");
  const [part4Topic, setPart4Topic] = useState("");

  const [currentPart, setCurrentPart] = useState(1);

  const handleComplete = () => {
    if (currentPart < 4) {
      setCurrentPart(currentPart + 1);
    } else {
      alert("Congratulations! You completed all parts!");
    }
  };

  useEffect(() => {
    // Part 1: Randomly select 5 questions
    const shuffledPart1 = [...data.part1].sort(() => Math.random() - 0.5);
    setPart1QuestionsSelected(shuffledPart1.slice(0, 3));
    const part2Data = [...data.part2];
    const shuffledPart2 = [...part2Data].sort(() => Math.random() - 0.5);
    setPart2Items(shuffledPart2.slice(0, 1));

    // Part 3: Randomly select 1 topic (assuming a simple topic selection)
    const part3Topics = [...data.part3].sort(() => Math.random() - 0.5);
    setPart3Topic(part3Topics.slice(0, 1));

    // Part 4: Randomly select 1 topic from part4Questions
    const shuffledPart4 = [...data.part4].sort(() => Math.random() - 0.5);
    setPart4Topic(shuffledPart4.slice(0, 1));
  }, []);

  return (
    <div className="test-container">
      <h1> SpeakingTest Across 4 Parts</h1>
      <div className="back-button-container">
        <Link to="/listening" className="back-button">
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

export default SpeakingTest;
