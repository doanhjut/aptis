import { act } from "react";
import { createRoot } from "react-dom/client";
import ListeningTestNew from "./testNew";

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

function mockPart(name) {
  const React = require("react");
  return ({ questions, onComplete }) =>
    React.createElement(
      "section",
      { "data-part": name, "data-count": questions.length },
      React.createElement(
        "button",
        { type: "button", onClick: onComplete },
        `Complete ${name}`,
      ),
    );
}

jest.mock("../part1/part1", () => ({ __esModule: true, default: mockPart("Part 1") }));
jest.mock("../part2/part2", () => ({ __esModule: true, default: mockPart("Part 2") }));
jest.mock("../part3/part3", () => ({ __esModule: true, default: mockPart("Part 3") }));
jest.mock("../part4/part4", () => ({ __esModule: true, default: mockPart("Part 4") }));

test("runs the new test through all four parts with the required sample sizes", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => root.render(<ListeningTestNew />));

  const currentPart = () => container.querySelector("[data-part]");
  const complete = () =>
    act(() => container.querySelector("[data-part] button").click());

  expect(container.textContent).toContain("Part 1 of 4");
  expect(currentPart().dataset.count).toBe("13");

  complete();
  expect(container.textContent).toContain("Part 2 of 4");
  expect(currentPart().dataset.count).toBe("1");

  complete();
  expect(container.textContent).toContain("Part 3 of 4");
  expect(currentPart().dataset.count).toBe("1");

  complete();
  expect(container.textContent).toContain("Part 4 of 4");
  expect(currentPart().dataset.count).toBe("2");

  complete();
  expect(container.textContent).toContain("Bạn đã hoàn thành bài kiểm tra");

  act(() => root.unmount());
  container.remove();
});
