import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
});

//criando tabela de usuarios
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
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
export const usersToClinicsTable = pgTable("user_to_clinic", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//criando relação entre usuarios e clinicas
export const usersTableRelations = relations(usersTable, ({ many }) => ({
  userToClinic: many(usersToClinicsTable),
}));

//criando relação entre usuarios e clinicas
export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

//criando relação entre clinicas e doutores
export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTabe),
  pacients: many(pacientsTable),
  appointments: many(appointmentsTable),
  userToClinic: many(usersToClinicsTable),
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
