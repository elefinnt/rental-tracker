"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import type { RentalApplication } from "@/types/rental";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "viewing" | "deadline" | "follow-up";
  application: RentalApplication;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch rental applications from the database
  const {
    data: applications = [],
    isLoading,
    error,
  } = api.rental.getAll.useQuery();

  // Generate calendar events from applications with viewing dates
  const events: CalendarEvent[] = applications
    .filter((app) => app.viewingDate)
    .map((app) => ({
      id: app.id,
      title: `Viewing: ${app.name}`,
      date: new Date(app.viewingDate!),
      type: "viewing" as const,
      application: app,
    }));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="border-border/50 h-24 border" />,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const dayEvents = getEventsForDate(date);
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`border-border/50 hover:bg-muted/50 h-24 cursor-pointer border p-1 transition-colors ${
            isSelected ? "bg-primary/10 border-primary" : ""
          } ${isToday ? "bg-blue-50 dark:bg-blue-950" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div
            className={`text-sm font-medium ${isToday ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="truncate rounded bg-blue-100 p-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {formatTime(event.date)} - {event.application.name}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-muted-foreground text-xs">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View your property viewings and important dates
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading calendar...</div>
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-500">Error loading calendar data</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      year: "numeric",
                    }).format(currentDate)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar header */}
                <div className="mb-2 grid grid-cols-7 gap-0">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-muted-foreground p-2 text-center text-sm font-medium"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>
                {/* Calendar grid */}
                <div className="border-border grid grid-cols-7 gap-0 overflow-hidden rounded-lg border">
                  {renderCalendarDays()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with selected date details */}
          <div className="space-y-4">
            {/* Selected date info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? formatDate(selectedDate) : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {getSelectedDateEvents().length > 0 ? (
                      getSelectedDateEvents().map((event) => (
                        <div key={event.id} className="rounded-lg border p-3">
                          <div className="mb-2 flex items-start justify-between">
                            <Badge variant="secondary">Viewing</Badge>
                            <span className="text-muted-foreground text-sm">
                              {formatTime(event.date)}
                            </span>
                          </div>
                          <h4 className="mb-1 font-medium">
                            {event.application.name}
                          </h4>
                          <div className="text-muted-foreground mb-2 flex items-center text-sm">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.application.address}
                          </div>
                          <div className="text-muted-foreground flex items-center text-sm">
                            <Clock className="mr-1 h-3 w-3" />
                            Viewer: {event.application.viewer}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No events scheduled for this date.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Click on a date to view scheduled events.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter((event) => event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-2"
                      >
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {event.application.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }).format(event.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  {events.filter((event) => event.date >= new Date()).length ===
                    0 && (
                    <p className="text-muted-foreground text-sm">
                      No upcoming events.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
