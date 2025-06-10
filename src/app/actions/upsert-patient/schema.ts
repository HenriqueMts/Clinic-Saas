import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(1, {
    message: "Telefone é obrigatório.",
  }),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    required_error: "Sexo é obrigatório.",
  }),
});
