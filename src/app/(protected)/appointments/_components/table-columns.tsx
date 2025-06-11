"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable } from "@/db/schema";

import AppointmentTableActions from "./table-actions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patientName: string;
  doctorName: string;
};

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patientName",
    accessorKey: "patientName",
    header: "Paciente",
  },
  {
    id: "doctorName",
    accessorKey: "doctorName",
    header: "Médico",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data",
    cell: (params) => {
      const date = params.row.original.date;
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "time",
    accessorKey: "time",
    header: "Horário",
    cell: (params) => {
      const date = params.row.original.date;
      return format(date, "HH:mm", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentTableActions appointment={appointment} />;
    },
  },
];
