import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import type { Medication } from "./UploadPrescription";
import type { CheckIn } from "./DailyCheckIn";

interface ReportComposerProps {
  meds: Medication[];
  checkIns: CheckIn[];
}

const ReportComposer = ({ meds, checkIns }: ReportComposerProps) => {
  const [doctorEmail, setDoctorEmail] = useState("");
  const [summary, setSummary] = useState<string | null>(null);

  const missedCount = useMemo(() => checkIns.filter((c) => !c.tookAllMeds).length, [checkIns]);
  const avg = (k: keyof CheckIn) => Math.round(checkIns.reduce((a, b) => a + (b[k] as number), 0) / Math.max(1, checkIns.length));
  const frequentSideEffects = useMemo(() => {
    const map: Record<string, number> = {};
    checkIns.forEach((c) => c.sideEffects.forEach((s) => (map[s] = (map[s] || 0) + 1)));
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => k);
  }, [checkIns]);

  const generate = () => {
    const lines: string[] = [];
    lines.push(`Medications: ${meds.map((m) => `${m.name} ${m.dosage} (${m.frequency})`).join(", ") || "None uploaded yet"}.`);
    lines.push(`Check-ins: ${checkIns.length} entries. Avg mood ${avg("mood")}%, energy ${avg("energy")}%, pain ${avg("pain")}%`);
    if (missedCount >= 2) lines.push(`Alert: ${missedCount} reported missed dose(s).`);
    if (frequentSideEffects.length) lines.push(`Common side effects: ${frequentSideEffects.join(", ")}.`);
    setSummary(lines.join("\n"));
    toast({ title: "AI summary prepared", description: "Review the summary before sending." });
  };

  const send = () => {
    if (!doctorEmail) {
      toast({ title: "Doctor email required", description: "Add a clinic or doctor email.", variant: "destructive" });
      return;
    }
    toast({ title: "Report sent (demo)", description: `We would email ${doctorEmail} once approved.` });
  };

  return (
    <section>
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Doctor report (preview)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Button variant="outline" onClick={generate}>Generate AI summary</Button>
            <div className="flex-1 flex items-center gap-2">
              <Input type="email" placeholder="doctor@clinic.com" value={doctorEmail} onChange={(e)=>setDoctorEmail(e.target.value)} aria-label="Doctor email" />
              <Button variant="hero" onClick={send}>Send</Button>
            </div>
          </div>
          <div className="rounded-md border p-4 bg-background/60">
            {summary ? (
              <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Generate a summary to preview the content here. PDF export and email delivery will be added with backend integration.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReportComposer;
