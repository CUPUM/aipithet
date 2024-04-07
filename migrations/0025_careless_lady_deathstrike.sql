CREATE TABLE IF NOT EXISTS "workshop_scenarios" (
	"id" text PRIMARY KEY DEFAULT nanoid(size => 12) NOT NULL,
	"pool_id" text NOT NULL,
	"external_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" text,
	CONSTRAINT "workshop_scenarios_pool_id_name_unique" UNIQUE("pool_id","name")
);
--> statement-breakpoint
DROP TABLE "images_to_pools";--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_storage_name_unique";--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" DROP CONSTRAINT "labeling_surveys_invitations_survey_id_email_pk";--> statement-breakpoint
ALTER TABLE "labeling_surveys_invitations" ADD CONSTRAINT "labeling_surveys_invitations_survey_id_email_editor_pk" PRIMARY KEY("survey_id","email","editor");--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "pool_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "scenario_id" text;--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "pool_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "method" text;--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "created_by_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_pool_id_image_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_scenario_id_workshop_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "workshop_scenarios"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_pool_id_image_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop_scenarios" ADD CONSTRAINT "workshop_scenarios_pool_id_image_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop_scenarios" ADD CONSTRAINT "workshop_scenarios_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_storage_name_pool_id_unique" UNIQUE("storage_name","pool_id");--> statement-breakpoint
ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_prompt_pool_id_unique" UNIQUE("prompt","pool_id");