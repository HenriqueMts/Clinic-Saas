"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { UpsertAppointmentForm } from "@/app/(protected)/appointments/_components/upsert-appointment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type doctorsTable, type patientsTable } from "@/db/schema";

interface AppointmentsClientProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
}

export function AppointmentsClient({
  doctors,
  patients,
}: AppointmentsClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Consultas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar consulta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar uma nova consulta</DialogTitle>
            </DialogHeader>
            <UpsertAppointmentForm
              doctors={doctors}
              patients={patients}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
