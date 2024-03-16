ALTER TABLE "labeling_surveys_answers" DROP CONSTRAINT "labeling_surveys_users_answer_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_users" DROP CONSTRAINT "labeling_surveys_users_survey_id_user_id_pk";