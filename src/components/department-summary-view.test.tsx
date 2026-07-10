import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import DepartmentSummaryView from "./department-summary-view";
import type { DepartmentSummaryMap } from "@/types/dummy-user";

const summaryData: DepartmentSummaryMap = {
  Sales: {
    male: 2,
    female: 1,
    ageRange: "25-52",
    hair: {
      Blond: 1,
    },
    addressUser: {
      DiegoLopez: "40404",
    },
  },
  Engineering: {
    male: 1,
    female: 2,
    ageRange: "28-43",
    hair: {
      Black: 2,
      Brown: 1,
    },
    addressUser: {
      AliceStone: "10101",
      BobRay: "20202",
    },
  },
};

function mockFetchSuccess(data: DepartmentSummaryMap) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json(data));
}

function getDepartmentRow(department: string) {
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row");
  const row = rows.find((currentRow) =>
    within(currentRow).queryByRole("rowheader", { name: department }),
  );

  if (!row) {
    throw new Error(`Could not find ${department} row`);
  }

  return row;
}

function getDepartmentNamesFromTable() {
  const table = screen.getByRole("table");

  return within(table)
    .getAllByRole("rowheader")
    .map((header) => header.textContent);
}

describe("DepartmentSummaryView", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("shows a loading state before the request resolves", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise<Response>(() => {}));

    render(<DepartmentSummaryView />);

    expect(screen.getByText("Loading department summary...")).toBeDefined();
  });

  test("renders department rows and calculated summary values after success", async () => {
    mockFetchSuccess(summaryData);

    render(<DepartmentSummaryView />);

    const engineeringRow = getDepartmentRow(
      await screen.findByRole("rowheader", { name: "Engineering" }).then(
        (header) => header.textContent ?? "",
      ),
    );
    const engineeringCells = within(engineeringRow).getAllByRole("cell");

    expect(engineeringCells.map((cell) => cell.textContent)).toEqual([
      "1",
      "2",
      "3",
      "28-43",
      "2",
      "2",
    ]);
  });

  test("sorts departments alphabetically", async () => {
    mockFetchSuccess(summaryData);

    render(<DepartmentSummaryView />);

    await screen.findByRole("rowheader", { name: "Engineering" });

    expect(getDepartmentNamesFromTable()).toEqual(["Engineering", "Sales"]);
  });

  test("renders hair colors and address users inside department details", async () => {
    mockFetchSuccess(summaryData);

    render(<DepartmentSummaryView />);

    const engineeringDetails = await screen.findByRole("group", {
      name: "Engineering details",
    });
    const details = within(engineeringDetails);

    expect(details.getByRole("heading", { name: "Hair Colors" })).toBeDefined();
    expect(details.getByText("Black: 2")).toBeDefined();
    expect(details.getByText("Brown: 1")).toBeDefined();
    expect(
      details.getByRole("heading", { name: "Address Users" }),
    ).toBeDefined();
    expect(details.getByText("AliceStone: 10101")).toBeDefined();
    expect(details.getByText("BobRay: 20202")).toBeDefined();
  });

  test("shows an error state when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ error: "Nope" }, { status: 502 }),
    );

    render(<DepartmentSummaryView />);

    expect(
      await screen.findByRole("heading", {
        name: "Unable to load department summary",
      }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Retry" })).toBeDefined();
  });

  test("clicking Retry performs another request and renders successful data", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ error: "Nope" }, { status: 502 }))
      .mockResolvedValueOnce(Response.json(summaryData));

    render(<DepartmentSummaryView />);

    const retryButton = await screen.findByRole("button", { name: "Retry" });
    fireEvent.click(retryButton);

    expect(
      await screen.findByRole("rowheader", { name: "Engineering" }),
    ).toBeDefined();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
