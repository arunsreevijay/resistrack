import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  organization: text("organization"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Bacteria table
export const bacteria = pgTable("bacteria", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  scientificName: text("scientific_name").notNull(),
  description: text("description"),
});

export const insertBacteriaSchema = createInsertSchema(bacteria).omit({
  id: true,
});

// Antibiotics table
export const antibiotics = pgTable("antibiotics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  class: text("class").notNull(),
  description: text("description"),
});

export const insertAntibioticSchema = createInsertSchema(antibiotics).omit({
  id: true,
});

// Regions table
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  parentId: integer("parent_id").references(() => regions.id),
  geoJson: jsonb("geo_json"),
});

export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
});

// Facilities table
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  regionId: integer("region_id").references(() => regions.id).notNull(),
  address: text("address"),
  contactInfo: text("contact_info"),
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
});

// Resistance data table
export const resistanceData = pgTable("resistance_data", {
  id: serial("id").primaryKey(),
  bacteriaId: integer("bacteria_id").references(() => bacteria.id).notNull(),
  antibioticId: integer("antibiotic_id").references(() => antibiotics.id).notNull(),
  regionId: integer("region_id").references(() => regions.id).notNull(),
  facilityId: integer("facility_id").references(() => facilities.id),
  sampleDate: date("sample_date").notNull(),
  totalSamples: integer("total_samples").notNull(),
  resistantSamples: integer("resistant_samples").notNull(),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  notes: text("notes"),
});

export const insertResistanceDataSchema = createInsertSchema(resistanceData).omit({
  id: true,
  uploadedAt: true,
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // document, webinar, guide, etc.
  url: text("url").notNull(),
  description: text("description"),
  publishedAt: timestamp("published_at").notNull(),
  addedById: integer("added_by_id").references(() => users.id),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, warning, info
  bacteriaId: integer("bacteria_id").references(() => bacteria.id),
  antibioticId: integer("antibiotic_id").references(() => antibiotics.id),
  regionId: integer("region_id").references(() => regions.id),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bacteria = typeof bacteria.$inferSelect;
export type InsertBacteria = z.infer<typeof insertBacteriaSchema>;

export type Antibiotic = typeof antibiotics.$inferSelect;
export type InsertAntibiotic = z.infer<typeof insertAntibioticSchema>;

export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;

export type ResistanceData = typeof resistanceData.$inferSelect;
export type InsertResistanceData = z.infer<typeof insertResistanceDataSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Summary types for the dashboard
export type ResistanceSummary = {
  totalSamples: number;
  resistantIsolates: number;
  resistanceRate: number;
  participatingFacilities: number;
};

export type ResistanceTrend = {
  month: string;
  bacteriaId: number;
  bacteriaName: string;
  resistanceRate: number;
};

export type AntibioticEffectiveness = {
  id: number;
  name: string;
  effectiveness: number;
  regions: string[];
};

// Dashboard filter state type
export type FilterState = {
  bacteriaId?: number;
  antibioticId?: number;
  regionId?: number;
  timePeriod: string;
  fromDate?: Date;
  toDate?: Date;
};
