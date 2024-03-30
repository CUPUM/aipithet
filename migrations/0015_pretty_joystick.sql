ALTER TABLE "labeling_surveys_chapters" ALTER COLUMN "survey_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "created_by_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters" ADD CONSTRAINT "labeling_surveys_chapters_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
