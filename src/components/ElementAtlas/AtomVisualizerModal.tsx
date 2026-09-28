"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Atom, Zap } from "lucide-react";
import { elements } from "@/data/elements";
import { ElectronConfigViewer } from "./ElectronConfigViewer";

interface AtomVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AtomVisualizerModal({ isOpen, onClose }: AtomVisualizerModalProps) {
  const [query, setQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<typeof elements[0] | null>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return elements
      .filter(
        (el) =>
          el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.atomicNumber.toString() === q
      )
      .slice(0, 8);
  }, [query]);

  const handleSelect = (el: typeof elements[0]) => {
    setSelectedElement(el);
    setQuery("");
  };

  const handleReset = () => {
    setSelectedElement(null);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                <Atom className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">3D Electron Configuration</h2>
                <p className="text-xs text-zinc-400">Visualize atomic orbital structure in 3D</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Search / Input */}
            {!selectedElement ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type element name, symbol, or atomic number..."
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-lg transition-all"
                    autoFocus
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden divide-y divide-zinc-800">
                    {suggestions.map((el) => (
                      <button
                        key={el.atomicNumber}
                        onClick={() => handleSelect(el)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-700/50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-zinc-500 font-mono">{el.atomicNumber}</span>
                          <span className="text-lg font-bold text-white">{el.symbol}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium">{el.name}</div>
                          <div className="text-xs text-zinc-500 font-mono truncate">
                            {el.electronConfiguration || "N/A"}
                          </div>
                        </div>
                        <Zap className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* No query state */}
                {!query.trim() && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30">
                      <Atom className="w-10 h-10 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-400">Enter an element name to visualize its electron configuration</p>
                      <p className="text-xs text-zinc-600 mt-2">
                        Try: <button onClick={() => setQuery("Iron")} className="text-cyan-500 hover:underline">Iron</button>,{" "}
                        <button onClick={() => setQuery("Gold")} className="text-cyan-500 hover:underline">Gold</button>,{" "}
                        <button onClick={() => setQuery("Carbon")} className="text-cyan-500 hover:underline">Carbon</button>,{" "}
                        <button onClick={() => setQuery("Uranium")} className="text-cyan-500 hover:underline">Uranium</button>
                      </p>
                    </div>
                  </div>
                )}

                {/* No results */}
                {query.trim() && suggestions.length === 0 && (
                  <div className="text-center py-8 text-zinc-500">
                    No elements found for &quot;{query}&quot;
                  </div>
                )}
              </div>
            ) : (
              /* 3D Visualization */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 font-mono">{selectedElement.atomicNumber}</span>
                      <span className="text-2xl font-bold text-white">{selectedElement.symbol}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedElement.name}</h3>
                      <p className="text-sm font-mono text-cyan-400">{selectedElement.electronConfiguration}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700/50 transition-colors"
                  >
                    ← Choose Another
                  </button>
                </div>

                <ElectronConfigViewer
                  electronConfiguration={selectedElement.electronConfiguration || "1s1"}
                  atomicNumber={selectedElement.atomicNumber}
                  symbol={selectedElement.symbol}
                  name={selectedElement.name}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
