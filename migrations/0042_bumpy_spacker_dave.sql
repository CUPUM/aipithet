ALTER TABLE "labeling_surveys_answers" ADD COLUMN "survey_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
