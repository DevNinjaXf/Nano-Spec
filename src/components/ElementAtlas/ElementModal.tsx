import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Scale, Atom, Thermometer, Box, Zap } from 'lucide-react';
import { ElementData } from '@/data/elements';

interface ElementModalProps {
  element: ElementData | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompare: boolean;
  onToggleCompare: () => void;
}

export function ElementModal({
  element,
  onClose,
  isFavorite,
  onToggleFavorite,
  isCompare,
  onToggleCompare
}: ElementModalProps) {
  if (!element) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 flex items-start justify-between border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 shadow-inner">
                <span className="text-zinc-400 font-mono text-sm">{element.atomicNumber}</span>
                <span className="text-4xl font-bold text-white">{element.symbol}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{element.name}</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="px-2.5 py-1 text-xs font-medium uppercase tracking-wider rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {element.category}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {element.phase}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 text-zinc-400">
              <button 
                onClick={onToggleCompare}
                className={`p-2 rounded-xl hover:bg-zinc-800 transition-colors ${isCompare ? 'text-blue-500 bg-blue-500/10' : ''}`}
                title="Compare"
              >
                <Scale className="w-5 h-5" />
              </button>
              <button 
                onClick={onToggleFavorite}
                className={`p-2 rounded-xl hover:bg-zinc-800 transition-colors ${isFavorite ? 'text-yellow-500 bg-yellow-500/10' : ''}`}
                title="Favorite"
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <p className="text-zinc-300 leading-relaxed mb-8 text-sm">
              {element.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PropertyCard icon={<Scale />} label="Atomic Mass" value={`${element.atomicMass} u`} />
              <PropertyCard icon={<Zap />} label="Electronegativity" value={element.electronegativity || 'N/A'} />
              <PropertyCard icon={<Thermometer />} label="Melting Point" value={element.melt ? `${element.melt} K` : 'N/A'} />
              <PropertyCard icon={<Thermometer />} label="Boiling Point" value={element.boil ? `${element.boil} K` : 'N/A'} />
              <PropertyCard icon={<Box />} label="Density" value={element.density ? `${element.density} g/cm³` : 'N/A'} />
              <PropertyCard icon={<Atom />} label="Electron Config" value={element.electronConfiguration || 'N/A'} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function PropertyCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
      <div className="text-zinc-500">
        {icon}
      </div>
      <div>
        <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</dt>
        <dd className="text-sm font-semibold text-zinc-200 mt-1">{value}</dd>
      </div>
    </div>
  );
}
