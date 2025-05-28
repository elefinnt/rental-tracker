// Database schema for the rental tracker application
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, mysqlTableCreator } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(
  (name) => `rental-tracker_${name}`,
);

export const users = createTable("user", (d) => ({
  id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
  firstName: d.varchar({ length: 256 }).notNull(),
}));

export const rentalApplications = createTable(
  "rental_application",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.varchar({ length: 256 }).notNull(),
    address: d.varchar({ length: 512 }).notNull(),
    link: d.varchar({ length: 1024 }).notNull(),
    viewingDate: d.timestamp(),
    viewer: d.varchar({ length: 256 }).notNull(),
    notes: d.text(),
    status: d
      .mysqlEnum(["not-applying", "applied", "rejected"])
      .notNull()
      .default("not-applying"),
    createdAt: d.timestamp().notNull().defaultNow(),
    updatedAt: d.timestamp().notNull().defaultNow(),
  }),
  (t) => [index("name_idx").on(t.name), index("status_idx").on(t.status)],
);
