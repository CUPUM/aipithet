ALTER TABLE "labeling_surveys" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys" ADD CONSTRAINT "labeling_surveys_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
