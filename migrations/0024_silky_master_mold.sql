CREATE TABLE IF NOT EXISTS "image_pools_editors" (
	"image_pool_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "image_pools_editors_image_pool_id_user_id_pk" PRIMARY KEY("image_pool_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_pools_invitations" (
	"image_pool_id" text NOT NULL,
	"code" text DEFAULT nanoid(size => 8) NOT NULL,
	"expires_at" timestamp DEFAULT (now() + (interval '1 months')) NOT NULL,
	"email" text NOT NULL,
	"pending" boolean DEFAULT true NOT NULL,
	CONSTRAINT "images_pools_invitations_image_pool_id_email_pk" PRIMARY KEY("image_pool_id","email")
);
--> statement-breakpoint
DROP TABLE "image_types_t";--> statement-breakpoint
DROP TABLE "image_types";--> statement-breakpoint
DROP TABLE "image_pools_users";--> statement-breakpoint
DROP TABLE "images_t";--> statement-breakpoint
ALTER TABLE "images_prompts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_editors" ADD CONSTRAINT "image_pools_editors_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_pools_editors" ADD CONSTRAINT "image_pools_editors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_pools_invitations" ADD CONSTRAINT "images_pools_invitations_image_pool_id_image_pools_id_fk" FOREIGN KEY ("image_pool_id") REFERENCES "image_pools"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
