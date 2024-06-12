CREATE TABLE IF NOT EXISTS "images_prompts_relation" (
	"parent_prompt_id" text,
	"child_prompt_id" text,
	"modification" text,
	CONSTRAINT "images_prompts_relation_parent_prompt_id_child_prompt_id_pk" PRIMARY KEY("parent_prompt_id","child_prompt_id")
);
--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "score_1_answered" boolean;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "score_2_answered" boolean;--> statement-breakpoint
ALTER TABLE "labeling_surveys_answers" ADD COLUMN "score_3_answered" boolean;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts_relation" ADD CONSTRAINT "images_prompts_relation_parent_prompt_id_images_prompts_id_fk" FOREIGN KEY ("parent_prompt_id") REFERENCES "images_prompts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts_relation" ADD CONSTRAINT "images_prompts_relation_child_prompt_id_images_prompts_id_fk" FOREIGN KEY ("child_prompt_id") REFERENCES "images_prompts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
