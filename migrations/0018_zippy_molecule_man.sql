DROP TABLE "labels_to_labeling_surveys";--> statement-breakpoint
ALTER TABLE "labels" ADD COLUMN "survey_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
