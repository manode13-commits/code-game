import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TournamentPlayer, TournamentSession } from '../types';
import {
  Trophy,
  Users,
  Timer,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Gift,
  Award,
  Flame,
  CheckCircle,
  UserCheck
} from 'lucide-react';

interface TournamentLobbyProps {
  session: TournamentSession;
  onStartTournament: () => void;
  onSelectPlayer: (playerIndex: number) => void;
  onResetSession: () => void;
  onUpdatePlayerName: (playerIndex: number, newName: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (playerIndex: number) => void;
  onAutoFillTenPlayers: () => void;
  onOpenCeremony: () => void;
}

export const TournamentLobby: React.FC<TournamentLobbyProps> = ({
  session,
  onStartTournament,
  onSelectPlayer,
  onResetSession,
  onUpdatePlayerName,
  onAddPlayer,
  onRemovePlayer,
  onAutoFillTenPlayers,
  onOpenCeremony,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState<string>('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedPlayers = [...session.players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Tournament Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl text-white select-none">
          #10
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> สัปดาห์วิทยาศาสตร์แห่งชาติ - รอบที่ {session.roundNumber}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              การแข่งขันโค้ดดิ้ง <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">10 ผู้เข้าแข่งขัน</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              เวลาต่อรอบ 5:00 นาที ใครถอดรหัสอัลกอริทึมได้ถูกต้องและทำคอมโบได้สูงสุด จะได้รับของรางวัลใหญ่และเกียรติบัตรวิทย์!
            </p>
          </div>

          {/* Time and Action Panel */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <Timer className={`w-7 h-7 ${session.secondsRemaining < 60 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-bold uppercase">เวลาคงเหลือ</div>
                <div className="text-2xl font-mono font-black text-white tracking-wider">
                  {formatTime(session.secondsRemaining)}
                </div>
              </div>
            </div>

            {!session.isActive && !session.isFinished && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onStartTournament}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <Play className="w-5 h-5 fill-white" /> เริ่มแข่ง 5 นาที
              </motion.button>
            )}

            {session.isActive && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-sm animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                กำลังแข่งขัน...
              </div>
            )}

            {session.isFinished && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onOpenCeremony}
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Award className="w-5 h-5 text-slate-950" /> ประกาศผล & มอบรางวัล
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Prize Banner */}
      <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-amber-300">ของรางวัลประจำรอบ: </span>
            <span>{session.prizeNote || 'ตุ๊กตามาสคอตวิทยาศาสตร์ + เกียรติบัตรยอดเยี่ยม + ขนมของขวัญ'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onAutoFillTenPlayers}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
        >
          สุ่มรายชื่อ 10 คน
        </button>
      </div>

      {/* 10 Players Leaderboard & Match Roster */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> ตารางคะแนนสด (รอบละ 10 คน)
            </h3>
            <p className="text-xs text-slate-400">
              คลิกที่ผู้เล่นเพื่อเข้าเล่นเกมและบันทึกคะแนนสะสม
            </p>
          </div>

          <div className="flex items-center gap-2">
            {session.players.length < 10 && (
              <button
                type="button"
                onClick={onAddPlayer}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" /> เพิ่มผู้เล่น ({session.players.length}/10)
              </button>
            )}
            <button
              type="button"
              onClick={onResetSession}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตรอบใหม่
            </button>
          </div>
        </div>

        {/* Players Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {session.players.map((player, idx) => {
            const rank = sortedPlayers.findIndex((p) => p.id === player.id) + 1;
            const isTop3 = rank <= 3;
            const isCurrentActive = session.activePlayerIndex === idx;

            const medalBadge =
              rank === 1 ? '🥇 อันดับ 1 (ทอง)' :
              rank === 2 ? '🥈 อันดับ 2 (เงิน)' :
              rank === 3 ? '🥉 อันดับ 3 (ทองแดง)' : `#${rank}`;

            return (
              <motion.div
                key={player.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isCurrentActive
                    ? 'bg-purple-900/30 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : isTop3
                    ? 'bg-slate-950/80 border-amber-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Avatar & Rank & Name */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
                      {player.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      rank === 1 ? 'bg-amber-400 text-slate-950' :
                      rank === 2 ? 'bg-slate-300 text-slate-950' :
                      rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rank}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingIndex === idx ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder="ชื่อผู้เข้าแข่งขัน..."
                          className="px-2 py-1 bg-slate-800 border border-purple-500 rounded text-xs text-white focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (tempName.trim()) {
                              onUpdatePlayerName(idx, tempName.trim());
                            }
                            setEditingIndex(null);
                          }}
                          className="px-2 py-1 bg-emerald-600 text-white text-xs rounded font-bold"
                        >
                          บันทึก
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div
                          onClick={() => {
                            setEditingIndex(idx);
                            setTempName(player.name);
                          }}
                          className="font-bold text-slate-100 text-sm sm:text-base truncate cursor-pointer hover:text-purple-300 flex items-center gap-1.5"
                          title="คลิกเพื่อแก้ไขชื่อ"
                        >
                          {player.name}
                          <span className="text-[10px] text-slate-500">✏️</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> ผ่าน {player.levelsCleared} ด่าน
                          </span>
                          {player.highestCombo > 1 && (
                            <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-amber-400" /> สูงสุด {player.highestCombo}x
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Score & Select Button */}
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">คะแนน</div>
                    <div className="text-lg sm:text-xl font-mono font-black text-amber-300">
                      {player.score.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPlayer(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                      isCurrentActive
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {isCurrentActive ? 'กำลังเล่น' : 'เลือกเล่น'}
                  </button>

                  {session.players.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemovePlayer(idx)}
                      title="ลบผู้เล่น"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
