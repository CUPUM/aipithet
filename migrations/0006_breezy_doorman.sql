CREATE TABLE IF NOT EXISTS "labeling_surveys_invitations" (
	"survey_id" text,
	"code" text DEFAULT nanoid() NOT NULL,
	"expires_at" timestamp DEFAULT (now() + (interval '1 months')) NOT NULL,
	"email" text NOT NULL,
	"pending" boolean DEFAULT false NOT NULL,
	CONSTRAINT "unique_surveys_invitation_email" UNIQUE("survey_id","email")
);
--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "created_by_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "due_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "time_to_answer_server" interval NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "time_to_answer_client" interval NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys" ADD CONSTRAINT "labeling_surveys_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" DROP COLUMN IF EXISTS "time_to_answer";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_invitations" ADD CONSTRAINT "labeling_surveys_invitations_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
