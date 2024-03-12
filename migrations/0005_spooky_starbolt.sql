CREATE TABLE IF NOT EXISTS "auth"."password_reset_tokens" (
	"user_id" text PRIMARY KEY NOT NULL,
	"token" text DEFAULT nanoid(size => 16,alphabet => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^çàèé.,ÉÀÈÙù!@#$%?&*()_+') NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + (interval '1 hours')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labeling_surveys_users" (
	"survey_id" text,
	"user_id" text,
	"role" text DEFAULT 'participant' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labeling_surveys_users_survey_id_user_id_pk" PRIMARY KEY("survey_id","user_id")
);
--> statement-breakpoint
DROP TABLE "auth"."password_resets";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" RENAME COLUMN "duration" TO "time_to_answer";--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_participants_fk";
--> statement-breakpoint
DROP TABLE "labeling_surveys_editors";--> statement-breakpoint
DROP TABLE "labeling_survey_participants";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_users_fk" FOREIGN KEY ("participant_id","survey_id") REFERENCES "labeling_surveys_users"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_users" ADD CONSTRAINT "labeling_surveys_users_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_users" ADD CONSTRAINT "labeling_surveys_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_users" ADD CONSTRAINT "labeling_surveys_users_role_roles_role_fk" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE set default ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
