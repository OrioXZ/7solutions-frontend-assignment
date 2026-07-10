import type { DummyUser } from "@/types/dummy-user";

const DUMMYJSON_USERS_URL =
  "https://dummyjson.com/users?limit=0&select=firstName,lastName,age,gender,hair,address,company";

type DummyUsersResponse = {
  users?: unknown;
};

export async function fetchDummyUsers(): Promise<DummyUser[]> {
  const response = await fetch(DUMMYJSON_USERS_URL);

  if (!response.ok) {
    throw new Error(`DummyJSON request failed with status ${response.status}`);
  }

  const data = (await response.json()) as DummyUsersResponse;

  if (!Array.isArray(data.users)) {
    throw new Error("DummyJSON response is invalid: users must be an array");
  }

  return data.users as DummyUser[];
}
