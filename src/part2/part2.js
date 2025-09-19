import { useState, useEffect } from 'react';
import './part2.css';

const sentences = [
  ["When", "He soon", "He almost", "The", "This"],
  ["When", "A", "Inside", "If you", "After"],
  ["When", "This ticket", "Please", "Before", "The machine"],
  ["When", "Next", "Through", "When", "Outside"],
  ["When", "A member", "He or she will", "You can", "You will"],
  ["When", "You", "Inside", "Before", "These"],
  ["When", "He", "While", "After", "Since"],
  ["When", "Take", "Show", "He", "Once"],
  ["They", "This", "As a", "Fortunately", "Therefore"],
  ["They", "He", "Jay", "At one", "It was"],
  ["The first", "The next", "Then", "You", "In"],
  ["The first", "In order", "The", "Other", "Such"],
  ["First", "When", "Next", "Bring", "The staff"],
  ["First", "When", "A light", "If the", "Before"],
  ["As", "His", "She", "These", "Princeton"],
  ["You should", "In", "You must follow", "When", "You must return"],
  ["In", "When", "Simply", "Once", "After"],
  ["On", "Runners", "To do", "A member", "Please"],
  ["Before", "Remember", "You should", "When", "After"],
  ["She", "At", "After", "However", "In the 1980s"],
  ["To", "If", "He or she will ask", "You", "He or she will make"],
  ["Go", "Choose", "Enter", "When", "When"],
  ["All", "An", "This", "When", "With"],
  ["The most", "The entrance", "When", "The ticket", "As well"]
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Part2() {
  const [sentenceIndices, setSentenceIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [inputValues, setInputValues] = useState(['', '', '', '', '']);
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    // Tạo mảng chỉ số ngẫu nhiên khi component mount
    const indices = shuffleArray(Array.from({ length: sentences.length }, (_, i) => i));
    setSentenceIndices(indices);
    setWords(shuffleArray(sentences[indices[0]]));
  }, []);

  const handleWordClick = (word) => {
    const firstEmptyIndex = inputValues.indexOf('');
    if (firstEmptyIndex !== -1) {
      const newInputValues = [...inputValues];
      newInputValues[firstEmptyIndex] = word;
      setInputValues(newInputValues);

      // Loại bỏ từ đã chọn khỏi danh sách gợi ý
      setWords(words.filter((w) => w !== word));
    }
  };

  const handleInputClick = (index) => {
    const newInputValues = [...inputValues];
    const removedWord = newInputValues[index];
    newInputValues[index] = '';
    for (let i = index + 1; i < newInputValues.length; i++) {
      newInputValues[i - 1] = newInputValues[i];
      newInputValues[i] = '';
    }
    setInputValues(newInputValues);

    // Thêm lại từ đã xóa vào danh sách gợi ý
    if (removedWord) {
      setWords([...words, removedWord]);
    }
  };

  const checkAnswer = () => {
    const userAnswer = inputValues.map((val) => val.trim()).filter(Boolean);
    const correctAnswer = sentences[sentenceIndices[currentIndex]].slice(0, 5);
    const isCorrect = userAnswer.every((word, index) => word === correctAnswer[index]);
    setResult(isCorrect ? 'Correct!' : 'Incorrect, try again or show correct answer.');
    if (isCorrect) {
      setTimeout(() => {
        if (currentIndex < sentenceIndices.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setWords(shuffleArray(sentences[sentenceIndices[currentIndex + 1]]));
          setInputValues(['', '', '', '', '']);
          setResult(null);
          setShowCorrect(false);
        } else {
          const newIndices = shuffleArray(Array.from({ length: sentences.length }, (_, i) => i));
          setSentenceIndices(newIndices);
          setCurrentIndex(0);
          setWords(shuffleArray(sentences[newIndices[0]]));
          setInputValues(['', '', '', '', '']);
          setResult('New round started!');
          setShowCorrect(false);
        }
      }, 1000);
    } else {
      setShowCorrect(true);
    }
  };

  const resetSentence = () => {
    setWords(shuffleArray(sentences[sentenceIndices[currentIndex]]));
    setInputValues(['', '', '', '', '']);
    setResult(null);
    setShowCorrect(false);
  };

  return (
    <div className="app-container">
      <h1 className="game-title">Word Order Game</h1>
      <p className="sentence-info">Sentence {currentIndex + 1} of {sentences.length}</p>
      <div className="word-section">
        <div className="word-list">
          {words.slice(0, 5).map((word) => (
            <span key={word} className="word-item" onClick={() => handleWordClick(word)}>
              {word}
            </span>
          ))}
        </div>
        <div className="input-grid">
          {inputValues.map((value, index) => (
            <span
              key={index}
              className="input-field"
              onClick={() => handleInputClick(index)}
            >
              {value || ' '}
            </span>
          ))}
        </div>
      </div>
      {result && (
        <div className={`result ${result.includes('Correct') ? 'correct' : 'incorrect'}`}>
          {result}
        </div>
      )}
      {showCorrect && (
        <div className="correct-answer">
          <p>Correct answer: {sentences[sentenceIndices[currentIndex]].slice(0, 5).join(' - ')}</p>
        </div>
      )}
      <div className="button-container">
        <button onClick={checkAnswer} className="check-button">Check Answer</button>
        <button onClick={resetSentence} className="try-again-button">Try Again</button>
      </div>
    </div>
  );
}

export default Part2;