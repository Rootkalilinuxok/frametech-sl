import { pgTable, uuid, varchar, numeric, timestamp, text } from "drizzle-orm/pg-core";

/* --- live ------------------------------------------------ */
export const receiptsLive = pgTable("receipts_live", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 8 }),
  name: varchar("name", { length: 120 }).notNull(),
  country: varchar("country", { length: 60 }),
  currency: varchar("currency", { length: 6 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  tip: numeric("tip", { precision: 12, scale: 2 }),
  exchangeRate: numeric("exchange_rate", { precision: 12, scale: 6 }),
  totalEur: numeric("total_eur", { precision: 12, scale: 2 }),
  percent: numeric("percent", { precision: 5, scale: 2 }),
  paymentMethod: varchar("payment_method", { length: 40 }),
  status: varchar("status", { length: 20 }).default("new"),
  sourceHash: text("source_hash").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* --- archivio ------------------------------------------- */
export const receiptsArchive = pgTable("receipts_archive", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 8 }),
  name: varchar("name", { length: 120 }).notNull(),
  country: varchar("country", { length: 60 }),
  currency: varchar("currency", { length: 6 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  tip: numeric("tip", { precision: 12, scale: 2 }),
  exchangeRate: numeric("exchange_rate", { precision: 12, scale: 6 }),
  totalEur: numeric("total_eur", { precision: 12, scale: 2 }),
  percent: numeric("percent", { precision: 5, scale: 2 }),
  paymentMethod: varchar("payment_method", { length: 40 }),
  status: varchar("status", { length: 20 }).default("new"),
  sourceHash: text("source_hash").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  archivedAt: timestamp("archived_at").defaultNow(),
});
