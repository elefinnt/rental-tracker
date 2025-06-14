"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  ExternalLink,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RentalApplication } from "@/types/rental";
import { EditApplicationDialog } from "./edit-application-dialog";
import Link from "next/link";

interface ApplicationCardProps {
  application: RentalApplication;
  onUpdate: (id: string, updates: Partial<RentalApplication>) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({
  application,
  onUpdate,
  onDelete,
}: ApplicationCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getStatusColor = (status: RentalApplication["status"]) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: RentalApplication["status"]) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "rejected":
        return "Rejected";
      default:
        return "Not Applying";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="truncate text-lg font-semibold">
                {application.name}
              </h3>
              <div className="text-muted-foreground mt-1 flex items-center text-sm">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(application.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {application.address}
                </Link>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 flex-shrink-0 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(application.id.toString())}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Status and link */}
          <div className="flex items-center justify-between gap-2">
            <Badge className={getStatusColor(application.status)}>
              {getStatusLabel(application.status)}
            </Badge>
            <Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
              <Link
                href={application.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-6 w-6" />
              </Link>
            </Button>
          </div>

          {/* Viewing date */}
          {application.viewingDate && (
            <div className="flex items-center text-sm">
              <Calendar className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                Viewing: {formatDate(application.viewingDate)}
              </span>
            </div>
          )}

          {/* Viewer */}
          <div className="flex items-center text-sm">
            <User className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Viewer: {application.viewer}</span>
          </div>

          {/* Notes */}
          {application.notes && (
            <div className="text-muted-foreground text-sm">
              <p className="line-clamp-2">{application.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditApplicationDialog
        application={application}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
