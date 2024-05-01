ALTER TABLE "labeling_surveys_answers" ADD COLUMN "next_answer_id" text;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "prev_answer_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_next_answer_id_labeling_surveys_answers_id_fk" FOREIGN KEY ("next_answer_id") REFERENCES "labeling_surveys_answers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_answers" ADD CONSTRAINT "labeling_surveys_answers_prev_answer_id_labeling_surveys_answers_id_fk" FOREIGN KEY ("prev_answer_id") REFERENCES "labeling_surveys_answers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
