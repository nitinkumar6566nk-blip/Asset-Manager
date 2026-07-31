import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const impactStatsTable = pgTable("impact_stats", {
  id: serial("id").primaryKey(),
  mealsServed: integer("meals_served").notNull().default(125000),
  childrenHelped: integer("children_helped").notNull().default(3800),
  oldAgeResidents: integer("old_age_residents").notNull().default(240),
  medicalCamps: integer("medical_camps").notNull().default(85),
  treesPlanted: integer("trees_planted").notNull().default(12000),
});
