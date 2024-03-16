ALTER TABLE "labeling_surveys_users" RENAME TO "labeling_surveys_participants";--> statement-breakpoint
ALTER TABLE "labeling_surveys_participants" DROP CONSTRAINT "labeling_surveys_users_survey_id_labeling_surveys_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_participants" DROP CONSTRAINT "labeling_surveys_users_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_participants" ADD CONSTRAINT "labeling_surveys_participants_survey_id_labeling_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "labeling_surveys"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_participants" ADD CONSTRAINT "labeling_surveys_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
