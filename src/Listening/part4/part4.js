import { useState, useEffect } from "react";
import "./part4.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function Part4({ onComplete }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [shuffledTopics, setShuffledTopics] = useState([]);
  
  // Stores the two "sub-questions" for the current topic.
  const [currentSubQuestions, setCurrentSubQuestions] = useState([]);
  
  // Track which sub-question we are on (0 or 1)
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  
  // Track selected option for the *current* sub-question
  const [selectedOption, setSelectedOption] = useState(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    shuffleTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleTopics = () => {
    const shuffled = [...data.part4].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    resetQuestionState();
    setCorrectCount(0);
    setIncorrectCount(0);
    
    if (shuffled.length > 0) {
      prepareSubQuestions(shuffled[0].subQuestions);
    }
  };

  const resetQuestionState = () => {
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);
    setCurrentSubIndex(0);
  };

  const prepareSubQuestions = (allOptions) => {
    const correctOptions = allOptions.filter((o) => o.answer);
    const incorrectOptions = allOptions.filter((o) => !o.answer);
    
    const shuffledIncorrect = [...incorrectOptions].sort(() => Math.random() - 0.5);

    // Group 1
    const group1Options = [
      correctOptions[0], 
      shuffledIncorrect[0], 
      shuffledIncorrect[1]
    ].filter(Boolean).sort(() => Math.random() - 0.5);

    // Group 2
    const group2Options = [
      correctOptions[1], 
      shuffledIncorrect[2], 
      shuffledIncorrect[3]
    ].filter(Boolean).sort(() => Math.random() - 0.5);

    setCurrentSubQuestions([
      { id: 0, options: group1Options },
      { id: 1, options: group2Options }
    ]);
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent multiple clicks
    setSelectedOption(option.text);

    if (option.answer) {
      setCorrectCount(prev => prev + 1);
      // Auto-advance
      setTimeout(() => {
        handleNextStep();
      }, 1000);
    } else {
      setIncorrectCount(prev => prev + 1);
      setResult("Incorrect. See correct answer.");
      setShowCorrect(true);
      // For incorrect, maybe wait longer or let user convert? 
      // Part 1 usually auto-advances even on wrong if getting "results".
      // Let's auto-advance after a slightly longer delay so they can see the red/green.
      setTimeout(() => {
        handleNextStep();
      }, 2000); // 2 seconds to see mistake
    }
  };

  const handleNextStep = () => {
    // Clear state for next step
    setResult(null);
    setShowCorrect(false);
    setSelectedOption(null);

    // If we are on the first sub-question (index 0), go to index 1
    if (currentSubIndex < 1) {
      setCurrentSubIndex(1);
    } else {
      // If we are on index 1, move to next TOPIC
      nextTopic();
    }
  };
  
  const nextTopic = () => {
    if (currentTopicIndex < shuffledTopics.length - 1) {
      const nextIndex = currentTopicIndex + 1;
      setCurrentTopicIndex(nextIndex);
      // Reset sub-index back to 0 for new topic
      setCurrentSubIndex(0);
      prepareSubQuestions(shuffledTopics[nextIndex].subQuestions);
    } else {
      setResult("Congratulations! You completed all topics!");
      onComplete();
    }
  };

  const currentTopic = shuffledTopics[currentTopicIndex] || null;
  const activeSubQuestion = currentSubQuestions[currentSubIndex];

  if (!currentTopic || !activeSubQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">Multiple Choice Game - Part 4</h1>
      <div className="back-button-container">
        <Link to="/listening" className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <p className="question-count">
        Topic {currentTopicIndex + 1}/{shuffledTopics.length} - Question {currentSubIndex + 1}/2
      </p>
      <p className="score-count">
        Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
      </p>
      
      <div className="question-section">
        <h2>Topic: {currentTopic.name}</h2>
        
        <div className="sub-question-block" style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>Choose the correct statement:</p>
          <div className="options">
            {activeSubQuestion.options.map((option, optIndex) => (
              <button
                key={optIndex}
                className={`option-btn ${
                  selectedOption === option.text
                    ? option.answer
                      ? "correct" // selected and correct
                      : "incorrect" // selected and wrong
                    : showCorrect && option.answer 
                      ? "correct" // show correct if wrong was picked
                      : ""
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedOption}
              >
                {String.fromCharCode(65 + optIndex)}. {option.text}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="result-container">
             <p className={`result ${result.includes("Correct") ? "correct" : "incorrect"}`}>
               {result}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Part4;
