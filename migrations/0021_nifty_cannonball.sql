ALTER TABLE "labeling_surveys_invitations" DROP CONSTRAINT "unique_surveys_invitation_email";--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ALTER COLUMN "survey_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ALTER COLUMN "code" SET DEFAULT nanoid(size => 8);--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ADD CONSTRAINT "labeling_surveys_invitations_survey_id_email_pk" PRIMARY KEY("survey_id","email");