import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AppointmentsClient } from "./_components/appointments-client";
import { appointmentsTableColumns } from "./_components/table-columns";

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, session.user.clinic.id),
    orderBy: [appointmentsTable.date],
    with: {
      patient: {
        columns: {
          name: true,
        },
      },
      doctor: {
        columns: {
          name: true,
        },
      },
    },
  });

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id),
  });

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
  });

  const formattedAppointments = appointments.map((appointment) => ({
    ...appointment,
    patientName: appointment.patient.name,
    doctorName: appointment.doctor.name,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Consultas</PageTitle>
          <PageDescription>
            Gerencie as consultas da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AppointmentsClient doctors={doctors} patients={patients} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={appointmentsTableColumns}
          data={formattedAppointments}
        />
      </PageContent>
    </PageContainer>
  );
}
