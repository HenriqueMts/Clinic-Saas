import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

//criando tabela de usuarios
export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

//criando tabela de clinicas
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando tabela de referencia entre usuarios e clinicas
export const userToClinicsTable = pgTable("user_to_clinic", {
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando relação entre usuarios e clinicas
export const userTableRelations = relations(userTable, ({ many }) => ({
  userToClinic: many(userToClinicsTable),
}));

//criando relação entre usuarios e clinicas
export const userToClinicsTableRelations = relations(
  userToClinicsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [userToClinicsTable.userId],
      references: [userTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [userToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

//criando relação entre clinicas e doutores
export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTabe),
  pacients: many(pacientsTable),
  appointments: many(appointmentsTable),
  userToClinic: many(userToClinicsTable),
}));

//criando tabela de doutores
export const doctorsTabe = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  avaliableFromWeekDay: integer("avaliable_from_week_day").notNull(),
  avaliableToWeekDay: integer("avaliable_to_week_day").notNull(),
  avaliableFromTime: time("avaliable_from_time").notNull(),
  avaliableToTime: time("avaliable_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando relação entre doutores e clinicas
export const doctorsTabeRelations = relations(doctorsTabe, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    //um doutor só tem uma clinica ao qual ele pertence
    fields: [doctorsTabe.clinicId], //o campo doctorsTable dentro de medicos refencia o campo de id da clinica
    references: [clinicsTable.id], //o campo id da clinicas referencia o campo id da tabela clinica
  }),
  appointments: many(appointmentsTable),
}));

//criando enum de sexo de pacientes
export const pacientSexEnum = pgEnum("pacient_sex", ["male", "female"]);

//criando tabela de pacientes
export const pacientsTable = pgTable("pacients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: pacientSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando relação entre pacientes e clinicas
export const pacientsTableRelations = relations(
  pacientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      // um paciente so tem uma clinica ao qual ele pertence
      fields: [pacientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    // um paciente pode ter varios agendamentos
    appointments: many(appointmentsTable),
  }),
);

//criando tabela de agendamentos
export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  pacientId: uuid("pacient_id")
    .notNull()
    .references(() => pacientsTable.id),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTabe.id),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando relação entre agendamentos e pacientes, doutores e clinicas
export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    pacient: one(pacientsTable, {
      fields: [appointmentsTable.pacientId],
      references: [pacientsTable.id],
    }),
    doctor: one(doctorsTabe, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTabe.id],
    }),
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);
