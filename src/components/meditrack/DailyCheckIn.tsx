import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

export interface CheckIn {
  date: string; // ISO date (YYYY-MM-DD)
  mood: number; // 0-100
  energy: number; // 0-100
  pain: number; // 0-100
  sideEffects: string[];
  notes?: string;
  tookAllMeds: boolean;
}

const sideEffectOptions = ["Nausea", "Dizziness", "Headache", "Fatigue", "Insomnia"];

interface DailyCheckInProps {
  onSubmit: (entry: CheckIn) => void;
  todayAlreadyDone?: boolean;
}

const DailyCheckIn = ({ onSubmit, todayAlreadyDone }: DailyCheckInProps) => {
  const [mood, setMood] = useState(70);
  const [energy, setEnergy] = useState(70);
  const [pain, setPain] = useState(10);
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [tookMeds, setTookMeds] = useState(true);

  const date = useMemo(() => new Date().toISOString().slice(0,10), []);

  const toggleEffect = (name: string, value: boolean) => {
    setChecked((prev) => value ? [...prev, name] : prev.filter((x) => x !== name));
  };

  const handleSubmit = () => {
    if (todayAlreadyDone) {
      toast({ title: "Already submitted", description: "Come back tomorrow for your next check‑in." });
      return;
    }
    const entry = { date, mood, energy, pain, sideEffects: checked, notes, tookAllMeds: tookMeds };
    onSubmit(entry);
    toast({ title: "Great job!", description: "Your daily check‑in is saved." });
    setNotes("");
  };

  return (
    <section id="daily-checkin">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Daily well‑being check‑in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm mb-2">Mood</p>
              <Slider defaultValue={[mood]} max={100} step={1} onValueChange={(v) => setMood(v[0])} />
            </div>
            <div>
              <p className="text-sm mb-2">Energy</p>
              <Slider defaultValue={[energy]} max={100} step={1} onValueChange={(v) => setEnergy(v[0])} />
            </div>
            <div>
              <p className="text-sm mb-2">Pain</p>
              <Slider defaultValue={[pain]} max={100} step={1} onValueChange={(v) => setPain(v[0])} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm">Side effects</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sideEffectOptions.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={checked.includes(name)} onCheckedChange={(v) => toggleEffect(name, Boolean(v))} />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Notes (optional)</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything you want your doctor to know?" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={tookMeds} onCheckedChange={(v) => setTookMeds(Boolean(v))} />
            I took all my prescribed meds today
          </label>

          <div className="pt-2">
            <Button variant="hero" size="lg" onClick={handleSubmit} aria-label="Submit daily check-in">{todayAlreadyDone ? "Check‑in completed" : "Save today’s check‑in"}</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DailyCheckIn;
