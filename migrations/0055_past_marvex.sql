ALTER TABLE "images" ADD COLUMN "method" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "mode" text DEFAULT 'random';