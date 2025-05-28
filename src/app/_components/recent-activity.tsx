import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "viewing" | "application" | "status";
  title: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="hover:bg-accent flex items-start gap-4 rounded-lg border p-4 transition-colors"
              >
                <div
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    activity.type === "viewing" && "bg-blue-500",
                    activity.type === "application" && "bg-green-500",
                    activity.type === "status" && "bg-yellow-500",
                  )}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {activity.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {activity.description}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
