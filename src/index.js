import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Core App Component
import App from "./App";

// Reading Components
import HomeReading from "./Reading/home";
import ReadingPart1 from "./Reading/part1/part1";
import ReadingPart2 from "./Reading/part2/part2";
import ReadingPart3 from "./Reading/part3/part3";
import ReadingPart4 from "./Reading/part4/part4";
import ReadingTest from "./Reading/test/test";

// Listening Components
import HomeListening from "./Listening/homeListening";
import ListeningPart1 from "./Listening/part1/part1";
import ListeningPart3 from "./Listening/part3/part3";
import ListeningPart4 from "./Listening/part4/part4";
import ListeningTest from "./Listening/test/test";

// Speaking Components
import HomeSpeaking from "./Speaking/homeSpeaking";
import SpeakingPart1 from "./Speaking/part1/part1";
import SpeakingPart2 from "./Speaking/part2/part2";
import SpeakingPart3 from "./Speaking/part3/part3";
import SpeakingPart4 from "./Speaking/part4/part4";
import SpeakingTest from "./Speaking/test/test";

// Writing Components
import HomeWriting from "./Writing/homeWriting";
import WritingPart1 from "./Writing/part1/part1";
import WritingPart2 from "./Writing/part2/part2";
import WritingPart3 from "./Writing/part3/part3";
import WritingPart4 from "./Writing/part4/part4";
import WritingTest from "./Writing/test/test";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<App />} />

      {/* Reading Routes */}
      <Route path="/reading" element={<HomeReading />} />
      <Route path="/reading/part1" element={<ReadingPart1 />} />
      <Route path="/reading/part2" element={<ReadingPart2 />} />
      <Route path="/reading/part3" element={<ReadingPart3 />} />
      <Route path="/reading/part4" element={<ReadingPart4 />} />
      <Route path="/reading/test" element={<ReadingTest />} />

      {/* Listening Routes */}
      <Route path="/listening" element={<HomeListening />} />
      <Route path="/listening/part1" element={<ListeningPart1 />} />
      <Route path="/listening/part3" element={<ListeningPart3 />} />
      <Route path="/listening/part4" element={<ListeningPart4 />} />
      <Route path="/listening/test" element={<ListeningTest />} />

      {/* Speaking Routes */}
      <Route path="/speaking" element={<HomeSpeaking />} />
      <Route path="/speaking/part1" element={<SpeakingPart1 />} />
      <Route path="/speaking/part2" element={<SpeakingPart2 />} />
      <Route path="/speaking/part3" element={<SpeakingPart3 />} />
      <Route path="/speaking/part4" element={<SpeakingPart4 />} />
      <Route path="/speaking/test" element={<SpeakingTest />} />

      {/* Writing Routes */}
      <Route path="/writing" element={<HomeWriting />} />
      <Route path="/writing/part1" element={<WritingPart1 />} />
      <Route path="/writing/part2" element={<WritingPart2 />} />
      <Route path="/writing/part3" element={<WritingPart3 />} />
      <Route path="/writing/part4" element={<WritingPart4 />} />
      <Route path="/writing/test" element={<WritingTest />} />
    </Routes>
  </BrowserRouter>
);