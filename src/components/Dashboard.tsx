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
    { id: 'educacion', title: 'Escuela & Estudio', icon: '📚', bg: 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-950 border-indigo-200/90', count: challenges.filter(c => c.category === 'educacion').length },
    { id: 'salud', title: 'Salud & Deporte', icon: '⚡', bg: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 border-emerald-200/90', count: challenges.filter(c => c.category === 'salud').length },
    { id: 'bienestar', title: 'Bienestar & Mente', icon: '🌱', bg: 'bg-sky-50 hover:bg-sky-100/80 text-sky-950 border-sky-200/90', count: challenges.filter(c => c.category === 'bienestar').length },
    { id: 'entretenimiento', title: 'Juegos & Arte', icon: '🎮', bg: 'bg-pink-50 hover:bg-pink-100/80 text-pink-950 border-pink-200/90', count: challenges.filter(c => c.category === 'entretenimiento').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner for Students - Soft Pastel Green Palette */}
      <section className="bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm relative overflow-hidden border border-emerald-200/90">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-black">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-bounce" />
              <span>¡Racha Ininterrumpida de {user.streakDays} Días! 🔥</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2 flex-wrap">
              <span>¡Hola, {user.name}! 👋</span>
            </h1>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Puntaje de Rango: <span className="font-bold text-indigo-900">{user.title}</span> (Nivel {user.level}). Hoy has completado <span className="font-extrabold text-emerald-800">{completedDailyCount} misiones</span>.
            </p>

            {/* XP Level Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-slate-700 mb-1 font-extrabold">
                <span>Nivel {user.level}</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="w-full h-3.5 bg-white/80 rounded-full overflow-hidden border border-purple-200 p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
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
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-black text-xs shadow-xs transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer border border-amber-400/80"
              >
                <Video className="w-4 h-4 text-amber-950 fill-amber-950" />
                <span>📹 Ver Video Explicativo de la Plataforma</span>
              </button>
            )}

            <button
              onClick={onOpenFocusTimer}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-700"
            >
              <Timer className="w-4 h-4 text-amber-300" />
              <span>🍅 Iniciar Pomodoro Estudiantil</span>
            </button>

            <div className="grid grid-cols-2 gap-2 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-purple-200/80 text-center shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Monedas</span>
                <span className="text-base font-extrabold text-amber-700 flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {user.coins} 🪙
                </span>
              </div>
              <div className="border-l border-purple-200 pl-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Retos</span>
                <span className="text-base font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 text-emerald-600" />
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
                <h3 className="text-xs sm:text-sm font-black">{cat.title}</h3>
                <p className="text-[11px] font-semibold opacity-85">{cat.count} desafíos activos</p>
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
        
        {/* Left Column: Desafíos del Día - Soft Pastel Indigo Block */}
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-3xl border border-indigo-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
                <Target className="w-3.5 h-3.5 text-indigo-700" />
                <span>Misiones de Hoy</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Desafíos Diarios Estudiantiles</h2>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-indigo-800">{progressPercent}% Completado</span>
              <div className="w-28 h-2.5 bg-indigo-100/80 rounded-full overflow-hidden mt-1 p-0.5 border border-indigo-200">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* List of daily challenges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-indigo-100">
              <span>⚡ Máximo 6 desafíos diarios activos a la vez</span>
              <span>Al completarse, se eliminan de tu lista activa</span>
            </div>

            {activeDailyChallenges.length === 0 ? (
              <div className="text-center py-8 bg-emerald-50/80 rounded-2xl border-2 border-dashed border-emerald-300 p-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-xs">
                  🎉
                </div>
                <h3 className="text-sm font-black text-emerald-950">¡Completaste todas tus misiones diarias!</h3>
                <p className="text-xs font-medium text-emerald-800 max-w-sm mx-auto">
                  Tus desafíos completados han sido procesados y eliminados de la lista activa por hoy. ¡Disfruta tus recompensas de XP y Monedas!
                </p>
              </div>
            ) : (
              activeDailyChallenges.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-2xs ${
                    c.category === 'educacion' ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950' :
                    c.category === 'salud' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' :
                    c.category === 'bienestar' ? 'bg-sky-50/90 border-sky-200 text-sky-950' : 'bg-pink-50/90 border-pink-200 text-pink-950'
                  }`}
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
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          c.category === 'educacion' ? 'bg-indigo-200/80 text-indigo-900' :
                          c.category === 'salud' ? 'bg-emerald-200/80 text-emerald-950' :
                          c.category === 'bienestar' ? 'bg-sky-200/80 text-sky-950' : 'bg-pink-200/80 text-pink-950'
                        }`}>
                          {c.category}
                        </span>
                        <span className="text-[11px] font-extrabold text-indigo-700">+{c.xpReward} XP</span>
                        <span className="text-[11px] font-extrabold text-amber-700">+{c.coinReward} 🪙</span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-700 font-medium">{c.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleChallenge(c.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 cursor-pointer transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs flex items-center gap-1"
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
              className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
            >
              <span>Ver todos los desafíos estudiantiles semanales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Quick Apps (Arcade, Trivia, Agenda, Notas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Game Banner - Soft Pastel Purple/Pink Card */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 rounded-3xl p-5 text-slate-900 shadow-sm border border-purple-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 border border-amber-400 uppercase">
                <Sparkles className="w-3 h-3 text-amber-950" />
                Minijuegos 2D & Trivia
              </span>
              <span className="text-xs text-purple-900 font-extrabold">Gana Monedas & XP</span>
            </div>

            <h3 className="text-lg font-black text-slate-900">Laberinto 2D & Trivia 🗝️🧠</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Pon a prueba tu agilidad mental y velocidad en el laberinto o responde la trivia escolar.
            </p>

            <button
              onClick={() => onNavigate('game')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Jugar Minijuegos</span>
            </button>
          </div>

          {/* Today's Calendar Agenda - Soft Pastel Sky Card */}
          <div className="bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/60 rounded-3xl border border-sky-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
              <h3 className="text-xs font-black text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-sky-600" />
                Agenda Escolar de Hoy
              </h3>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[11px] font-black text-sky-700 hover:underline"
              >
                Calendario
              </button>
            </div>

            <div className="space-y-2">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-2.5 bg-white/90 rounded-2xl border border-sky-150 flex items-center justify-between text-xs shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block truncate max-w-[180px]">{ev.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${ev.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                    {ev.completed ? 'Listo' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notes Preview - Soft Pastel Emerald Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-mint-50/60 rounded-3xl border border-emerald-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Notas de Estudio
              </h3>
              <button
                onClick={() => onNavigate('notes')}
                className="text-[11px] font-black text-emerald-700 hover:underline"
              >
                Mis Notas
              </button>
            </div>

            <div className="space-y-2">
              {notes.slice(0, 2).map((n) => (
                <div key={n.id} className="p-2.5 bg-white/90 rounded-2xl border border-emerald-150 text-xs shadow-2xs">
                  <h4 className="font-bold text-slate-900 truncate">{n.title}</h4>
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

