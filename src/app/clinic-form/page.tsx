import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./components/form";

const ClinicFormPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <Dialog open={true}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crie sua Clínica</DialogTitle>
              <DialogDescription>
                Adicione uma clínica para continuar
              </DialogDescription>
            </DialogHeader>

            <ClinicForm />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
