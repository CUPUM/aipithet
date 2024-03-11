ALTER TABLE "auth"."email_confirmation_codes" RENAME TO "email_verification_codes";--> statement-breakpoint
ALTER TABLE "auth"."email_verification_codes" DROP CONSTRAINT "email_confirmation_codes_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."email_verification_codes" ADD CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
