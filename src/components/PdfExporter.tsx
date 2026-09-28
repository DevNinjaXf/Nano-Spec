"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PdfExporterProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export function PdfExporter({ targetRef, filename = "SEM_Report.pdf" }: PdfExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) return;
    
    try {
      setIsExporting(true);
      
      const element = targetRef.current;
      
      // html-to-image bypasses canvas parsing limits by natively rendering DOM via browser engines.
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2, 
        backgroundColor: "#020617", // Force dark mode background to match UI
      });
      
      const rect = element.getBoundingClientRect();
      const defaultWidth = 210; // A4 width in mm
      const scaledHeight = (rect.height * defaultWidth) / rect.width;
      
      // We create a custom format PDF so it acts like a continuous scroll, preventing cut-offs.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [defaultWidth, scaledHeight + 20] // Add 20mm padding
      });
      
      pdf.addImage(dataUrl, "PNG", 0, 10, defaultWidth, scaledHeight);
      pdf.save(filename);
      
    } catch (error) {
      console.error("Export PDF failed:", error);
      alert("Failed to export PDF due to rendering limits. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {isExporting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      {isExporting ? "Generating PDF..." : "Export as PDF"}
    </button>
  );
}
