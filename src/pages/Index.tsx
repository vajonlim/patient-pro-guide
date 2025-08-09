import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "@/components/meditrack/Hero";
import UploadPrescription, { type Medication } from "@/components/meditrack/UploadPrescription";
import DailyCheckIn, { type CheckIn } from "@/components/meditrack/DailyCheckIn";
import StreakCard from "@/components/meditrack/StreakCard";
import ReportComposer from "@/components/meditrack/ReportComposer";
import { Helmet } from "react-helmet-async";

const LS_KEYS = {
  meds: "meditrack_meds",
  checkins: "meditrack_checkins",
};

const Index = () => {
  const [meds, setMeds] = useState<Medication[]>(() => {
    const raw = localStorage.getItem(LS_KEYS.meds);
    return raw ? JSON.parse(raw) : [];
  });
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const raw = localStorage.getItem(LS_KEYS.checkins);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(LS_KEYS.meds, JSON.stringify(meds));
  }, [meds]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.checkins, JSON.stringify(checkIns));
  }, [checkIns]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollToUpload = () => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const todayKey = useMemo(() => new Date().toISOString().slice(0,10), []);
  const todayAlreadyDone = checkIns.some((c) => c.date === todayKey);

  const streak = useMemo(() => {
    // Count consecutive days up to today
    let count = 0;
    const days = new Set(checkIns.map((c) => c.date));
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const k = d.toISOString().slice(0,10);
      if (days.has(k)) { count++; d.setDate(d.getDate() - 1); } else { break; }
    }
    return count;
  }, [checkIns]);

  const completionRate = useMemo(() => {
    // last 14 days percentage
    const d = new Date();
    const keys: string[] = [];
    for (let i = 0; i < 14; i++) { keys.push(d.toISOString().slice(0,10)); d.setDate(d.getDate() - 1); }
    const set = new Set(checkIns.map((c) => c.date));
    const completed = keys.filter(k => set.has(k)).length;
    return (completed / keys.length) * 100;
  }, [checkIns]);

  const addCheckIn = (entry: CheckIn) => setCheckIns((prev) => {
    const filtered = prev.filter((c) => c.date !== entry.date);
    return [...filtered, entry].sort((a,b) => a.date.localeCompare(b.date));
  });

  return (
    <main className="min-h-screen container py-10 space-y-10">
      <Helmet>
        <title>MediTrack AI — Smart medication reminders</title>
        <meta name="description" content="Track medications, get reminders, complete daily check-ins, and share AI summaries with doctors." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>

      <Hero onCTAClick={scrollToUpload} />

      <div ref={sectionRef} className="grid gap-6 md:grid-cols-2">
        <UploadPrescription onExtract={setMeds} />
        <StreakCard streak={streak} completionRate={completionRate} />
      </div>

      <DailyCheckIn onSubmit={addCheckIn} todayAlreadyDone={todayAlreadyDone} />

      <ReportComposer meds={meds} checkIns={checkIns} />

      <footer className="py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MediTrack. Be kind to yourself — you’re building healthy habits.</p>
      </footer>
    </main>
  );
};

export default Index;
