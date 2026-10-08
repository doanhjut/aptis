import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import HomeListening, {
  NewListeningHome,
  OldListeningHome,
} from "./homeListening";

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
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const renderWithRouter = (ui) => {
  act(() => root.render(<MemoryRouter>{ui}</MemoryRouter>));
};

const findLink = (text) =>
  [...container.querySelectorAll("a")].find((link) =>
    link.textContent.includes(text),
  );

test("shows the two Listening versions", () => {
  renderWithRouter(<HomeListening />);

  expect(findLink("Bộ cũ").getAttribute("href")).toBe("/listening/old");
  expect(findLink("15 đề mới").getAttribute("href")).toBe("/listening/new");
});

test("keeps the legacy menu routes and disables old Part 2", () => {
  renderWithRouter(<OldListeningHome />);

  expect(findLink("Part 1").getAttribute("href")).toBe("/listening/part1");
  expect(findLink("Part 3:").getAttribute("href")).toBe("/listening/part3");
  expect(findLink("Part 3 ngắn").getAttribute("href")).toBe(
    "/listening/part3-short",
  );
  expect(findLink("Part 4").getAttribute("href")).toBe("/listening/part4");
  expect(findLink("Test: Bài kiểm tra").getAttribute("href")).toBe(
    "/listening/test",
  );
  expect(container.querySelector(".card--disabled").textContent).toContain("Part 2");
});

test("links every new Listening section under the new base path", () => {
  renderWithRouter(<NewListeningHome />);

  [
    ["Part 1", "/listening/new/part1"],
    ["Part 2", "/listening/new/part2"],
    ["Part 3:", "/listening/new/part3"],
    ["Part 3 ngắn", "/listening/new/part3-short"],
    ["Part 4", "/listening/new/part4"],
    ["Test", "/listening/new/test"],
  ].forEach(([name, href]) => {
    expect(findLink(name).getAttribute("href")).toBe(href);
  });
});
