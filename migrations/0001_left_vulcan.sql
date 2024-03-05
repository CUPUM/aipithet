CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "extensions";
--> statement-breakpoint
CREATE SCHEMA "i18n";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."email_confirmation_codes" (
	"user_id" text PRIMARY KEY NOT NULL,
	"code" text DEFAULT nanoid(size => 6,alphabet => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."roles" (
	"role" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."user_roles_t" (
	"lang" text NOT NULL,
	"role" text NOT NULL,
	"title" text,
	"description" text,
	CONSTRAINT "user_roles_t_role_lang_pk" PRIMARY KEY("role","lang"),
	CONSTRAINT "user_roles_t_lang_title_unique" UNIQUE("lang","title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exipires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" text PRIMARY KEY DEFAULT nanoid(size => 15) NOT NULL,
	"role" text DEFAULT 'participant' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "i18n"."languages" (
	"lang" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"regconfig" "regconfig" NOT NULL,
	CONSTRAINT "languages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_types" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_types_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"title" text,
	"description" text,
	CONSTRAINT "image_types_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"storage_name" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"prompt_id" text,
	CONSTRAINT "images_storage_name_unique" UNIQUE("storage_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_pools" (
	"id" text PRIMARY KEY DEFAULT nanoid(size => 15) NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_pools_users" (
	"image_pool_id" text,
	"user_id" text,
	"role" text DEFAULT 'participant' NOT NULL,
	CONSTRAINT "image_pools_users_image_pool_id_user_id_pk" PRIMARY KEY("image_pool_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_pools_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"name" text,
	"description" text,
	CONSTRAINT "image_pools_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_prompts" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"original_lang" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_prompts_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"prompt" text NOT NULL,
	"title" text,
	"description" text,
	CONSTRAINT "images_prompts_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"description" text,
	CONSTRAINT "images_t_id_lang_pk" PRIMARY KEY("id","lang")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_to_pools" (
	"image_pool_id" text,
	"image_id" text,
	CONSTRAINT "images_to_pools_image_id_image_pool_id_pk" PRIMARY KEY("image_id","image_pool_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_survey_criteria" (

);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_answers" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"survey_id" text,
	"participant_id" text,
	"duration" interval NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_chapters" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"survey_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_chapters_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"title" text,
	"description" text,
	CONSTRAINT "labeling_surveys_chapters_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_editors" (
	"survey_id" text,
	"user_id" text,
	"role" text DEFAULT 'participant' NOT NULL,
	CONSTRAINT "labeling_surveys_editors_user_id_survey_id_pk" PRIMARY KEY("user_id","survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_survey_participants" (
	"survey_id" text,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labeling_survey_participants_survey_id_user_id_pk" PRIMARY KEY("survey_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_t" (
	"lang" text NOT NULL,
	"id" text NOT NULL,
	"title" text,
	"summary" text,
	"description" text,
	CONSTRAINT "labeling_surveys_t_lang_id_pk" PRIMARY KEY("lang","id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."email_confirmation_codes" ADD CONSTRAINT "email_confirmation_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."user_roles_t" ADD CONSTRAINT "user_roles_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."user_roles_t" ADD CONSTRAINT "user_roles_t_role_roles_role_fk" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."users" ADD CONSTRAINT "users_role_roles_role_fk" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE set default ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_types_t" ADD CONSTRAINT "image_types_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_types_t" ADD CONSTRAINT "image_types_t_id_image_types_id_fk" FOREIGN KEY ("id") REFERENCES "image_types"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_prompt_id_images_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "images_prompts"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools" ADD CONSTRAINT "image_pools_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_users" ADD CONSTRAINT "image_pools_users_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_users" ADD CONSTRAINT "image_pools_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_users" ADD CONSTRAINT "image_pools_users_role_roles_role_fk" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE set default ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_t" ADD CONSTRAINT "image_pools_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_t" ADD CONSTRAINT "image_pools_t_id_image_pools_id_fk" FOREIGN KEY ("id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts_t" ADD CONSTRAINT "images_prompts_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts_t" ADD CONSTRAINT "images_prompts_t_id_images_prompts_id_fk" FOREIGN KEY ("id") REFERENCES "images_prompts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_t" ADD CONSTRAINT "images_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_t" ADD CONSTRAINT "images_t_id_images_id_fk" FOREIGN KEY ("id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_to_pools" ADD CONSTRAINT "images_to_pools_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_to_pools" ADD CONSTRAINT "images_to_pools_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_participants_fk" FOREIGN KEY ("participant_id","survey_id") REFERENCES "labeling_survey_participants"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters" ADD CONSTRAINT "labeling_surveys_chapters_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_t" ADD CONSTRAINT "labeling_surveys_chapters_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_chapters_t" ADD CONSTRAINT "labeling_surveys_chapters_t_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_survey_participants" ADD CONSTRAINT "labeling_survey_participants_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_survey_participants" ADD CONSTRAINT "labeling_survey_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_t" ADD CONSTRAINT "labeling_surveys_t_lang_languages_lang_fk" FOREIGN KEY ("lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_t" ADD CONSTRAINT "labeling_surveys_t_id_labeling_surveys_id_fk" FOREIGN KEY ("id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
