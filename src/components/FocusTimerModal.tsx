import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, X, BookOpen, Flame, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioEffect, toggleFocusAmbientSound } from '../utils/audio';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (xp: number, coins: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onEarnRewards,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [subjectTag, setSubjectTag] = useState('📚 Tareas & Escuela');
  const [completedSessions, setCompletedSessions] = useState(0);

  const subjects = [
    '📚 Tareas & Escuela',
    '📐 Matemáticas & Ciencias',
    '📖 Lengua & Lectura',
    '🇬🇧 Idiomas / Inglés',
    '🎨 Proyecto Creativo',
    '💻 Código & Lógica',
  ];

  useEffect(() => {
    setSecondsLeft(selectedMinutes * 60);
    setIsActive(false);
  }, [selectedMinutes]);

  useEffect(() => {
    let interval: any = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      toggleFocusAmbientSound(false);
      setAmbientAudio(false);

      playAudioEffect('win');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#059669', '#f59e0b', '#ec4899']
      });

      const earnedXp = selectedMinutes * 5;
      const earnedCoins = selectedMinutes * 2;
      onEarnRewards(earnedXp, earnedCoins);
      setCompletedSessions((prev) => prev + 1);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, selectedMinutes, onEarnRewards]);

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    playAudioEffect('click');
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(selectedMinutes * 60);
    toggleFocusAmbientSound(false);
    setAmbientAudio(false);
    playAudioEffect('click');
  };

  const toggleAmbient = () => {
    const next = !ambientAudio;
    setAmbientAudio(next);
    toggleFocusAmbientSound(next);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = Math.round(((selectedMinutes * 60 - secondsLeft) / (selectedMinutes * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-500/30 relative space-y-6">
        
        {/* Close button */}
        <button
          onClick={() => {
            toggleFocusAmbientSound(false);
            setAmbientAudio(false);
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Modo Enfoque Estudiantil ⚡</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">Reloj Pomodoro & Lofi</h3>
          <p className="text-xs text-slate-300">
            Cero distracciones. Gana <span className="text-amber-300 font-bold">+{selectedMinutes * 5} XP</span> al completar la sesión.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { mins: 25, label: '25 min (Estudio)' },
            { mins: 15, label: '15 min (Repaso)' },
            { mins: 5, label: '5 min (Descanso)' },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => setSelectedMinutes(preset.mins)}
              disabled={isActive}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedMinutes === preset.mins
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Timer Circular Display */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-950/80 border-4 border-indigo-500/40 flex flex-col items-center justify-center relative shadow-inner shadow-indigo-900/50">
            {/* Progress Ring Gradient */}
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000 opacity-80"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                opacity: progressPercent > 0 ? 1 : 0.2
              }}
            />

            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>

            <span className="text-[11px] text-amber-300 font-bold mt-2 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/20">
              {isActive ? '⚡ Estudiando...' : 'Pausado'}
            </span>
          </div>
        </div>

        {/* Subject Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">Materia o Tarea Actual:</label>
          <select
            value={subjectTag}
            onChange={(e) => setSubjectTag(e.target.value)}
            disabled={isActive}
            className="w-full bg-slate-800/90 text-white text-xs font-bold border border-slate-700 rounded-xl p-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Ambient Lofi Music Sound Toggle */}
        <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs">
            <Music className="w-4 h-4 text-indigo-400 animate-bounce" />
            <div>
              <span className="font-bold text-slate-200 block">Fondo Lofi Relajante</span>
              <span className="text-[10px] text-slate-400">Sonido ambiental de estudio</span>
            </div>
          </div>

          <button
            onClick={toggleAmbient}
            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              ambientAudio
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
            }`}
          >
            {ambientAudio ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar Sesión</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>¡Iniciar Enfoque!</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 cursor-pointer"
            title="Reiniciar Temporizador"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {completedSessions > 0 && (
          <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/60">
            🎉 ¡Completaste {completedSessions} sesión(es) de estudio hoy!
          </div>
        )}

      </div>
    </div>
  );
};
