"use client";

import { ColumnDef } from "@tanstack/react-table";

import { patientsTable } from "@/db/schema";

import PacientTableActions from "./table-actions";

type Patient = typeof patientsTable.$inferSelect;

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const phone = params.row.original.phoneNumber;
      if (!phone) return "-";

      const ddd = phone.slice(0, 2);
      const firstPart = phone.slice(2, 7);
      const secondPart = phone.slice(7);

      return `(${ddd}) ${firstPart[0]} ${firstPart.slice(1)}-${secondPart}`;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const patient = params.row.original;
      return patient.sex === "male" ? "Masculino" : "Feminino";
    },
  },

  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const patient = params.row.original;

      return <PacientTableActions patient={patient} />;
    },
  },
];
