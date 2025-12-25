import { useEffect, useState } from "react";
import { data } from "../data.js";
import "./test.css";
import Part1 from "../part1/part1.js";
import Part4 from "../part4/part4.js";
import { Link } from "react-router-dom";
import ListeningPart3 from "../part3/part3.js";

function ListeningTest() {
  const [part1QuestionsSelected, setPart1QuestionsSelected] = useState([]);
  // const [part2Items, setPart2Items] = useState([]);
  const [part3Topic, setPart3Topic] = useState([]);
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
    setPart1QuestionsSelected(shuffledPart1.slice(0, 13));

    // const part2Data = [...data.part2];
    // const shuffledPart2 = [...part2Data].sort(() => Math.random() - 0.5);
    // setPart2Items(shuffledPart2.slice(0, 2));

    // Part 3: Randomly select 1 topic (assuming a simple topic selection)
    const part3Topics = [...data.part3];
    setPart3Topic(part3Topics[Math.floor(Math.random() * part3Topics.length)]);

    // Part 4: Randomly select 1 topic from part4Questions
    const shuffledPart4 = [...data.part4].sort(() => Math.random() - 0.5);
    setPart4Topic(shuffledPart4[0].main);
  }, []);

  return (
    <div className="test-container">
      <h1>ListeningTest Across 4 Parts</h1>
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
          {/* {currentPart === 2 && (
            <Part2
              questions={Array.isArray(part2Items) ? part2Items : []}
              onComplete={handleComplete}
            />
          )} */}
          {currentPart === 2 && (
            <ListeningPart3
              questions={Array.isArray(part3Topic) ? part3Topic : []}
              onComplete={handleComplete}
            />
          )}
          {currentPart === 3 && (
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

export default ListeningTest;
