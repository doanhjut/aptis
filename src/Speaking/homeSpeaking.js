import { Link } from "react-router-dom";
import "./homeSpeaking.css";

function HomeSpeaking() {
  return (
    <div className="app-container">
      <h1 className="game-title">Word Order Game</h1>
      <div className="card-container">
        <Link to="/speaking/part1" className="card">
          <h2>Part 1: Chọn đáp án đúng</h2>
          <p>Chọn đáp án đúng để hoàn thành 13 câu.</p>
          <button className="start-button">Start Part 1</button>
        </Link>
        <Link to="/speaking/part2" className="card">
          <h2>Part 2: Sắp xếp</h2>
          <p>Sắp xếp các câu thành 1 đoạn văn.</p>
          <button className="start-button" >Start Part 2</button>
        </Link>
        <Link to="/speaking/part3" className="card"> 
          <h2>Part 3: Chọn câu hỏi</h2>
          <p>Có 4 người và 7 câu hỏi. Chọn câu hỏi về người nào</p>
          <button className="start-button">Start Part 3</button>
        </Link>
        <Link to="/speaking/part4" className="card">
          <h2>Part 4: Chọn tiêu đề cho đoạn văn</h2>
          <p>Có 7 đoạn văn và 8 tiêu đề cần chọn tiêu đề cho đoạn văn.</p>
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
