import { Link } from "react-router-dom";
import "./home.css";

function HomeReading() {
  return (
    <div className="app-container app-container--reading">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <h1 className="game-title">Aptis Reading</h1>
      <p className="game-subtitle">Chọn phần luyện tập bên dưới</p>
      <div className="card-container">
        <Link to="/reading/part1" className="card">
          <h2>Part 1: Chọn đáp án đúng</h2>
          <p>Chọn đáp án đúng để hoàn thành câu.</p>
          <span className="start-button">Bắt đầu Part 1</span>
        </Link>
        <Link to="/reading/part2" className="card">
          <h2>Part 2: Sắp xếp</h2>
          <p>Sắp xếp các câu thành 1 đoạn văn.</p>
          <span className="start-button">Bắt đầu Part 2</span>
        </Link>
        <Link to="/reading/part3" className="card">
          <h2>Part 3: Chọn câu hỏi</h2>
          <p>Có 4 người và 7 câu hỏi. Chọn câu hỏi về người nào</p>
          <span className="start-button">Bắt đầu Part 3</span>
        </Link>
        <Link to="/reading/part4" className="card">
          <h2>Part 4: Chọn tiêu đề cho đoạn văn</h2>
          <p>Có 7 đoạn văn và 8 tiêu đề cần chọn tiêu đề cho đoạn văn.</p>
          <span className="start-button">Bắt đầu Part 4</span>
        </Link>
        <Link to="/reading/test" className="card card--highlight">
          <h2>Test: Bài kiểm tra</h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <span className="start-button">Bắt đầu Test</span>
        </Link>
      </div>
    </div>
  );
}

export default HomeReading;
