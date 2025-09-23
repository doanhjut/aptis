import { Link } from "react-router-dom";
import "./homeWriting.css";

function HomeWriting() {
  return (
    <div className="app-container">
      <h1 className="game-title">Aptis Speaking</h1>
      <div className="back-button-container">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className="card-container">
        <Link to="/writing/part1" className="card">
          <h2>Part 1: Thông tin cá nhân</h2>
          <p>Trả lời 5 câu hỏi thông tin cá nhân, mỗi câu 1-5 từ.</p>
          <button className="start-button">Start Part 1</button>
        </Link>
        <Link to="/writing/part2" className="card">
          <h2>Part 2: Viết câu</h2>
          <p>Mỗi câu trả lời yêu cầu viết từ 20 đến 30 từ. </p>
          <button className="start-button">Start Part 2</button>
        </Link>
        <Link to="/writing/part3" className="card">
          <h2>Part 3: Viết phản hồi trên mạng xã hội</h2>
          <p>
            {" "}
            Viết phản hồi cho 3 câu hỏi được đặt ra trên nền tảng mạng xã hội.
            Mỗi câu trả lời yêu cầu độ dài từ 30 đến 40 từ.{" "}
          </p>
          <button className="start-button">Start Part 3</button>
        </Link>
        <Link to="/writing/part4" className="card">
          <h2>
            Part 4: Viết hai email, một email thân mật và một email trang trọng.{" "}
          </h2>
          <p>
            Khoảng 40 đến 50 từ, trả lời email có sẵn hoặc trao đổi thông tin
            với thành viên trong câu lạc bộ.{" "}
          </p>
          <p>
            Khoảng 120 đến 150 từ, viết một email trang trọng cho người không
            quen biết để đưa ra đề nghị.{" "}
          </p>
          <button className="start-button">Start Part 4</button>
        </Link>
        <Link to="/writing/test" className="card">
          <h2>Test: Bài kiểm tra </h2>
          <p>Bài kiểm tra ngẫu nhiên từ 4 part.</p>
          <button className="start-button">Start Test</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeWriting;
