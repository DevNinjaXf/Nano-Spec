import React, { useMemo } from 'react';
import { ElementData } from '@/data/elements';
import { ElementCard } from './ElementCard';

interface PeriodicTableGridProps {
  elements: ElementData[];
  filteredElementIds: Set<number>;
  onElementClick: (element: ElementData) => void;
  heatmapProperty: keyof ElementData | string | null;
  selectedElements: Set<number>;
}

export function PeriodicTableGrid({
  elements,
  filteredElementIds,
  onElementClick,
  heatmapProperty,
  selectedElements,
}: PeriodicTableGridProps) {

  // Calculate min max for heatmap
  const heatmapData = useMemo(() => {
    if (!heatmapProperty) return null;
    let min = Infinity;
    let max = -Infinity;
    
    elements.forEach((el) => {
      // @ts-ignore
      const val = el[heatmapProperty];
      if (typeof val === 'number') {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    });

    return { min, max };
  }, [elements, heatmapProperty]);

  const getHeatmapColor = (val: any) => {
    if (typeof val !== 'number' || !heatmapData || heatmapData.max === heatmapData.min) return undefined;
    const ratio = (val - heatmapData.min) / (heatmapData.max - heatmapData.min);
    // Gradient from cool blue to hot red
    const r = Math.floor(40 + ratio * 215); // 40 to 255
    const g = Math.floor(100 - ratio * 50); // 100 to 50
    const b = Math.floor(250 - ratio * 200); // 250 to 50
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full overflow-x-auto pb-8 pt-4">
      <div className="min-w-[800px] sm:min-w-[1024px] lg:min-w-0">
        <div 
          className="grid gap-1 sm:gap-1.5 md:gap-2 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(40px, 1fr))',
          }}
        >
          {elements.map((el) => {
            let hmColor = undefined;
            if (heatmapProperty) {
                // @ts-ignore
                hmColor = getHeatmapColor(el[heatmapProperty]);
            }

            return (
              <ElementCard
                key={el.atomicNumber}
                element={el}
                filteredOut={!filteredElementIds.has(el.atomicNumber)}
                onClick={onElementClick}
                heatmapColor={hmColor}
                isSelected={selectedElements.has(el.atomicNumber)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
