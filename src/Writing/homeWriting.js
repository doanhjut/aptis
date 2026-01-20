import { Link } from "react-router-dom";
import "./homeWriting.css";

function HomeWriting() {
  return (
    <div className="app-container app-container--writing">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          ← Trang chủ
        </Link>
      </div>
      <h1 className="game-title">Aptis Writing</h1>
      <p className="game-subtitle">Chọn phần luyện tập bên dưới</p>
      <div className="card-container">
        <Link to="/writing/part1" className="card">
          <h2>Part 1: Thông tin cá nhân</h2>
          <p>Trả lời 5 câu hỏi thông tin cá nhân, mỗi câu 1–5 từ.</p>
          <span className="start-button">Bắt đầu Part 1</span>
        </Link>
        <Link to="/writing/part2" className="card">
          <h2>Part 2: Viết câu</h2>
          <p>Mỗi câu trả lời yêu cầu viết từ 20 đến 30 từ.</p>
          <span className="start-button">Bắt đầu Part 2</span>
        </Link>
        <Link to="/writing/part3" className="card">
          <h2>Part 3: Viết phản hồi trên mạng xã hội</h2>
          <p>Viết phản hồi cho 3 câu hỏi được đặt ra trên nền tảng mạng xã hội. Mỗi câu trả lời từ 30 đến 40 từ.</p>
          <span className="start-button">Bắt đầu Part 3</span>
        </Link>
        <Link to="/writing/part4" className="card">
          <h2>Part 4: Viết hai email (thân mật & trang trọng)</h2>
          <p>Email thân mật: 40–50 từ. Email trang trọng: 120–150 từ cho người không quen để đưa ra đề nghị.</p>
          <span className="start-button">Bắt đầu Part 4</span>
        </Link>
        <Link to="/writing/test" className="card card--highlight">
          <h2>Test: Bài kiểm tra</h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <span className="start-button">Bắt đầu Test</span>
        </Link>
      </div>
    </div>
  );
}

export default HomeWriting;
