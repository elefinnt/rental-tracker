import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { rentalApplications } from "@/server/db/schema";

// Zod schema for rental application input validation
const createRentalApplicationSchema = z.object({
  name: z.string().min(1, "Name is required").max(256),
  address: z.string().max(512).default(""),
  link: z.string().url("Must be a valid URL").max(1024),
  viewingDate: z.date().optional(),
  viewer: z.string().min(1, "Viewer is required").max(256),
  notes: z.string().max(65535).nullable().optional(),
  status: z
    .enum(["not-applying", "applied", "rejected"])
    .default("not-applying"),
});

const updateRentalApplicationSchema = createRentalApplicationSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  });

export const rentalRouter = createTRPCRouter({
  // Get all rental applications
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(rentalApplications)
      .orderBy(rentalApplications.name);
  }),

  // Create a new rental application
  create: publicProcedure
    .input(createRentalApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const [newApplication] = await ctx.db.insert(rentalApplications).values({
        name: input.name,
        address: input.address,
        link: input.link,
        viewingDate: input.viewingDate,
        viewer: input.viewer,
        notes: input.notes,
        status: input.status,
        createdAt: now,
        updatedAt: now,
      });

      const [createdApplication] = await ctx.db
        .select()
        .from(rentalApplications)
        .where(eq(rentalApplications.id, newApplication.insertId));

      if (!createdApplication) {
        throw new Error("Failed to create rental application");
      }

      return {
        ...createdApplication,
        id: createdApplication.id.toString(),
      };
    }),

  // Update an existing rental application
  update: publicProcedure
    .input(updateRentalApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const now = new Date();

      await ctx.db
        .update(rentalApplications)
        .set({
          ...updateData,
          updatedAt: now,
        })
        .where(eq(rentalApplications.id, id));

      // Fetch the updated application
      const [updatedApplication] = await ctx.db
        .select()
        .from(rentalApplications)
        .where(eq(rentalApplications.id, id));

      if (!updatedApplication) {
        throw new Error("Rental application not found");
      }

      return {
        ...updatedApplication,
        id: updatedApplication.id.toString(),
      };
    }),

  // Delete a rental application
  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(rentalApplications)
        .where(eq(rentalApplications.id, input.id));

      return { success: true };
    }),

  // Get application by ID
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [application] = await ctx.db
        .select()
        .from(rentalApplications)
        .where(eq(rentalApplications.id, input.id));

      if (!application) {
        throw new Error("Rental application not found");
      }

      return {
        ...application,
        id: application.id.toString(),
      };
    }),
});
