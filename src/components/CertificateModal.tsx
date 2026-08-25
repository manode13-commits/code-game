import React from 'react';
import { motion } from 'motion/react';
import { KpswLogo } from './KpswLogo';
import {
  Printer,
  RotateCcw,
  X,
  Award,
  CheckCircle2,
  Sparkles,
  Calendar,
  Zap,
  ShieldCheck,
  Flame,
  Code2,
  Trophy,
} from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  totalScore: number;
  maxCombo: number;
  certificateId?: string;
  issuedDateStr?: string;
  completedLevelsCount?: number;
  onClose: () => void;
  onResetForNextStudent?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  totalScore,
  maxCombo,
  certificateId = 'KPSW-80L-CERT',
  issuedDateStr,
  completedLevelsCount = 80,
  onClose,
  onResetForNextStudent,
}) => {
  // Format Thai date
  const today = new Date();
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const defaultFormattedDate = `${today.getDate()} ${thaiMonths[today.getMonth()]} พ.ศ. ${today.getFullYear() + 543}`;
  const formattedDate = issuedDateStr || defaultFormattedDate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      key="cert-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <motion.div
        key="cert-modal-content"
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="bg-slate-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
              GEN-ALPHA DIGITAL CERTIFICATE OF ACHIEVEMENT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              id="print-certificate-btn"
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              title="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Inner Canvas - Modern Gen-Alpha Cyber Elegance */}
        <div
          id="printable-certificate"
          className="p-5 sm:p-8 md:p-10 flex flex-col items-center justify-between text-center relative bg-gradient-to-b from-slate-50 via-white to-amber-50/40 border-[6px] sm:border-[8px] border-emerald-800 m-2 sm:m-3 rounded-2xl sm:rounded-3xl shadow-inner overflow-hidden select-none"
          style={{ minHeight: '520px' }}
        >
          {/* Cyber Geometric Corner Brackets */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-emerald-600 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-emerald-600 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-emerald-600 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-emerald-600 rounded-br-lg" />

          {/* Golden Outer Guilloche Accent Line */}
          <div className="absolute inset-2 border border-amber-500/40 rounded-xl pointer-events-none" />

          {/* Top School Branding & Activity Seal */}
          <div className="w-full flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
              <Code2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>SCIENCE WEEK 2026 • QUEST VERIFIED</span>
            </div>

            {/* School Crest Logo */}
            <div className="flex flex-col items-center">
              <KpswLogo size="md" showSubtitle={false} />
            </div>

            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>MASTER CODER 100%</span>
            </div>
          </div>

          {/* School & Department Subtitle */}
          <div className="text-[11px] sm:text-xs font-bold text-emerald-900 tracking-wide">
            โรงเรียนกำแพงแสนวิทยา • กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
          </div>

          {/* Certificate Title */}
          <div className="my-2 sm:my-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              เกียรติบัตรแห่งความสำเร็จ
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm font-extrabold text-amber-700 tracking-wider uppercase mt-1">
              CERTIFICATE OF COMPUTATIONAL THINKING & LOGIC MASTERY
            </p>
          </div>

          {/* Presentation Line */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            ขอมอบเกียรติบัตรฉบับนี้เพื่อแสดงว่า
          </p>

          {/* Student Name Display */}
          <div className="my-2 sm:my-3 px-8 py-2 bg-gradient-to-r from-emerald-50 via-amber-50/60 to-emerald-50 rounded-2xl border-2 border-amber-400 shadow-xs inline-block max-w-full">
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-950 tracking-wide drop-shadow-xs">
              {studentName || 'นักเรียนโรงเรียนกำแพงแสนวิทยา'}
            </span>
          </div>

          {/* Achievement Description - Balanced Non-Breaking Lines for Clean Layout */}
          <div className="w-full max-w-2xl mx-auto my-2 text-slate-700 font-medium">
            <p className="text-xs sm:text-[13.5px] leading-snug whitespace-normal">
              ได้เข้าร่วมกิจกรรมและผ่านการทดสอบทักษะการคิดเชิงคำนวณและการเขียนโปรแกรมควบคุมตามผังงาน
            </p>
            <p className="text-xs sm:text-[13.5px] font-bold text-emerald-800 leading-snug mt-1">
              (Computational Thinking & Algorithm Flowchart) ครบทั้ง {completedLevelsCount} ภารกิจ
            </p>
          </div>

          {/* Gen-Alpha Gamer & Logic Mastery Stat Badges */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 my-2 sm:my-3 flex-wrap">
            {/* Score Badge */}
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-300 flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-900 shadow-xs">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>คะแนนรวม: {totalScore.toLocaleString()} แต้ม</span>
            </div>

            {/* Combo Badge */}
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-300 flex items-center gap-2 text-xs sm:text-sm font-black text-amber-900 shadow-xs">
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              <span>คอมโบสูงสุด: {maxCombo} Combo</span>
            </div>

            {/* 100% Completion Badge */}
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-300 flex items-center gap-2 text-xs sm:text-sm font-black text-cyan-900 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>{completedLevelsCount} / {completedLevelsCount} ด่านสำเร็จ 100%</span>
            </div>

            {/* Verification Code */}
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-300 flex items-center gap-1.5 text-xs sm:text-sm font-mono font-black text-indigo-900 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>CODE: {certificateId}</span>
            </div>
          </div>

          {/* Date & Department Certification Seal */}
          <div className="w-full grid grid-cols-2 pt-3 sm:pt-4 mt-2 border-t border-slate-200 text-xs sm:text-sm">
            {/* Left: Issued Date */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>วันที่ออกเกียรติบัตร</span>
              </div>
              <span className="font-bold text-slate-800">{formattedDate}</span>
            </div>

            {/* Right: Signature & Department */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-36 sm:w-44 border-b-2 border-slate-400 mb-1" />
              <span className="font-bold text-slate-800 text-[11.5px] sm:text-xs">
                กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500">
                โรงเรียนกำแพงแสนวิทยา
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions for Open Station Walk-in (Screen Only) */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / เซฟเกียรติบัตร (Print / PDF)</span>
          </button>

          {onResetForNextStudent ? (
            <button
              type="button"
              onClick={onResetForNextStudent}
              id="reset-for-next-btn"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>จบกิจกรรม & เริ่มสำหรับคนต่อไป</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <span>ปิดหน้าต่าง</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
