import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ShortLink table
export const shortLinks = pgTable('shortlinks', {
  id: text('id').primaryKey().notNull(),
  shortId: text('shortId').notNull().unique(),
  original: text('original').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// AccessLog table
export const accessLogs = pgTable('accesslogs', {
  id: text('id').primaryKey().notNull(),
  shortLinkId: text('shortLinkId').notNull().references(() => shortLinks.shortId, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userAgent: text('userAgent').notNull(),
  ip: text('ip').notNull(),
});

// Relations
export const shortLinksRelations = relations(shortLinks, ({ many }) => ({
  accesses: many(accessLogs),
}));

export const accessLogsRelations = relations(accessLogs, ({ one }) => ({
  shortLink: one(shortLinks, {
    fields: [accessLogs.shortLinkId],
    references: [shortLinks.shortId],
  }),
}));