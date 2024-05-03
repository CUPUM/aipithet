ALTER TABLE "labeling_surveys_invitations" ADD COLUMN "preferred_lang" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labeling_surveys_invitations" ADD CONSTRAINT "labeling_surveys_invitations_preferred_lang_languages_lang_fk" FOREIGN KEY ("preferred_lang") REFERENCES "i18n"."languages"("lang") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
