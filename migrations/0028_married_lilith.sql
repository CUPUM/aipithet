ALTER TABLE "images_prompts" DROP CONSTRAINT "images_prompts_prompt_pool_id_unique";--> statement-breakpoint
ALTER TABLE "labels" DROP CONSTRAINT "labels_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "auth"."email_verification_codes" ALTER COLUMN "expires_at" SET DEFAULT (now() + (interval '1 hours'));--> statement-breakpoint
ALTER TABLE "labels" ALTER COLUMN "created_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
ALTER TABLE "labels" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
ALTER TABLE "workshop_scenarios" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop_scenarios" ADD CONSTRAINT "workshop_scenarios_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "images_prompts" ADD CONSTRAINT "images_prompts_prompt_pool_id_method_unique" UNIQUE NULLS NOT DISTINCT("prompt","pool_id","method");