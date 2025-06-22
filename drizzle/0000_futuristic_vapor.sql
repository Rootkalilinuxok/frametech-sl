CREATE TABLE "receipts_archive" (
	"id" SERIAL PRIMARY KEY,
	"date" timestamp NOT NULL,
	"time" varchar,
	"name" varchar NOT NULL,
	"country" varchar,
	"currency" varchar NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"tip" numeric(12, 2),
	"exchange_rate" numeric(12, 6),
	"total_eur" numeric(12, 2),
	"percent" numeric(5, 2),
	"payment_method" varchar,
	"status" varchar DEFAULT 'new',
	"source_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"archived_at" timestamp DEFAULT now(),
        CONSTRAINT "receipts_archive_source_hash_unique" UNIQUE("source_hash")
);
--> statement-breakpoint
CREATE TABLE "receipts_live" (
	"id" SERIAL PRIMARY KEY,
	"date" timestamp NOT NULL,
	"time" varchar,
	"name" varchar NOT NULL,
	"country" varchar,
	"currency" varchar NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"tip" numeric(12, 2),
	"exchange_rate" numeric(12, 6),
	"total_eur" numeric(12, 2),
	"percent" numeric(5, 2),
	"payment_method" varchar,
	"status" varchar DEFAULT 'new',
	"source_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "receipts_live_source_hash_unique" UNIQUE("source_hash")
);
