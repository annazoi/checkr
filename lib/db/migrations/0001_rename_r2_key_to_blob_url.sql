ALTER TABLE "report_evidence" RENAME COLUMN "r2_key" TO "blob_url";--> statement-breakpoint
ALTER TABLE "report_evidence" ALTER COLUMN "blob_url" TYPE varchar(1000);
