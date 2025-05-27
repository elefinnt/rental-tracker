"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ApplicationCard } from "./_components/application-card";
import { AddApplicationDialog } from "./_components/add-application-dialog";

export interface RentalApplication {
  id: string;
  name: string;
  address: string;
  link: string;
  viewingDate?: Date;
  viewer: string;
  notes: string;
  status: "not-applying" | "applied" | "rejected";
  createdAt: Date;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<RentalApplication[]>([
    {
      id: "1",
      name: "Modern 2BR Apartment",
      address: "123 Oak Street, Downtown",
      link: "https://example.com/listing1",
      viewingDate: new Date("2024-01-15T14:00:00"),
      viewer: "John & Sarah",
      notes: "Great location, close to metro. Ask about parking.",
      status: "applied",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "2",
      name: "Cozy Studio",
      address: "456 Pine Avenue, Midtown",
      link: "https://example.com/listing2",
      viewer: "John",
      notes: "Small but well-designed. Good for single person.",
      status: "not-applying",
      createdAt: new Date("2024-01-12"),
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addApplication = (
    application: Omit<RentalApplication, "id" | "createdAt">,
  ) => {
    const newApplication: RentalApplication = {
      ...application,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setApplications((prev) => [newApplication, ...prev]);
  };

  const updateApplication = (
    id: string,
    updates: Partial<RentalApplication>,
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app)),
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
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

        {applications.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-4">
              No rental applications yet
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
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
