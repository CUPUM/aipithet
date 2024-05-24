ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "image_pool_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters" ADD CONSTRAINT "labeling_surveys_chapters_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
