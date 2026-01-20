import { Link } from "react-router-dom";
import "./homeListening.css";

function HomeListening() {
  return (
    <div className="app-container app-container--listening">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <h1 className="game-title">Aptis Listening</h1>
      <p className="game-subtitle">Chọn phần luyện tập bên dưới</p>
      <div className="card-container">
        <Link to="/listening/part1" className="card">
          <h2>Part 1: Chọn đáp án đúng</h2>
          <p>Chọn đáp án đúng để hoàn thành 13 câu.</p>
          <span className="start-button">Bắt đầu Part 1</span>
        </Link>
        <div className="card card--disabled">
          <h2>Part 2: Sắp xếp</h2>
          <p>Sắp xếp các câu thành 1 đoạn văn.</p>
          <span className="start-button start-button--disabled">Bắt đầu Part 2</span>
        </div>
        <Link to="/listening/part3" className="card">
          <h2>Part 3: Chọn câu hỏi</h2>
          <p>Có 2 người nói chuyện. Chọn câu phát biểu đó thuộc về người nào</p>
          <span className="start-button">Bắt đầu Part 3</span>
        </Link>
        <Link to="/listening/part4" className="card">
          <h2>Part 4: Chọn tiêu đề cho đoạn văn</h2>
          <p>Có 2 bài nói. Mỗi bài sẽ có 2 câu trắc nghiệm</p>
          <span className="start-button">Bắt đầu Part 4</span>
        </Link>
        <Link to="/listening/test" className="card card--highlight">
          <h2>Test: Bài kiểm tra</h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <span className="start-button">Bắt đầu Test</span>
        </Link>
      </div>
    </div>
  );
}

export default HomeListening;
