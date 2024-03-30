ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" DROP COLUMN IF EXISTS "duration";