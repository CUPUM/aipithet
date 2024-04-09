ALTER TABLE "labeling_surveys_leafs" RENAME TO "labeling_surveys_answers_presets";--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_path_pool_id_bucket_unique";--> statement-breakpoint
ALTER TABLE "images_prompts" DROP CONSTRAINT "images_prompts_prompt_pool_id_method_scenario_id_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" DROP CONSTRAINT "labeling_surveys_leafs_chapter_id_index_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_answers_leaf_id_labeling_surveys_leafs_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" DROP CONSTRAINT "labeling_surveys_leafs_chapter_id_labeling_surveys_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" DROP CONSTRAINT "labeling_surveys_leafs_image_1_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" DROP CONSTRAINT "labeling_surveys_leafs_image_2_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ALTER COLUMN "time_to_answer_server" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ALTER COLUMN "time_to_answer_client" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "image_1_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "image_2_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "label_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "answered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" ADD COLUMN "label_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_image_1_id_images_id_fk" FOREIGN KEY ("image_1_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_image_2_id_images_id_fk" FOREIGN KEY ("image_2_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_image_1_id_images_id_fk" FOREIGN KEY ("image_1_id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_image_2_id_images_id_fk" FOREIGN KEY ("image_2_id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "leaf_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_pool_id_path_bucket_unique" UNIQUE("pool_id","path","bucket");--> statement-breakpoint
ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_pool_id_prompt_method_unique" UNIQUE NULLS NOT DISTINCT("pool_id","prompt","method");--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers_presets" ADD CONSTRAINT "labeling_surveys_answers_presets_chapter_id_index_unique" UNIQUE("chapter_id","index");