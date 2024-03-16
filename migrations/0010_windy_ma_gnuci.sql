ALTER TABLE "labeling_surveys_participants" ADD CONSTRAINT "labeling_surveys_participants_survey_id_user_id_pk" PRIMARY KEY("survey_id","user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_users_answer_fk" FOREIGN KEY ("participant_id","survey_id") REFERENCES "labeling_surveys_participants"("user_id","survey_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
