"use client";

import { Microscope, Activity, Home, FileSearch, Grid } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const NavButton = ({ label, targetId, href, icon: Icon }: { label: string, targetId?: string, href?: string, icon: any }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (href) {
      if (pathname === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push(href);
      }
      return;
    }

    if (pathname !== '/') {
      router.push(`/${targetId ? `#${targetId}` : ''}`);
      return;
    }

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        alert(`Please perform a material analysis first to view your ${label}.`);
      }
    }
  };

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.button
        onClick={handleClick}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.15, rotateX: 15, rotateY: -10, z: 30 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-colors text-sm font-semibold tracking-wide shadow-lg text-white"
      >
        <Icon className="w-4 h-4" />
        {label}
      </motion.button>
    </div>
  );
};

const NanoLogo = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl border border-primary/20 shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute w-7 h-7 border-[1.5px] border-transparent border-t-cyan-400 border-b-cyan-500 rounded-full opacity-70"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-5 h-5 border-[1.5px] border-transparent border-l-indigo-400 border-r-blue-400 rounded-full opacity-90"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-2 h-2 bg-gradient-to-tr from-cyan-200 to-white rounded-full shadow-[0_0_10px_rgba(103,232,249,1)]"
      />
    </div>
  );
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md"
    >
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => {
          if (pathname !== '/') {
            router.push('/');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <NanoLogo />
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            NanoSpec
          </h1>
          <p className="text-xs text-foreground/60 font-medium">Pro</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <NavButton label="Home" targetId="home-section" icon={Home} />
        <NavButton label="New Scan" targetId="scan-section" icon={Activity} />
        <NavButton label="Report" targetId="results-section" icon={FileSearch} />
        <NavButton label="Element Atlas" href="/element-atlas" icon={Grid} />
      </div>
    </motion.nav>
  );
}
