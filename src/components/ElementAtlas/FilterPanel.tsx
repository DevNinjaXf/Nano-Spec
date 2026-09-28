"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, Flame, ChevronDown, X, Droplets } from 'lucide-react';

interface FilterPanelProps {
  categories: string[];
  activeCategories: Set<string>;
  toggleCategory: (cat: string) => void;
  states: string[];
  activeStates: Set<string>;
  toggleState: (state: string) => void;
  heatmapProperty: string | null;
  setHeatmapProperty: (prop: string | null) => void;
}

function MultiSelectDropdown({
  label,
  icon,
  options,
  selected,
  onToggle,
  accentColor = 'blue',
}: {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: Set<string>;
  onToggle: (val: string) => void;
  accentColor?: 'blue' | 'emerald';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const accent = accentColor === 'emerald'
    ? { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400', hover: 'hover:bg-emerald-500/10' }
    : { bg: 'bg-blue-500/15', border: 'border-blue-500/40', text: 'text-blue-400', dot: 'bg-blue-400', hover: 'hover:bg-blue-500/10' };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border transition-all text-sm ${
          open
            ? `${accent.bg} ${accent.border} ${accent.text}`
            : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
        }`}
      >
        <span className="flex items-center gap-2 font-medium">
          {icon}
          {label}
          {selected.size > 0 && (
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-md ${accent.bg} ${accent.text} font-bold`}>
              {selected.size}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[260px] bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {options.map((opt) => {
              const isActive = selected.has(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? `${accent.bg} ${accent.text} font-medium`
                      : `text-zinc-400 ${accent.hover} hover:text-zinc-200`
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${
                    isActive ? `${accent.border} ${accent.bg}` : 'border-zinc-600'
                  }`}>
                    {isActive && (
                      <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z" />
                      </svg>
                    )}
                  </div>
                  <span className="capitalize">{opt}</span>
                </button>
              );
            })}
          </div>

          {selected.size > 0 && (
            <div className="border-t border-zinc-800 p-2">
              <button
                onClick={() => {
                  selected.forEach((val) => onToggle(val));
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all"
              >
                <X className="w-3 h-3" /> Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterPanel({
  categories,
  activeCategories,
  toggleCategory,
  states,
  activeStates,
  toggleState,
  heatmapProperty,
  setHeatmapProperty,
}: FilterPanelProps) {
  const heatmapOptions = [
    { value: null as string | null, label: 'Category Colors' },
    { value: 'atomicMass', label: 'Atomic Mass' },
    { value: 'electronegativity', label: 'Electronegativity' },
    { value: 'density', label: 'Density' },
    { value: 'melt', label: 'Melting Point' },
    { value: 'boil', label: 'Boiling Point' },
  ];

  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (heatmapRef.current && !heatmapRef.current.contains(e.target as Node)) setHeatmapOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentHeatmapLabel = heatmapOptions.find(o => o.value === heatmapProperty)?.label || 'Category Colors';

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl p-4 sm:p-5 w-full shadow-xl">
      <div className="flex items-center gap-2 mb-4 text-zinc-100">
        <Filter className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-lg">Filters & Views</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Categories Dropdown */}
        <MultiSelectDropdown
          label="Categories"
          icon={<Filter className="w-4 h-4" />}
          options={categories}
          selected={activeCategories}
          onToggle={toggleCategory}
          accentColor="blue"
        />

        {/* States Dropdown */}
        <MultiSelectDropdown
          label="State at STP"
          icon={<Droplets className="w-4 h-4" />}
          options={states}
          selected={activeStates}
          onToggle={toggleState}
          accentColor="emerald"
        />

        {/* Heatmap Dropdown */}
        <div ref={heatmapRef} className="relative">
          <button
            onClick={() => setHeatmapOpen(!heatmapOpen)}
            className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border transition-all text-sm ${
              heatmapOpen
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
            }`}
          >
            <span className="flex items-center gap-2 font-medium">
              <Flame className="w-4 h-4" />
              {currentHeatmapLabel}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${heatmapOpen ? 'rotate-180' : ''}`} />
          </button>

          {heatmapOpen && (
            <div className="absolute z-50 mt-2 w-full min-w-[220px] bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="p-2 space-y-0.5">
                {heatmapOptions.map((opt) => {
                  const isActive = heatmapProperty === opt.value;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => { setHeatmapProperty(opt.value); setHeatmapOpen(false); }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 font-medium'
                          : 'text-zinc-400 hover:bg-amber-500/10 hover:text-zinc-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400' : 'bg-zinc-600'}`} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filter tags */}
      {(activeCategories.size > 0 || activeStates.size > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-800/50">
          <span className="text-xs text-zinc-500 uppercase tracking-wider mr-1">Active:</span>
          {Array.from(activeCategories).map(c => (
            <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {c}
              <button onClick={() => toggleCategory(c)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {Array.from(activeStates).map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {s}
              <button onClick={() => toggleState(s)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
