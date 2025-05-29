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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Eye, MapPin, Calendar, User } from "lucide-react";
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
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Properties
          </h1>
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
        <>
          {/* Desktop Table View */}
          <div className="hidden w-full rounded-lg border md:block">
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
                            <Link
                              href={property.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 px-4 md:hidden">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Link href={`/properties/${property.id}`}>
                      <CardTitle className="text-lg leading-tight hover:underline">
                        {property.name}
                      </CardTitle>
                    </Link>
                    <Badge
                      variant="secondary"
                      className={`${statusColors[property.status]} text-xs`}
                    >
                      {statusLabels[property.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {property.address || "No address"}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>{property.viewer}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {property.viewingDate
                          ? format(
                              new Date(property.viewingDate),
                              "MMM dd, yyyy",
                            )
                          : "Not scheduled"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/properties/${property.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    {property.link && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={property.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
