import { useEffect, useState } from "react";
import { data } from "../data.js";
import "./test.css";
import Part1 from "../part1/part1.js";
import Part2 from "../part2/part2.js";
import Part3 from "../part3/part3.js";
import Part4 from "../part4/part4.js";
import { Link } from "react-router-dom";

function WritingTest() {
  const [part1QuestionsSelected, setPart1QuestionsSelected] = useState([]);
  const [part2Item, setPart2Item] = useState(null);
  const [sharedTopic, setSharedTopic] = useState(null);
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
    setPart1QuestionsSelected(shuffledPart1.slice(0, 5));

    // Part 2: Randomly select 1 question
    const shuffledPart2 = [...data.part2].sort(() => Math.random() - 0.5);
    setPart2Item(shuffledPart2[0]);

    // Part 3 & Part 4: Select 1 shared topic
    // Map part3 names and part4 topics to lowercase for comparison
    const part3Names = data.part3.map((p3) => p3.name.toLowerCase());
    const part4Topics = data.part4.map((p4) => p4.topic.toLowerCase());
    // Find common topics (case-insensitive)
    const commonTopics = part3Names.filter((name) =>
      part4Topics.includes(name)
    );

    if (commonTopics.length > 0) {
      // Select a random common topic
      const selectedTopic =
        commonTopics[Math.floor(Math.random() * commonTopics.length)];
      // Find the corresponding data for Part 3 and Part 4
      const part3Data = data.part3.find(
        (p3) => p3.name.toLowerCase() === selectedTopic
      );
      const part4Data = data.part4.find(
        (p4) => p4.topic.toLowerCase() === selectedTopic
      );
      setSharedTopic({ part3: part3Data, part4: part4Data });
    } else {
      // Fallback: Use the first topic from part3 and part4 if no common topics
      console.warn(
        "No common topics found between part3 and part4. Using fallback."
      );
      setSharedTopic({
        part3: data.part3[0],
        part4: data.part4[0],
      });
    }
  }, []);

  return (
    <div className="test-container">
      <h1>Speaking Across 4 Parts</h1>
      <div className="back-button-container">
        <Link to="/listening" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className="part-section">
        {currentPart === 1 && part1QuestionsSelected.length > 0 && (
          <Part1
            questions={part1QuestionsSelected}
            onComplete={handleComplete}
          />
        )}
        {currentPart === 2 && part2Item && (
          <Part2 questions={[part2Item]} onComplete={handleComplete} />
        )}
        {currentPart === 3 && sharedTopic?.part3 && (
          <Part3 questions={sharedTopic.part3} onComplete={handleComplete} />
        )}
        {currentPart === 4 && sharedTopic?.part4 && (
          <Part4 questions={sharedTopic.part4} onComplete={handleComplete} />
        )}
        {(!part1QuestionsSelected.length || !part2Item || !sharedTopic) && (
          <div>Loading questions...</div>
        )}
      </div>
    </div>
  );
}

export default WritingTest;
