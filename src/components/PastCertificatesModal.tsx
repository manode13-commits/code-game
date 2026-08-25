import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Award,
  Calendar,
  Flame,
  Printer,
  Eye,
  X,
  Sparkles,
  Trophy,
  CheckCircle2,
  RefreshCw,
  FileText,
  ShieldCheck,
  Lock,
  Users,
  Clock,
  ChevronRight,
  AlertCircle,
  Play,
  Hourglass,
} from 'lucide-react';
import { CertificateRecord, PlayerHistoryEntry, fetchPlayerHistoryEntries } from '../services/playerService';
import { KpswLogo } from './KpswLogo';

interface PastCertificatesModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSelectCertificate: (cert: CertificateRecord) => void;
  onResumePlayer?: (player: PlayerHistoryEntry) => void;
}

export const PastCertificatesModal: React.FC<PastCertificatesModalProps> = ({
  isOpen = true,
  onClose,
  onSelectCertificate,
  onResumePlayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [entries, setEntries] = useState<PlayerHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await fetchPlayerHistoryEntries();
      setEntries(results);
    } catch (e) {
      console.error('Error fetching player history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Filtered entries based on tab and search
  const filteredEntries = useMemo(() => {
    let list = entries;

    if (filterTab === 'completed') {
      list = list.filter((item) => item.isComplete80);
    } else if (filterTab === 'in_progress') {
      list = list.filter((item) => !item.isComplete80);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.studentName.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          (item.certificate?.id && item.certificate.id.toLowerCase().includes(q))
      );
    }

    return list;
  }, [entries, filterTab, searchQuery]);

  const completedCount = useMemo(() => entries.filter((e) => e.isComplete80).length, [entries]);
  const inProgressCount = useMemo(() => entries.filter((e) => !e.isComplete80).length, [entries]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="past-certs-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            key="past-certs-content"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
          >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 flex-wrap">
                <span>รายชื่อผู้เข้าเล่น & คลังเกียรติบัตรออนไลน์</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  Firebase Database
                </span>
              </h2>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                ตรวจสอบรายชื่อผู้เล่น ความคืบหน้า และเกียรติบัตรสำหรับผู้ที่ผ่านครบ 80 ด่าน
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-emerald-100 hover:text-white transition cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats & Rules Summary Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Users className="w-4 h-4 text-slate-500" />
              <span>ผู้เข้าร่วมทั้งหมด: <span className="text-emerald-700 font-extrabold">{entries.length} คน</span></span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ผ่านครบ 80 ด่าน (ถาวร): <span className="font-extrabold">{completedCount} คน</span></span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-amber-700">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>เล่นค้างไว้ (เก็บ 24 ชม.): <span className="font-extrabold">{inProgressCount} คน</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
              <Hourglass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>ด่านที่เล่นค้างไว้จะถูกลบหากไม่เล่นต่อภายใน 1 วัน</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>เกียรติบัตรจะเปิดเมื่อครบ 80 ด่าน</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Tabs Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-2xl w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>ทั้งหมด ({entries.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('completed')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ผ่าน 80 ด่าน ({completedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('in_progress')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                filterTab === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ยังไม่ครบ ({inProgressCount})</span>
            </button>
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อผู้เล่น หรือรหัสเกียรติบัตร..."
                className="w-full pl-10 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={loadData}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
              title="รีเฟรชข้อมูลล่าสุดจาก Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Players & Certificates List Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-xs font-semibold">กำลังดึงข้อมูลรายชื่อจาก Firebase Firestore...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  {searchQuery ? 'ไม่พบรายชื่อที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อมูลในระบบ'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  เมื่อนักเรียนเริ่มใส่ชื่อและเล่นเกม ข้อมูลจะถูกบันทึกลงในระบบโดยอัตโนมัติ
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredEntries.map((entry, index) => {
                const percent = Math.round((entry.completedLevels / 80) * 100);

                return (
                  <div
                    key={entry.id || index}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      entry.isComplete80
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Left Info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${
                          entry.isComplete80
                            ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {entry.isComplete80 ? <Award className="w-5 h-5" /> : `#${index + 1}`}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900 truncate">
                            {entry.studentName}
                          </span>

                          {entry.isComplete80 ? (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ผ่านครบ 80 ด่าน (แกรนด์มาสเตอร์)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              กำลังทำภารกิจ ({entry.completedLevels}/80 ด่าน)
                            </span>
                          )}

                          {entry.certificate?.id && (
                            <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                              {entry.certificate.id}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar & Stats */}
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-600">
                          {/* Mini Progress bar */}
                          <div className="flex items-center gap-2 min-w-[140px] max-w-[200px]">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  entry.isComplete80
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold font-mono text-slate-700 shrink-0">
                              {entry.completedLevels}/80 ({percent}%)
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 font-bold text-emerald-700">
                              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                              {entry.totalScore.toLocaleString()} แต้ม
                            </span>
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              {entry.maxCombo} Combo
                            </span>
                            {entry.formattedDate && (
                              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {entry.formattedDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Button: Enable ONLY if 80 levels completed! */}
                    <div className="shrink-0 self-end md:self-center pt-2 md:pt-0 flex items-center gap-2">
                      {entry.isComplete80 && entry.certificate ? (
                        <button
                          type="button"
                          onClick={() => onSelectCertificate(entry.certificate!)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดู & โหลดเกียรติบัตร</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {onResumePlayer && (
                            <button
                              type="button"
                              onClick={() => {
                                onResumePlayer(entry);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                              title="กดเพื่อเข้าเล่นต่อจากด่านล่าสุดที่บันทึกไว้"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>เล่นต่อ (ด่าน {Math.min(entry.completedLevels + 1, 80)})</span>
                            </button>
                          )}
                          <div
                            className="px-2.5 py-1.5 bg-slate-200/90 text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1 cursor-not-allowed border border-slate-300/80"
                            title="ยังไม่สามารถรับเกียรติบัตรได้ เนื่องจากต้องผ่านให้ครบทั้ง 80 ภารกิจก่อน"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span className="hidden sm:inline">ยังไม่ได้รับเกียรติบัตร</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • โรงเรียนกำแพงแสนวิทยา</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </motion.div>
    </motion.div>
    )}
  </AnimatePresence>
  );
};

