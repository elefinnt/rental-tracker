"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RentalApplication } from "@/types/rental";
import { api } from "@/trpc/react";

interface EditApplicationDialogProps {
  application: RentalApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<RentalApplication>) => void;
}

export function EditApplicationDialog({
  application,
  open,
  onOpenChange,
  onUpdate,
}: EditApplicationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    link: "",
    viewingDate: "",
    viewingTime: "",
    viewer: "",
    notes: "",
    status: "not-applying" as RentalApplication["status"],
  });

  // Fetch users for the viewer dropdown
  const { data: users = [] } = api.users.getAll.useQuery();

  // Populate form when dialog opens
  useEffect(() => {
    if (open && application) {
      const viewingDate = application.viewingDate;
      setFormData({
        name: application.name,
        address: application.address,
        link: application.link,
        viewingDate: viewingDate
          ? (new Date(viewingDate).toISOString().split("T")[0] ?? "")
          : "",
        viewingTime: viewingDate
          ? (new Date(viewingDate).toTimeString().slice(0, 5) ?? "")
          : "",
        viewer: application.viewer,
        notes: application.notes ?? "",
        status: application.status,
      });
    }
  }, [open, application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time if both provided
    let viewingDate: Date | undefined;
    if (formData.viewingDate && formData.viewingTime) {
      viewingDate = new Date(`${formData.viewingDate}T${formData.viewingTime}`);
    }

    onUpdate(application.id.toString(), {
      name: formData.name,
      address: formData.address,
      link: formData.link,
      viewingDate,
      viewer: formData.viewer,
      notes: formData.notes || null,
      status: formData.status,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Property Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Modern 2BR Apartment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Address *</Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="e.g., 123 Oak Street, Downtown"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link">Property Link *</Label>
            <Input
              id="edit-link"
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="https://..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-viewingDate">Viewing Date</Label>
              <Input
                id="edit-viewingDate"
                type="date"
                value={formData.viewingDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    viewingDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-viewingTime">Viewing Time</Label>
              <Input
                id="edit-viewingTime"
                type="time"
                value={formData.viewingTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    viewingTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-viewer">Who&apos;s Viewing *</Label>
            {users.length > 0 ? (
              <Select
                value={formData.viewer}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, viewer: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a viewer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.firstName}>
                      {user.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  id="edit-viewer"
                  value={formData.viewer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, viewer: e.target.value }))
                  }
                  placeholder="e.g., John & Sarah"
                  required
                />
                <p className="text-muted-foreground text-sm">
                  No users found. Add users in Settings to use the dropdown.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: RentalApplication["status"]) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-applying">Not Applying</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional notes about the property..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Property</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
