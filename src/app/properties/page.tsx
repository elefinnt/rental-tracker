"use client";

import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = api.rental.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-600">
            Error loading properties: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental property applications
          </p>
        </div>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t added any properties yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Viewer</TableHead>
                <TableHead>Viewing Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow
                  key={property.id}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/properties/${property.id}`}
                      className="hover:underline"
                    >
                      {property.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.address || "No address"}
                  </TableCell>
                  <TableCell>{property.viewer}</TableCell>
                  <TableCell>
                    {property.viewingDate
                      ? format(new Date(property.viewingDate), "MMM dd, yyyy")
                      : "Not scheduled"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[property.status]}
                    >
                      {statusLabels[property.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {property.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={property.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
