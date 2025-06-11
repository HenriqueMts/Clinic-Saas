"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertAppointment } from "@/app/actions/upsert-appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type doctorsTable, type patientsTable } from "@/db/schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientId: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  doctorId: z.string({
    required_error: "Por favor, selecione um médico",
  }),
  appointmentPrice: z.string({
    required_error: "Por favor, insira o valor da consulta",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  time: z.string({
    required_error: "Por favor, selecione um horário",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface UpsertAppointmentFormProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess?: () => void;
}

export function UpsertAppointmentForm({
  doctors,
  patients,
  onSuccess,
}: UpsertAppointmentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: "",
      time: "",
    },
  });

  const { execute, status } = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Consulta agendada com sucesso");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      const errorMessage = error.error.serverError as string | undefined;
      toast.error(errorMessage || "Algo deu errado");
    },
  });

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === form.watch("doctorId"),
  );

  const onSubmit = (values: FormValues) => {
    execute({
      patientId: values.patientId,
      doctorId: values.doctorId,
      date: values.date,
      time: values.time,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Médico</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const doctor = doctors.find((d) => d.id === value);
                  if (doctor) {
                    form.setValue(
                      "appointmentPrice",
                      (doctor.appointmentPriceInCents / 100).toFixed(2),
                    );
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um médico" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appointmentPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Consulta</FormLabel>
              <FormControl>
                <NumericFormat
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedDoctor}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={!selectedDoctor || !form.watch("patientId")}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() ||
                      date.getDay() === 0 ||
                      date.getDay() === 6
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={
                  !selectedDoctor ||
                  !form.watch("patientId") ||
                  !form.watch("date")
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => {
                    const hour = i + 9; // 9 AM to 4 PM
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={status === "executing"}
        >
          {status === "executing" ? "Agendando..." : "Agendar Consulta"}
        </Button>
      </form>
    </Form>
  );
}
