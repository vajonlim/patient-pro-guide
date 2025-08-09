import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "@/components/meditrack/Hero";
import UploadPrescription, { type Medication } from "@/components/meditrack/UploadPrescription";
import DailyCheckIn, { type CheckIn } from "@/components/meditrack/DailyCheckIn";
import StreakCard from "@/components/meditrack/StreakCard";
import ReportComposer from "@/components/meditrack/ReportComposer";
import { Helmet } from "react-helmet-async";
import MobileShell from "@/components/meditrack/MobileShell";

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

  const uploadRef = useRef<HTMLDivElement>(null);
  const checkinRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const scrollTo = (id: string) => {
    const map: Record<string, HTMLDivElement | null> = {
      "upload": uploadRef.current,
      "daily-checkin": checkinRef.current,
      "reports": reportsRef.current,
    };
    map[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const todayKey = useMemo(() => new Date().toISOString().slice(0,10), []);
  const todayAlreadyDone = checkIns.some((c) => c.date === todayKey);

  const streak = useMemo(() => {
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
    <MobileShell onGo={scrollTo}>
      <Helmet>
        <title>MediTrack AI — Smart medication reminders</title>
        <meta name="description" content="Track medications, get reminders, complete daily check-ins, and share AI summaries with doctors." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>

      <div className="space-y-8">
        <Hero onCTAClick={() => scrollTo('upload')} />

        <div ref={uploadRef} id="upload" className="grid gap-6 md:grid-cols-2 animate-enter">
          <UploadPrescription onExtract={setMeds} />
          <StreakCard streak={streak} completionRate={completionRate} />
        </div>

        <div ref={checkinRef} id="daily-checkin" className="animate-enter">
          <DailyCheckIn onSubmit={addCheckIn} todayAlreadyDone={todayAlreadyDone} />
        </div>

        <div ref={reportsRef} id="reports" className="animate-enter">
          <ReportComposer meds={meds} checkIns={checkIns} />
        </div>

        <footer className="py-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MediTrack. Be kind to yourself — you’re building healthy habits.</p>
        </footer>
      </div>
    </MobileShell>
  );
};

export default Index;
