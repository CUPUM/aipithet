ALTER TABLE "labeling_surveys_answers_presets" RENAME TO "labeling_surveys_pairs";--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_chapter_id_index_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_image_1_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_image_2_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_label_1_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_label_2_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_label_3_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_chapter_id_labeling_surveys_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_image_1_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_image_2_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_label_1_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_label_2_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_answers_presets_label_3_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" ALTER COLUMN "chapter_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "pair_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" ADD COLUMN "max_answers_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_pair_id_labeling_surveys_pairs_id_fk" FOREIGN KEY ("pair_id") REFERENCES "labeling_surveys_pairs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_image_1_id_images_id_fk" FOREIGN KEY ("image_1_id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_image_2_id_images_id_fk" FOREIGN KEY ("image_2_id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_label_1_id_labels_id_fk" FOREIGN KEY ("label_1_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_label_2_id_labels_id_fk" FOREIGN KEY ("label_2_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_label_3_id_labels_id_fk" FOREIGN KEY ("label_3_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "image_1_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "image_2_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "label_1_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "label_2_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "label_3_id";