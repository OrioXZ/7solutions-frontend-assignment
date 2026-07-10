// @vitest-environment node

import { afterEach, describe, expect, test, vi } from "vitest";
import { GET } from "./route";

describe("GET /api/department-summary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns the transformed department summary", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        users: [
          {
            firstName: "Alice",
            lastName: "Stone",
            age: 28,
            gender: "female",
            hair: { color: "Black" },
            address: { postalCode: 10101 },
            company: { department: "Engineering" },
          },
          {
            firstName: "Bob",
            lastName: "Ray",
            age: 43,
            gender: "male",
            hair: { color: "Brown" },
            address: { postalCode: "20202" },
            company: { department: "Engineering" },
          },
        ],
      }),
    );

    const response = await GET();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/users?limit=0&select=firstName,lastName,age,gender,hair,address,company",
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      Engineering: {
        male: 1,
        female: 1,
        ageRange: "28-43",
        hair: {
          Black: 1,
          Brown: 1,
        },
        addressUser: {
          AliceStone: "10101",
          BobRay: "20202",
        },
      },
    });
  });

  test("returns HTTP 502 when DummyJSON fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ message: "upstream error" }, { status: 500 }),
    );

    const response = await GET();

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch department summary",
    });
  });
});
