import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import AutoDeleteTodo from "./auto-delete-todo";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function renderTodoList() {
  render(<AutoDeleteTodo />);
}

function getColumn(title: string) {
  const heading = screen.getByRole("heading", { name: title });
  const section = heading.closest("section");

  if (!section) {
    throw new Error(`Could not find ${title} column`);
  }

  return within(section);
}

function getColumnItemNames(title: string) {
  return getColumn(title)
    .getAllByRole("button")
    .map((button) => button.textContent);
}

function clickItemInColumn(columnTitle: string, itemName: string) {
  fireEvent.click(getColumn(columnTitle).getByRole("button", { name: itemName }));
}

function advanceTime(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

describe("AutoDeleteTodo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test("initially renders all main list items in the assignment order", () => {
    const expectedOrder = [
      "Apple",
      "Broccoli",
      "Mushroom",
      "Banana",
      "Tomato",
      "Orange",
      "Mango",
      "Pineapple",
      "Cucumber",
      "Watermelon",
      "Carrot",
    ];

    renderTodoList();

    const mainListButtons = getColumn("Main List").getAllByRole("button");
    const renderedItemNames = mainListButtons.map((button) => button.textContent);

    expect(renderedItemNames).toEqual(expectedOrder);
    expect(getColumn("Fruit").queryAllByRole("button")).toHaveLength(0);
    expect(getColumn("Vegetable").queryAllByRole("button")).toHaveLength(0);
  });

  test("clicking Apple moves it from Main List to the Fruit column", () => {
    renderTodoList();

    clickItemInColumn("Main List", "Apple");

    expect(getColumn("Main List").queryByRole("button", { name: "Apple" })).toBeNull();
    expect(getColumnItemNames("Fruit")).toEqual(["Apple"]);
  });

  test("clicking Broccoli moves it from Main List to the Vegetable column", () => {
    renderTodoList();

    clickItemInColumn("Main List", "Broccoli");

    expect(
      getColumn("Main List").queryByRole("button", { name: "Broccoli" }),
    ).toBeNull();
    expect(getColumnItemNames("Vegetable")).toEqual(["Broccoli"]);
  });

  test("automatically returns a moved item to the bottom of Main List after 5 seconds", () => {
    renderTodoList();

    clickItemInColumn("Main List", "Apple");
    advanceTime(4999);

    expect(getColumnItemNames("Fruit")).toEqual(["Apple"]);
    expect(getColumn("Main List").queryByRole("button", { name: "Apple" })).toBeNull();

    advanceTime(1);

    expect(getColumn("Fruit").queryByRole("button", { name: "Apple" })).toBeNull();
    expect(getColumnItemNames("Main List")).toEqual([
      "Broccoli",
      "Mushroom",
      "Banana",
      "Tomato",
      "Orange",
      "Mango",
      "Pineapple",
      "Cucumber",
      "Watermelon",
      "Carrot",
      "Apple",
    ]);
  });

  test("clicking an item in a type column returns it immediately and clears its timer", () => {
    renderTodoList();

    clickItemInColumn("Main List", "Apple");
    clickItemInColumn("Fruit", "Apple");

    expect(getColumn("Fruit").queryByRole("button", { name: "Apple" })).toBeNull();
    expect(getColumnItemNames("Main List")).toEqual([
      "Broccoli",
      "Mushroom",
      "Banana",
      "Tomato",
      "Orange",
      "Mango",
      "Pineapple",
      "Cucumber",
      "Watermelon",
      "Carrot",
      "Apple",
    ]);

    advanceTime(5000);

    expect(
      getColumn("Main List").getAllByRole("button", { name: "Apple" }),
    ).toHaveLength(1);
    expect(getColumnItemNames("Main List").at(-1)).toBe("Apple");
  });

  test("multiple moved items use independent timers", () => {
    renderTodoList();

    clickItemInColumn("Main List", "Apple");
    advanceTime(2000);
    clickItemInColumn("Main List", "Broccoli");
    advanceTime(3000);

    expect(getColumn("Fruit").queryByRole("button", { name: "Apple" })).toBeNull();
    expect(getColumnItemNames("Vegetable")).toEqual(["Broccoli"]);
    expect(getColumnItemNames("Main List").at(-1)).toBe("Apple");

    advanceTime(2000);

    expect(getColumn("Vegetable").queryByRole("button", { name: "Broccoli" })).toBeNull();
    expect(getColumnItemNames("Main List").slice(-2)).toEqual([
      "Apple",
      "Broccoli",
    ]);
  });
});
