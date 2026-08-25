import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KpswQRCode } from './KpswQRCode';
import { KpswLogo } from './KpswLogo';
import { DeviceMode } from '../types';
import { testFirebaseConnection, ConnectionStatus } from '../services/firebase';
import {
  Play,
  Sparkles,
  Award,
  HelpCircle,
  QrCode,
  Smartphone,
  Monitor,
  Maximize2,
  X,
  CheckCircle2,
  Radio,
  Database,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';


interface WelcomeScreenProps {
  studentName: string;
  initialDeviceMode?: DeviceMode;
  onStart: (name: string, deviceMode: DeviceMode) => void;
  onOpenPastCertificates?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  studentName: initialName,
  initialDeviceMode = 'desktop',
  onStart,
  onOpenPastCertificates,
}) => {
  const [name, setName] = useState<string>(initialName || '');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    if (initialDeviceMode) return initialDeviceMode;
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'mobile';
    return 'desktop';
  });
  const [error, setError] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<ConnectionStatus | null>(null);
  const [testingDb, setTestingDb] = useState<boolean>(false);
  const targetUrl = 'https://code-game69.vercel.app/';

  const checkDatabase = async () => {
    setTestingDb(true);
    try {
      const res = await testFirebaseConnection();
      setDbStatus(res);
    } catch {
      setDbStatus({
        online: false,
        message: 'ไม่สามารถทดสอบการเชื่อมต่อฐานข้อมูลได้',
      });
    } finally {
      setTestingDb(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (!name.trim()) {
      setError('กรุณากรอกชื่อก่อนเริ่มเล่นกิจกรรม');
      return;
    }
    setError('');
    onStart(name.trim(), deviceMode);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 p-3.5 sm:p-6 flex flex-col relative overflow-hidden"
      >
        {/* Decorative Background Accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* School Header & Branding */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
          <KpswLogo size="md" />
          <div className="text-right">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200">
              สถานีเปิด Walk-in Station
            </span>
            <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium mt-0.5">
              กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
            </div>
          </div>
        </div>

        {/* TOP QR CODE SECTION (ข้างบนชื่อเกม สำหรับสแกนเล่นในมือถือ) */}
        <div className="mb-3 p-2.5 bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50 rounded-xl sm:rounded-2xl border border-sky-200/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Interactive QR Code Thumbnail */}
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="bg-white p-1 rounded-xl border-2 border-indigo-300/80 shadow-sm hover:scale-105 transition cursor-pointer relative group shrink-0"
              title="คลิกเพื่อขยาย QR Code เต็มจอสำหรับฉายโปรเจกเตอร์หรือสแกน"
            >
              <KpswQRCode
                value={targetUrl}
                size={58}
                includeMargin={true}
              />
              <span className="absolute inset-0 bg-indigo-900/20 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">สแกน QR Code เพื่อเปิดเล่นในมือถือ</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 leading-tight mt-0.5">
                เผื่อเครื่องคอมพิวเตอร์ไม่พอ นักเรียนสามารถใช้สมาร์ทโฟน/แท็บเล็ตสแกนเล่นพร้อมกันได้
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10.5px] font-bold rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <QrCode className="w-3 h-3" />
            <span className="hidden sm:inline">ขยาย QR</span>
          </button>
        </div>

        {/* Activity Title */}
        <div className="text-center mb-3">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>กิจกรรมฝึกทักษะโค้ดดิ้ง & คิดเชิงคำนวณ</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 shrink-0" />
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
            อ่านคำสั่งโค้ดและผังงาน (Flowchart) เพื่อนำทางจุดสีพิชิต 80 ด่านภารกิจ!
          </p>
        </div>

        {/* Student Name & Device Selection Form */}
        <form onSubmit={handleSubmit} className="mb-3 space-y-2.5">
          {/* 1. Device Selection (คอมพิวเตอร์ vs มือถือ) */}
          <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              <span>เลือกอุปกรณ์ที่คุณกำลังใช้งาน (เพื่อปรับหน้าจอให้พอดีที่สุด):</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Option A: Computer / PC */}
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-xl border-2 flex items-center gap-2.5 transition text-left cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-indigo-50/90 border-indigo-600 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>💻 เล่นบนคอมพิวเตอร์</span>
                    {deviceMode === 'desktop' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">PC / โน้ตบุ๊ก (จอกว้าง)</div>
                </div>
              </button>

              {/* Option B: Mobile / Tablet */}
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-xl border-2 flex items-center gap-2.5 transition text-left cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    deviceMode === 'mobile' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>📱 เล่นบนมือถือ / แท็บเล็ต</span>
                    {deviceMode === 'mobile' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">ย่อโค้ด & ผังงานให้เต็มจอพอดี</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Name Input */}
          <div className="bg-slate-50/90 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200">
            <label
              htmlFor="student-name-input"
              className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>กรอกชื่อผู้เล่น (สำหรับพิมพ์ในใบเกียรติบัตร) :</span>
            </label>
            <div className="flex gap-2">
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="เช่น ด.ช.สมชาย ใจดี ม.2/1 เลขที่ 15"
                className="flex-1 px-3 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="submit"
                id="start-activity-btn"
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
              >
                <span>เริ่มเล่น</span>
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </button>
            </div>
            {error && (
              <p className="text-rose-600 text-xs font-bold mt-1.5">
                ⚠️ {error}
              </p>
            )}
          </div>
        </form>

        {/* How to Play Guide (วิธีเล่น 4 ข้อเข้าใจง่าย) */}
        <div className="space-y-1.5 mb-2.5">
          <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-sky-600" />
            <span>วิธีเล่นง่ายๆ ใน 4 ขั้นตอน:</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            <div className="p-2 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-800 block font-bold text-[11px]">อ่านคำสั่งโค้ด & ผังงาน</strong>
                <span className="text-slate-600 text-[10px] sm:text-[10.5px]">
                  ดูคำสั่งและผังงานว่าให้เดินไปทิศทางไหน
                </span>
              </div>
            </div>

            <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-800 block font-bold text-[11px]">กดปุ่มลูกศรเดินทีละก้าว</strong>
                <span className="text-slate-600 text-[10px] sm:text-[10.5px]">
                  ใช้แป้นพิมพ์ <kbd className="px-1 bg-white border rounded text-[9px]">↑</kbd> <kbd className="px-1 bg-white border rounded text-[9px]">↓</kbd> <kbd className="px-1 bg-white border rounded text-[9px]">←</kbd> <kbd className="px-1 bg-white border rounded text-[9px]">→</kbd> หรือแตะปุ่มบนจอ
                </span>
              </div>
            </div>

            <div className="p-2 bg-purple-50/70 rounded-xl border border-purple-100 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-800 block font-bold text-[11px]">วาร์ปทะลุขอบจอได้ (Wrap)</strong>
                <span className="text-slate-600 text-[10px] sm:text-[10.5px]">
                  เดินเลยขอบตารางจะวาร์ปไปโผล่อีกฝั่งอัตโนมัติ
                </span>
              </div>
            </div>

            <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-100 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-800 block font-bold text-[11px]">รับใบเกียรติบัตรออนไลน์</strong>
                <span className="text-slate-600 text-[10px] sm:text-[10.5px]">
                  พิชิตครบ 80 ด่าน รับใบประกาศพร้อมสั่งพิมพ์และดาวน์โหลดย้อนหลังได้ทันที!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Firebase Cloud Database Status Banner */}
        <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 text-[10.5px]">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1 rounded-lg shrink-0 ${dbStatus?.online ? 'bg-emerald-100 text-emerald-700' : dbStatus ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dbStatus?.online ? 'bg-emerald-500 animate-pulse' : dbStatus ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <span className={dbStatus?.online ? 'text-emerald-900 font-black' : 'text-slate-700'}>
                  {dbStatus?.online ? 'ฐานข้อมูล Firebase Cloud Firestore (ออนไลน์)' : testingDb ? 'กำลังตรวจสอบการเชื่อมต่อฐานข้อมูล...' : 'กำลังเชื่อมต่อฐานข้อมูล Firebase...'}
                </span>
                {dbStatus?.latencyMs !== undefined && (
                  <span className="text-[9.5px] px-1.5 py-0.2 bg-emerald-100/80 text-emerald-800 rounded-full font-mono font-bold">
                    {dbStatus.latencyMs}ms
                  </span>
                )}
              </div>
              <div className="text-[9.5px] text-slate-500 truncate font-mono">
                DB ID: {dbStatus?.databaseId || 'ai-studio-scienceweekcodeq-4297696f-7af9-4a9b-9e1a-27ab27311832'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={checkDatabase}
            disabled={testingDb}
            title="กดเพื่อทดสอบเชื่อมต่อและ Ping ฐานข้อมูล Cloud Firestore"
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${testingDb ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span>{testingDb ? 'กำลังทดสอบ...' : 'ทดสอบเชื่อมต่อ'}</span>
          </button>
        </div>

        {/* Action Bar: Past Certificates Button & Category Pills */}
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10.5px] text-slate-500 flex-wrap gap-2">

          {onOpenPastCertificates ? (
            <button
              type="button"
              onClick={onOpenPastCertificates}
              id="welcome-past-certificates-btn"
              className="px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-900 border border-amber-300 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs text-[11px]"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>👥 รายชื่อผู้เข้าเล่น & คลังเกียรติบัตร (Firebase)</span>
            </button>
          ) : (
            <span className="font-bold text-slate-600">4 โซนหลัก (80 ด่าน):</span>
          )}


          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px]">K: ลำดับ (1-20)</span>
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">P: วนซ้ำ (21-40)</span>
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">S: เงื่อนไข (41-60)</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">W: ฟังก์ชัน (61-80)</span>
          </div>
        </div>
      </motion.div>

      {/* FULLSCREEN QR CODE MODAL FOR PROJECTOR / EASY SCAN */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            key="qr-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              key="qr-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200 relative flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="font-black text-slate-900 text-base mb-1">
                สแกน QR Code เพื่อเปิดเล่น
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                เปิดกล้องมือถือแล้วสแกนเพื่อเข้าสู่กิจกรรมได้ทันที
              </p>

              {/* Large High-Res Standard QR Code */}
              <div className="p-3 bg-white rounded-2xl border-2 border-indigo-200 shadow-md mb-3 inline-block">
                <KpswQRCode
                  value={targetUrl}
                  size={210}
                  includeMargin={true}
                />
              </div>

              <div className="w-full mb-2">
                <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-200 break-all select-all text-center">
                  {targetUrl}
                </div>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(targetUrl);
                    alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
                  }}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-200 transition cursor-pointer"
                >
                  📋 คัดลอกลิงก์
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
