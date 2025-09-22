import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="game-title">Word Order Game</h1>
      <div className="card-container">
        <Link to="/reading" className="card">
          <h2>Reading</h2>
          <p>Bài tập phần đọc.</p>
          <button className="start-button">Start Reading</button>
        </Link>
        <Link to="/listening" className="card">
          <h2>Listening</h2>
          <p>Bài nghe từ 12 đề của cô.</p>
          <button className="start-button">Listening </button>
        </Link>
        <Link to="/speaking" className="card">
          <h2>Speaking</h2>
          <p>Bài nói, ngẫu nhiên các phần nói</p>
          <button className="start-button">Start Speaking</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
