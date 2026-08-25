import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TournamentSession } from '../types';
import { sound } from '../utils/audio';
import { testFirebaseConnection, ConnectionStatus } from '../services/firebase';
import {
  Settings,
  X,
  Clock,
  Gift,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Download,
  Users,
  Eye,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';


interface TeacherHostPanelProps {
  isOpen: boolean;
  onClose: () => void;
  session: TournamentSession;
  onUpdateDuration: (seconds: number) => void;
  onUpdatePrize: (note: string) => void;
  onResetSession: () => void;
  onJumpToLevel: (levelId: number) => void;
  totalLevels: number;
  currentLevelId: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TeacherHostPanel: React.FC<TeacherHostPanelProps> = ({
  isOpen,
  onClose,
  session,
  onUpdateDuration,
  onUpdatePrize,
  onResetSession,
  onJumpToLevel,
  totalLevels,
  currentLevelId,
  soundEnabled,
  onToggleSound,
}) => {
  const [prizeInput, setPrizeInput] = useState(session.prizeNote);
  const [dbStatus, setDbStatus] = useState<ConnectionStatus | null>(null);
  const [testingDb, setTestingDb] = useState<boolean>(false);

  const checkDb = async () => {
    setTestingDb(true);
    try {
      const res = await testFirebaseConnection();
      setDbStatus(res);
    } finally {
      setTestingDb(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkDb();
    }
  }, [isOpen]);


  const exportScoresCSV = () => {
    const sorted = [...session.players].sort((a, b) => b.score - a.score);
    let csv = `อันดับ,ชื่อผู้เข้าแข่งขัน,คะแนน,ผ่านด่าน,คอมโบสูงสุด,สถานะ\n`;
    sorted.forEach((p, idx) => {
      csv += `${idx + 1},"${p.name}",${p.score},${p.levelsCleared},${p.highestCombo},${p.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Science_Week_Round_${session.roundNumber}_Scores.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="teacher-panel-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            key="teacher-panel-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  แผงควบคุมบูธวิทยาศาสตร์ (Teacher Panel)
                </h3>
                <p className="text-xs text-slate-400">
                  ตั้งค่าเวลารอบ ของรางวัล และกระโดดข้ามด่านสำหรับสาธิต
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time Limit Setting */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> เวลาการแข่งขันต่อรอบ (นาที)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[180, 300, 600].map((secs) => (
                <button
                  key={secs}
                  type="button"
                  onClick={() => onUpdateDuration(secs)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border cursor-pointer ${
                    session.durationSeconds === secs
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {secs / 60} นาที {secs === 300 && '⭐ แนะนำ'}
                </button>
              ))}
            </div>
          </div>

          {/* Prize Name Setting */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-rose-400" /> ของรางวัลสำหรับผู้ชนะเลิศรอบนี้
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prizeInput}
                onChange={(e) => setPrizeInput(e.target.value)}
                placeholder="เช่น ตุ๊กตามาสคอตวิทยาศาสตร์ + เกียรติบัตร..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => onUpdatePrize(prizeInput)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition"
              >
                บันทึก
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <div className="text-xs font-bold text-white">เสียงประกอบเกม (Web Audio SFX)</div>
                <div className="text-[11px] text-slate-400">เสียงกดก้าว, คอมโบ, นาฬิกานับถอยหลัง</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'เปิดอยู่' : 'ปิดเสียง'}
            </button>
          </div>

          {/* Jump to Level Demo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-400" /> สาธิตด่าน / เลือกเล่นด่านเฉพาะ (1 - {totalLevels})
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {Array.from({ length: totalLevels }).map((_, i) => {
                const lvlNum = i + 1;
                const isCurrent = lvlNum === currentLevelId;
                return (
                  <button
                    key={lvlNum}
                    type="button"
                    onClick={() => {
                      onJumpToLevel(lvlNum);
                      onClose();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lvlNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Firebase Cloud Database Status Card */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${dbStatus?.online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>ฐานข้อมูล Firebase Cloud Firestore</span>
                    <span className={`w-2 h-2 rounded-full ${dbStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[260px]">
                    {dbStatus?.databaseId || 'ai-studio-scienceweekcodeq-4297696f-7af9-4a9b-9e1a-27ab27311832'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={checkDb}
                disabled={testingDb}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
                <span>{testingDb ? 'Ping...' : 'ทดสอบ Ping'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <span>{dbStatus?.message || 'กำลังตรวจสอบการเชื่อมต่อ...'}</span>
              {dbStatus?.latencyMs !== undefined && (
                <span className="font-mono text-emerald-400 font-bold">{dbStatus.latencyMs} ms</span>
              )}
            </div>
          </div>

          {/* Export and Reset actions */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">

            <button
              type="button"
              onClick={exportScoresCSV}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> ส่งออกคะแนน CSV
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('ต้องการรีเซ็ตรอบการแข่งขันสำหรับกลุ่ม 10 คนใหม่หรือไม่?')) {
                  onResetSession();
                  onClose();
                }
              }}
              className="flex-1 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" /> รีเซ็ตรอบใหม่
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
