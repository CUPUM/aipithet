CREATE TABLE IF NOT EXISTS "auth"."password_resets" (
	"user_id" text PRIMARY KEY NOT NULL,
	"temporary_password" text DEFAULT nanoid(size => 16,alphabet => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^çàèé.,ÉÀÈÙù!@#$%?&*()_+') NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + (interval '15 minutes')) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
