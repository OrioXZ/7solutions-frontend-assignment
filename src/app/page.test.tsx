import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import Home from "./page";

describe("assignment landing page", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders both assignment titles", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Auto Delete Todo List" }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Department Summary" }),
    ).toBeDefined();
  });

  test("renders clickable assignment cards with the correct destinations", () => {
    render(<Home />);

    expect(
      screen
        .getByRole("link", { name: /Auto Delete Todo List/ })
        .getAttribute("href"),
    ).toBe("/auto-delete-todo");
    expect(
      screen
        .getByRole("link", { name: /Department Summary/ })
        .getAttribute("href"),
    ).toBe("/department-summary");
  });
});
