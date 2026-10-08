import { act } from "react";
import { createRoot } from "react-dom/client";
import { newListeningData } from "./dataNew";
import Part1 from "./part1/part1";
import Part3 from "./part3/part3";
import Part4 from "./part4/part4";

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
});

const render = (component) => act(() => root.render(component));

afterEach(() => {
  jest.useRealTimers();
});

test("Part 1 reviews a wrong answer and continues with the next question", () => {
  jest.spyOn(Math, "random").mockReturnValue(0.5);
  render(
    <Part1
      questions={[
        {
          question: "First question",
          options: ["Right", "Wrong"],
          correctAnswer: "Right",
        },
        {
          question: "Second question",
          options: ["Correct", "Incorrect"],
          correctAnswer: "Correct",
        },
      ]}
    />,
  );

  act(() =>
    [...container.querySelectorAll(".option-btn")]
      .find((button) => button.textContent.includes("Wrong"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Ôn câu sai (1)"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Tiếp tục bài đang làm"))
      .click(),
  );

  expect(container.textContent).toContain("Second question");
  expect(container.textContent).toContain("2/2");
  Math.random.mockRestore();
});

test("Part 3 reviews a wrong answer and continues with the next question", () => {
  jest.spyOn(Math, "random").mockReturnValue(0.5);
  const question = (main, answer) => ({
    main,
    dialogue: `${main} dialogue`,
    options: "1/2/B",
    subQuestions: ["One", "Two", "Three", "Four"].map((text) => ({
      text,
      expectedAnswers: 1,
    })),
    answers: [[answer], [answer], [answer], [answer]],
  });
  render(
    <Part3 questions={[question("First topic", "1"), question("Second topic", "2")]} />,
  );

  for (let index = 0; index < 4; index += 1) {
    act(() =>
      [...container.querySelectorAll(".word-item")]
        .find((option) => option.textContent === "2")
        .click(),
    );
  }
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Kiểm tra đáp án"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Ôn câu sai (1)"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Tiếp tục bài đang làm"))
      .click(),
  );

  expect(container.textContent).toContain("Second topic");
  expect(container.textContent).toContain("Câu hỏi 2 / 2");
  Math.random.mockRestore();
});

test("Part 1 shows a custom back link while using supplied questions", () => {
  render(
    <Part1
      backPath="/listening/new"
      questions={[
        {
          question: "New Part 1 question",
          options: ["First", "Second", "Third"],
          correctAnswer: "First",
        },
      ]}
    />,
  );

  expect(container.textContent).toContain("New Part 1 question");
  expect(container.querySelector("a.back-button").getAttribute("href")).toBe(
    "/listening/new",
  );
});

test("Part 3 shows a custom back link while using supplied questions", () => {
  render(
    <Part3
      backPath="/listening/new"
      questions={[
        {
          main: "New Part 3 topic",
          dialogue: "A dialogue",
          options: "1/2/B",
          subQuestions: ["One", "Two", "Three", "Four"].map((text) => ({
            text,
            expectedAnswers: 1,
          })),
          answers: [["1"], ["2"], ["B"], ["1"]],
        },
      ]}
    />,
  );

  expect(container.textContent).toContain("New Part 3 topic");
  expect(container.querySelector("a.back-button").getAttribute("href")).toBe(
    "/listening/new",
  );
});

test("Part 4 keeps the original options and prompt of each source question", () => {
  const topic = newListeningData.part4.find(
    (item) => item.testNumber === 10 && item.questionNumber === 16,
  );

  render(<Part4 questions={[topic]} />);

  const displayed = [...container.querySelectorAll(".option-btn")].map((button) =>
    button.textContent.replace(/^[A-C]\.\s*/, ""),
  );
  const sourceGroups = [topic.subQuestions.slice(0, 3), topic.subQuestions.slice(3, 6)];
  const matchingGroup = sourceGroups.find((group) =>
    displayed.every((text) => group.some((option) => option.text === text)),
  );

  expect([...displayed].sort()).toEqual(
    topic.subQuestions
      .slice(0, 3)
      .map((option) => option.text)
      .sort(),
  );
  expect(container.textContent).toContain(
    "How does the speaker recommend saving money effectively?",
  );
  expect(matchingGroup).toBe(sourceGroups[0]);
});

test("Part 4 uses supplied questions and its custom back path", () => {
  render(
    <Part4
      backPath="/listening/new"
      questions={[
        {
          name: "New Part 4 topic",
          subQuestions: [
            { text: "Correct one", answer: true },
            { text: "Correct two", answer: true },
            { text: "Wrong one", answer: false },
            { text: "Wrong two", answer: false },
            { text: "Wrong three", answer: false },
            { text: "Wrong four", answer: false },
          ],
        },
      ]}
    />,
  );

  expect(container.textContent).toContain("New Part 4 topic");
  expect(container.querySelector("a.back-button").getAttribute("href")).toBe(
    "/listening/new",
  );
});

test("Part 4 can review a wrong answer before the remaining questions are finished", () => {
  jest.useFakeTimers();
  jest.spyOn(Math, "random").mockReturnValue(0.9);
  render(
    <Part4
      questions={[
        {
          name: "First topic",
          subQuestions: [
            { text: "First correct", answer: true },
            { text: "Second correct", answer: true },
            { text: "Wrong one", answer: false },
            { text: "Wrong two", answer: false },
            { text: "Wrong three", answer: false },
            { text: "Wrong four", answer: false },
          ],
        },
        {
          name: "Second topic",
          subQuestions: [
            { text: "Later correct one", answer: true },
            { text: "Later correct two", answer: true },
            { text: "Later wrong one", answer: false },
            { text: "Later wrong two", answer: false },
            { text: "Later wrong three", answer: false },
            { text: "Later wrong four", answer: false },
          ],
        },
      ]}
    />,
  );

  const wrongButton = [...container.querySelectorAll(".option-btn")].find(
    (button) => button.textContent.includes("Wrong"),
  );
  act(() => wrongButton.click());

  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Ôn câu sai (1)"))
      .click(),
  );

  expect(container.textContent).toContain("Ôn lại câu sai: 1 / 1");
  expect(container.textContent).toContain("First topic");
  expect(container.textContent).not.toContain("Second topic");

  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Tiếp tục bài đang làm"))
      .click(),
  );

  expect(container.textContent).toContain("Topic 1/2 - Question 2/2");
  expect(container.textContent).toContain("First topic");
  expect(container.textContent).not.toContain("Ôn lại câu sai");
  Math.random.mockRestore();
});

test("Part 4 resumes at the next topic after reviewing from the second question", () => {
  jest.useFakeTimers();
  jest.spyOn(Math, "random").mockReturnValue(0.9);
  const onComplete = jest.fn();
  render(
    <Part4
      onComplete={onComplete}
      questions={[
        {
          name: "First topic",
          subQuestions: [
            { text: "First correct", answer: true },
            { text: "Second correct", answer: true },
            { text: "Wrong one", answer: false },
            { text: "Wrong two", answer: false },
            { text: "Wrong three", answer: false },
            { text: "Wrong four", answer: false },
          ],
        },
        {
          name: "Second topic",
          subQuestions: [
            { text: "Later correct one", answer: true },
            { text: "Later correct two", answer: true },
            { text: "Later wrong one", answer: false },
            { text: "Later wrong two", answer: false },
            { text: "Later wrong three", answer: false },
            { text: "Later wrong four", answer: false },
          ],
        },
      ]}
    />,
  );

  act(() =>
    [...container.querySelectorAll(".option-btn")]
      .find((button) => button.textContent.includes("First correct"))
      .click(),
  );
  act(() => jest.runOnlyPendingTimers());
  act(() =>
    [...container.querySelectorAll(".option-btn")]
      .find((button) => button.textContent.includes("Wrong"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Ôn câu sai (1)"))
      .click(),
  );
  act(() =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent.includes("Tiếp tục bài đang làm"))
      .click(),
  );

  expect(container.textContent).toContain("Topic 2/2");
  expect(container.textContent).toContain("Second topic");
  expect(onComplete).not.toHaveBeenCalled();
  Math.random.mockRestore();
});

test("Part 4 refreshes when its supplied questions change", () => {
  const makeTopic = (name) => ({
    name,
    subQuestions: [
      { text: `${name} correct one`, answer: true },
      { text: `${name} correct two`, answer: true },
      { text: `${name} wrong one`, answer: false },
      { text: `${name} wrong two`, answer: false },
      { text: `${name} wrong three`, answer: false },
      { text: `${name} wrong four`, answer: false },
    ],
  });

  render(<Part4 questions={[makeTopic("First supplied topic")]} />);
  expect(container.textContent).toContain("First supplied topic");

  render(<Part4 questions={[makeTopic("Replacement supplied topic")]} />);
  expect(container.textContent).toContain("Replacement supplied topic");
  expect(container.textContent).not.toContain("First supplied topic");
});
