"use client";

import { useState } from "react";
import { Building2, Calendar, FileText, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ApplicationCard } from "./_components/application-card";
import { AddApplicationDialog } from "./_components/add-application-dialog";
import { api } from "@/trpc/react";
import type { RentalApplication } from "@/types/rental";
import { StatsCard } from "./_components/stats-card";
import { QuickActions } from "./_components/quick-actions";
import { RecentActivity } from "./_components/recent-activity";

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

  // Calculate stats
  const totalProperties = applications.length;
  const appliedCount = applications.filter(
    (app) => app.status === "applied",
  ).length;
  const upcomingViewings = applications.filter(
    (app) => app.viewingDate && app.viewingDate > new Date(),
  ).length;

  // Generate recent activity
  const recentActivity = applications
    .map((app) => {
      const activities = [];
      const now = new Date();

      if (app.viewingDate) {
        activities.push({
          id: `viewing-${app.id}`,
          type: "viewing" as const,
          title: "Viewing Scheduled",
          description: `Viewing scheduled for ${app.address}`,
          timestamp: app.viewingDate,
        });
      }

      activities.push({
        id: `status-${app.id}`,
        type: "status" as const,
        title: "Status Updated",
        description: `Application status changed to ${app.status} for ${app.address}`,
        timestamp: now,
      });

      return activities;
    })
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  // Quick actions
  const quickActions = [
    {
      title: "Add Property",
      description: "Add a new property to track",
      icon: Plus,
      onClick: () => setIsAddDialogOpen(true),
    },
    {
      title: "View Calendar",
      description: "Check your upcoming viewings",
      icon: Calendar,
      onClick: () => (window.location.href = "/calendar"),
    },
    // {
    //   title: "View Properties",
    //   description: "See all your tracked properties",
    //   icon: Building2,
    //   onClick: () => (window.location.href = "/properties"),
    // },
    // {
    //   title: "View Applications",
    //   description: "Check your application status",
    //   icon: FileText,
    //   onClick: () => (window.location.href = "/applications"),
    // },
  ];

  return (
    <SidebarInset>
      <main className="flex-1 p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your property viewings and applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Properties"
            value={totalProperties}
            icon={Home}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Applied"
            value={appliedCount}
            icon={FileText}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Upcoming Viewings"
            value={upcomingViewings}
            icon={Calendar}
          />
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Applications grid */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Your Properties</h2>
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="text-muted-foreground">
                  Loading applications...
                </div>
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
              <div className="grid gap-4">
                {applications.slice(0, 3).map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onUpdate={updateApplication}
                    onDelete={deleteApplication}
                  />
                ))}
                {applications.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                    onClick={() => (window.location.href = "/applications")}
                  >
                    View All Properties
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <QuickActions actions={quickActions} />
            <RecentActivity activities={recentActivity} />
          </div>
        </div>

        <AddApplicationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addApplication}
        />
      </main>
    </SidebarInset>
  );
}
