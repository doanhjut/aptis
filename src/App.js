import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="game-title">Word Order Game</h1>
      <div className="card-container">
        <Link to="/part2" className="card">
          <h2>Part 2: Drag and Drop Game</h2>
          <p>Practice arranging words with drag and drop.</p>
          <button className="start-button">Start Part 2</button>
        </Link>
        <Link to="/part3" className="card">
          <h2>Part 3: Multiple Choice Game</h2>
          <p>Practice selecting correct phrases for sentences.</p>
          <button className="start-button">Start Part 3</button>
        </Link>
      </div>
    </div>
  );
}

export default App;