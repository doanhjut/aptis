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
      <p className="game-subtitle">Chọn bộ đề bạn muốn luyện tập</p>
      <div className="card-container">
        <Link to="/listening/old" className="card">
          <h2>Bộ cũ</h2>
          <p>Tiếp tục luyện tập với bộ câu hỏi Listening hiện có.</p>
          <span className="start-button">Mở Bộ cũ</span>
        </Link>
        <Link to="/listening/new" className="card card--highlight">
          <h2>15 đề mới</h2>
          <p>Luyện tập đầy đủ 4 part với bộ 15 đề Listening mới.</p>
          <span className="start-button">Mở 15 đề mới</span>
        </Link>
      </div>
    </div>
  );
}

function ListeningSectionMenu({ isNew = false }) {
  const basePath = isNew ? "/listening/new" : "/listening";

  return (
    <div className="app-container app-container--listening">
      <div className="back-button-container">
        <Link to="/listening" className="back-button">
          ← Chọn bộ đề
        </Link>
      </div>
      <h1 className="game-title">
        Aptis Listening {isNew ? "- 15 đề mới" : "- Bộ cũ"}
      </h1>
      <p className="game-subtitle">Chọn phần luyện tập bên dưới</p>
      <div className="card-container">
        <Link to={`${basePath}/part1`} className="card">
          <h2>Part 1: Chọn đáp án đúng</h2>
          <p>Chọn đáp án đúng để hoàn thành các câu hỏi.</p>
          <span className="start-button">Bắt đầu Part 1</span>
        </Link>

        {isNew ? (
          <Link to={`${basePath}/part2`} className="card">
            <h2>Part 2: Ghép người nói</h2>
            <p>Ghép bốn người nói với bốn lựa chọn phù hợp.</p>
            <span className="start-button">Bắt đầu Part 2</span>
          </Link>
        ) : (
          <div className="card card--disabled">
            <h2>Part 2: Sắp xếp</h2>
            <p>Sắp xếp các câu thành 1 đoạn văn.</p>
            <span className="start-button start-button--disabled">
              Bắt đầu Part 2
            </span>
          </div>
        )}

        <Link to={`${basePath}/part3`} className="card">
          <h2>Part 3: Chọn câu hỏi</h2>
          <p>Có 2 người nói chuyện. Chọn câu phát biểu đó thuộc về người nào.</p>
          <span className="start-button">Bắt đầu Part 3</span>
        </Link>
        <Link to={`${basePath}/part3-short`} className="card">
          <h2>Part 3 ngắn: Chọn đáp án B</h2>
          <p>Trong 4 câu, chọn những câu có đáp án B rồi nộp bài.</p>
          <span className="start-button">Bắt đầu Part 3 ngắn</span>
        </Link>
        <Link to={`${basePath}/part4`} className="card">
          <h2>Part 4: Chọn tiêu đề cho đoạn văn</h2>
          <p>Có 2 bài nói. Mỗi bài sẽ có 2 câu trắc nghiệm.</p>
          <span className="start-button">Bắt đầu Part 4</span>
        </Link>
        <Link to={`${basePath}/test`} className="card card--highlight">
          <h2>Test: Bài kiểm tra</h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <span className="start-button">Bắt đầu Test</span>
        </Link>
      </div>
    </div>
  );
}

export function OldListeningHome() {
  return <ListeningSectionMenu />;
}

export function NewListeningHome() {
  return <ListeningSectionMenu isNew />;
}

export default HomeListening;
