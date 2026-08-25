import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface VirtualDPadProps {
  onMove: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onReset: () => void;
  disabled?: boolean;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onMove,
  onReset,
  disabled = false,
}) => {
  const triggerMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (disabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    onMove(dir);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
      <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
        <span>🎮 ปุ่มควบคุมหน้าจอสัมผัส (Touch D-Pad)</span>
      </div>

      <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center select-none">
        {/* UP BUTTON */}
        <motion.button
          type="button"
          id="btn-dpad-up"
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerMove('up')}
          disabled={disabled}
          className="absolute top-0 w-14 h-14 bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 active:from-sky-600 active:to-sky-700 text-white rounded-2xl shadow-lg border border-sky-400/40 flex flex-col items-center justify-center cursor-pointer transition-transform disabled:opacity-50"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-bold">UP</span>
        </motion.button>

        {/* DOWN BUTTON */}
        <motion.button
          type="button"
          id="btn-dpad-down"
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerMove('down')}
          disabled={disabled}
          className="absolute bottom-0 w-14 h-14 bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 active:from-sky-600 active:to-sky-700 text-white rounded-2xl shadow-lg border border-sky-400/40 flex flex-col items-center justify-center cursor-pointer transition-transform disabled:opacity-50"
        >
          <ArrowDown className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-bold">DOWN</span>
        </motion.button>

        {/* LEFT BUTTON */}
        <motion.button
          type="button"
          id="btn-dpad-left"
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerMove('left')}
          disabled={disabled}
          className="absolute left-0 w-14 h-14 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 active:from-sky-700 active:to-sky-600 text-white rounded-2xl shadow-lg border border-sky-400/40 flex flex-col items-center justify-center cursor-pointer transition-transform disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-bold">LEFT</span>
        </motion.button>

        {/* RIGHT BUTTON */}
        <motion.button
          type="button"
          id="btn-dpad-right"
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerMove('right')}
          disabled={disabled}
          className="absolute right-0 w-14 h-14 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 active:from-sky-600 active:to-sky-700 text-white rounded-2xl shadow-lg border border-sky-400/40 flex flex-col items-center justify-center cursor-pointer transition-transform disabled:opacity-50"
        >
          <ArrowRight className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] font-bold">RIGHT</span>
        </motion.button>

        {/* CENTER RESET BUTTON */}
        <motion.button
          type="button"
          id="btn-dpad-reset"
          whileTap={{ scale: 0.85 }}
          onClick={onReset}
          disabled={disabled}
          title="รีเซ็ตตำแหน่ง"
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 text-slate-300 flex items-center justify-center shadow-inner cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
        </motion.button>
      </div>
    </div>
  );
};
