import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";

export type NavItem = {
  label: string;
  href: string;
  visible: boolean;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("CleanPro"),
  primaryColor: text("primary_color").notNull().default("#0074FC"),
  secondaryColor: text("secondary_color").notNull().default("#000C26"),
  fontFamily: text("font_family").notNull().default("Inter"),
  faviconUrl: text("favicon_url"),
  logoUrl: text("logo_url"),
  contactInfo: text("contact_info"),
  whatsappNumber: text("whatsapp_number"),
  instagramUrl: text("instagram_url"),
  businessAddress: text("business_address"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  seoKeywords: text("seo_keywords"),
  footerText: text("footer_text"),
  navItems: jsonb("nav_items").$type<NavItem[]>().notNull().default([]),
  socialLinks: jsonb("social_links").$type<SocialLink[]>().notNull().default([]),
  sheetsScriptUrl: text("sheets_script_url"),
  sheetsSpreadsheetId: text("sheets_spreadsheet_id"),
  sheetsSheetName: text("sheets_sheet_name"),
});
