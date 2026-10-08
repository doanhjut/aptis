import { act } from "react";
import { createRoot } from "react-dom/client";
import { newListeningData } from "./dataNew";
import Part3 from "./part3/part3";
import { shortPart3Questions } from "./shortPart3";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ children, to, ...props }) =>
        React.createElement("a", { href: to, ...props }, children),
    };
  },
  { virtual: true },
);

test("keeps every statement and moves its answer with it", () => {
  const source = [
    {
      main: "Topic",
      dialogue: "A dialogue",
      options: "1/2/B",
      subQuestions: [
        { text: "Only the woman", expectedAnswers: 1 },
        { text: "Both speakers", expectedAnswers: 1 },
        { text: "Only the man", expectedAnswers: 1 },
        { text: "The woman again", expectedAnswers: 1 },
      ],
      answers: [["1"], ["B"], ["2"], ["1"]],
    },
  ];

  const [question] = shortPart3Questions(source);

  expect(question.subQuestions).toHaveLength(4);
  question.subQuestions.forEach((subQuestion, index) => {
    const sourceIndex = source[0].subQuestions.findIndex(
      (item) => item.text === subQuestion.text,
    );
    expect(question.answers[index]).toEqual(source[0].answers[sourceIndex]);
  });
  expect(source[0].answers.map((answer) => answer[0])).toEqual(["1", "B", "2", "1"]);
});

test("short Part 3 from the new set keeps four mixed answer types", () => {
  const shortQuestions = shortPart3Questions(newListeningData.part3);

  expect(shortQuestions).toHaveLength(newListeningData.part3.length);
  shortQuestions.forEach((item) => {
    expect(item.subQuestions).toHaveLength(4);
    const types = item.answers.map((answer) => answer[0]);
    expect(types).toContain("B");
    expect(new Set(types).size).toBeGreaterThan(1);
  });
});

test("short Part 3 submits the B statements, shows a correction, then advances", () => {
  jest.spyOn(Math, "random").mockReturnValue(0.5);
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const question = (main) => ({
    main,
    dialogue: `${main} dialogue`,
    options: "1/2/B",
    subQuestions: [
      { text: `${main} woman`, expectedAnswers: 1 },
      { text: `${main} both`, expectedAnswers: 1 },
      { text: `${main} man`, expectedAnswers: 1 },
      { text: `${main} again`, expectedAnswers: 1 },
    ],
    answers: [["1"], ["B"], ["2"], ["1"]],
  });
  const clickStatement = (text) => {
    act(() =>
      [...container.querySelectorAll("button.both-choice")]
        .find((button) => button.textContent.includes(text))
        .click(),
    );
  };
  const submit = () => {
    act(() =>
      [...container.querySelectorAll("button")]
        .find((button) => button.textContent.includes("Nộp bài"))
        .click(),
    );
  };

  act(() =>
    root.render(
      <Part3
        mode="short"
        questions={[question("First"), question("Second")]}
      />,
    ),
  );

  expect(container.querySelectorAll("button.both-choice")).toHaveLength(4);
  expect(container.querySelector(".word-item")).toBeNull();

  clickStatement("First woman");
  submit();
  expect(container.textContent).toContain("Không phải B. Hãy bỏ chọn.");
  expect(container.textContent).toContain("Đáp án B. Hãy chọn câu này.");
  expect(container.textContent).toContain("First");

  clickStatement("First woman");
  clickStatement("First both");
  submit();
  expect(container.textContent).toContain("Đúng rồi!");

  act(() => {
    jest.advanceTimersByTime(1500);
  });
  expect(container.textContent).toContain("Second");

  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
  Math.random.mockRestore();
});
