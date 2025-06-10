"use client";

import { useState } from "react";

import UpsertPatientForm from "@/app/(protected)/patients/_components/upsert-patient-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { patientsTable } from "@/db/schema";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const [upsertPatientDialogOpen, setUpsertPatientDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">{patient.email}</p>
          <p className="text-muted-foreground text-sm">{patient.phoneNumber}</p>
          <p className="text-muted-foreground text-sm">
            {patient.sex === "male" ? "Masculino" : "Feminino"}
          </p>
        </div>
        <Dialog
          open={upsertPatientDialogOpen}
          onOpenChange={setUpsertPatientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              Editar
            </Button>
          </DialogTrigger>
          <UpsertPatientForm
            isOpen={upsertPatientDialogOpen}
            patient={patient}
            onSuccess={() => setUpsertPatientDialogOpen(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
