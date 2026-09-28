import React from 'react';
import { motion } from 'framer-motion';
import { ElementData } from '@/data/elements';

const categoryColors: Record<string, string> = {
  'diatomic nonmetal': 'bg-pink-500/20 border-pink-500/50 text-pink-100 hover:bg-pink-500/40',
  'polyatomic nonmetal': 'bg-pink-500/20 border-pink-500/50 text-pink-100 hover:bg-pink-500/40',
  'noble gas': 'bg-purple-500/20 border-purple-500/50 text-purple-100 hover:bg-purple-500/40',
  'alkali metal': 'bg-orange-500/20 border-orange-500/50 text-orange-100 hover:bg-orange-500/40',
  'alkaline earth metal': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100 hover:bg-yellow-500/40',
  'metalloid': 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 hover:bg-emerald-500/40',
  'post-transition metal': 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-500/40',
  'transition metal': 'bg-indigo-500/20 border-indigo-500/50 text-indigo-100 hover:bg-indigo-500/40',
  'lanthanide': 'bg-teal-500/20 border-teal-500/50 text-teal-100 hover:bg-teal-500/40',
  'actinide': 'bg-rose-500/20 border-rose-500/50 text-rose-100 hover:bg-rose-500/40',
};

const getCategoryColor = (category: string) => {
  if (categoryColors[category]) return categoryColors[category];
  if (category.includes('unknown')) return 'bg-zinc-600/20 border-zinc-500/50 text-zinc-100 hover:bg-zinc-600/40';
  return 'bg-zinc-800/50 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700';
};

interface ElementCardProps {
  element: ElementData;
  onClick: (element: ElementData) => void;
  filteredOut: boolean;
  heatmapColor?: string;
  isSelected?: boolean;
}

export function ElementCard({ element, onClick, filteredOut, heatmapColor, isSelected }: ElementCardProps) {
  const baseColorClass = getCategoryColor(element.category);
  
  return (
    <motion.button
      layout
      whileHover={filteredOut ? {} : { scale: 1.1, zIndex: 10 }}
      onClick={() => !filteredOut && onClick(element)}
      className={`relative flex flex-col items-center justify-center p-1 sm:p-2 border rounded-md sm:rounded-lg transition-opacity duration-300 ${
        filteredOut ? 'opacity-10 grayscale pointer-events-none' : 'opacity-100 shadow-md cursor-pointer'
      } ${!heatmapColor ? baseColorClass : 'text-zinc-900 font-bold border-zinc-900/20'} ${
        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
      }`}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        ...(heatmapColor && !filteredOut ? { backgroundColor: heatmapColor } : {}),
      }}
    >
      <div className="absolute top-0.5 sm:top-1 left-1 sm:left-1.5 text-[8px] sm:text-[10px] font-mono opacity-80">
        {element.atomicNumber}
      </div>
      {(element.atomicMass && !filteredOut) && (
        <div className="absolute top-0.5 sm:top-1 right-1 sm:right-1.5 text-[6px] sm:text-[8px] opacity-60">
          {element.atomicMass.toFixed(1)}
        </div>
      )}
      <div className="text-sm sm:text-2xl font-bold tracking-tight mt-1 sm:mt-2">
        {element.symbol}
      </div>
      <div className="text-[6px] sm:text-[9px] uppercase tracking-wider truncate w-full px-1 mt-0.5 opacity-80">
        {element.name}
      </div>
    </motion.button>
  );
}
