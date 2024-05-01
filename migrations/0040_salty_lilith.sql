ALTER TABLE "labeling_surveys_pairs" ALTER COLUMN "label_1_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" ALTER COLUMN "label_2_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" ALTER COLUMN "label_3_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" ADD COLUMN "generation_method" text NOT NULL;