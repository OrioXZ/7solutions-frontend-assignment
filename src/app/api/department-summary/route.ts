import { groupUsersByDepartment } from "@/lib/group-users-by-department";
import { fetchDummyUsers } from "@/services/dummyjson-users";

export async function GET() {
  try {
    const users = await fetchDummyUsers();
    const summary = groupUsersByDepartment(users);

    return Response.json(summary, { status: 200 });
  } catch {
    return Response.json(
      { error: "Failed to fetch department summary" },
      { status: 502 },
    );
  }
}
