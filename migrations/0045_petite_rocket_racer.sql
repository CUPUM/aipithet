ALTER TABLE "labeling_surveys_pairs" ADD COLUMN "prompt_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_pairs" ADD CONSTRAINT "labeling_surveys_pairs_prompt_id_images_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "images_prompts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
