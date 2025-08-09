import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreakCardProps {
  streak: number;
  completionRate: number; // 0-100
}

const StreakCard = ({ streak, completionRate }: StreakCardProps) => {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Consistency streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-5xl font-extrabold text-gradient">{streak}</div>
            <p className="text-sm text-muted-foreground">days in a row</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border flex items-center justify-center">
              <span className="text-lg font-semibold">{Math.round(completionRate)}%</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[12rem]">Daily check‑ins completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
