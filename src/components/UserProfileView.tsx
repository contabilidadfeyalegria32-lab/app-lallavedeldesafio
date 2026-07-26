import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { User, Award, Flame, Coins, Trophy, Clock, Sparkles, CheckCircle2, Shield, Palette, Star, Crown } from 'lucide-react';

interface UserProfileViewProps {
  user: UserProfile;
  onUpdateTitle: (title: string) => void;
  onSelectTheme: (theme: UserProfile['selectedTheme']) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateTitle,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-6">
          
          {/* Avatar & Level Ring */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-indigo-600 shadow-md">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover rounded-[22px]"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 bg-slate-900 text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-xs">
              Nv. {user.level}
            </span>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
              <span className="text-xs font-mono text-slate-400">{user.username}</span>
            </div>

            {/* Current Active Title */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{user.title}</span>
              </span>

              {/* Title Selector */}
              <select
                value={user.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 cursor-pointer"
              >
                {user.unlockedTitles.map((t) => (
                  <option key={t} value={t}>
                    👑 {t}
                  </option>
                ))}
              </select>
            </div>

            {/* XP Progress */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                <span>Progreso de Nivel</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100))}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1 fill-amber-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Racha Actual</span>
            <span className="text-xl font-black text-slate-900">{user.streakDays} Días</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <Trophy className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desafíos Completados</span>
            <span className="text-xl font-black text-slate-900">{user.completedChallengesCount}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <Coins className="w-5 h-5 text-amber-400 mx-auto mb-1 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monedas Acumuladas</span>
            <span className="text-xl font-black text-slate-900">{user.coins} 🪙</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Horas de Actividad</span>
            <span className="text-xl font-black text-slate-900">{user.activeHours} hrs</span>
          </div>
        </div>

      </div>

      {/* Badges Gallery Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Galería de Logros</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Insignias Especiales</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Completa retos en cada categoría para desbloquear insignias y bonificaciones de XP.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/60 border-amber-200/90 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                {b.icon}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{b.name}</h4>
                  {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{b.description}</p>
                <span className="text-[10px] font-bold text-indigo-600 block mt-1">
                  +{b.xpBonus} XP Bonus
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Theme Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Personalización de Tema de Perfil</h3>
        </div>

        <p className="text-xs text-slate-500">
          Elige la paleta visual que prefieres para tu panel y acentos de color.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {[
            { id: 'emerald', name: 'Esmeralda Vital', bg: 'bg-emerald-600' },
            { id: 'indigo', name: 'Índigo Crecimiento', bg: 'bg-indigo-600' },
            { id: 'amber', name: 'Ámbar Energía', bg: 'bg-amber-500' },
            { id: 'rose', name: 'Rosa Pasión', bg: 'bg-rose-600' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                user.selectedTheme === theme.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${theme.bg}`} />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
