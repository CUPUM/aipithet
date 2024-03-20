ALTER TABLE "labeling_surveys_answers" RENAME TO "labeling_surveys_chapters_answers";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_planned_leafs" RENAME TO "labeling_surveys_chapters_leafs";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" RENAME COLUMN "participant_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" DROP CONSTRAINT "labeling_surveys_chapters_planned_leafs_id_index_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_answers_chapter_id_labeling_surveys_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_answers_image_1_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_answers_image_2_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_answers_next_id_labeling_surveys_answers_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_answers_new_version_id_labeling_surveys_answers_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP CONSTRAINT "labeling_surveys_users_answer_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" DROP CONSTRAINT "labeling_surveys_chapters_planned_leafs_id_labeling_surveys_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" ALTER COLUMN "survey_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ALTER COLUMN "id" SET DEFAULT nanoid();--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ALTER COLUMN "index" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" ADD COLUMN "leaf_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD COLUMN "chapter_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD COLUMN "image_1_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD COLUMN "image_2_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_answers" ADD CONSTRAINT "labeling_surveys_chapters_answers_leaf_id_labeling_surveys_chapters_leafs_id_fk" FOREIGN KEY ("leaf_id") REFERENCES "labeling_surveys_chapters_leafs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_answers" ADD CONSTRAINT "labeling_surveys_chapters_answers_user_id_survey_id_labeling_surveys_participants_user_id_survey_id_fk" FOREIGN KEY ("user_id","survey_id") REFERENCES "labeling_surveys_participants"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_leafs" ADD CONSTRAINT "labeling_surveys_chapters_leafs_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_leafs" ADD CONSTRAINT "labeling_surveys_chapters_leafs_image_1_id_images_id_fk" FOREIGN KEY ("image_1_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_leafs" ADD CONSTRAINT "labeling_surveys_chapters_leafs_image_2_id_images_id_fk" FOREIGN KEY ("image_2_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP COLUMN IF EXISTS "chapter_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP COLUMN IF EXISTS "image_1_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP COLUMN IF EXISTS "image_2_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP COLUMN IF EXISTS "next_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" DROP COLUMN IF EXISTS "new_version_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" ADD CONSTRAINT "labeling_surveys_chapters_leafs_chapter_id_index_unique" UNIQUE("chapter_id","index");