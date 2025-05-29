"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  User,
  FileText,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";
import { EditApplicationDialog } from "@/app/_components/edit-application-dialog";
import type { RentalApplication } from "@/types/rental";

const statusColors = {
  "not-applying": "bg-gray-100 text-gray-800",
  applied: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
} as const;

const statusLabels = {
  "not-applying": "Not Applying",
  applied: "Applied",
  rejected: "Rejected",
} as const;

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params);
  const propertyId = Number.parseInt(id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: property,
    isLoading,
    error,
    refetch,
  } = api.rental.getById.useQuery(
    { id: propertyId },
    { enabled: !isNaN(propertyId) },
  );

  const updateMutation = api.rental.update.useMutation({
    onSuccess: () => {
      void refetch();
      setIsEditDialogOpen(false);
    },
  });

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

  if (isNaN(propertyId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-600">Invalid property ID</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading property...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-600">
            Error loading property: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Property not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/properties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.name}
            </h1>
            <p className="text-muted-foreground">
              Property details and application status
            </p>
          </div>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span>{property.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="text-muted-foreground h-4 w-4" />
              <Link
                href={property.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Listing
              </Link>
            </div>
            {property.viewingDate && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>
                  Viewing scheduled for{" "}
                  {format(new Date(property.viewingDate), "PPP p")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>Viewer: {property.viewer}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <Badge
                className={statusColors[property.status]}
                variant="secondary"
              >
                {statusLabels[property.status]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {property.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{property.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditApplicationDialog
        application={property}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={updateApplication}
      />
    </div>
  );
}
