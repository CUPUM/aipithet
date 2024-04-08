ALTER TABLE "images" RENAME COLUMN "storage_name" TO "path";--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_storage_name_pool_id_unique";--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "bucket" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "declared_not_found_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_path_pool_id_bucket_unique" UNIQUE("path","pool_id","bucket");