import { Link } from "react-router-dom";
import "./homeSpeaking.css";

function HomeSpeaking() {
  return (
    <div className="app-container">
      <h1 className="game-title">Aptis Speaking</h1>
      <div className="back-button-container">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className="card-container">
        <Link to="/speaking/part1" className="card">
          <h2>Part 1: Thông tin cá nhân</h2>
          <p>Trả lời 3 câu hỏi thông tin cá nhân, mỗi câu trong vòng 30s.</p>
          <button className="start-button">Start Part 1</button>
        </Link>
        <Link to="/speaking/part2" className="card">
          <h2>Part 2: Miêu tả tranh</h2>
          <p>Mô tả 1 bức tranh và trả lời 2 câu hỏi liên quan.</p>
          <button className="start-button">Start Part 2</button>
        </Link>
        <Link to="/speaking/part3" className="card">
          <h2>Part 3: So sánh 2 bức tranh</h2>
          <p>So sánh 2 bức tranh và trả lời 2 câu hỏi liên quan.</p>
          <button className="start-button">Start Part 3</button>
        </Link>
        <Link to="/speaking/part4" className="card">
          <h2>Part 4: Thảo luận kinh nghiệm, quan điểm</h2>
          <p>Trả lời câu hỏi về các chủ đề trừu tượng.</p>
          <button className="start-button">Start Part 4</button>
        </Link>
        <Link to="/speaking/test" className="card">
          <h2>Test: Bài kiểm tra </h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <button className="start-button">Start Test</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeSpeaking;
