"use client";

import type React from "react";

import { useState } from "react";
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

interface AddApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    application: Omit<RentalApplication, "id" | "createdAt" | "updatedAt">,
  ) => void;
}

export function AddApplicationDialog({
  open,
  onOpenChange,
  onAdd,
}: AddApplicationDialogProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time if both provided
    let viewingDate: Date | undefined;
    if (formData.viewingDate && formData.viewingTime) {
      viewingDate = new Date(`${formData.viewingDate}T${formData.viewingTime}`);
    }

    onAdd({
      name: formData.name,
      address: formData.address,
      link: formData.link,
      viewingDate,
      viewer: formData.viewer,
      notes: formData.notes || null,
      status: formData.status,
    });

    // Reset form
    setFormData({
      name: "",
      address: "",
      link: "",
      viewingDate: "",
      viewingTime: "",
      viewer: "",
      notes: "",
      status: "not-applying",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Modern 2BR Apartment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="e.g., 123 Oak Street, Downtown"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Property Link *</Label>
            <Input
              id="link"
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
              <Label htmlFor="viewingDate">Viewing Date</Label>
              <Input
                id="viewingDate"
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
              <Label htmlFor="viewingTime">Viewing Time</Label>
              <Input
                id="viewingTime"
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
            <Label htmlFor="viewer">Who&apos;s Viewing *</Label>
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
                  id="viewer"
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
            <Label htmlFor="status">Status</Label>
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
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
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
