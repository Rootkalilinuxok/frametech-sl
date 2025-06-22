ALTER TABLE "receipts_archive" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "receipts_archive" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "receipts_live" ALTER COLUMN "id" DROP DEFAULT;
