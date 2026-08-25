import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KpswLogo } from './KpswLogo';
import { BookOpen, X, Sparkles, CheckCircle2, ChevronRight, Lightbulb, Compass, Cpu, Atom } from 'lucide-react';

interface KpswKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KpswKnowledgeModal: React.FC<KpswKnowledgeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'K' | 'P' | 'S' | 'W'>('K');

  const kpswPillars = [
    {
      id: 'K' as const,
      letter: 'K',
      title: 'Knowledge & Sequencing',
      thaiTitle: 'องค์ความรู้และลำดับขั้นตอน (Algorithm)',
      levelsRange: 'ด่าน 0 - 4',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      gradient: 'from-amber-500/20 via-slate-900 to-slate-950',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      icon: '🚀',
      scienceConcept: 'กระบวนการทางวิทยาศาสตร์เริ่มต้นจากการตั้งสมมติฐานและการวางขั้นตอนการทดลองอย่างเป็นลำดับที่ถูกต้อง',
      codingConcept: 'การเขียนโค้ดแบบลำดับ (Sequence): คอมพิวเตอร์จะประมวลผลคำสั่งทีละบรรทัดจากบนลงล่างอย่างเคร่งครัด เช่น ก้าวเดิน ➔ หมุนซ้าย ➔ วาร์ปมิติ',
      keyTakeaways: [
        'การเรียงลำดับคำสั่งผิดแม้แต่ขั้นตอนเดียว อาจทำให้ผลลัพธ์ล้มเหลว (Bug)',
        'คำนวณระยะทางและทิศทางก่อนป้อนคำสั่งให้ยานสำรวจ',
        'ใช้พอร์ทัลวาร์ปมิติเพื่อข้ามอุปสรรคทางตัน',
      ],
      schoolValue: 'Knowledge (ความรู้) : ปลูกฝังให้นักเรียนกำแพงแสนวิทยามีรากฐานความรู้ทางวิทยาศาสตร์และเทคโนโลยีที่มั่นคง',
    },
    {
      id: 'P' as const,
      letter: 'P',
      title: 'Pattern & Practice',
      thaiTitle: 'การรู้จำรูปแบบและการวนซ้ำ (Loops)',
      levelsRange: 'ด่าน 5 - 9',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      gradient: 'from-cyan-500/20 via-slate-900 to-slate-950',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      icon: '🔁',
      scienceConcept: 'ปรากฏการณ์ธรรมชาติและจักรวาลล้วนมีรูปแบบซ้ำเดิม (Patterns) เช่น การโคจรของดาวเคราะห์ วงจรชีวิตพืช',
      codingConcept: 'การวนซ้ำ (Loops): การลดทอนคำสั่งที่ซ้ำซ้อนด้วย `repeat(N)` หรือ `while(condition)` ช่วยให้โค้ดสั้น กระชับ และมีประสิทธิภาพสูง',
      keyTakeaways: [
        'มองหาสิ่งที่ทำซ้ำ เช่น เดินหน้าแล้วเก็บผลึก 4 ครั้ง แทนการเขียนโค้ดยาว 4 บรรทัด',
        'การวนซ้ำแบบมีเงื่อนไข (While Loop) เช่น เดินไปข้างหน้าเรื่อยๆ จนกว่าจะเจอเป้าหมาย',
        'ประหยัดบล็อกคำสั่งเพื่อให้ได้คะแนนระดับ 3 ดาวเต็ม ⭐⭐⭐',
      ],
      schoolValue: 'Practice (การฝึกฝน) : มุ่งมั่นฝึกฝนปฏิบัติจริง เพื่อสร้างความชำนาญและกระบวนการคิดที่เป็นระบบ',
    },
    {
      id: 'S' as const,
      letter: 'S',
      title: 'Science & Selection',
      thaiTitle: 'กระบวนการวิทย์และการตัดสินใจ (Conditionals)',
      levelsRange: 'ด่าน 10 - 14',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
      gradient: 'from-fuchsia-500/20 via-slate-900 to-slate-950',
      accentColor: 'text-fuchsia-400',
      borderColor: 'border-fuchsia-500/50',
      icon: '🔀',
      scienceConcept: 'การทดลองทางวิทยาศาสตร์ต้องใช้การสังเกต วิเคราะห์ข้อมูลเชิงประจักษ์ และปรับเปลี่ยนกลยุทธ์ตามผลการทดลอง',
      codingConcept: 'การเลือกทำตามเงื่อนไข (If-Else & Sensors): หุ่นยนต์ใช้เซนเซอร์ตรวจสอบสิ่งแวดล้อม เช่น ถ้าเจอกระเบื้องสีฟ้าให้เลี้ยวซ้าย ถ้าเจอสีแดงให้เลี้ยวขวา',
      keyTakeaways: [
        'ใช้โครงสร้าง `if (condition)` เพื่อตัดสินใจแบบอัตโนมัติ',
        'เซนเซอร์สีช่วยให้หุ่นยนต์ปรับตัวเข้ากับแผนที่ที่ซับซ้อนได้เอง',
        'สร้างตรรกะการแก้ปัญหาทางแยกในเส้นทางเขาวงกต',
      ],
      schoolValue: 'Science (วิทยาศาสตร์) : ส่งเสริมกระบวนการคิดแบบนักวิทยาศาสตร์ มีเหตุผล และพิสูจน์ได้ด้วยข้อมูลจริง',
    },
    {
      id: 'W' as const,
      letter: 'W',
      title: 'Wisdom & World Solutions',
      thaiTitle: 'ภูมิปัญญา นวัตกรรม และฟังก์ชัน (Functions & Boss)',
      levelsRange: 'ด่าน 15 - 19',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      gradient: 'from-emerald-500/20 via-slate-900 to-slate-950',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      icon: '⚡',
      scienceConcept: 'เป้าหมายสูงสุดของวิทยาศาสตร์คือการนำความรู้มาสร้างนวัตกรรมแก้ปัญหาจริงของมนุษยชาติและสิ่งแวดล้อมโลก',
      codingConcept: 'การสร้างฟังก์ชันและแก้ปัญหาโจทย์ใหญ่ (Functions & Decomposition): การแบ่งปัญหาใหญ่ออกเป็นส่วนย่อย แล้วเขียนฟังก์ชันมาเรียกใช้ซ้ำได้อย่างชาญฉลาด',
      keyTakeaways: [
        'สร้างฟังก์ชัน `def action()` เพื่อรวมชุดคำสั่งย่อยให้เรียกใช้ได้ทันที',
        'การพิชิตด่านบอสต้องการการผสานความรู้ทั้ง K-P-S-W เข้าด้วยกัน',
        'ฝึกทักษะการคิดขั้นสูง (Computational Thinking) สำหรับศตวรรษที่ 21',
      ],
      schoolValue: 'Wisdom (ปัญญาและคุณธรรม) : นำเทคโนโลยีและวิทยาศาสตร์ไปพัฒนาสังคม ประเทศชาติอย่างสร้างสรรค์',
    },
  ];

  const currentPillar = kpswPillars.find((p) => p.id === activeTab)!;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="knowledge-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <motion.div
            key="knowledge-modal-content"
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-slate-900 border-2 border-cyan-500/60 w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-b border-slate-700/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white px-2 py-0.5 rounded-lg shadow-sm">
                  <KpswLogo size="xs" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span>หลักสูตรความรู้ KPSW Coding Quest</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • โรงเรียนกำแพงแสนวิทยา
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pillar Selector Tabs (K - P - S - W) */}
            <div className="grid grid-cols-4 gap-1.5 p-2 sm:p-3 bg-slate-950/70 border-b border-slate-800 shrink-0">
              {kpswPillars.map((pillar) => {
                const isActive = activeTab === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActiveTab(pillar.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                      isActive
                        ? `bg-slate-800 ${pillar.borderColor} ${pillar.accentColor} shadow-lg shadow-cyan-500/10 scale-[1.02]`
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{pillar.icon}</span>
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-black flex items-center justify-center sm:justify-start gap-1">
                        <span>{pillar.letter}</span>
                        <span className="hidden md:inline text-[11px] opacity-80">({pillar.levelsRange})</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] truncate max-w-[65px] sm:max-w-none">
                        {pillar.letter === 'K' ? 'ลำดับคำสั่ง' : pillar.letter === 'P' ? 'การวนซ้ำ' : pillar.letter === 'S' ? 'เงื่อนไข' : 'ฟังก์ชัน/บอส'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Header of Active Pillar */}
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentPillar.gradient} border ${currentPillar.borderColor} shadow-inner`}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${currentPillar.badgeColor}`}>
                    {currentPillar.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    ครอบคลุม {currentPillar.levelsRange}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-black ${currentPillar.accentColor}`}>
                  {currentPillar.thaiTitle}
                </h3>
              </div>

              {/* Grid of Concept Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Science Connection Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
                    <Atom className="w-4 h-4" />
                    <span>🔬 มิติด้านวิทยาศาสตร์ (Science)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPillar.scienceConcept}
                  </p>
                </div>

                {/* Computational Thinking Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>💻 มิติด้านโค้ดดิ้ง (Coding Logic)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPillar.codingConcept}
                  </p>
                </div>
              </div>

              {/* Key Takeaways Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm mb-2.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>💡 เทคนิคการพิชิตด่านในโซนนี้ (Tips & Tricks)</span>
                </div>
                <div className="space-y-1.5">
                  {currentPillar.keyTakeaways.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Value / KPSW Philosophy */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <span className="font-bold text-emerald-300">อัตลักษณ์กำแพงแสนวิทยา : </span>
                  {currentPillar.schoolValue}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>กดเลือกแต่ละแท็บ K - P - S - W เพื่อศึกษาความรู้ครบทุกเสาหลัก</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-500/25 transition cursor-pointer"
              >
                เข้าใจแล้ว เข้าสู่เกม 🚀
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
