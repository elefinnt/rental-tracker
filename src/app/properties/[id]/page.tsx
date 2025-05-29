"use client";

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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";

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

  const {
    data: property,
    isLoading,
    error,
  } = api.rental.getById.useQuery(
    { id: propertyId },
    { enabled: !isNaN(propertyId) },
  );

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
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={statusColors[property.status]}
                  >
                    {statusLabels[property.status]}
                  </Badge>
                </div>
              </div>
              {property.link && (
                <Button asChild>
                  <a
                    href={property.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Listing
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-muted-foreground">
                    {property.address || "No address provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Viewer</p>
                  <p className="text-muted-foreground">{property.viewer}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Viewing Date</p>
                  <p className="text-muted-foreground">
                    {property.viewingDate
                      ? format(
                          new Date(property.viewingDate),
                          "EEEE, MMMM dd, yyyy",
                        )
                      : "Not scheduled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {format(new Date(property.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {property.notes && (
              <div>
                <h3 className="mb-3 text-lg font-medium">Notes</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{property.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
