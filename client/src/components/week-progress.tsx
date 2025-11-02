import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { getCurrentWeekNumber, getWeekProgressMessage, getDaysUntilNextWeek } from "@/lib/week-tracker";

interface WeekProgressProps {
  userCreatedAt: string;
}

export function WeekProgress({ userCreatedAt }: WeekProgressProps) {
  const weekNumber = getCurrentWeekNumber(userCreatedAt);
  const message = getWeekProgressMessage(weekNumber);
  const daysUntilNextWeek = getDaysUntilNextWeek(userCreatedAt);

  return (
    <Card data-testid="card-week-progress">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Your Journey</CardTitle>
          <CardDescription>Week-by-week progress</CardDescription>
        </div>
        <TrendingUp className="h-4 w-4 text-sage" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold" data-testid="text-week-number">
            Week {weekNumber}
          </span>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-week-message">
          {message}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span data-testid="text-days-remaining">
            {daysUntilNextWeek} day{daysUntilNextWeek !== 1 ? 's' : ''} until week {weekNumber + 1}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
