DROP TABLE "images_prompts_t";--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "prompt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images_prompts" DROP COLUMN IF EXISTS "original_lang";