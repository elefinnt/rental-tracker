export interface RentalApplication {
  id: string;
  name: string;
  address: string;
  link: string;
  viewingDate?: Date | null;
  viewer: string;
  notes: string | null;
  status: "not-applying" | "applied" | "rejected";
}

export type CreateRentalApplicationInput = Omit<
  RentalApplication,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateRentalApplicationInput =
  Partial<CreateRentalApplicationInput> & { id: string };

export interface User {
  id: string;
  firstName: string;
}

export type CreateUserInput = Omit<User, "id">;
export type UpdateUserInput = Partial<CreateUserInput> & { id: string };
