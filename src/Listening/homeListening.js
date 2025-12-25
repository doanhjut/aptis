import { Link } from "react-router-dom";
import "./homeListening.css";

function HomeListening() {
  return (
    <div className="app-container">
      <h1 className="game-title">Aptis Listening</h1>
      <div className="back-button-container">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className="card-container">
        <Link to="/listening/part1" className="card">
          <h2>Part 1: Chọn đáp án đúng</h2>
          <p>Chọn đáp án đúng để hoàn thành 13 câu.</p>
          <button className="start-button">Start Part 1</button>
        </Link>
        <Link to="/listening/part2" className="card" style={{ background: '#b3b3b3', opacity: '0.5' }}>
          <h2>Part 2: Sắp xếp</h2>
          <p>Sắp xếp các câu thành 1 đoạn văn.</p>
          <button className="start-button" disabled={true}>Start Part 2</button>
        </Link>
        <Link to="/listening/part3" className="card">
          <h2>Part 3: Chọn câu hỏi</h2>
          <p>Có 2 người nói chuyện. Chọn câu phát biểu đó thuộc về người nào</p>
          <button className="start-button" >Start Part 3</button>
        </Link>
        <Link to="/listening/part4" className="card">
          <h2>Part 4: Chọn tiêu đề cho đoạn văn</h2>
          <p>Có 2 bài nói. Mỗi bài sẽ có 2 câu trắc ngiệm</p>
          <button className="start-button">Start Part 4</button>
        </Link>
        <Link to="/listening/test" className="card">
          <h2>Test: Bài kiểm tra</h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <button className="start-button">Start Test</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeListening;