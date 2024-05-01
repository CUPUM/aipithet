CREATE TABLE IF NOT EXISTS "labeling_surveys_breaks" (
	"id" text PRIMARY KEY DEFAULT nanoid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" text NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_breaks" ADD CONSTRAINT "labeling_surveys_breaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_breaks" ADD CONSTRAINT "labeling_surveys_breaks_chapter_id_labeling_surveys_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "labeling_surveys_chapters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
