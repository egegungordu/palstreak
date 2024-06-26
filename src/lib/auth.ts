import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import _ from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboardingFinished: boolean;
      username: string | null;
      imageBig: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    username: string | null;
    onboardingFinished: boolean;
    imageBig: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string | null;
    onboardingFinished: boolean;
    imageBig: string | null;
  }
}

// this is a lie
declare module "@auth/core/adapters" {
  interface AdapterUser {
    username: string | null;
    onboardingFinished: boolean;
    imageBig: string | null;
  }
}

// we give fake values to the tables that are not used (because jwt)
let drizzleAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: {} as any,
  verificationTokensTable: {} as any,
});

drizzleAdapter.createUser = async (user) => {
  const [dbUser] = await db
    .insert(users)
    .values({
      id: user.id,
      email: user.email,
      name: user.name,
      // do not use the image from google
      image: null,
      emailVerified: user.emailVerified,
    })
    .returning();
  return dbUser;
};

drizzleAdapter.getUser = async (id) => {
  const user = await db.select().from(users).where(eq(users.id, id));

  if (user.length === 0) {
    return null;
  }

  return {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    image: user[0].image,
    imageBig: user[0].imageBig,
    emailVerified: user[0].emailVerified,
    onboardingFinished: user[0].onboardingFinished,
    username: user[0].username,
  };
};

// TODO: this assumes oauth login, can fix with a switch statement and the
// other parameter
drizzleAdapter.getUserByAccount = async ({ providerAccountId }) => {
  const account = await db
    .select()
    .from(accounts)
    .where(eq(accounts.providerAccountId, providerAccountId));

  if (account.length === 0) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, account[0].userId));

  return {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    image: user[0].image,
    imageBig: user[0].imageBig,
    emailVerified: user[0].emailVerified,
    onboardingFinished: user[0].onboardingFinished,
    username: user[0].username,
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: drizzleAdapter,
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  pages: {
    newUser: "/onboarding",
  },
  events: {},
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub!;
      session.user.onboardingFinished = token.onboardingFinished;
      session.user.username = token.username;
      session.user.image = token.picture;
      session.user.imageBig = token.imageBig;
      return session;
    },
    jwt: async ({ token, user, trigger }) => {
      // TODO: update means we finished onboarding
      // make it more clear/segmented by maybe using the parameter of update()
      if (trigger === "update") {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, token.sub!));

        if (dbUser.length === 0) {
          return token;
        }

        token.onboardingFinished = dbUser[0].onboardingFinished;
        token.username = dbUser[0].username;
        token.picture = dbUser[0].image;
        token.imageBig = dbUser[0].imageBig;
      }

      if (user) {
        token.sub = user.id!;
        token.onboardingFinished = user.onboardingFinished;
        token.username = user.username;
        token.imageBig = user.imageBig;
      }

      return token;
    },
  },
});
