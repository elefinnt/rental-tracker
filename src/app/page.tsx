"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ApplicationCard } from "./_components/application-card";
import { AddApplicationDialog } from "./_components/add-application-dialog";
import { api } from "@/trpc/react";
import type { RentalApplication } from "@/types/rental";

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // tRPC queries and mutations
  const {
    data: applications = [],
    isLoading,
    refetch,
  } = api.rental.getAll.useQuery();
  const createMutation = api.rental.create.useMutation({
    onSuccess: () => {
      void refetch();
      setIsAddDialogOpen(false);
    },
  });
  const updateMutation = api.rental.update.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const deleteMutation = api.rental.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addApplication = (
    application: Omit<RentalApplication, "id" | "createdAt" | "updatedAt">,
  ) => {
    createMutation.mutate({
      ...application,
      viewingDate: application.viewingDate ?? undefined,
      notes: application.notes,
    });
  };

  const updateApplication = (
    id: string,
    updates: Partial<RentalApplication>,
  ) => {
    const { id: _, ...updateData } = updates;
    updateMutation.mutate({
      id: parseInt(id),
      ...updateData,
      viewingDate: updateData.viewingDate ?? undefined,
      notes: updateData.notes,
    });
  };

  const deleteApplication = (id: string) => {
    deleteMutation.mutate({ id: parseInt(id) });
  };

  return (
    <SidebarInset>
      <main className="flex-1 p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Rental Applications</h1>
              <p className="text-muted-foreground">
                Track your property viewings and applications
              </p>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold">{applications.length}</div>
            <div className="text-muted-foreground text-sm">
              Total Properties
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((app) => app.status === "applied").length}
            </div>
            <div className="text-muted-foreground text-sm">Applied</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                applications.filter(
                  (app) => app.viewingDate && app.viewingDate > new Date(),
                ).length
              }
            </div>
            <div className="text-muted-foreground text-sm">
              Upcoming Viewings
            </div>
          </div>
        </div>

        {/* Applications grid */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="text-muted-foreground">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-4">
              No rental applications yet
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onUpdate={updateApplication}
                onDelete={deleteApplication}
              />
            ))}
          </div>
        )}

        <AddApplicationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addApplication}
        />
      </main>
    </SidebarInset>
  );
}
