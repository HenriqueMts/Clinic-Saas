"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const deleteAppointment = async ({ id }: { id: string }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  if (!session.user.clinic) {
    throw new Error("Clínica não encontrada");
  }

  const appointment = await db.query.appointmentsTable.findFirst({
    where: eq(appointmentsTable.id, id),
  });

  if (!appointment) {
    throw new Error("Consulta não encontrada");
  }

  if (appointment.clinicId !== session.user.clinic.id) {
    throw new Error("Não autorizado");
  }

  await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));

  revalidatePath("/appointments");
};
