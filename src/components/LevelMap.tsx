import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Level } from '../types';
import { KpswLogo } from './KpswLogo';
import {
  Lock,
  Play,
  Sparkles,
  Award,
  RotateCcw,
  User,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Layers,
  ChevronLeft,
  History,
  Users,
} from 'lucide-react';

interface LevelMapProps {
  levels: Level[];
  unlockedLevelIndex: number;
  currentLevelIndex: number;
  onSelectLevel: (levelIndex: number) => void;
  playerScore: number;
  levelScores?: Record<number, number>;
  studentName?: string;
  onOpenCertificate?: () => void;
  onOpenPastCertificates?: () => void;
  onExitToWelcome?: () => void;
}

interface StageZone {
  id: number;
  zoneKey: string;
  title: string;
  subtitle: string;
  startLevel: number; // 1-indexed (e.g. 1)
  endLevel: number; // 1-indexed (e.g. 20)
  range: string;
  icon: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeBg: string;
  conceptTitle: string;
  conceptDescription: string;
  scienceLink: string;
  codeKeywords: string[];
}

export const LevelMap: React.FC<LevelMapProps> = ({
  levels,
  unlockedLevelIndex,
  currentLevelIndex,
  onSelectLevel,
  playerScore,
  levelScores = {},
  studentName = '',
  onOpenCertificate,
  onOpenPastCertificates,
  onExitToWelcome,
}) => {
  // 4 Core Master Zones for 80 Levels
  const zones: StageZone[] = [
    {
      id: 1,
      zoneKey: 'K',
      title: 'ขั้นตอนวิธี & ลำดับคำสั่ง',
      subtitle: 'Zone K • Sequencing & Trajectory',
      startLevel: 1,
      endLevel: 20,
      range: 'ด่าน 1 - 20',
      icon: '🚀',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/50 hover:border-amber-400 shadow-amber-500/10',
      bgGradient: 'from-amber-500/15 via-slate-900/90 to-slate-950/95',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      conceptTitle: 'หลักการลำดับคำสั่ง (Sequence)',
      conceptDescription:
        'คอมพิวเตอร์จะประมวลผลคำสั่งทีละบรรทัดจากบนลงล่างอย่างแม่นยำ การเรียงลำดับถูกหรือผิดส่งผลโดยตรงต่อผลลัพธ์',
      scienceLink: '🔬 สาระวิทย์: การวางขั้นตอนการทดลอง (Scientific Method) ทีละขั้นอย่างมีระเบียบ',
      codeKeywords: ['ก้าวเดิน', 'เลี้ยวซ้าย/ขวา', 'พอร์ทัลวาร์ป'],
    },
    {
      id: 2,
      zoneKey: 'P',
      title: 'การวนซ้ำ & รู้จำรูปแบบ',
      subtitle: 'Zone P • Loops & Pattern Recognition',
      startLevel: 21,
      endLevel: 40,
      range: 'ด่าน 21 - 40',
      icon: '🔁',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/10',
      bgGradient: 'from-cyan-500/15 via-slate-900/90 to-slate-950/95',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      conceptTitle: 'การวนซ้ำและการลดรูปคำสั่ง (Loops)',
      conceptDescription:
        'มองหารูปแบบที่ทำซ้ำ แล้วใช้คำสั่ง `repeat (N)` หรือ `while` เพื่อให้โค้ดสั้น กระชับ และมีประสิทธิภาพสูงสุด',
      scienceLink: '🔬 สาระวิทย์: การสังเกตวัฏจักรธรรมชาติ เช่น วงโคจรดาวเคราะห์และการหมุนเวียนสาร',
      codeKeywords: ['repeat(N)', 'while loop', 'วงล้อคาบซ้ำ'],
    },
    {
      id: 3,
      zoneKey: 'S',
      title: 'เงื่อนไข & การตัดสินใจ',
      subtitle: 'Zone S • Conditionals & Sensors',
      startLevel: 41,
      endLevel: 60,
      range: 'ด่าน 41 - 60',
      icon: '🔀',
      accentColor: 'text-fuchsia-400',
      borderColor: 'border-fuchsia-500/50 hover:border-fuchsia-400 shadow-fuchsia-500/10',
      bgGradient: 'from-fuchsia-500/15 via-slate-900/90 to-slate-950/95',
      badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
      conceptTitle: 'ตรรกะการตัดสินใจ (If-Else)',
      conceptDescription:
        'หุ่นยนต์ใช้เซนเซอร์ตรวจสอบสิ่งแวดล้อมเพื่อเลือกเส้นทาง เช่น `if (เจอกระเบื้องสีเขียว) เลี้ยวขวา else เลี้ยวซ้าย`',
      scienceLink: '🔬 สาระวิทย์: การวิเคราะห์ข้อมูลเชิงประจักษ์และการปรับสมมติฐานตามตัวแปรทดลอง',
      codeKeywords: ['if / else', 'เซนเซอร์สี', 'ทางแยกเขาวงกต'],
    },
    {
      id: 4,
      zoneKey: 'W',
      title: 'ฟังก์ชัน & แกรนด์มาสเตอร์บอส 👑',
      subtitle: 'Zone W • Functions & Master Bosses',
      startLevel: 61,
      endLevel: 80,
      range: 'ด่าน 61 - 80',
      icon: '⚡',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10',
      bgGradient: 'from-emerald-500/15 via-slate-900/90 to-slate-950/95',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      conceptTitle: 'การแยกย่อยปัญหาและสร้างฟังก์ชัน (Functions)',
      conceptDescription:
        'รวมกลุ่มคำสั่งย่อยเป็นฟังก์ชัน `def action()` เรียกใช้งานซ้ำ ผสานความรู้ทั้งหมดเพื่อแก้โจทย์ 80 ด่านบริบูรณ์',
      scienceLink: '🔬 สาระวิทย์: การบูรณาการสะเต็มศึกษา (STEM) สู่นวัตกรรมแก้ปัญหาจริง',
      codeKeywords: ['def function()', 'Decomposition', 'บอส AI 80 ด่าน 👑'],
    },
  ];

  // Active Zone Tab (1, 2, 3, 4)
  const currentZoneIndex = Math.min(Math.floor(unlockedLevelIndex / 20), 3);
  const [selectedZoneId, setSelectedZoneId] = useState<number>(currentZoneIndex + 1);

  const completedCount = Object.keys(levelScores).length;
  const totalLevelsCount = levels.length || 80;
  const progressPercent = Math.round((completedCount / totalLevelsCount) * 100);
  const isAllComplete = completedCount >= totalLevelsCount || unlockedLevelIndex >= totalLevelsCount - 1;

  const targetPlayIndex = Math.min(unlockedLevelIndex, totalLevelsCount - 1);
  const targetPlayLevelNumber = targetPlayIndex + 1; // 1-80

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full p-1 sm:p-2 overflow-hidden select-none relative">
      {/* TOP HEADER: Brand, Student Badge, Progress, Certificate, and BIG Clear PLAY BUTTON */}
      <div className="flex items-center justify-between bg-slate-900/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg shrink-0 z-20 flex-wrap gap-2">
        {/* Left: Brand & Student Name */}
        <div className="flex items-center gap-2">
          <div className="bg-white/95 px-2 py-0.5 rounded-lg shadow-xs shrink-0 flex items-center">
            <KpswLogo size="xs" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300 tracking-tight font-mono">
              CODING QUEST 80
            </span>
            {studentName && (
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1 text-[10px] sm:text-[11px]">
                <User className="w-2.5 h-2.5 text-emerald-400" />
                <span className="truncate max-w-[90px] sm:max-w-[150px]">{studentName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Quest Progress Meter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/90 rounded-lg border border-slate-800">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold">ภารกิจ:</span>
            <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-black text-emerald-300">
              {completedCount}/{totalLevelsCount} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Right: Score, Certificate, PROMINENT START PLAY & Reset Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Score Badge */}
          <div className="px-2 py-1 bg-slate-950 rounded-lg flex items-center gap-1 border border-amber-500/30 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-mono font-black text-amber-300">
              {playerScore.toLocaleString()}
            </span>
          </div>

          {/* Past Certificates Archive Search Button */}
          {onOpenPastCertificates && (
            <button
              type="button"
              onClick={onOpenPastCertificates}
              id="map-past-certificates-btn"
              title="ค้นหารายชื่อผู้เข้าเล่นและเกียรติบัตรทั้งหมดในระบบ"
              className="px-2 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition cursor-pointer bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700/80 shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">รายชื่อ & เกียรติบัตร</span>
            </button>
          )}


          {/* Certificate Button (Unlocked ONLY after completing all 80 levels) */}
          {onOpenCertificate && (
            isAllComplete ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onOpenCertificate}
                id="view-certificate-map-btn"
                title="ดูใบเกียรติบัตร (พิชิตครบ 80 ด่านสำเร็จแล้ว)"
                className="px-2.5 py-1.5 rounded-lg font-black text-[11px] flex items-center gap-1 transition cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-400/30 animate-bounce"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>🏆 รับเกียรติบัตร</span>
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert(`คุณต้องเล่นพิชิตให้ครบทั้ง 80 ด่านก่อนจึงจะสามารถรับใบเกียรติบัตรได้ครับ\n(ขณะนี้ผ่านแล้ว ${completedCount}/${totalLevelsCount} ด่าน)`);
                }}
                id="view-certificate-map-btn"
                title={`ต้องเล่นครบ 80 ด่านเพื่อปลดล็อกเกียรติบัตร (ขณะนี้ผ่าน ${completedCount}/${totalLevelsCount} ด่าน)`}
                className="px-2.5 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer bg-slate-800/90 hover:bg-slate-700/90 text-slate-400 border border-slate-700/60"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>เกียรติบัตร ({completedCount}/{totalLevelsCount})</span>
              </button>
            )
          )}

          {/* PROMINENT START PLAY BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSelectLevel(targetPlayIndex)}
            id="start-play-main-btn"
            className="px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300/60 flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm tracking-wide"
          >
            <div className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950 ml-0.5" />
            </div>
            <span>เริ่มเล่นด่าน {targetPlayLevelNumber}</span>
          </motion.button>

          {/* Exit / Next Student Button */}
          {onExitToWelcome && (
            <button
              type="button"
              onClick={onExitToWelcome}
              id="exit-to-welcome-btn"
              title="จบกิจกรรมและเริ่มสำหรับคนต่อไป"
              className="px-2 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/50 text-rose-300 font-bold rounded-lg transition flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">คนต่อไป</span>
            </button>
          )}
        </div>
      </div>

      {/* ZONE SELECTOR TABS (Zone 1: 1-20, Zone 2: 21-40, Zone 3: 41-60, Zone 4: 61-80) */}
      <div className="grid grid-cols-4 gap-1.5 my-1 shrink-0 z-10">
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const isUnlockedZone = unlockedLevelIndex >= zone.startLevel - 1;
          const zoneCompletedInZone = levels
            .slice(zone.startLevel - 1, zone.endLevel)
            .filter((_, idx) => !!levelScores[zone.startLevel - 1 + idx]).length;

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZoneId(zone.id)}
              className={`px-2 py-1.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                isSelected
                  ? `bg-slate-900 border-2 ${zone.accentColor} shadow-md shadow-slate-950`
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900/60 opacity-80'
              }`}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-base sm:text-lg">{zone.icon}</span>
                <div className="truncate">
                  <div className={`text-xs font-black truncate ${isSelected ? zone.accentColor : 'text-slate-200'}`}>
                    {zone.title}
                  </div>
                  <div className="text-[9.5px] text-slate-400 font-mono">
                    {zone.range}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                  zoneCompletedInZone === 20 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {zoneCompletedInZone}/20 ⭐
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE ZONE DETAIL & 20-LEVEL GRID (Compact 4x5 or 5x4 responsive grid) */}
      <div className={`flex-1 bg-gradient-to-b ${activeZone.bgGradient} border-2 ${activeZone.borderColor} rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden z-10`}>
        {/* Zone Concept Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{activeZone.icon}</span>
            <div>
              <h3 className={`text-sm sm:text-base font-black ${activeZone.accentColor} tracking-tight leading-tight`}>
                {activeZone.title} ({activeZone.range})
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
                {activeZone.conceptDescription}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-cyan-300/90 font-mono">
            {activeZone.scienceLink}
          </div>
        </div>

        {/* 20 Levels Grid in this Zone */}
        <div className="flex-1 grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2 my-1 items-center justify-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800/90 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => {
            const levelIdx = activeZone.startLevel - 1 + i;
            const levelNum = levelIdx + 1; // 1 to 80
            const isUnlocked = levelIdx <= unlockedLevelIndex;
            const isCurrent = levelIdx === currentLevelIndex;
            const isCompleted = levelIdx < unlockedLevelIndex || !!levelScores[levelIdx];
            const lvl = levels[levelIdx];
            const isFinalBoss = levelNum === 80;
            const isZoneBoss = levelNum % 20 === 0;

            return (
              <div key={levelIdx} className="relative group/node flex flex-col items-center">
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.15 } : {}}
                  whileTap={isUnlocked ? { scale: 0.92 } : {}}
                  type="button"
                  onClick={() => isUnlocked && onSelectLevel(levelIdx)}
                  disabled={!isUnlocked}
                  className={`w-full aspect-square max-w-[54px] rounded-xl flex flex-col items-center justify-center font-mono font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer relative z-10 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-300 to-yellow-400 text-slate-950 ring-3 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_18px_rgba(251,191,36,0.95)] font-black animate-pulse'
                      : isCompleted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)] border border-emerald-300/40'
                      : isUnlocked
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600'
                      : 'bg-slate-900/90 text-slate-600 border border-slate-800 opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <span>{levelNum}</span>
                      {isCompleted && (
                        <span className="text-[8px] sm:text-[9px] leading-none text-amber-200">
                          ⭐
                        </span>
                      )}
                    </>
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}

                  {/* Boss Crown */}
                  {isZoneBoss && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] animate-bounce">
                      {isFinalBoss ? '👑' : '🏆'}
                    </span>
                  )}
                </motion.button>

                {/* Level Tooltip on Hover */}
                {lvl && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover/node:opacity-100 transition-opacity bg-slate-950 text-[10px] text-slate-200 px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-30 shadow-2xl border border-slate-700 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 font-bold text-white">
                      <span>{lvl.iconEmoji || '⚡'}</span>
                      <span>ด่าน {levelNum}: {lvl.thaiTitle}</span>
                    </div>
                    {levelScores[levelIdx] ? (
                      <span className="text-amber-300 font-bold text-[8.5px]">
                        ⭐ แต้มที่ได้: {levelScores[levelIdx]} แต้ม
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Zone Footer: Keywords & Fast Navigation */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-400">คีย์เวิร์ดประจำโซน:</span>
            {activeZone.codeKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800"
              >
                {kw}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedZoneId <= 1}
              onClick={() => setSelectedZoneId((prev) => Math.max(prev - 1, 1))}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 font-bold text-[10px] border border-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" /> โซนก่อนหน้า
            </button>
            <button
              type="button"
              disabled={selectedZoneId >= 4}
              onClick={() => setSelectedZoneId((prev) => Math.min(prev + 1, 4))}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 font-bold text-[10px] border border-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              โซนถัดไป <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Footer & Adventure Flow Progression */}
      <div className="flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] text-slate-400 shrink-0 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.9)]" /> ผ่านแล้ว ⭐
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" /> ด่านปัจจุบัน ⚡
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" /> ล็อก 🔒
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-cyan-300/90 font-mono">
          <span className="font-bold text-slate-300">ภารกิจ 80 ด่าน:</span>
          <span className="text-amber-400 font-bold">K: 1➔20</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-400 font-bold">P: 21➔40</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="text-fuchsia-400 font-bold">S: 41➔60</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="text-emerald-400 font-bold">W: 61➔80 (Grand Boss 👑)</span>
        </div>
      </div>
    </div>
  );
};
