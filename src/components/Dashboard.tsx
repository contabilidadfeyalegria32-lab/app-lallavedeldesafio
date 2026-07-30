import React from 'react';
import { UserProfile, Challenge, CalendarEvent, NoteItem } from '../types';
import { Sparkles, Flame, Award, Coins, CheckCircle2, Circle, Target, Gamepad2, Calendar as CalendarIcon, FileText, ArrowRight, Zap, Trophy, ShieldCheck, HeartPulse, BookOpen, Smile, Plus, Timer, Brain, Video } from 'lucide-react';
import { NavigationTab } from './Header';
import { MilestonesSection } from './MilestonesSection';

interface DashboardProps {
  user: UserProfile;
  challenges: Challenge[];
  events: CalendarEvent[];
  notes: NoteItem[];
  onToggleChallenge: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenFocusTimer: () => void;
  onOpenVideoTour?: () => void;
  onClaimMilestone?: (milestoneXp: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  challenges,
  events,
  notes,
  onToggleChallenge,
  onNavigate,
  onOpenFocusTimer,
  onOpenVideoTour,
  onClaimMilestone,
}) => {
  // Daily challenges logic: Max 6 active daily challenges per day, completed ones are removed from active view
  const allDaily = challenges.filter((c) => c.frequency === 'daily');
  const activeDailyChallenges = allDaily.filter((c) => !c.completed).slice(0, 6);
  const completedDailyCount = allDaily.filter((c) => c.completed).length;
  const totalDailySlotCount = Math.max(6, activeDailyChallenges.length + completedDailyCount);
  const progressPercent = totalDailySlotCount > 0 ? Math.round((completedDailyCount / totalDailySlotCount) * 100) : 0;

  const categories = [
    { id: 'educacion', title: 'Escuela & Estudio', icon: '📚', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', count: challenges.filter(c => c.category === 'educacion').length },
    { id: 'salud', title: 'Salud & Deporte', icon: '⚡', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', count: challenges.filter(c => c.category === 'salud').length },
    { id: 'bienestar', title: 'Bienestar & Mente', icon: '🌱', bg: 'bg-blue-50 text-blue-800 border-blue-200', count: challenges.filter(c => c.category === 'bienestar').length },
    { id: 'entretenimiento', title: 'Juegos & Arte', icon: '🎮', bg: 'bg-amber-50 text-amber-800 border-amber-200', count: challenges.filter(c => c.category === 'entretenimiento').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner for Students */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-300 animate-bounce" />
              <span>¡Racha Ininterrumpida de {user.streakDays} Días! 🔥</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>¡Hola, {user.name}! 👋</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Puntaje de Rango: <span className="font-bold text-amber-300">{user.title}</span> (Nivel {user.level}). Hoy has completado <span className="font-bold text-emerald-400">{completedDailyCount} misiones</span>.
            </p>

            {/* XP Level Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-bold">
                <span>Nivel {user.level}</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Focus Mode & Coins Quick Banner */}
          <div className="flex flex-col gap-2.5 shrink-0">
            {onOpenVideoTour && (
              <button
                onClick={onOpenVideoTour}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
              >
                <Video className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>📹 Ver Video Explicativo de la Plataforma</span>
              </button>
            )}

            <button
              onClick={onOpenFocusTimer}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <Timer className="w-4 h-4 text-amber-300" />
              <span>🍅 Iniciar Pomodoro Estudiantil</span>
            </button>

            <div className="grid grid-cols-2 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Monedas</span>
                <span className="text-base font-extrabold text-amber-300 flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {user.coins} 🪙
                </span>
              </div>
              <div className="border-l border-white/10 pl-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Retos</span>
                <span className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  {user.completedChallengesCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate('challenges')}
            className={`p-4 rounded-2xl border ${cat.bg} shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold">{cat.title}</h3>
                <p className="text-[11px] opacity-80">{cat.count} desafíos activos</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>

      {/* 1,000 XP Milestone Rewards Chests */}
      {onClaimMilestone && (
        <MilestonesSection
          user={user}
          onClaimMilestone={onClaimMilestone}
        />
      )}

      {/* Daily Challenges Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Desafíos del Día */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>Misiones de Hoy</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Desafíos Diarios Estudiantiles</h2>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-indigo-700">{progressPercent}% Completado</span>
              <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1 p-0.5 border border-slate-200">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* List of daily challenges (Max 6 active daily, auto-eliminated upon completion) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <span>⚡ Máximo 6 desafíos diarios activos a la vez</span>
              <span>Al completarse, se eliminan de tu lista activa</span>
            </div>

            {activeDailyChallenges.length === 0 ? (
              <div className="text-center py-8 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200 p-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🎉
                </div>
                <h3 className="text-sm font-extrabold text-emerald-950">¡Completaste todas tus misiones diarias!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Tus desafíos completados han sido procesados y eliminados de la lista activa por hoy. ¡Disfruta tus recompensas de XP y Monedas!
                </p>
              </div>
            ) : (
              activeDailyChallenges.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border bg-white border-slate-200/80 hover:border-indigo-300 shadow-2xs transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => onToggleChallenge(c.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title="Marcar como completado"
                    >
                      <Circle className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          c.category === 'educacion' ? 'bg-indigo-100 text-indigo-800' :
                          c.category === 'salud' ? 'bg-emerald-100 text-emerald-800' :
                          c.category === 'bienestar' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.category}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-600">+{c.xpReward} XP</span>
                        <span className="text-[11px] font-bold text-amber-600">+{c.coinReward} 🪙</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-600">{c.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleChallenge(c.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs flex items-center gap-1"
                  >
                    <span>Completar</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('challenges')}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              <span>Ver todos los desafíos estudiantiles semanales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Quick Apps (Arcade, Trivia, Agenda, Notas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Game Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-5 text-white shadow-md border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                <Sparkles className="w-3 h-3" />
                Minijuegos 2D & Trivia
              </span>
              <span className="text-xs text-indigo-300 font-mono">Gana Monedas & XP</span>
            </div>

            <h3 className="text-lg font-extrabold">Laberinto 2D & Trivia 🗝️🧠</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pon a prueba tu agilidad mental y velocidad en el laberinto o responde la trivia escolar.
            </p>

            <button
              onClick={() => onNavigate('game')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black shadow-md transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Jugar Minijuegos</span>
            </button>
          </div>

          {/* Today's Calendar Agenda */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                Agenda Escolar de Hoy
              </h3>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Calendario
              </button>
            </div>

            <div className="space-y-2">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block truncate max-w-[180px]">{ev.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {ev.completed ? 'Listo' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notes Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Notas de Estudio
              </h3>
              <button
                onClick={() => onNavigate('notes')}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Mis Notas
              </button>
            </div>

            <div className="space-y-2">
              {notes.slice(0, 2).map((n) => (
                <div key={n.id} className="p-2.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs">
                  <h4 className="font-bold text-slate-800 truncate">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

