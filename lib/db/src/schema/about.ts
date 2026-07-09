import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const aboutTable = pgTable("about", {
  id: serial("id").primaryKey(),
  introduction: text("introduction"),
  mission: text("mission"),
  vision: text("vision"),
  experience: text("experience"),
});
