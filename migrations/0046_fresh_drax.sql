ALTER TABLE "labeling_surveys" ALTER COLUMN "break_frequency" SET DEFAULT 150;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "session_duration" integer DEFAULT 45 NOT NULL;