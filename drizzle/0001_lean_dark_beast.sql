ALTER TABLE "receipts_archive" ALTER COLUMN "time" SET DATA TYPE varchar(8);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "country" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "currency" SET DATA TYPE varchar(6);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "payment_method" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "status" SET DEFAULT 'new';--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "time" SET DATA TYPE varchar(8);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "country" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "currency" SET DATA TYPE varchar(6);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "payment_method" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "status" SET DEFAULT 'new';
