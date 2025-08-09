import { PropsWithChildren, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Home, ClipboardCheck, FileText } from "lucide-react";

interface MobileShellProps extends PropsWithChildren {
  onGo(sectionId: string): void;
}

const MobileShell = ({ children, onGo }: MobileShellProps) => {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container py-3 flex items-center justify-between">
          <div className="font-extrabold text-lg"><span className="text-gradient">MediTrack</span></div>
          <div className="text-xs text-muted-foreground">{year}</div>
        </div>
      </header>

      <main className="pb-28 container safe-bottom animate-fade-in">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/90 backdrop-blur-md">
        <div className="container grid grid-cols-3 gap-2 py-2">
          <Button variant="ghost" onClick={() => onGo("upload")} className="flex flex-col items-center hover-scale">
            <Home className="mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" onClick={() => onGo("daily-checkin")} className="flex flex-col items-center hover-scale">
            <ClipboardCheck className="mb-1" />
            <span className="text-xs">Check‑in</span>
          </Button>
          <Button variant="ghost" onClick={() => onGo("reports")} className="flex flex-col items-center hover-scale">
            <FileText className="mb-1" />
            <span className="text-xs">Reports</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default MobileShell;
