import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";

// Zod schema for user input validation
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(256),
});

const updateUserSchema = createUserSchema.partial().extend({
  id: z.number().int().positive(),
});

export const usersRouter = createTRPCRouter({
  // Get all users
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db.select().from(users).orderBy(users.firstName);

    return allUsers.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));
  }),

  // Create a new user
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const [newUser] = await ctx.db.insert(users).values({
        firstName: input.firstName,
      });

      // Fetch the created user to return it with all fields
      const [createdUser] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, newUser.insertId));

      if (!createdUser) {
        throw new Error("Failed to create user");
      }

      return {
        ...createdUser,
        id: createdUser.id.toString(),
      };
    }),

  // Update an existing user
  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await ctx.db.update(users).set(updateData).where(eq(users.id, id));

      // Fetch the updated user
      const [updatedUser] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        ...updatedUser,
        id: updatedUser.id.toString(),
      };
    }),

  // Delete a user
  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id));

      return { success: true };
    }),

  // Get a single user by ID
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id));

      if (!user) {
        throw new Error("User not found");
      }

      return {
        ...user,
        id: user.id.toString(),
      };
    }),
});
