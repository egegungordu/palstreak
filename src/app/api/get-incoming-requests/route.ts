import { friendRequests } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, count } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET() {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [res] = await db
    .select({
      count: count(friendRequests.toUserId),
    })
    .from(friendRequests)
    .where(eq(friendRequests.toUserId, session.user.id));

  return Response.json({ count: res.count });
}
