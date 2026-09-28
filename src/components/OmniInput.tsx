"use client";

import { useState } from "react";
import { Mic, Image as ImageIcon, Search, FileUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type InputMode = "text" | "voice" | "image";

export function OmniInput({ 
  onAnalyze, 
  isAnalyzing 
}: { 
  onAnalyze: (query: string, mode: InputMode) => void;
  isAnalyzing: boolean;
}) {
  const [val, setVal] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const handleSubmit = () => {
    if (!val.trim()) return;
    onAnalyze(val, "text");
  };

  const handleVoice = () => {
    if (voiceActive && recognitionInstance) {
      recognitionInstance.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setRecognitionInstance(recognition);

    recognition.onstart = () => {
      setVoiceActive(true);
      setVal("Listening...");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      let current = finalTranscript || interimTranscript;
      current = current.replace(/[.!?]+$/, "").trim();
      
      setVal(current);

      if (finalTranscript) {
        onAnalyze(current, "voice");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setVoiceActive(false);
      setRecognitionInstance(null);
      setVal("");
    };

    recognition.onend = () => {
      setVoiceActive(false);
      setRecognitionInstance(null);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting recognition:", e);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVal(e.dataTransfer.files[0].name);
      onAnalyze(e.dataTransfer.files[0].name, "image");
    }
  };

  const fileInputClick = () => {
    const el = document.getElementById("file-upload");
    if (el) el.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative flex items-center w-full rounded-2xl p-2 transition-all duration-300 ${
          dragActive 
            ? "bg-primary/10 border-2 border-primary border-dashed" 
            : "glass-panel bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        
        {/* Input area */}
        <div className="flex-1 flex items-center px-4">
          {isAnalyzing ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <Search className="w-6 h-6 text-foreground/50" />
          )}
          <input 
            type="text" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={
              dragActive 
                ? "Drop micrograph here..." 
                : "Enter material name, drop micrograph, or use voice..."
            }
            className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg text-foreground placeholder-foreground/50"
            disabled={isAnalyzing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-2">
          
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setVal(e.target.files[0].name);
                onAnalyze(e.target.files[0].name, "image");
              }
            }}
          />
          <button 
            type="button"
            onClick={fileInputClick}
            disabled={isAnalyzing}
            className="p-3 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-primary"
            title="Upload Micrograph"
          >
            <ImageIcon className="w-6 h-6" />
          </button>

          <button 
            type="button"
            onClick={handleVoice}
            disabled={isAnalyzing}
            className={`p-3 rounded-xl transition-all ${
              voiceActive 
                ? "bg-red-500/20 text-red-500" 
                : "hover:bg-foreground/5 text-foreground/70 hover:text-primary"
            }`}
            title="Voice Input"
          >
            {voiceActive ? (
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <Mic className="relative inline-flex w-6 h-6 text-red-500" />
              </span>
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !val.trim()}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary/25"
          >
             Analyze
          </button>
        </div>
      </motion.div>
      
      <p className="text-center text-xs text-foreground/50 font-medium tracking-wide">
         Try analyzing: "Carbon Nanotubes", "Tungsten Disulfide", "Silicon Wafer Defect"
      </p>

    </div>
  );
}
