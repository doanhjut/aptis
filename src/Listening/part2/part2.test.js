import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ListeningPart2 from "./part2";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ children, to, ...props }) =>
        React.createElement("a", { href: to, ...props }, children),
      MemoryRouter: ({ children }) => React.createElement(React.Fragment, null, children),
    };
  },
  { virtual: true },
);

const exercises = [
  {
    name: "First exercise",
    options: ["Alpha", "Bravo", "Charlie", "Delta"],
    speakers: [
      { speaker: "A", transcript: "Speaker A transcript", correctAnswer: "Alpha" },
      { speaker: "B", transcript: "Speaker B transcript", correctAnswer: "Bravo" },
      { speaker: "C", transcript: "Speaker C transcript", correctAnswer: "Charlie" },
      { speaker: "D", transcript: "Speaker D transcript", correctAnswer: "Delta" },
    ],
  },
  {
    name: "Second exercise",
    options: ["One", "Two", "Three", "Four"],
    speakers: [
      { speaker: "A", transcript: "Second A", correctAnswer: "One" },
      { speaker: "B", transcript: "Second B", correctAnswer: "Two" },
      { speaker: "C", transcript: "Second C", correctAnswer: "Three" },
      { speaker: "D", transcript: "Second D", correctAnswer: "Four" },
    ],
  },
];

let container;
let root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

const renderPart2 = (props = {}) => {
  act(() => {
    root.render(
      <MemoryRouter>
        <ListeningPart2 questions={exercises} {...props} />
      </MemoryRouter>,
    );
  });
};

const assign = (speaker, answer) => {
  const select = container.querySelector(`select[data-speaker="${speaker}"]`);
  act(() => {
    select.value = answer;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

const findButton = (text) =>
  [...container.querySelectorAll("button")].find((button) =>
    button.textContent.includes(text),
  );

test("assigns unique options and allows changing an assignment before checking", () => {
  renderPart2();

  assign("A", "Alpha");
  expect(
    container.querySelector('select[data-speaker="B"] option[value="Alpha"]').disabled,
  ).toBe(true);

  assign("A", "Bravo");
  expect(
    container.querySelector('select[data-speaker="B"] option[value="Alpha"]').disabled,
  ).toBe(false);
  expect(
    container.querySelector('select[data-speaker="B"] option[value="Bravo"]').disabled,
  ).toBe(true);
});

test("continues from the next main exercise after leaving wrong-answer review", () => {
  renderPart2();
  assign("A", "Bravo");
  assign("B", "Alpha");
  assign("C", "Charlie");
  assign("D", "Delta");
  act(() => findButton("Kiểm tra đáp án").click());
  act(() => findButton("Ôn câu sai (1)").click());

  act(() => findButton("Tiếp tục bài đang làm").click());

  expect(container.textContent).toContain("Bài 2/2");
  expect(container.textContent).toContain("Second exercise");
  expect(container.textContent).not.toContain("Ôn câu sai:");
});

test("starts reviewing a wrong exercise immediately before the set is finished", () => {
  renderPart2();
  assign("A", "Bravo");
  assign("B", "Alpha");
  assign("C", "Charlie");
  assign("D", "Delta");
  act(() => findButton("Kiểm tra đáp án").click());

  act(() => findButton("Ôn câu sai (1)").click());

  expect(container.textContent).toContain("Ôn câu sai: 1/1");
  expect(container.textContent).toContain("First exercise");
  expect(container.querySelector('select[data-speaker="A"]').value).toBe("");
});

test("checks all speakers and reveals every correct answer after a wrong check", () => {
  renderPart2();
  assign("A", "Bravo");
  assign("B", "Alpha");
  assign("C", "Charlie");
  assign("D", "Delta");

  act(() => findButton("Kiểm tra đáp án").click());

  expect(container.textContent).toContain("Sai rồi");
  expect(container.textContent).toContain("A: Alpha");
  expect(container.textContent).toContain("B: Bravo");
  expect(container.textContent).toContain("C: Charlie");
  expect(container.textContent).toContain("D: Delta");
});

test("advances on a correct answer and completes after the final exercise", () => {
  jest.useFakeTimers();
  const onComplete = jest.fn();
  renderPart2({ onComplete });

  assign("A", "Alpha");
  assign("B", "Bravo");
  assign("C", "Charlie");
  assign("D", "Delta");
  act(() => findButton("Kiểm tra đáp án").click());

  act(() => jest.runOnlyPendingTimers());
  expect(container.textContent).toContain("Second exercise");

  assign("A", "One");
  assign("B", "Two");
  assign("C", "Three");
  assign("D", "Four");
  act(() => findButton("Kiểm tra đáp án").click());

  act(() => jest.runOnlyPendingTimers());
  expect(onComplete).toHaveBeenCalledTimes(1);
});

test("reads each speaker transcript with speech synthesis", () => {
  const speak = jest.fn();
  const cancel = jest.fn();
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: { speak, cancel },
  });
  window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
    this.text = text;
  };

  renderPart2();
  act(() => findButton("Nghe Speaker A").click());

  expect(cancel).toHaveBeenCalled();
  expect(speak).toHaveBeenCalledWith(
    expect.objectContaining({ text: "Speaker A transcript" }),
  );
});
