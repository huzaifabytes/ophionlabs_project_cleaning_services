import { pgTable, text, serial, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const slidesTable = pgTable("slides", {
  id: serial("id").primaryKey(),
  heading: text("heading").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  overlayOpacity: real("overlay_opacity").notNull().default(0.5),
  sortOrder: integer("sort_order").notNull().default(0),
  autoplay: boolean("autoplay").notNull().default(true),
  autoplaySpeed: integer("autoplay_speed").notNull().default(5000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
