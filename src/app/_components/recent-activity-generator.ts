import type { RentalApplication } from "@/types/rental";

export type ActivityType = "viewing" | "status" | "property" | "notes";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
}

export function generateRecentActivities(
  applications: RentalApplication[],
): Activity[] {
  return applications
    .map((app) => {
      const activities: Activity[] = [];

      if (app.viewingDate) {
        activities.push({
          id: `viewing-${app.id}`,
          type: "viewing",
          title: "Viewing Scheduled",
          description: `Viewing scheduled for ${app.address} on ${new Date(app.viewingDate).toLocaleDateString()} at ${new Date(app.viewingDate).toLocaleTimeString()}`,
          timestamp: app.viewingDate,
        });
      }

      activities.push({
        id: `status-${app.id}`,
        type: "status",
        title: "Status Updated",
        description: `Application status changed to ${app.status} for ${app.address}`,
        timestamp: app.updatedAt,
      });

      activities.push({
        id: `name-${app.id}`,
        type: "property",
        title: "Property Title Updated",
        description: `Property "${app.name}" at ${app.address} was updated`,
        timestamp: app.updatedAt,
      });

      if (app.notes) {
        activities.push({
          id: `notes-${app.id}`,
          type: "notes",
          title: "Notes Updated",
          description: `Notes updated for ${app.address}`,
          timestamp: app.updatedAt,
        });
      }

      return activities;
    })
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by most recent first
    .slice(0, 5);
}
