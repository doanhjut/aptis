import { Link } from "react-router-dom";
import "./App.css";

const IconSpeaking = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const IconReading = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
  </svg>
);

const IconListening = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const IconWriting = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

function App() {
  return (
    <div className="app-container app-container--home">
      <div className="home-bg" aria-hidden="true" />
      <header className="home-header">
        <p className="home-badge">Luyện thi chứng chỉ</p>
        <h1 className="game-title">Aptis</h1>
        <p className="game-tagline">
          Làm chủ 4 kỹ năng: Nói, Đọc, Nghe, Viết
        </p>
      </header>

      <div className="card-container card-container--skills">
        <Link to="/speaking" className="card card--speaking">
          <span className="card-icon" aria-hidden>
            <IconSpeaking />
          </span>
          <h2>Speaking</h2>
          <p>Bài nói, ngẫu nhiên các phần nói</p>
          <span className="start-button">Bắt đầu</span>
        </Link>

        <Link to="/reading" className="card card--reading">
          <span className="card-icon" aria-hidden>
            <IconReading />
          </span>
          <h2>Reading</h2>
          <p>Bài tập phần đọc</p>
          <span className="start-button">Bắt đầu</span>
        </Link>

        <Link to="/listening" className="card card--listening">
          <span className="card-icon" aria-hidden>
            <IconListening />
          </span>
          <h2>Listening</h2>
          <p>Bài nghe từ 12 đề của cô</p>
          <span className="start-button">Bắt đầu</span>
        </Link>

        <Link to="/writing" className="card card--writing">
          <span className="card-icon" aria-hidden>
            <IconWriting />
          </span>
          <h2>Writing</h2>
          <p>Bài viết</p>
          <span className="start-button">Bắt đầu</span>
        </Link>
      </div>

      <footer className="home-footer">
        <span className="home-footer-text">Aptis Testing</span>
      </footer>
    </div>
  );
}

export default App;
