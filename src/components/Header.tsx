import React from 'react';
import { Key, LayoutDashboard, Target, Gamepad2, Calendar, FileText, User, Users, QrCode, Flame, Award, Timer, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

export type NavigationTab = 'dashboard' | 'challenges' | 'game' | 'calendar' | 'notes' | 'profile' | 'community';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfile;
  onOpenQrModal: () => void;
  onOpenFocusTimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenQrModal,
  onOpenFocusTimer,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'challenges', label: 'Desafíos', icon: Target },
    { id: 'game', label: 'Arcade & Trivia', icon: Gamepad2 },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'notes', label: 'Notas', icon: FileText },
    { id: 'profile', label: 'Perfil & Logros', icon: User },
    { id: 'community', label: 'Muro Estudiantil', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Key className="w-5 h-5 text-amber-200 transform -rotate-45" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>La Llave del Desafío</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
                Nv. {user.level}
              </span>
            </h1>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Plataforma Estudiantil & Crecimiento 🚀</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Focus Timer Button */}
          <button
            onClick={onOpenFocusTimer}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Abrir Temporizador Pomodoro de Enfoque sin distracciones"
          >
            <Timer className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="hidden sm:inline">Modo Enfoque</span>
          </button>

          {/* Streak Badge */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black shadow-2xs cursor-pointer hover:bg-amber-100 transition-colors"
            title="Días consecutivos de aprendizaje"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{user.streakDays}d</span>
          </div>

          {/* XP Badge */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Puntos de Experiencia Totales"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.xp} XP</span>
          </div>

          {/* QR Code Action Button */}
          <button
            onClick={onOpenQrModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xs transition-all cursor-pointer"
            title="Ver / Escanear Credencial Digital QR de estudiante"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Pase VIP</span>
          </button>
        </div>

      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                isActive ? 'text-indigo-700 bg-indigo-50 border border-indigo-100' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </header>
  );
};

