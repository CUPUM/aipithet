ALTER TABLE "labeling_surveys_chapters" ALTER COLUMN "allow_lateness" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ALTER COLUMN "allow_lateness" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "max_answers_count" integer;