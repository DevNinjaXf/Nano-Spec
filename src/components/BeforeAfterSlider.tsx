"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider({ 
  rawImage = "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800", 
  semImage = "https://images.unsplash.com/photo-1614935151651-0bea6508abb0?q=80&w=800" 
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel"
    >
      {/* Background (SEM Image) */}
      <img
        src={semImage}
        alt="SEM Magnification"
        className="absolute inset-0 w-full h-full object-cover filter grayscale"
      />
      <div className="absolute top-4 right-4 bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold z-10 border border-white/20">
        SEM 50,000x
      </div>

      {/* Overlay (Raw Image) */}
      <div 
        className="absolute inset-0 object-cover overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={rawImage}
          alt="Raw Material"
          className="absolute inset-0 w-full h-[100%] max-w-none object-cover"
          style={{ width: `calc(100vw * (100 / ${sliderPosition || 1}))`, minWidth: '100%' }} // Keep image static while container clips
        />
        <div className="absolute top-4 left-4 bg-white/60 text-black backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-black/20">
          Optical (Macro)
        </div>
      </div>

      {/* Slider Handle */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
      
      {/* Visual Divider */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-primary z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
          <MoveHorizontal className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
