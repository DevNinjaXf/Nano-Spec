import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { ElementData } from '@/data/elements';

interface ComparePanelProps {
  elements: ElementData[];
  onRemove: (atomicNumber: number) => void;
  onClear: () => void;
}

export function ComparePanel({ elements, onRemove, onClear }: ComparePanelProps) {
  if (elements.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 sm:p-6 max-h-[50vh] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-blue-500">Compare</span> Elements
              <span className="text-sm font-normal text-zinc-500 bg-zinc-800 px-2.5 py-0.5 rounded-full">
                {elements.length}/4
              </span>
            </h3>
            <button 
              onClick={onClear}
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {elements.map((el) => (
              <div key={el.atomicNumber} className="relative bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
                <button
                  onClick={() => onRemove(el.atomicNumber)}
                  className="absolute top-2 right-2 p-1 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-zinc-800 rounded-lg font-bold text-xl border border-zinc-700">
                    {el.symbol}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100">{el.name}</h4>
                    <div className="text-xs text-zinc-400">{el.category}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                    <span className="text-zinc-500">Atomic Mass</span>
                    <span className="font-mono text-zinc-300">{el.atomicMass}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                    <span className="text-zinc-500">Density</span>
                    <span className="font-mono text-zinc-300">{el.density || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                    <span className="text-zinc-500">Melting Pt</span>
                    <span className="font-mono text-zinc-300">{el.melt ? `${el.melt} K` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Boiling Pt</span>
                    <span className="font-mono text-zinc-300">{el.boil ? `${el.boil} K` : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {elements.length < 4 && (
              <div className="border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 text-zinc-500">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-2">
                  <ArrowRight className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-sm text-center">Select another element <br/>to compare</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
