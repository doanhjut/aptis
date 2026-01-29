import { useState, useEffect } from "react";
import "./part1.css";
import { data } from "../data.js";
import { Link } from "react-router-dom";

function ListeningPart1({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  
  // Scoring
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Review Mode State
  const [wrongQuestions, setWrongQuestions] = useState([]); // Stores objects of wrong questions
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // New state to show summary screen

  useEffect(() => {
    shuffleQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleQuestions = () => {
    const dataQuestions =
      questions && questions.length > 0 ? questions : data.part1;
    const shuffled = [...dataQuestions].sort(() => Math.random() - 0.5);
    
    setShuffledQuestions(shuffled);
    resetTestState();
  };

  const resetTestState = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setResult(null);
    setShowCorrect(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setWrongQuestions([]);
    setIsReviewMode(false);
    setIsFinished(false);
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent double click
    setSelectedOption(option);
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setResult("Correct!");
      // Only increment score if not in review mode (or do we count review score? Usually separate).
      // Let's keep adding to 'correctCount' normally, showing progress.
      if (!isReviewMode) {
        setCorrectCount(prev => prev + 1);
      }
      
      setTimeout(() => {
        handleNextStep();
      }, 1000);
    } else {
      setResult("Incorrect, try again or show correct answer.");
      setShowCorrect(true);
      if (!isReviewMode) {
        setIncorrectCount(prev => prev + 1);
        // Add to wrong questions if not already there (though indices are unique in this run)
        setWrongQuestions(prev => [...prev, currentQuestion]);
      } else {
         // In review mode, if they get it wrong again, keep it in the list? 
         // Or just let them proceed? For now, let's just proceed.
      }
    }
  };

  const handleNextStep = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption("");
      setResult(null);
      setShowCorrect(false);
    } else {
      finishSection();
    }
  };

  const finishSection = () => {
    if (isReviewMode) {
       setResult("Review completed! Good job.");
       // After review, maybe go back to summary or finish?
       // Let's just finish for now or show summary of review?
       // Behaving like Part 3: "Great! You corrected your mistakes." then back/finish.
       setTimeout(() => {
         setIsFinished(true);
         setIsReviewMode(false); // Reset mode to show final summary options again
       }, 1500);
    } else {
      setIsFinished(true);
    }
  };

  const startReview = () => {
    if (wrongQuestions.length === 0) return;
    setIsReviewMode(true);
    setIsFinished(false);
    // Shuffle wrong questions or keep order?
    const shuffledWrong = [...wrongQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffledWrong);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setResult(null);
    setShowCorrect(false);
    // Reset specific 'correct' count for the review session? 
    // Or just track progress. Let's not reset global counters to keep total "session" stats visible if desired, 
    // OR reset to focus on review. Part 3 resets counters kind of.
    // Let's reset counters for the review session clarity.
    setCorrectCount(0);
    setIncorrectCount(0); // Optionally track errors during review
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex] || null;

  if (isFinished) {
    return (
      <div className="app-container">
        <h1 className="game-title">Part 1 - Summary</h1>
        <div className="question-section" style={{textAlign: "center"}}>
          <h2>You completed the section!</h2>
          <p className="score-count" style={{fontSize: "1.2rem", margin: "20px 0"}}>
             Correct: {correctCount} | Incorrect: {incorrectCount}
          </p>
          
          {wrongQuestions.length > 0 && !isReviewMode && (
             <div style={{marginBottom: "20px"}}>
               <p>You have {wrongQuestions.length} incorrect answers.</p>
               <button 
                 onClick={startReview}
                 className="option-btn" 
                 style={{background: "#f59e0b", color:"white", borderColor:"#d97706", fontWeight:"bold", margin:"0 auto", display:"block", width:"auto"}}
               >
                 Review Wrong Answers
               </button>
             </div>
          )}

          <div style={{display: "flex", gap: "10px", justifyContent: "center"}}>
             <button 
               className="option-btn"
               onClick={() => onComplete && onComplete()}
               style={{background: "#10b981", color:"white", borderColor:"#059669", width:"auto"}}
             >
               Finish Part 1
             </button>
             
             <button
               className="option-btn"
               onClick={shuffleQuestions} // Restart whole test
               style={{background: "#3b82f6", color:"white", borderColor:"#2563eb", width:"auto"}}
             >
               Restart All
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1 className="game-title">
        {isReviewMode ? "Review Mode - Part 1" : "Multiple Choice Game - Part 1"}
      </h1>
      {(!questions || questions.length === 0) && (
        <div className="back-button-container">
          <Link to="/listening" className="back-button">
            ← Trang chủ
          </Link>
        </div>
      )}
      <p className="question-count">
        {isReviewMode ? "Review: " : ""}{currentQuestionIndex + 1}/{shuffledQuestions.length}
      </p>
      {!isReviewMode && (
        <p className="score-count">
          Trả lời đúng: {correctCount}, Trả lời sai: {incorrectCount}
        </p>
      )}
      <div className="question-section">
        <p className="question-text">{currentQuestion.question}</p>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedOption === option
                  ? option === currentQuestion.correctAnswer
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
        {result && (
          <div className="result-container"> 
             <p className={`result ${result.includes("Congratulations") || result.includes("Correct") || result.includes("Review") ? "correct" : "incorrect"}`}>
               {result}
             </p>
             {/* If incorrect, provide a next button to proceed manually or wait for timeout? 
                 Logic above uses timeout 1000ms for correct.
                 For incorrect, we didn't add timeout in render, but user might want to study.
                 Let's add a "Next" button if result is visible and incorrect? 
                 Actually, let's keep it simple with auto-advance for flow, or use button.
                 Code above didn't change 'handleOptionClick' timeout logic for incorrect.
                 Wait, I didn't add timeout for incorrect in 'handleOptionClick' in the edit above? 
                 Let's check code above. Line 58: else { ... } no timeout. 
                 So user is stuck unless they can click something? 
                 Ah, previous code had `disabled={selectedOption !== ""}`. 
                 If I disable buttons, they can't click anything.
                 I need a "Next" button for incorrect answers if I don't auto-advance.
             */}
             {result.includes("Incorrect") && (
                <button 
                  className="next-btn"
                  onClick={handleNextStep}
                  style={{marginTop: "10px", padding: "8px 16px", cursor:"pointer"}}
                >
                  Next Question
                </button>
             )}
          </div>
        )}
        {showCorrect && (
          <div className="correct-answer">
            <p>Correct answer: {currentQuestion.correctAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeningPart1;
