ALTER TABLE "image_pools_users" DROP CONSTRAINT "image_pools_users_role_roles_role_fk";
--> statement-breakpoint
ALTER TABLE "labeling_surveys_editors" DROP CONSTRAINT "labeling_surveys_editors_role_roles_role_fk";
--> statement-breakpoint
ALTER TABLE "image_pools_users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "labeling_surveys_editors" DROP COLUMN IF EXISTS "role";