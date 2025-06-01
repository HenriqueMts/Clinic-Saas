ALTER TABLE "accounts" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider_account_id" text;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "account_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider_id";