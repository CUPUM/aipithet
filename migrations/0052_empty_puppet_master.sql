ALTER TABLE "labeling_surveys_pairs" DROP CONSTRAINT "labeling_surveys_pairs_prompt_id_images_prompts_id_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_pairs" DROP COLUMN IF EXISTS "prompt_id";