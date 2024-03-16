CREATE TABLE IF NOT EXISTS "labeling_surveys_chapters_planned_leafs" (
	"id" text,
	"index" integer NOT NULL,
	CONSTRAINT "labeling_surveys_chapters_planned_leafs_id_index_unique" UNIQUE("id","index")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_editors" (
	"survey_id" text,
	"user_id" text,
	"role" text DEFAULT 'participant' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labeling_surveys_editors_survey_id_user_id_pk" PRIMARY KEY("survey_id","user_id")
);
--> statement-breakpoint
DROP TABLE "labeling_survey_criteria";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_users_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_users" DROP CONSTRAINT "labeling_surveys_users_role_roles_role_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ALTER COLUMN "pending" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "slider_step_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "chapter_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "image_1_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "image_2_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "score" numeric;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "next_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "new_version_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "image_pool_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "duration" interval;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "start" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "labeling_surveys_chapters" ADD COLUMN "allow_lateness" boolean;--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ADD COLUMN "editor" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_next_id_labeling_surveys_answers_id_fk" FOREIGN KEY ("next_id") REFERENCES "labeling_surveys_answers"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_new_version_id_labeling_surveys_answers_id_fk" FOREIGN KEY ("new_version_id") REFERENCES "labeling_surveys_answers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_users_answer_fk" FOREIGN KEY ("participant_id","survey_id") REFERENCES "labeling_surveys_users"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters" ADD CONSTRAINT "labeling_surveys_chapters_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys" DROP COLUMN IF EXISTS "due_at";--> statement-breakpoint
ALTER TABLE "labeling_surveys_users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_planned_leafs" ADD CONSTRAINT "labeling_surveys_chapters_planned_leafs_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_editors" ADD CONSTRAINT "labeling_surveys_editors_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_editors" ADD CONSTRAINT "labeling_surveys_editors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_editors" ADD CONSTRAINT "labeling_surveys_editors_role_roles_role_fk" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE set default ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
