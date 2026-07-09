import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceRequired: text("service_required"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
