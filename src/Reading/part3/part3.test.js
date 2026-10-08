import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ReadingPart3 from "./part3";
import { data } from "../data";

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

let container;
let root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  jest.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  Math.random.mockRestore();
  act(() => root.unmount());
  container.remove();
});

const renderPart3 = () => {
  act(() => {
    root.render(
      <MemoryRouter>
        <ReadingPart3 />
      </MemoryRouter>,
    );
  });
};

test("lets the learner switch to the short Part 3 set without dropping the full set", () => {
  renderPart3();

  const select = container.querySelector("#data-select");
  expect(select.value).toBe("part3");
  expect(
    [...select.options].map((option) => option.value),
  ).toEqual(["part3", "part3shorten"]);

  const fullTexts = data.part3.flatMap((topic) =>
    topic.subQuestions.map((sub) => sub.text),
  );
  const shortTexts = data.part3shorten.flatMap((topic) =>
    topic.subQuestions.map((sub) => sub.text),
  );
  expect(fullTexts.some((text) => container.textContent.includes(text))).toBe(
    true,
  );

  act(() => {
    select.value = "part3shorten";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });

  expect(shortTexts.some((text) => container.textContent.includes(text))).toBe(
    true,
  );
  expect(fullTexts.some((text) => container.textContent.includes(text))).toBe(
    false,
  );
  expect(container.querySelectorAll(".word-item")).toHaveLength(7);
});
