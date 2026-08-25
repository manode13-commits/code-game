import React from 'react';

interface ScienceWeekFrameProps {
  children: React.ReactNode;
}

export const ScienceWeekFrame: React.FC<ScienceWeekFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#030712] select-none p-1 sm:p-2">
      {/* Background Cosmic Starfield & Nebula */}
      <div className="absolute inset-0 bg-radial from-[#0d1536] via-[#050818] to-[#02040b] pointer-events-none -z-20" />
      
      {/* Deep Space Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle Cyber Grid Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

        {/* Top Left Saturn Ring Planet */}
        <div className="absolute -top-6 -left-6 w-28 h-28 sm:w-36 sm:h-36 opacity-75">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            <circle cx="50" cy="50" r="26" fill="url(#saturnGrad)" />
            <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#f472b6" strokeWidth="4" transform="rotate(-25 50 50)" opacity="0.8" />
            <ellipse cx="50" cy="50" rx="42" ry="9" fill="none" stroke="#c084fc" strokeWidth="2" transform="rotate(-25 50 50)" opacity="0.9" />
            <defs>
              <linearGradient id="saturnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top Right Earth Planet & Satellite */}
        <div className="absolute -top-4 right-16 sm:right-28 w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
            <circle cx="50" cy="50" r="32" fill="url(#earthOcean)" />
            <path d="M 30 40 Q 45 30 55 45 Q 65 35 70 50 Q 55 65 40 55 Z" fill="#22c55e" opacity="0.85" />
            <path d="M 35 60 Q 45 70 60 65 Q 50 78 38 72 Z" fill="#16a34a" opacity="0.8" />
            <defs>
              <linearGradient id="earthOcean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Satellite */}
        <div className="absolute top-2 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 opacity-80 animate-pulse">
          <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
            <rect x="20" y="20" width="10" height="10" fill="#94a3b8" rx="2" />
            <rect x="5" y="22" width="12" height="6" fill="#38bdf8" />
            <rect x="33" y="22" width="12" height="6" fill="#38bdf8" />
            <line x1="25" y1="12" x2="25" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="25" cy="10" r="2.5" fill="#facc15" />
          </svg>
        </div>

        {/* Ambient Neon Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* TOP HEADER: SCIENCE WEEK CODE QUEST (เกมถอดรหัสวิทย์) */}
      <div className="w-full flex flex-col items-center justify-center shrink-0 pt-0.5 pb-1 relative z-20">
        {/* Futuristic Cyber Banner Container */}
        <div className="relative flex flex-col items-center px-6 sm:px-12 py-1 bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-blue-950/90 border-2 border-cyan-400/80 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.45)] backdrop-blur-md">
          {/* Top Title: SCIENCE WEEK + Glowing Lock */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base md:text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)] uppercase font-mono">
              SCIENCE WEEK
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-0.5 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse">
              🔒
            </span>
          </div>

          {/* Main Title: CODE QUEST */}
          <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 drop-shadow-[0_2px_12px_rgba(245,158,11,0.8)] font-sans uppercase -mt-0.5">
            CODE QUEST
          </div>

          {/* Subtitle: เกมถอดรหัสวิทย์ */}
          <div className="text-[10px] sm:text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5 -mt-0.5">
            <span className="w-2 h-0.5 bg-cyan-400 rounded-full inline-block" />
            <span>เกมถอดรหัสวิทย์</span>
            <span className="w-2 h-0.5 bg-cyan-400 rounded-full inline-block" />
          </div>

          {/* Corner Cyber Accents */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />
        </div>
      </div>

      {/* MAIN CONTENT AREA: Cyber Frame with Left & Right Science Widgets + Central Level Map */}
      <div className="flex-1 w-full flex items-center justify-between gap-1 sm:gap-2 min-h-0 relative z-10 overflow-hidden">
        {/* LEFT SCIENCE WIDGETS (DNA, Molecule, Beaker, Test Tubes) */}
        <div className="hidden lg:flex flex-col items-center justify-around h-full w-20 xl:w-24 shrink-0 py-2">
          {/* Hexagon DNA Hologram */}
          <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-blue-950/60 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center p-2 backdrop-blur-xs">
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
              <path d="M 15 10 Q 30 20 45 10 M 15 25 Q 30 35 45 25 M 15 40 Q 30 50 45 40 M 15 55 Q 30 65 45 55" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <path d="M 45 10 Q 30 20 15 10 M 45 25 Q 30 35 15 25 M 45 40 Q 30 50 15 40 M 45 55 Q 30 65 15 55" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
              <line x1="20" y1="18" x2="40" y2="18" stroke="#a855f7" strokeWidth="2" />
              <line x1="18" y1="33" x2="42" y2="33" stroke="#3b82f6" strokeWidth="2" />
              <line x1="20" y1="48" x2="40" y2="48" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          {/* Molecular Node Structure */}
          <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-center p-1.5 shadow-sm">
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]">
              <circle cx="25" cy="25" r="5" fill="#38bdf8" />
              <circle cx="10" cy="15" r="4" fill="#60a5fa" />
              <circle cx="40" cy="15" r="4" fill="#60a5fa" />
              <circle cx="15" cy="40" r="4" fill="#60a5fa" />
              <circle cx="38" cy="38" r="4" fill="#60a5fa" />
              <line x1="25" y1="25" x2="10" y2="15" stroke="#93c5fd" strokeWidth="2" />
              <line x1="25" y1="25" x2="40" y2="15" stroke="#93c5fd" strokeWidth="2" />
              <line x1="25" y1="25" x2="15" y2="40" stroke="#93c5fd" strokeWidth="2" />
              <line x1="25" y1="25" x2="38" y2="38" stroke="#93c5fd" strokeWidth="2" />
            </svg>
          </div>

          {/* Chemical Flask Widget */}
          <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-blue-950/60 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center p-2">
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]">
              <path d="M 22 8 L 28 8 L 28 18 L 38 38 C 40 42 36 46 32 46 L 18 46 C 14 46 10 42 12 38 L 22 18 Z" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <path d="M 14 36 L 36 36 C 35 44 15 44 14 36 Z" fill="#0284c7" opacity="0.8" />
              <circle cx="22" cy="38" r="2" fill="#bae6fd" />
              <circle cx="28" cy="41" r="1.5" fill="#bae6fd" />
            </svg>
          </div>

          {/* Test Tubes in Rack */}
          <div className="flex items-end gap-1 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 shadow-md">
            <div className="w-2.5 h-8 bg-amber-500 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <div className="w-2.5 h-9 bg-purple-500 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            <div className="w-2.5 h-7 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          </div>
        </div>

        {/* CENTRAL CYBER HUD FRAME (Container for Level Map) */}
        <div className="flex-1 h-full min-h-0 bg-slate-950/80 rounded-2xl sm:rounded-3xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col relative overflow-hidden backdrop-blur-md">
          {/* Cyber Edge Lighting Accents */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(6,182,212,1)]" />
          <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(59,130,246,1)]" />
          
          {/* Inner Content Slot */}
          <div className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
            {children}
          </div>
        </div>

        {/* RIGHT SCIENCE WIDGETS (Microscope, Flask, Magnifier, Cyber Nodes) */}
        <div className="hidden lg:flex flex-col items-center justify-around h-full w-20 xl:w-24 shrink-0 py-2">
          {/* Magnifier Hologram */}
          <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-center p-1.5 shadow-sm">
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
              <circle cx="22" cy="22" r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <line x1="31" y1="31" x2="42" y2="42" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 18 16 Q 22 14 26 18" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Hexagonal Cyber Orbit Nodes */}
          <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-blue-950/60 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center p-2">
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]">
              <ellipse cx="25" cy="25" rx="18" ry="8" fill="none" stroke="#c084fc" strokeWidth="1.5" transform="rotate(30 25 25)" />
              <ellipse cx="25" cy="25" rx="18" ry="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-30 25 25)" />
              <circle cx="25" cy="25" r="4" fill="#f43f5e" />
              <circle cx="38" cy="18" r="2.5" fill="#38bdf8" />
              <circle cx="12" cy="32" r="2.5" fill="#c084fc" />
            </svg>
          </div>

          {/* Optical Microscope */}
          <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-blue-950/60 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center p-1.5">
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
              {/* Microscope base & arm */}
              <rect x="12" y="42" width="26" height="5" rx="2" fill="#64748b" />
              <path d="M 32 42 L 32 25 Q 32 18 25 18 L 22 18" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
              {/* Eyepiece / Objective tube */}
              <rect x="18" y="10" width="7" height="18" transform="rotate(25 21 19)" fill="#cbd5e1" rx="1" />
              <rect x="17" y="6" width="9" height="5" transform="rotate(25 21 8)" fill="#0284c7" rx="1" />
              <circle cx="16" cy="34" r="3" fill="#38bdf8" />
            </svg>
          </div>

          {/* Green Acid Chemical Beaker */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]">
              <path d="M 16 6 L 24 6 L 24 14 L 32 30 C 34 34 30 36 28 36 L 12 36 C 10 36 6 34 8 30 L 16 14 Z" fill="#15803d" stroke="#4ade80" strokeWidth="2" />
              <circle cx="20" cy="28" r="2" fill="#bbf7d0" />
            </svg>
          </div>
        </div>
      </div>

      {/* BOTTOM CYBER PLATFORM: 5 Science Badges (Brain, Leaf, Flask, Gear, Planet) */}
      <div className="w-full flex items-center justify-center shrink-0 pt-0.5 pb-0.5 relative z-20">
        <div className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8 py-1 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-blue-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md text-cyan-300">
          <div className="flex items-center gap-1 text-[11px] font-bold" title="สมอง / การคิดวิเคราะห์">
            <span>🧠</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold" title="ชีววิทยา / ธรรมชาติ">
            <span>🌿</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold" title="เคมี / การทดลอง">
            <span>🧪</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold" title="ฟิสิกส์ / กลไก">
            <span>⚙️</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold" title="ดาราศาสตร์ / อวกาศ">
            <span>🪐</span>
          </div>
        </div>
      </div>
    </div>
  );
};
