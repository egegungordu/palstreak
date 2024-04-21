"use server";

import { users } from "@/db/schema";
import { db } from "../db";

export async function addNewUser() {
  return db.insert(users).values({
    fullName: "John Doe",
    phone: "123-456-7890",
  });
}
