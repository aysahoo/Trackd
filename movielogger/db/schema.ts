import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const watchItem = pgTable(
  "watch_item",
  {
    id: text("id").primaryKey(), // nanoid / uuid
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    tmdbId: text("tmdb_id").notNull(),
    mediaType: text("media_type").notNull(), // movie | tv

    title: text("title").notNull(),
    year: text("year"),
    poster: text("poster"),

    rating: integer("rating"), // 1-5 stars

    status: text("status").default("watched"),
    // watched | watching | wishlist

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("watch_item_user_idx").on(table.userId),
    index("watch_item_tmdb_user_idx").on(table.userId, table.tmdbId),
  ],
);

export const friend = pgTable(
  "friend",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    friendId: text("friend_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"), // pending, accepted
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("friend_user_idx").on(table.userId),
    index("friend_friend_idx").on(table.friendId),
  ],
);



export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const watchItemRelations = relations(watchItem, ({ one }) => ({
  user: one(user, {
    fields: [watchItem.userId],
    references: [user.id],
  }),
}));

export const friendRelations = relations(friend, ({ one }) => ({
  initiator: one(user, {
    fields: [friend.userId],
    references: [user.id],
    relationName: "friends_initiated",
  }),
  recipient: one(user, {
    fields: [friend.friendId],
    references: [user.id],
    relationName: "friends_received",
  }),
}));

export const suggestion = pgTable(
  "suggestion",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    friendId: text("friend_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    tmdbId: text("tmdb_id").notNull(),
    mediaType: text("media_type").notNull(),

    title: text("title").notNull(),
    year: text("year"),
    poster: text("poster"),

    status: text("status").default("pending"), // pending, accepted, dismissed

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("suggestion_user_idx").on(table.userId),
    index("suggestion_friend_idx").on(table.friendId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    status: text("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("invitation_email_idx").on(table.email)],
);

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  watchItems: many(watchItem),
  friendsInitiated: many(friend, { relationName: "friends_initiated" }),
  friendsReceived: many(friend, { relationName: "friends_received" }),
  suggestionsReceived: many(suggestion, { relationName: "suggestions_received" }),
  suggestionsSent: many(suggestion, { relationName: "suggestions_sent" }),
  invitationsSent: many(invitation),
}));

export const suggestionRelations = relations(suggestion, ({ one }) => ({
  recipient: one(user, {
    fields: [suggestion.userId],
    references: [user.id],
    relationName: "suggestions_received",
  }),
  sender: one(user, {
    fields: [suggestion.friendId],
    references: [user.id],
    relationName: "suggestions_sent",
  }),
}));
