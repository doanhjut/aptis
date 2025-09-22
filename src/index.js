import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ReadingPart1 from "./Reading/part1/part1";
import ReadingPart2 from "./Reading/part2/part2";
import ReadingPart3 from "./Reading/part3/part3";
import ReadingPart4 from "./Reading/part4/part4";
import Test from "./Reading/test/test";
import HomeReading from "./Reading/home";
import HomeListening from "./Listening/homeListening";
import SpeakingPart1 from "./Speaking/part1/part1";
import ListeningPart1 from "./Listening/part1/part1";
import ListeningPart4 from "./Listening/part4/part4";
import ListeningTest from "./Listening/test/test";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/reading" element={<HomeReading />} />
      <Route path="/reading/part1" element={<ReadingPart1 />} />
      <Route path="/reading/part2" element={<ReadingPart2 />} />
      <Route path="/reading/part3" element={<ReadingPart3 />} />
      <Route path="/reading/part4" element={<ReadingPart4 />} />
      <Route path="/reading/test" element={<Test />} />
      <Route path="/listening" element={<HomeListening />} />
      <Route path="/listening/part1" element={<ListeningPart1 />} />
      <Route path="/listening/part4" element={<ListeningPart4 />} />
      <Route path="/listening/test" element={<ListeningTest />} />
      <Route path="/speaking" element={<HomeReading />} />
    </Routes>
  </BrowserRouter>
);
