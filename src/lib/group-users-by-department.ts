import type { DepartmentSummaryMap, DummyUser } from "@/types/dummy-user";

export function groupUsersByDepartment(
  users: DummyUser[],
): DepartmentSummaryMap {
  const summaries: DepartmentSummaryMap = {};
  const ageBounds: Record<string, { min: number; max: number }> = {};

  for (const user of users) {
    const department = user.company.department;
    const existingSummary = summaries[department];

    if (!existingSummary) {
      summaries[department] = {
        male: 0,
        female: 0,
        ageRange: `${user.age}-${user.age}`,
        hair: {},
        addressUser: {},
      };
      ageBounds[department] = { min: user.age, max: user.age };
    }

    const summary = summaries[department];
    const bounds = ageBounds[department];

    if (user.gender === "male") {
      summary.male += 1;
    }

    if (user.gender === "female") {
      summary.female += 1;
    }

    bounds.min = Math.min(bounds.min, user.age);
    bounds.max = Math.max(bounds.max, user.age);
    summary.ageRange = `${bounds.min}-${bounds.max}`;

    summary.hair[user.hair.color] = (summary.hair[user.hair.color] ?? 0) + 1;
    summary.addressUser[`${user.firstName}${user.lastName}`] = String(
      user.address.postalCode,
    );
  }

  return summaries;
}
