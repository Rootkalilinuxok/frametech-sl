CREATE TABLE "receipts_archive" (
	"archived_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "receipts_live" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"time" varchar(8),
	"name" varchar(120) NOT NULL,
	"country" varchar(60),
	"currency" varchar(6) NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"tip" numeric(12, 2),
	"exchange_rate" numeric(12, 6),
	"total_eur" numeric(12, 2),
	"percent" numeric(5, 2),
	"payment_method" varchar(40),
	"status" varchar(20) DEFAULT 'new',
	"source_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "receipts_live_source_hash_unique" UNIQUE("source_hash")
);
