"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { elements, ElementData } from '@/data/elements';
import { SearchBar } from '@/components/ElementAtlas/SearchBar';
import { FilterPanel } from '@/components/ElementAtlas/FilterPanel';
import { PeriodicTableGrid } from '@/components/ElementAtlas/PeriodicTableGrid';
import { ElementModal } from '@/components/ElementAtlas/ElementModal';
import { ComparePanel } from '@/components/ElementAtlas/ComparePanel';
import { AtomVisualizerModal } from '@/components/ElementAtlas/AtomVisualizerModal';
import { Atom } from 'lucide-react';

export default function ElementAtlasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeStates, setActiveStates] = useState<Set<string>>(new Set());
  const [heatmapProperty, setHeatmapProperty] = useState<string | null>(null);
  
  const [activeElement, setActiveElement] = useState<ElementData | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<number>>(new Set());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  const [isClient, setIsClient] = useState(false);
  const [showAtomVisualizer, setShowAtomVisualizer] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('elementsFavorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (atomicNumber: number) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(atomicNumber)) newFavs.delete(atomicNumber);
    else newFavs.add(atomicNumber);
    setFavorites(newFavs);
    localStorage.setItem('elementsFavorites', JSON.stringify(Array.from(newFavs)));
  };

  const toggleCompare = (atomicNumber: number) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(atomicNumber)) {
      newSelected.delete(atomicNumber);
    } else {
      if (newSelected.size < 4) newSelected.add(atomicNumber);
    }
    setSelectedElements(newSelected);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    elements.forEach(el => cats.add(el.category));
    return Array.from(cats).sort();
  }, []);

  const states = useMemo(() => {
    const sts = new Set<string>();
    elements.forEach(el => sts.add(el.phase));
    return Array.from(sts).sort();
  }, []);

  const toggleCategory = (cat: string) => {
    const newCats = new Set(activeCategories);
    if (newCats.has(cat)) newCats.delete(cat);
    else newCats.add(cat);
    setActiveCategories(newCats);
  };

  const toggleState = (state: string) => {
    const newSts = new Set(activeStates);
    if (newSts.has(state)) newSts.delete(state);
    else newSts.add(state);
    setActiveStates(newSts);
  };

  // Filter elements
  const filteredElementIds = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    return new Set(
      elements
        .filter(el => {
          const matchSearch = q === '' || 
            el.name.toLowerCase().includes(q) || 
            el.symbol.toLowerCase().includes(q) || 
            el.atomicNumber.toString() === q;
            
          const matchCat = activeCategories.size === 0 || activeCategories.has(el.category);
          const matchState = activeStates.size === 0 || activeStates.has(el.phase);
          
          return matchSearch && matchCat && matchState;
        })
        .map(el => el.atomicNumber)
    );
  }, [searchQuery, activeCategories, activeStates]);

  const selectedElementsData = useMemo(() => {
    return Array.from(selectedElements).map(id => elements.find(e => e.atomicNumber === id)!).filter(Boolean);
  }, [selectedElements]);

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-200 selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32">
        <header className="mb-10 space-y-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Element Atlas
              </h1>
              <p className="mt-2 text-zinc-400 max-w-2xl text-lg">
                Interactive periodic table with comprehensive property data, heatmaps, and side-by-side comparison.
              </p>
            </div>
            <div className="mt-6 sm:mt-0 flex items-center gap-3">
              <SearchBar query={searchQuery} onChange={setSearchQuery} />
              <button
                onClick={() => setShowAtomVisualizer(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 whitespace-nowrap"
              >
                <Atom className="w-5 h-5" />
                3D Orbital Viewer
              </button>
            </div>
          </div>
        </header>

        <section className="relative z-20 mb-8">
          <FilterPanel 
            categories={categories}
            activeCategories={activeCategories}
            toggleCategory={toggleCategory}
            states={states}
            activeStates={activeStates}
            toggleState={toggleState}
            heatmapProperty={heatmapProperty}
            setHeatmapProperty={setHeatmapProperty}
          />
        </section>

        <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-2 sm:p-6 backdrop-blur-sm shadow-2xl">
          {isClient && (
            <PeriodicTableGrid
              elements={elements}
              filteredElementIds={filteredElementIds}
              onElementClick={setActiveElement}
              heatmapProperty={heatmapProperty}
              selectedElements={selectedElements}
            />
          )}
        </section>
      </main>

      <ElementModal 
        element={activeElement} 
        onClose={() => setActiveElement(null)} 
        isFavorite={activeElement ? favorites.has(activeElement.atomicNumber) : false}
        onToggleFavorite={() => activeElement && toggleFavorite(activeElement.atomicNumber)}
        isCompare={activeElement ? selectedElements.has(activeElement.atomicNumber) : false}
        onToggleCompare={() => activeElement && toggleCompare(activeElement.atomicNumber)}
      />

      <ComparePanel 
        elements={selectedElementsData} 
        onRemove={(id) => toggleCompare(id)} 
        onClear={() => setSelectedElements(new Set())}
      />

      <AtomVisualizerModal
        isOpen={showAtomVisualizer}
        onClose={() => setShowAtomVisualizer(false)}
      />
    </div>
  );
}
