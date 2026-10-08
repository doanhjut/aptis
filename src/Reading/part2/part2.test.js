import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ReadingPart2 from "./part2";

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

const introQuestion = {
  topic: "Topic: Films",
  intro: "The first film was shown in 1895 in Paris, France.",
  questions: [
    "Old movies were very different from today's movies.",
    "That's because the movies were only in black and white, and sometimes without sound.",
    "Not only did these technological limitations exist, the movies were also low budget.",
    "Due to the lack of money, actors also had few opportunities to earn money through acting.",
    "Now things have changed, actors and filmmakers can earn millions of dollars from film production.",
  ],
};

const noIntroQuestion = {
  topic: "Topic: College Welcome Day",
  questions: [
    "It starts at 10am, there is a small presentation in the main hall.",
    "At the end of the talk, you will meet the head of department and teachers.",
    "These staff members give you a guided tour of the building.",
    "You have to stay with other students until lunch break.",
    "This meal is on the 2nd floor of the building.",
  ],
};

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

const renderPart2 = (questions) => {
  act(() => {
    root.render(
      <MemoryRouter>
        <ReadingPart2 questions={questions} />
      </MemoryRouter>,
    );
  });
};

test("shows the opening sentence as a locked first line above the five sortable slots", () => {
  renderPart2([introQuestion]);

  const introSlot = container.querySelector(".input-slot--intro");
  expect(introSlot.textContent).toContain("Câu mở đầu");
  expect(introSlot.textContent).toContain(introQuestion.intro);
  expect(
    [...container.querySelectorAll(".word-item")].map((el) => el.textContent),
  ).not.toContain(introQuestion.intro);
  expect(
    container.querySelectorAll(".input-slot:not(.input-slot--intro)"),
  ).toHaveLength(5);
});

test("does not render an intro placeholder when the topic has none", () => {
  renderPart2([noIntroQuestion]);

  expect(container.querySelector(".input-slot--intro")).toBeNull();
  expect(container.querySelectorAll(".input-slot")).toHaveLength(5);
});
