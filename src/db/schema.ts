import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  jsonb,
  serial,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { randomUUID } from "crypto";

export const habit = pgTable(
  "habit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    order: serial("order"),
    name: text("name").notNull(),
    color: text("color").notNull().default("#000000"),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    streaks: jsonb("streaks")
      .$type<Record<number, { date: Date; value: number }>>()
      .notNull()
      .default({}),
    streak: integer("streak").notNull().default(0),
    longestStreak: integer("longestStreak").notNull().default(0),
    lastCompletedAt: timestamp("lastCompletedAt", {
      mode: "date",
      withTimezone: true,
    }),
    timezoneOffset: integer("timezoneOffset").notNull().default(0),
  },
  (table) => ({
    userIdIdx: index().on(table.userId),
  }),
);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  longestCurrentStreak: integer("longestCurrentStreak").notNull().default(0),
  onboardingFinished: boolean("onboardingFinished").notNull().default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const friendRequests = pgTable("friendRequest", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  fromUserId: text("fromUserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toUserId: text("toUserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  fromIdx: index().on(table.fromUserId),
  toIdx: index().on(table.toUserId),
}));

export const friends = pgTable(
  "friend",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: text("friendId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.friendId] }),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    userIdIdx: index().on(account.userId),
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    sessionToken: text("sessionToken").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
    };
  },
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
