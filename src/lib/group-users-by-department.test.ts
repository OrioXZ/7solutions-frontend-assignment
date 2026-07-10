import { describe, expect, test } from "vitest";
import { groupUsersByDepartment } from "./group-users-by-department";
import type { DummyUser } from "@/types/dummy-user";

const users: DummyUser[] = [
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
  {
    firstName: "Clara",
    lastName: "Wong",
    age: 35,
    gender: "female",
    hair: { color: "Black" },
    address: { postalCode: 30303 },
    company: { department: "Engineering" },
  },
  {
    firstName: "Diego",
    lastName: "Lopez",
    age: 50,
    gender: "male",
    hair: { color: "Blond" },
    address: { postalCode: "40404" },
    company: { department: "Sales" },
  },
];

describe("groupUsersByDepartment", () => {
  test("groups users by department", () => {
    expect(Object.keys(groupUsersByDepartment(users))).toEqual([
      "Engineering",
      "Sales",
    ]);
  });

  test("counts male and female users", () => {
    const result = groupUsersByDepartment(users);

    expect(result.Engineering.male).toBe(1);
    expect(result.Engineering.female).toBe(2);
    expect(result.Sales.male).toBe(1);
    expect(result.Sales.female).toBe(0);
  });

  test("tracks minimum and maximum age", () => {
    const result = groupUsersByDepartment(users);

    expect(result.Engineering.ageRange).toBe("28-43");
    expect(result.Sales.ageRange).toBe("50-50");
  });

  test("counts hair colors", () => {
    const result = groupUsersByDepartment(users);

    expect(result.Engineering.hair).toEqual({
      Black: 2,
      Brown: 1,
    });
    expect(result.Sales.hair).toEqual({
      Blond: 1,
    });
  });

  test("maps concatenated names to postal codes as strings", () => {
    const result = groupUsersByDepartment(users);

    expect(result.Engineering.addressUser).toEqual({
      AliceStone: "10101",
      BobRay: "20202",
      ClaraWong: "30303",
    });
    expect(result.Sales.addressUser).toEqual({
      DiegoLopez: "40404",
    });
  });

  test("handles multiple departments in the final output", () => {
    expect(groupUsersByDepartment(users)).toEqual({
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
          ClaraWong: "30303",
        },
      },
      Sales: {
        male: 1,
        female: 0,
        ageRange: "50-50",
        hair: {
          Blond: 1,
        },
        addressUser: {
          DiegoLopez: "40404",
        },
      },
    });
  });

  test("returns an empty object for empty input", () => {
    expect(groupUsersByDepartment([])).toEqual({});
  });
});
