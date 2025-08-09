import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/meditrack-hero.jpg";

interface HeroProps {
  onCTAClick?: () => void;
}

const Hero = ({ onCTAClick }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header className="relative overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm p-10 md:p-14 card-elevated">
      <div ref={containerRef} className="pointer-spotlight" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="text-gradient">MediTrack AI</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Friendly medication reminders, daily well-being check-ins, and AI summaries for your doctor.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="hero" size="xl" onClick={onCTAClick} aria-label="Upload prescription PDF">
            Upload prescription
          </Button>
          <a href="#daily-checkin" className="inline-flex">
            <Button variant="outline" size="lg">Daily check-in</Button>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">You're doing great — consistency beats perfection.</p>
      </div>
      <div className="relative z-0 mt-8 md:mt-0 md:absolute md:-right-6 md:bottom-0 md:opacity-90 pointer-events-none select-none">
        <img src={heroImage} alt="MediTrack AI medical gradient illustration" loading="lazy" className="w-[480px] max-w-none hidden md:block" />
      </div>
    </header>
  );
};

export default Hero;
