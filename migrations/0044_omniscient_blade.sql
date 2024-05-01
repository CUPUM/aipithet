ALTER TABLE "labeling_surveys" ADD COLUMN "break_duration" integer DEFAULT 15 NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "allow_breaks" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "break_frequency" integer DEFAULT 100 NOT NULL;