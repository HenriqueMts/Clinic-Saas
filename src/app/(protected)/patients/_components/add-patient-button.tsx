"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import UpsertPatientForm from "@/app/(protected)/patients/_components/upsert-patient-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Paciente
        </Button>
      </DialogTrigger>

      <UpsertPatientForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddPatientButton;
