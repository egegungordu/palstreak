import {
  timestamp,
  text,
  primaryKey,
  numeric,
  integer,
  index,
  jsonb,
  serial,
  boolean,
  pgTableCreator,
  unique,
  uniqueIndex
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

const pgTable = pgTableCreator((name) => `palstreak_${name}`);

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
    colorIndex: integer("colorIndex").notNull().default(0),
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

// TODO: NOTE: https://github.com/drizzle-team/drizzle-orm/issues/1856
// since drizzle doesnt support .using() yet, we have to use raw sql
// CREATE UNIQUE INDEX idx_username_lower ON palstreak_user (LOWER(username));
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  friendCount: integer("friendCount").notNull().default(0),
  lastActive: timestamp("lastActive", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  longestCurrentStreak: integer("longestCurrentStreak").notNull().default(0),
  consistencyScore: numeric("consistencyScore", {
    precision: 5,
    scale: 2,
  })
    .notNull()
    .default("0"),
  onboardingFinished: boolean("onboardingFinished").notNull().default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
}, (table) => ({
  lastActiveIdx: index().on(table.lastActive),
}));

export const friendRequests = pgTable(
  "friendRequest",
  {
    fromUserId: text("fromUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: text("toUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.fromUserId, table.toUserId] }),
    toIdx: index().on(table.toUserId),
  }),
);

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
    friendIdx: index().on(table.friendId),
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
