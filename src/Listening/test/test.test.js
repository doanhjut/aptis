import { act } from "react";
import { createRoot } from "react-dom/client";
import ListeningTest from "./test";

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

jest.mock("../part1/part1", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ backPath }) =>
      React.createElement("div", { "data-part-back": backPath }),
  };
});

jest.mock("../part3/part3", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../part4/part4", () => ({
  __esModule: true,
  default: () => null,
}));

test("legacy Listening test links back to the old dataset menu", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => root.render(<ListeningTest />));

  expect(container.querySelector("a.back-button").getAttribute("href")).toBe(
    "/listening/old",
  );
  expect(container.querySelector("[data-part-back]").dataset.partBack).toBe(
    "/listening/old",
  );

  act(() => root.unmount());
  container.remove();
});
