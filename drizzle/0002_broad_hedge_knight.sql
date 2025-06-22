ALTER TABLE "receipts_archive" DROP CONSTRAINT "receipts_archive_source_hash_unique";--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "receipts_archive" ADD CONSTRAINT "receipts_live_source_hash_unique" UNIQUE("source_hash");