/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

export function getAuthToken() {
  const storage = JSON.parse(fs.readFileSync("playwright/.auth/user.json", "utf-8"));

  // PocketBase save token in localStorage
  const localStorage = storage.origins[0].localStorage;

  const tokenItem = localStorage.find((item: any) => item.name.includes("auth"));

  if (!tokenItem) {
    throw new Error("Auth token not found");
  }

  const parsed = JSON.parse(tokenItem.value);

  return parsed.token;
}
