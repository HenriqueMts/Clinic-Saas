"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";

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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <EditIcon />
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <TrashIcon />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
