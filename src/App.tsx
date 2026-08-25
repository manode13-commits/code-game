import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, GridPosition, DeviceMode } from './types';
import { GAME_LEVELS } from './data/levels';
import { GameBoard } from './components/GameBoard';
import { CodeDisplay } from './components/CodeDisplay';
import { LevelMap } from './components/LevelMap';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CertificateModal } from './components/CertificateModal';
import { PastCertificatesModal } from './components/PastCertificatesModal';
import { ScienceWeekFrame } from './components/ScienceWeekFrame';
import { KpswLogo } from './components/KpswLogo';
import { sound } from './utils/audio';
import {
  savePlayerRecord,
  saveCertificateRecord,
  CertificateRecord,
  PlayerHistoryEntry,
  fetchPlayerByName,
  INCOMPLETE_RETENTION_MS,
} from './services/playerService';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  Volume2,
  VolumeX,
  Trophy,
  Award,
  Target,
  Zap,
  RotateCcw,
  User,
  AlertTriangle,
  X,
  Smartphone,
  Monitor,
  LayoutGrid,
  Code2,
  Columns,
  Lock,
  History,
  Users,
} from 'lucide-react';

export default function App() {
  // Check 24-hour expiration for local saved in-progress data on startup
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('kpsw_unlocked_level');
      const unlockedNum = savedUnlocked ? parseInt(savedUnlocked, 10) : 0;
      const isCompleted = unlockedNum >= GAME_LEVELS.length;

      // If not fully completed, check if last activity timestamp > 24 hours
      if (!isCompleted) {
        const lastActiveStr = localStorage.getItem('kpsw_last_active_time');
        if (lastActiveStr) {
          const lastActiveTime = new Date(lastActiveStr).getTime();
          if (!isNaN(lastActiveTime) && Date.now() - lastActiveTime > INCOMPLETE_RETENTION_MS) {
            // Expired after 1 day! Clean up local session
            localStorage.removeItem('kpsw_student_name');
            localStorage.removeItem('kpsw_unlocked_level');
            localStorage.removeItem('kpsw_level_scores');
            localStorage.removeItem('kpsw_last_active_time');
            setStudentName('');
            setUnlockedLevelIndex(0);
            setLevelScores({});
            setView('welcome');
          }
        }
      }
    } catch {}
  }, []);

  // Student Name for Walk-in Kiosk
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('kpsw_student_name') || '';
    } catch {
      return '';
    }
  });

  // Device Mode: 'desktop' | 'mobile'
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    try {
      const saved = localStorage.getItem('kpsw_device_mode');
      if (saved === 'desktop' || saved === 'mobile') return saved;
      return typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';
    } catch {
      return 'desktop';
    }
  });

  // Mobile Sub-View Tab (for mobile view switching): 'split' | 'board' | 'code'
  const [mobileTab, setMobileTab] = useState<'split' | 'board' | 'code'>('split');

  // Current Screen View: 'welcome' | 'map' | 'game'
  const [view, setView] = useState<'welcome' | 'map' | 'game'>(() => {
    try {
      const savedName = localStorage.getItem('kpsw_student_name');
      return savedName ? 'map' : 'welcome';
    } catch {
      return 'welcome';
    }
  });

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showPastCertificates, setShowPastCertificates] = useState<boolean>(false);
  const [selectedPastCert, setSelectedPastCert] = useState<CertificateRecord | null>(null);
  const [currentCertificateId, setCurrentCertificateId] = useState<string>('KPSW-80L-CERT');
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Persisted Unlocked Level & High Scores
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kpsw_unlocked_level');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [levelScores, setLevelScores] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('kpsw_level_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel: Level = GAME_LEVELS[currentLevelIndex] || GAME_LEVELS[0];

  const [currentPos, setCurrentPos] = useState<GridPosition>(currentLevel.startPos);
  const [visitedPositions, setVisitedPositions] = useState<GridPosition[]>([currentLevel.startPos]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // FAIR ATTEMPT SCORING:
  // Points accumulated in the current flawless run
  const [attemptScore, setAttemptScore] = useState<number>(0);
  const [mistakesInAttempt, setMistakesInAttempt] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [floatingText, setFloatingText] = useState<{ text: string; id: number } | null>(null);
  const [bumpKey, setBumpKey] = useState<number>(0);
  const [isInputLocked, setIsInputLocked] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Total calculated strictly as the sum of all level best scores
  const totalScore: number = (Object.values(levelScores) as number[]).reduce(
    (sum: number, val: number) => sum + (Number(val) || 0),
    0
  );

  const completedLevelsCount = Object.keys(levelScores).length;
  const isAllLevelsCompleted = completedLevelsCount >= GAME_LEVELS.length || unlockedLevelIndex >= GAME_LEVELS.length;

  // Sync state on level change
  useEffect(() => {
    setCurrentPos(currentLevel.startPos);
    setVisitedPositions([currentLevel.startPos]);
    setCurrentStepIndex(0);
    setIsLevelComplete(false);
    setShowHint(false);
    setAttemptScore(0);
    setMistakesInAttempt(0);
    setCombo(0);
    setIsInputLocked(false);
  }, [currentLevelIndex, currentLevel]);

  // Floating text feedback
  const showFeedback = (text: string) => {
    setFloatingText({ text, id: Date.now() });
    setTimeout(() => {
      setFloatingText(null);
    }, 1100);
  };

  // Start Playing from Welcome Screen
  const handleStartActivity = async (name: string, mode: DeviceMode) => {
    const trimmedName = name.trim();
    setStudentName(trimmedName);
    setDeviceMode(mode);
    const nowIso = new Date().toISOString();

    try {
      localStorage.setItem('kpsw_student_name', trimmedName);
      localStorage.setItem('kpsw_device_mode', mode);
      localStorage.setItem('kpsw_last_active_time', nowIso);
    } catch {}

    // Check if this student already has saved in-progress data in Firebase to resume seamlessly
    let currentUnlocked = unlockedLevelIndex;
    let currentTotalScore = totalScore;
    let currentHighestCombo = highestCombo;

    if (trimmedName) {
      try {
        const existingPlayer = await fetchPlayerByName(trimmedName);
        if (existingPlayer && (existingPlayer.completedLevels > 0 || existingPlayer.totalScore > 0)) {
          // If the player exists and has higher saved level
          if (existingPlayer.completedLevels > currentUnlocked) {
            currentUnlocked = Math.min(existingPlayer.completedLevels, GAME_LEVELS.length);
            setUnlockedLevelIndex(currentUnlocked);
            try {
              localStorage.setItem('kpsw_unlocked_level', currentUnlocked.toString());
            } catch {}
          }
          if (existingPlayer.totalScore > currentTotalScore) {
            currentTotalScore = existingPlayer.totalScore;
          }
          if (existingPlayer.maxCombo > currentHighestCombo) {
            currentHighestCombo = existingPlayer.maxCombo;
            setHighestCombo(currentHighestCombo);
          }
        }
      } catch (err) {
        console.warn('Error checking existing player on login:', err);
      }

      // Save/Update player info to Firebase Firestore with latest active time
      savePlayerRecord({
        name: trimmedName,
        completedLevels: currentUnlocked,
        totalScore: currentTotalScore,
        maxCombo: currentHighestCombo,
        deviceMode: mode,
      });
    }

    setView('map');
  };

  // Resume playing from PastCertificatesModal
  const handleResumePlayer = (player: PlayerHistoryEntry) => {
    const targetName = player.studentName;
    const targetUnlocked = Math.min(player.completedLevels, GAME_LEVELS.length);
    const nowIso = new Date().toISOString();

    setStudentName(targetName);
    setUnlockedLevelIndex(targetUnlocked);
    setHighestCombo(player.maxCombo || 0);

    // If starting on a level, set current level to next uncompleted level (or level 80)
    const targetLevelIdx = Math.min(targetUnlocked, GAME_LEVELS.length - 1);
    setCurrentLevelIndex(targetLevelIdx);

    try {
      localStorage.setItem('kpsw_student_name', targetName);
      localStorage.setItem('kpsw_unlocked_level', targetUnlocked.toString());
      localStorage.setItem('kpsw_last_active_time', nowIso);
    } catch {}

    // Touch Firestore to update lastActiveAt
    savePlayerRecord({
      id: player.id,
      name: targetName,
      completedLevels: targetUnlocked,
      totalScore: player.totalScore,
      maxCombo: player.maxCombo,
    });

    // Go directly to level map or game view
    setView('map');
  };

  // Complete Reset For Next Student (Walk-in Open Station)
  const handleResetForNextStudent = () => {
    try {
      localStorage.removeItem('kpsw_student_name');
      localStorage.removeItem('kpsw_unlocked_level');
      localStorage.removeItem('kpsw_level_scores');
      localStorage.removeItem('kpsw_last_active_time');
    } catch {}

    setStudentName('');
    setUnlockedLevelIndex(0);
    setLevelScores({});
    setCurrentLevelIndex(0);
    setCurrentStepIndex(0);
    setAttemptScore(0);
    setMistakesInAttempt(0);
    setCombo(0);
    setHighestCombo(0);
    setIsLevelComplete(false);
    setShowCertificate(false);
    setShowExitConfirm(false);
    setView('welcome');
    sound.playLevelSuccess();
  };

  // Potential score calculations for current level
  const stepCount = currentLevel.stepByStepDirections.length;
  let maxStepPoints = 0;
  for (let i = 1; i <= stepCount; i++) {
    const mult = Math.min(1 + (i - 1) * 0.1, 2.5);
    maxStepPoints += Math.round(50 * mult);
  }
  const maxComboBonus = stepCount * 20;
  const clearBonus = 200;
  const flawlessBonus = 100;
  const maxPossibleScore = maxStepPoints + maxComboBonus + clearBonus + flawlessBonus;

  // Move dot according to code instruction with TOROIDAL / EDGE WRAP-AROUND
  const handleMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isLevelComplete || view !== 'game' || isInputLocked) return;

      const expectedDirection = currentLevel.stepByStepDirections[currentStepIndex];

      const deltaMap: Record<string, { r: number; c: number }> = {
        up: { r: -1, c: 0 },
        down: { r: 1, c: 0 },
        left: { r: 0, c: -1 },
        right: { r: 0, c: 1 },
      };

      const delta = deltaMap[direction];
      const rawRow = currentPos.row + delta.r;
      const rawCol = currentPos.col + delta.c;

      // Wrap-around boundaries: if moving past edge, appear on the opposite side!
      const wrappedRow = (rawRow + currentLevel.rows) % currentLevel.rows;
      const wrappedCol = (rawCol + currentLevel.cols) % currentLevel.cols;

      const nextPos: GridPosition = {
        row: wrappedRow,
        col: wrappedCol,
      };

      const isWrapMove =
        rawRow < 0 ||
        rawRow >= currentLevel.rows ||
        rawCol < 0 ||
        rawCol >= currentLevel.cols;

      // 1. Check if move matches code algorithm
      if (direction === expectedDirection) {
        sound.playMove();

        const newStep = currentStepIndex + 1;
        const newPositions = [...visitedPositions, nextPos];

        setCurrentPos(nextPos);
        setVisitedPositions(newPositions);
        setCurrentStepIndex(newStep);

        // Calculate Progressive Step Multiplier
        const stepMultiplier = Math.min(1 + currentStepIndex * 0.1, 2.5);
        const earnedStepScore = Math.round(50 * stepMultiplier);

        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > highestCombo) {
          setHighestCombo(newCombo);
        }

        const comboBonus = (newCombo - 1) * 20;
        const totalStepGain = earnedStepScore + comboBonus;

        setAttemptScore((prev) => prev + totalStepGain);

        if (isWrapMove) {
          showFeedback('🌀 วาร์ปข้ามขอบ!');
        } else if (newCombo >= 4) {
          showFeedback(`🔥 คอมโบ x${newCombo}! (+${totalStepGain})`);
        } else {
          showFeedback(`+${totalStepGain}`);
        }

        // Check if level completed
        if (newStep >= currentLevel.stepByStepDirections.length) {
          setIsLevelComplete(true);
          sound.playLevelSuccess();

          // Calculate final level bonus points
          const levelClearBonus = 200;
          const flawlessRunBonus = mistakesInAttempt === 0 ? 100 : 0;
          const finalAttemptScore = attemptScore + totalStepGain + levelClearBonus + flawlessRunBonus;

          // Save high score for this level
          const previousBest = levelScores[currentLevel.id] || 0;
          let currentLevelScores = levelScores;
          if (finalAttemptScore > previousBest) {
            currentLevelScores = {
              ...levelScores,
              [currentLevel.id]: finalAttemptScore,
            };
            setLevelScores(currentLevelScores);
            try {
              localStorage.setItem('kpsw_level_scores', JSON.stringify(currentLevelScores));
            } catch {}
          }

          // Calculate current aggregate score across all completed levels
          const updatedTotalScore: number = (Object.values(currentLevelScores) as number[]).reduce(
            (sum: number, val: number) => sum + (Number(val) || 0),
            0
          );

          // Unlock next level (enforcing sequential progression across all 80 levels)
          const nextLevelIdx = currentLevelIndex + 1;
          let updatedUnlocked = unlockedLevelIndex;
          if (nextLevelIdx > unlockedLevelIndex) {
            updatedUnlocked = Math.min(nextLevelIdx, GAME_LEVELS.length);
            setUnlockedLevelIndex(updatedUnlocked);
            try {
              localStorage.setItem('kpsw_unlocked_level', updatedUnlocked.toString());
            } catch {}
          }

          // Persist ongoing progress to Firebase Firestore
          if (studentName) {
            savePlayerRecord({
              name: studentName,
              completedLevels: updatedUnlocked,
              totalScore: updatedTotalScore,
              maxCombo: Math.max(highestCombo, newCombo),
              deviceMode,
            });
          }

          // Auto-advance or trigger certificate on finishing all 80 levels
          setTimeout(() => {
            if (currentLevelIndex < GAME_LEVELS.length - 1) {
              setCurrentLevelIndex((prev) => prev + 1);
            } else {
              // Final Level 80 Completed! Generate and save Certificate
              const certId = `KPSW-80L-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
              setCurrentCertificateId(certId);

              if (studentName) {
                saveCertificateRecord({
                  certificateId: certId,
                  studentName,
                  totalScore: updatedTotalScore,
                  maxCombo: Math.max(highestCombo, newCombo),
                  completedLevelsCount: GAME_LEVELS.length,
                });
              }

              setShowCertificate(true);
            }
          }, 1400);
        }
      } else {
        // WRONG DIRECTION
        sound.playError();
        setBumpKey((prev) => prev + 1);
        setIsInputLocked(true);

        const newMistakes = mistakesInAttempt + 1;
        setMistakesInAttempt(newMistakes);
        setCombo(0);
        setAttemptScore(0);

        showFeedback('❌ ผิดทิศทาง! รีเซ็ตจุดเริ่มต้น');

        setTimeout(() => {
          setCurrentPos(currentLevel.startPos);
          setVisitedPositions([currentLevel.startPos]);
          setCurrentStepIndex(0);
          setIsInputLocked(false);
        }, 500);
      }
    },
    [
      isLevelComplete,
      view,
      isInputLocked,
      currentLevel,
      currentStepIndex,
      currentPos,
      visitedPositions,
      combo,
      highestCombo,
      attemptScore,
      mistakesInAttempt,
      levelScores,
      currentLevelIndex,
      unlockedLevelIndex,
    ]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleMove('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleMove('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMove('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMove('right');
      } else if (e.key === 'Escape') {
        if (showCertificate) {
          setShowCertificate(false);
        } else if (showExitConfirm) {
          setShowExitConfirm(false);
        } else if (view === 'game') {
          setView('map');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, view, showCertificate, showExitConfirm]);

  const handleResetStep = () => {
    setCurrentPos(currentLevel.startPos);
    setVisitedPositions([currentLevel.startPos]);
    setCurrentStepIndex(0);
    setIsLevelComplete(false);
    setCombo(0);
    setAttemptScore(0);
    sound.playBump();
  };

  const handleSelectLevel = (levelIndex: number) => {
    // Only allow selecting unlocked levels (or already completed ones) to enforce sequential ordering
    if (levelIndex <= unlockedLevelIndex) {
      setCurrentLevelIndex(levelIndex);
      setView('game');
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const toggleDeviceMode = () => {
    const next = deviceMode === 'desktop' ? 'mobile' : 'desktop';
    setDeviceMode(next);
    try {
      localStorage.setItem('kpsw_device_mode', next);
    } catch {}
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#060913] text-slate-100 flex flex-col font-sans select-none p-1 sm:p-2 relative">
      {/* Background Glow Orbs & Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. WELCOME SCREEN (Walk-in Kiosk / QR Code / Enter Name / Device Selection) */}
      {view === 'welcome' ? (
        <WelcomeScreen
          studentName={studentName}
          initialDeviceMode={deviceMode}
          onStart={handleStartActivity}
          onOpenPastCertificates={() => setShowPastCertificates(true)}
        />
      ) : view === 'map' ? (
        /* 2. LEVEL MAP VIEW (Science Week Code Quest Frame + K-P-S-W Quad Matrix) */
        <ScienceWeekFrame>
          <LevelMap
            levels={GAME_LEVELS}
            unlockedLevelIndex={unlockedLevelIndex}
            currentLevelIndex={currentLevelIndex}
            onSelectLevel={handleSelectLevel}
            playerScore={totalScore}
            levelScores={levelScores}
            studentName={studentName}
            onOpenCertificate={() => setShowCertificate(true)}
            onOpenPastCertificates={() => setShowPastCertificates(true)}
            onExitToWelcome={() => setShowExitConfirm(true)}
          />
        </ScienceWeekFrame>
      ) : (
        /* 3. FULL SCREEN GAMEPLAY VIEW (ADAPTIVE TOP BAR & ZERO CUTOFF LAYOUT) */
        <div className="h-full w-full flex flex-col gap-1 sm:gap-1.5 max-w-7xl mx-auto overflow-hidden">
          {/* Unified Compact Top Bar */}
          <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-2 sm:px-3 py-1 rounded-xl shadow-md shrink-0 border border-slate-800/60 text-xs flex-wrap gap-1">
            {/* Left: Back Button & Level Title & Small KPSW Brand */}
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                type="button"
                onClick={() => setView('map')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg flex items-center gap-1 text-[11px] font-bold transition cursor-pointer shrink-0"
                title="กลับไปหน้ารวมด่าน"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">หน้ารวมด่าน</span>
              </button>

              <div className="bg-white/95 px-1.5 sm:px-2 py-0.5 rounded-lg flex items-center shadow-2xs shrink-0">
                <KpswLogo size="xs" />
              </div>

              {/* Prominent Current Level of Total Status Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-rose-950/90 via-slate-900 to-indigo-950/90 border border-rose-500/50 rounded-lg shadow-sm shrink-0">
                <span className="text-[10px] text-slate-300 font-bold hidden xs:inline">ด่าน</span>
                <span className="font-mono font-black text-xs sm:text-sm text-rose-400">
                  {currentLevel.id}
                </span>
                <span className="text-slate-400 font-mono text-[10px] font-bold">/</span>
                <span className="font-mono font-bold text-xs text-slate-300">
                  {GAME_LEVELS.length}
                </span>
              </div>

              <div className="flex items-center gap-1 min-w-0">
                {currentLevel.iconEmoji && (
                  <span className="text-sm shrink-0">{currentLevel.iconEmoji}</span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden xs:inline shrink-0">
                  {currentLevel.conceptLabel}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[100px] sm:max-w-[160px]">
                  {currentLevel.thaiTitle}
                </span>
              </div>
            </div>

            {/* Middle: Potential Level Score Target Pills (Large Screen Only) */}
            <div className="hidden xl:flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="inline-flex items-center gap-1 bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded-md font-medium">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>ผ่าน +200</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-indigo-950/70 text-indigo-300 border border-indigo-800/40 px-1.5 py-0.5 rounded-md font-medium">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span>ก้าว ~{maxStepPoints}</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-rose-950/70 text-rose-300 border border-rose-800/40 px-1.5 py-0.5 rounded-md font-medium">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>คอมโบ +{maxComboBonus}</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 px-2 py-0.5 rounded-md">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>สูงสุด ~{maxPossibleScore.toLocaleString()}</span>
              </span>
            </div>

            {/* Right: Device Toggle, Score, Certificate & Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Quick Device Switcher Button */}
              <button
                type="button"
                onClick={toggleDeviceMode}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[10.5px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}
                title={deviceMode === 'mobile' ? 'โหมดมือถือ (คลิกเพื่อเปลี่ยนเป็นโหมดคอม)' : 'โหมดคอมพิวเตอร์ (คลิกเพื่อเปลี่ยนเป็นโหมดมือถือ)'}
              >
                {deviceMode === 'mobile' ? (
                  <>
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    <span className="hidden xs:inline">มือถือ</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 text-indigo-400" />
                    <span className="hidden xs:inline">คอม</span>
                  </>
                )}
              </button>

              {studentName && (
                <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-slate-800/80 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-700">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[80px]">{studentName}</span>
                </div>
              )}

              {/* Past Certificates Archive Button */}
              <button
                type="button"
                onClick={() => setShowPastCertificates(true)}
                title="ค้นหารายชื่อผู้เข้าเล่นและเกียรติบัตรทั้งหมดในระบบ"
                className="px-1.5 sm:px-2 py-0.5 bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700/80 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Users className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">รายชื่อ & เกียรติบัตร</span>
              </button>


              {/* Attempt Live Points */}
              <div className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-indigo-950/80 border border-indigo-800/40 rounded-lg text-[10.5px] sm:text-[11px] font-bold text-indigo-300">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400" />
                <span className="font-mono text-indigo-200">+{attemptScore}</span>
              </div>

              {/* Total Score */}
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-950 border border-slate-800/50 rounded-lg">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="font-mono font-black text-amber-300 text-xs">
                  {totalScore.toLocaleString()}
                </span>
              </div>

              {combo > 1 && (
                <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-950/80 rounded-lg text-rose-300 font-bold text-[10.5px]">
                  <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>x{combo}</span>
                </div>
              )}

              {/* Certificate Button (Unlocked ONLY after completing all 80 levels) */}
              {isAllLevelsCompleted ? (
                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  id="view-certificate-game-btn"
                  title="ดูใบเกียรติบัตร (พิชิตครบ 80 ด่านแล้ว)"
                  className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-[10.5px] sm:text-[11px] font-black transition flex items-center gap-1 cursor-pointer shadow-md shadow-amber-400/20 animate-pulse"
                >
                  <Award className="w-3 h-3 text-slate-950" />
                  <span className="hidden sm:inline">🏆 เกียรติบัตร</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert(`คุณต้องเล่นพิชิตให้ครบทั้ง 80 ด่านก่อนจึงจะสามารถรับใบเกียรติบัตรได้ครับ\n(ขณะนี้ผ่านแล้ว ${completedLevelsCount}/${GAME_LEVELS.length} ด่าน)`);
                  }}
                  id="view-certificate-game-btn"
                  title={`ต้องเล่นครบ 80 ด่านเพื่อปลดล็อกเกียรติบัตร (ขณะนี้ผ่าน ${completedLevelsCount}/${GAME_LEVELS.length} ด่าน)`}
                  className="px-1.5 sm:px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 border border-slate-700/60 rounded-lg text-[10.5px] sm:text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-400/80" />
                  <span className="hidden sm:inline">เกียรติบัตร ({completedLevelsCount}/{GAME_LEVELS.length})</span>
                </button>
              )}

              {/* Exit / Next Player Button */}
              <button
                type="button"
                onClick={() => setShowExitConfirm(true)}
                title="จบกิจกรรมสำหรับคนต่อไป"
                className="p-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40 rounded-md text-rose-300 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
              >
                {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Quick Mobile View Switcher (Visible on mobile mode or small screens) */}
          {(deviceMode === 'mobile' || typeof window !== 'undefined') && (
            <div className="lg:hidden flex items-center justify-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60 shrink-0">
              <button
                type="button"
                onClick={() => setMobileTab('split')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  mobileTab === 'split'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>คู่กัน (กระดาน + โค้ด)</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('board')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  mobileTab === 'board'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>เฉพาะกระดาน</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('code')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                  mobileTab === 'code'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>เฉพาะโค้ด/ผังงาน</span>
              </button>
            </div>
          )}

          {/* Main Gameplay Screen Split */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-2.5 h-full overflow-hidden min-h-0">
            {/* Left Column: Dot Grid Game Board */}
            <div
              className={`h-full flex flex-col overflow-hidden min-h-0 ${
                mobileTab === 'code' ? 'hidden lg:flex lg:col-span-5' : mobileTab === 'board' ? 'flex lg:col-span-5' : 'lg:col-span-5 flex'
              }`}
            >
              <GameBoard
                level={currentLevel}
                currentPos={currentPos}
                visitedPositions={visitedPositions}
                currentStepIndex={currentStepIndex}
                isLevelComplete={isLevelComplete}
                onMoveDot={handleMove}
                floatingText={floatingText}
                bumpKey={bumpKey}
              />
            </div>

            {/* Right Column: Code Display + Flowchart Side-by-Side */}
            <div
              className={`h-full flex flex-col overflow-hidden min-h-0 ${
                mobileTab === 'board' ? 'hidden lg:flex lg:col-span-7' : mobileTab === 'code' ? 'flex lg:col-span-7' : 'lg:col-span-7 flex'
              }`}
            >
              <CodeDisplay
                level={currentLevel}
                currentStepIndex={currentStepIndex}
                onResetStep={handleResetStep}
                showHint={showHint}
                onToggleHint={() => setShowHint((p) => !p)}
                onMove={handleMove}
                isLevelComplete={isLevelComplete}
                deviceMode={deviceMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. CERTIFICATE MODAL FOR CURRENT PLAYER (Pops up on finishing 80 levels or via button) */}
      {showCertificate && (
        <CertificateModal
          studentName={studentName}
          totalScore={totalScore}
          maxCombo={highestCombo || combo}
          certificateId={currentCertificateId}
          completedLevelsCount={GAME_LEVELS.length}
          onClose={() => setShowCertificate(false)}
          onResetForNextStudent={handleResetForNextStudent}
        />
      )}

      {/* 5. PAST CERTIFICATES SEARCH & DOWNLOAD MODAL (FIREBASE ARCHIVE) */}
      <PastCertificatesModal
        isOpen={showPastCertificates}
        onClose={() => setShowPastCertificates(false)}
        onSelectCertificate={(cert) => {
          setSelectedPastCert(cert);
        }}
        onResumePlayer={handleResumePlayer}
      />

      {/* 6. MODAL TO VIEW/PRINT SELECTED ARCHIVED CERTIFICATE */}
      {selectedPastCert && (
        <CertificateModal
          studentName={selectedPastCert.studentName}
          totalScore={selectedPastCert.totalScore}
          maxCombo={selectedPastCert.maxCombo}
          certificateId={selectedPastCert.certificateId}
          issuedDateStr={selectedPastCert.issuedDate}
          completedLevelsCount={selectedPastCert.completedLevelsCount || GAME_LEVELS.length}
          onClose={() => setSelectedPastCert(null)}
        />
      )}

      {/* 7. CONFIRMATION MODAL: Exit & Reset for Next Student */}
      {showExitConfirm && (
        <motion.div
          key="exit-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            key="exit-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-1.5">
              ต้องการรีเซ็ตเพื่อเริ่มเล่นสำหรับคนต่อไปหรือไม่?
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              ระบบจะล้างคะแนน ด่านที่ปลดล็อค และข้อมูลชื่อของผู้เล่นปัจจุบัน เพื่อให้นักเรียนคนใหม่สามารถเริ่มเล่นตั้งแต่ด่านแรกได้อย่างสมบูรณ์
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleResetForNextStudent}
                id="confirm-reset-next-student-btn"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ยืนยันรีเซ็ต
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
