"use client";

import { motion } from "framer-motion";
import { Activity, Beaker, Zap, FileSearch, TrendingUp, Cpu, Thermometer, Layers } from "lucide-react";
import { forwardRef } from "react";
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { getMaterialData } from "@/lib/materialData";

interface SEMReportProps {
  materialName: string;
}

export const SEMReport = forwardRef<HTMLDivElement, SEMReportProps>(({ materialName }, ref) => {
  const data = getMaterialData(materialName);

  // Generate responsive spectrum dynamically based on the material's predefined shift
  const spectrumData = Array.from({ length: 100 }).map((_, i) => {
    const energy = (i * 0.1).toFixed(1);
    let counts = Math.random() * 40; 
    
    // Shift the peaks using spectrumShift so different materials look different
    const shift = data.spectrumShift * 0.1;
    
    if (Math.abs(i - (28 + shift)) < 2) counts += 800; // Primary peak
    if (Math.abs(i - (52 + shift)) < 3) counts += 300; // Secondary peak
    if (Math.abs(i - (82 + shift)) < 2) counts += 400; // Tertiary peak
    if (Math.abs(i - (16 + shift)) < 1.5) counts += 150;

    return { KeV: energy, Counts: counts > 0 ? counts : 0 };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3 py-2 rounded-lg text-xs font-mono shadow-xl border border-white/20">
          <p className="opacity-70 mb-1">{label} KeV</p>
          <p className="font-bold text-primary">{Math.round(payload[0].value)} Counts</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3 py-2 rounded-lg text-xs font-mono shadow-xl border border-white/20">
          <p className="font-bold">{payload[0].payload.name}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={ref} className="w-full glass-panel rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden bg-white/50 dark:bg-[#020617]/80">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-foreground/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            {data.name} Analysis
          </h2>
          <p className="text-foreground/60 mt-1 font-mono text-sm leading-relaxed max-w-xl">
            Target: <span className="text-foreground font-semibold uppercase">{materialName}</span> | GUID: #{Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20 flex-shrink-0 ml-4">
          <FileSearch className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Crystallography & Structural */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Layers className="w-5 h-5 text-primary" /> Crystallography
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Crystal System</p>
                <p className="font-mono font-medium">{data.crystalSystem}</p>
              </div>
              <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Space Group</p>
                <p className="font-mono font-medium">{data.spaceGroup}</p>
              </div>
              <div className="col-span-2 bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Lattice Parameters</p>
                <p className="font-mono font-medium">{data.latticeParams}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Cpu className="w-5 h-5 text-yellow-500" /> Thermomechanical Core
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Young's Modulus</p>
                <p className="font-mono font-medium">{data.modulus}</p>
              </div>
              <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Poisson's Ratio</p>
                <p className="font-mono font-medium">{data.poisson}</p>
              </div>
              <div className="col-span-2 bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                <p className="text-xs text-foreground/50">Hardness</p>
                <p className="font-mono font-medium">{data.hardness}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Dynamic Charts Row */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Beaker className="w-5 h-5 text-cyan-500" /> Atomic EDX Composition
            </h3>
            <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5 h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.composition} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={40} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--foreground)', opacity: 0.05 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {data.composition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <TrendingUp className="w-5 h-5 text-purple-500" /> Energy Spectrum (KeV)
            </h3>
            <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5 h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spectrumData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="KeV" tick={{ fill: 'var(--foreground)', fontSize: 10, opacity: 0.5 }} tickCount={6} />
                  <YAxis tick={{ fill: 'var(--foreground)', fontSize: 10, opacity: 0.5 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Counts" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

      </div>

      {/* Description / Defect Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="w-full">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Activity className="w-5 h-5 text-primary" /> Morphology Data
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed bg-foreground/5 p-4 rounded-xl border border-foreground/5">
              {data.morphology}
            </p>
        </section>

        <section className="w-full">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            <Thermometer className="w-5 h-5 text-red-500" /> Defect Analysis & Synthesis
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed bg-red-500/10 dark:bg-red-500/5 text-red-900 dark:text-red-300 p-4 rounded-xl border border-red-500/20">
            {data.defectAnalysis}
          </p>
        </section>
      </div>
      
    </div>
  );
});

SEMReport.displayName = "SEMReport";
