CREATE TABLE IF NOT EXISTS "labels" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels_to_labeling_surveys" (
	"label_id" text NOT NULL,
	"survey_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labels_to_labeling_surveys_label_id_survey_id_pk" PRIMARY KEY("label_id","survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"text" text,
	"description" text,
	CONSTRAINT "labels_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_answers" RENAME TO "labeling_surveys_answers";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters_leafs" RENAME TO "labeling_surveys_leafs";--> statement-breakpoint
ALTER TABLE "labeling_surveys" RENAME COLUMN "likert_step_count" TO "slider_step_count";--> statement-breakpoint
ALTER TABLE "labeling_surveys_leafs" DROP CONSTRAINT "labeling_surveys_chapters_leafs_chapter_id_index_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" DROP CONSTRAINT "labeling_surveys_chapters_image_pool_id_image_pools_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_chapters_answers_leaf_id_labeling_surveys_chapters_leafs_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_chapters_answers_user_id_survey_id_labeling_surveys_participants_user_id_survey_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_leafs" DROP CONSTRAINT "labeling_surveys_chapters_leafs_chapter_id_labeling_surveys_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_leafs" DROP CONSTRAINT "labeling_surveys_chapters_leafs_image_1_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_leafs" DROP CONSTRAINT "labeling_surveys_chapters_leafs_image_2_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "created_by_id" text;--> statement-breakpoint
ALTER TABLE "images_to_pools" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "image_pool_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "chapter_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys" ADD CONSTRAINT "labeling_surveys_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_leaf_id_labeling_surveys_leafs_id_fk" FOREIGN KEY ("leaf_id") REFERENCES "labeling_surveys_leafs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_user_id_chapter_id_labeling_surveys_participants_user_id_survey_id_fk" FOREIGN KEY ("user_id","chapter_id") REFERENCES "labeling_surveys_participants"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_leafs" ADD CONSTRAINT "labeling_surveys_leafs_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_leafs" ADD CONSTRAINT "labeling_surveys_leafs_image_1_id_images_id_fk" FOREIGN KEY ("image_1_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_leafs" ADD CONSTRAINT "labeling_surveys_leafs_image_2_id_images_id_fk" FOREIGN KEY ("image_2_id") REFERENCES "images"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" DROP COLUMN IF EXISTS "image_pool_id";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "survey_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels_to_labeling_surveys" ADD CONSTRAINT "labels_to_labeling_surveys_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels_to_labeling_surveys" ADD CONSTRAINT "labels_to_labeling_surveys_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels_t" ADD CONSTRAINT "labels_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels_t" ADD CONSTRAINT "labels_t_id_labels_id_fk" FOREIGN KEY ("id") REFERENCES "labels"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_leafs" ADD CONSTRAINT "labeling_surveys_leafs_chapter_id_index_unique" UNIQUE("chapter_id","index");