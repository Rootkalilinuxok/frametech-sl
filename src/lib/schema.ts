import { pgTable, serial, varchar, numeric, timestamp, text } from "drizzle-orm/pg-core";

/*
 * Columns shared between the live and archive tables. Drizzle relies on the
 * column definitions passed directly to `pgTable` to infer the table shape
 * when generating migrations, so we keep these definitions in a standalone
 * object that can be spread into both table definitions.
 */
const receiptColumns = {
  id: serial("id").primaryKey(), // <-- ID incrementale numerico
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
  image_url: varchar("image_url", { length: 255 }),
};

/* --- live ------------------------------------------------ */
export const receiptsLive = pgTable("receipts_live", receiptColumns);

/* --- archivio ------------------------------------------- */
export const receiptsArchive = pgTable("receipts_archive", {
  ...receiptColumns,
  archivedAt: timestamp("archived_at").defaultNow(),
});
