import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface UploadPrescriptionProps {
  onExtract: (meds: Medication[]) => void;
}

const mockMeds: Medication[] = [
  { name: "Metformin", dosage: "500mg", frequency: "2x daily" },
  { name: "Atorvastatin", dosage: "20mg", frequency: "1x nightly" },
  { name: "Lisinopril", dosage: "10mg", frequency: "1x daily" },
];

const UploadPrescription = ({ onExtract }: UploadPrescriptionProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleExtract = () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please upload a prescription PDF first.", variant: "destructive" });
      return;
    }
    // Placeholder extraction
    setTimeout(() => {
      onExtract(mockMeds);
      toast({ title: "Medications extracted", description: `${mockMeds.length} medications were detected from the PDF.` });
    }, 700);
  };

  return (
    <section id="upload" className="relative">
      <Card className="border bg-card/80 backdrop-blur-sm card-elevated">
        <CardHeader>
          <CardTitle>Upload e‑prescription (PDF)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} aria-label="Upload PDF" />
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          <div className="flex gap-3">
            <Button variant="hero" onClick={handleExtract}>Extract medications</Button>
            <a href="#daily-checkin" className="inline-flex"><Button variant="outline">Skip for now</Button></a>
          </div>
          <p className="text-sm text-muted-foreground">Your file is processed securely. Only PDF is supported in v1.</p>
        </CardContent>
      </Card>
    </section>
  );
};

export default UploadPrescription;
