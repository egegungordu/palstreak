"use server";

import { signIn as _signIn } from "@/lib/auth";

export default async function signInAction() {
  await _signIn("google");
}
