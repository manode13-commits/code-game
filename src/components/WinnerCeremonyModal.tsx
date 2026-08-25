import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { TournamentPlayer } from '../types';
import { sound } from '../utils/audio';
import {
  Trophy,
  Medal,
  Sparkles,
  Printer,
  X,
  Award,
  Crown,
  Gift,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface WinnerCeremonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: TournamentPlayer[];
  roundNumber: number;
  prizeNote: string;
}

export const WinnerCeremonyModal: React.FC<WinnerCeremonyModalProps> = ({
  isOpen,
  onClose,
  players,
  roundNumber,
  prizeNote,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const champion = sorted[0];
  const runnerUp1 = sorted[1];
  const runnerUp2 = sorted[2];

  useEffect(() => {
    if (isOpen) {
      sound.playFanfare();

      // Confetti blast sequence
      const end = Date.now() + 3000;
      const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="winner-ceremony-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            key="winner-ceremony-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] my-8 max-h-[90vh] overflow-y-auto"
          >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ceremony Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> พิธีมอบรางวัลสัปดาห์วิทยาศาสตร์แห่งชาติ (รอบที่ {roundNumber})
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              🎉 ประกาศผลผู้ชนะเลิศ <span className="text-amber-400">Code Master</span>
            </h2>
            <p className="text-sm text-slate-300">
              ขอแสดงความยินดีกับน้องๆ นักคิดเชิงคำนวณที่ทำคะแนนสูงสุดในรอบ 5 นาที!
            </p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end mb-8 pt-6">
            {/* 2nd Place (Silver) */}
            {runnerUp1 && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-slate-300 flex items-center justify-center text-2xl sm:text-3xl shadow-lg relative mb-2">
                  {runnerUp1.avatar}
                  <div className="absolute -top-2 -right-2 bg-slate-300 text-slate-950 text-xs font-black px-1.5 py-0.5 rounded-full">
                    2nd
                  </div>
                </div>
                <div className="font-bold text-slate-200 text-xs sm:text-sm text-center truncate max-w-full">
                  {runnerUp1.name}
                </div>
                <div className="font-mono text-xs text-slate-300 font-bold">
                  {runnerUp1.score.toLocaleString()} แต้ม
                </div>
                <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl mt-2 flex items-center justify-center font-black text-slate-300 text-lg border-t-2 border-slate-400">
                  🥈 รองชนะเลิศ 1
                </div>
              </div>
            )}

            {/* 1st Place (Champion Gold) */}
            {champion && (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <Crown className="w-8 h-8 text-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                    {champion.avatar}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                    👑 ชนะเลิศ 1st
                  </div>
                </div>
                <div className="font-black text-amber-300 text-sm sm:text-base text-center truncate max-w-full mt-1">
                  {champion.name}
                </div>
                <div className="font-mono text-sm text-amber-200 font-black">
                  {champion.score.toLocaleString()} แต้ม
                </div>
                <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-amber-700/80 to-amber-500 rounded-t-2xl mt-2 flex flex-col items-center justify-center font-black text-slate-950 text-xl border-t-4 border-amber-300 shadow-lg">
                  <Trophy className="w-6 h-6 fill-slate-950 mb-1" />
                  แชมป์วิทย์
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {runnerUp2 && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-2xl sm:text-3xl shadow-lg relative mb-2">
                  {runnerUp2.avatar}
                  <div className="absolute -top-2 -right-2 bg-amber-700 text-white text-xs font-black px-1.5 py-0.5 rounded-full">
                    3rd
                  </div>
                </div>
                <div className="font-bold text-slate-200 text-xs sm:text-sm text-center truncate max-w-full">
                  {runnerUp2.name}
                </div>
                <div className="font-mono text-xs text-amber-300/80 font-bold">
                  {runnerUp2.score.toLocaleString()} แต้ม
                </div>
                <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-amber-950 to-amber-900 rounded-t-2xl mt-2 flex items-center justify-center font-black text-amber-300 text-sm sm:text-base border-t-2 border-amber-600">
                  🥉 รองชนะเลิศ 2
                </div>
              </div>
            )}
          </div>

          {/* Printable Official Science Week Certificate */}
          <div
            ref={certificateRef}
            className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 rounded-2xl border-4 border-amber-400/80 shadow-2xl text-center space-y-4 my-6 relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 text-[10px] text-amber-400 font-mono">
              CERTIFICATE ID: SCI-CODE-2026-R{roundNumber}
            </div>

            <div className="flex justify-center items-center gap-2">
              <Award className="w-8 h-8 text-amber-400" />
              <div className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-wide">
                เกียรติบัตรเชิดชูเกียรติ สัปดาห์วิทยาศาสตร์
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              ขอมอบเกียรติบัตรนี้ให้แก่
            </p>

            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-200 border-b-2 border-amber-400/50 pb-2 max-w-md mx-auto">
              {champion?.name || 'สุดยอดนักเขียนโค้ด'}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              ผู้ชนะเลิศอันดับ 1 ในการแข่งขัน <b>Computational Thinking & Coding Puzzle Quest</b>
              <br />
              ทำคะแนนรวม <span className="text-amber-300 font-bold">{champion?.score.toLocaleString()} แต้ม</span> (ผ่าน {champion?.levelsCleared} ด่าน) ภายในเวลา 5 นาที
            </p>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <div>📍 บูธกิจกรรมวิทยาศาสตร์ & เทคโนโลยี</div>
              <div className="font-semibold text-amber-300">สัปดาห์วิทยาศาสตร์แห่งชาติ ๒๕๖๙</div>
            </div>
          </div>

          {/* Prize Claim & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-500/30">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>นำหน้านี้ไปติดต่อรับของรางวัล: <b>{prizeNote}</b></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> พิมพ์เกียรติบัตร
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                เสร็จสิ้น / รอบต่อไป
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
