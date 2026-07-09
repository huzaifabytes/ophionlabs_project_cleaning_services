import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
