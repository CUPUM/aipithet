ALTER TABLE "labeling_surveys_answers" RENAME COLUMN "label_id" TO "label_1_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" RENAME COLUMN "label_id" TO "label_1_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_label_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" DROP CONSTRAINT "labeling_surveys_answers_presets_label_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "label_2_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "label_3_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" ADD COLUMN "label_2_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" ADD COLUMN "label_3_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_label_1_id_labels_id_fk" FOREIGN KEY ("label_1_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_label_2_id_labels_id_fk" FOREIGN KEY ("label_2_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_label_3_id_labels_id_fk" FOREIGN KEY ("label_3_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_label_1_id_labels_id_fk" FOREIGN KEY ("label_1_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_label_2_id_labels_id_fk" FOREIGN KEY ("label_2_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_label_3_id_labels_id_fk" FOREIGN KEY ("label_3_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
