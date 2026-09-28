"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { OmniInput, InputMode } from "@/components/OmniInput";
import { Insight3D } from "@/components/Insight3D";
import { getMaterialData } from "@/lib/materialData";
import { SEMReport } from "@/components/SEMReport";
import { PdfExporter } from "@/components/PdfExporter";

export default function Home() {
  const [analyzedMaterial, setAnalyzedMaterial] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (query: string, mode: InputMode) => {
    setIsAnalyzing(true);
    setAnalyzedMaterial(null);
    
    // Simulate AI API Call and processing time
    setTimeout(() => {
      setAnalyzedMaterial(query);
      setIsAnalyzing(false);
      
      // Auto-scroll to report after a short delay
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }, 2500); // 2.5s simulation delay
  };

  return (
    <main id="home-section" className="min-h-screen relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] -z-10 mix-blend-screen" />

        <div className="w-full relative h-[300px] sm:h-[400px]">
          <Hero3D />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl"
            >
              Discover the <br/>
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-500 bg-clip-text text-transparent">
                Nanoscale
              </span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-foreground/80 max-w-2xl font-light"
            >
               Advanced AI-driven material analysis. Upload micrographs, dictate structures, or query directly to simulate topography, morphology, and EDX compositions in 8K resolution.
            </motion.p>
          </div>
        </div>

        <div id="scan-section" className="w-full mt-12 sm:mt-8 z-10 transition-transform scroll-mt-24">
           <OmniInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {analyzedMaterial && (
          <motion.section 
            id="results-section"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-5xl mx-auto px-6 pb-24 space-y-12 scroll-mt-24"
          >
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-16" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Insight3D Component */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-4">
                  <h3 className="text-2xl font-semibold pl-2 border-l-4 border-primary">
                    Molecular Lattice
                  </h3>
                  <p className="text-foreground/70 text-sm pl-3">
                    Reconstructed unit cell configuration projecting real-time space group boundaries inferred from EDX responses. Interact to pivot the lattice mapping.
                  </p>
                  <Insight3D crystalSystem={getMaterialData(analyzedMaterial).crystalSystem} />
                </div>
              </div>

              {/* SEM simulated report */}
              <div className="lg:col-span-3">
                 <SEMReport ref={reportRef} materialName={analyzedMaterial} />
                 
                 {/* Export Tools */}
                 <div className="mt-8 flex justify-end">
                    <PdfExporter targetRef={reportRef} filename={`SEM_Report_${analyzedMaterial.replace(/\s+/g, "_")}.pdf`} />
                 </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
    </main>
  );
}
