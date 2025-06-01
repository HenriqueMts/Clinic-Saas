ALTER TABLE "user_to_clinic" RENAME TO "users_to_clinics";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_patients_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctor_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_clinics" DROP CONSTRAINT "user_to_clinic_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_clinics" DROP CONSTRAINT "user_to_clinic_clinic_id_clinics_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_clinics" ADD CONSTRAINT "users_to_clinics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_clinics" ADD CONSTRAINT "users_to_clinics_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider_account_id";