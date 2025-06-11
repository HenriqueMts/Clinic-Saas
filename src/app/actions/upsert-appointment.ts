"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const upsertAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  date: z.date(),
  time: z.string(),
});

export const upsertAppointment = actionClient
  .schema(upsertAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { patientId, doctorId, date, time } = parsedInput;

    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Get the clinic ID from the doctor
    const doctor = await db.query.doctorsTable.findFirst({
      where: (doctors, { eq }) => eq(doctors.id, doctorId),
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    if (doctor.clinicId !== session.user.clinic?.id) {
      throw new Error(
        "You don't have permission to create appointments for this doctor",
      );
    }

    await db.insert(appointmentsTable).values({
      patientId,
      doctorId,
      date: appointmentDate,
      clinicId: doctor.clinicId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/appointments");
  });
