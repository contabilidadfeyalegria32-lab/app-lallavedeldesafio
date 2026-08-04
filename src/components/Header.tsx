import React from 'react';
import { Key, LayoutDashboard, Target, Gamepad2, Calendar, FileText, User, Users, QrCode, Flame, Award, Timer, LogOut, Video, Headphones, Smartphone } from 'lucide-react';
import { UserProfile } from '../types';

export type NavigationTab = 'dashboard' | 'challenges' | 'game' | 'calendar' | 'notes' | 'profile' | 'community';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfile;
  onOpenQrModal: () => void;
  onOpenFocusTimer: () => void;
  onOpenMusicPlayer?: () => void;
  onOpenVideoTour?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenQrModal,
  onOpenFocusTimer,
  onOpenMusicPlayer,
  onOpenVideoTour,
  onLogout,
}) => {
  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    activeStyle: string;
    iconActiveStyle: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: LayoutDashboard,
      activeStyle: 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs font-black',
      iconActiveStyle: 'text-emerald-700',
    },
    {
      id: 'challenges',
      label: 'Desafíos',
      icon: Target,
      activeStyle: 'bg-indigo-100 text-indigo-950 border border-indigo-300 shadow-2xs font-black',
      iconActiveStyle: 'text-indigo-700',
    },
    {
      id: 'game',
      label: 'Arcade & Trivia',
      icon: Gamepad2,
      activeStyle: 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs font-black',
      iconActiveStyle: 'text-amber-800',
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: Calendar,
      activeStyle: 'bg-sky-100 text-sky-950 border border-sky-300 shadow-2xs font-black',
      iconActiveStyle: 'text-sky-700',
    },
    {
      id: 'notes',
      label: 'Notas',
      icon: FileText,
      activeStyle: 'bg-rose-100 text-rose-950 border border-rose-300 shadow-2xs font-black',
      iconActiveStyle: 'text-rose-700',
    },
    {
      id: 'profile',
      label: 'Perfil & Logros',
      icon: User,
      activeStyle: 'bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs font-black',
      iconActiveStyle: 'text-purple-700',
    },
    {
      id: 'community',
      label: 'Muro Estudiantil',
      icon: Users,
      activeStyle: 'bg-teal-100 text-teal-950 border border-teal-300 shadow-2xs font-black',
      iconActiveStyle: 'text-teal-700',
    },
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
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? item.activeStyle
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? item.iconActiveStyle : 'text-slate-400'}`} />
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

          {/* Spotify & Study Music Player Button */}
          {onOpenMusicPlayer && (
            <button
              onClick={onOpenMusicPlayer}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
              title="Escuchar música de Spotify o playlists relajantes mientras estudias"
            >
              <Headphones className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Música / Spotify</span>
            </button>
          )}

          {/* Video Explicativo Tour Button */}
          {onOpenVideoTour && (
            <button
              onClick={onOpenVideoTour}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-transform hover:scale-105 cursor-pointer shadow-xs border border-amber-300"
              title="Ver Video Explicativo e Interactivo de la plataforma"
            >
              <Video className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span className="hidden sm:inline">Video Explicativo</span>
            </button>
          )}

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
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xs transition-all cursor-pointer"
            title="Ver / Escanear Credencial Digital QR de estudiante"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Pase VIP</span>
          </button>

          {/* Logged in user profile avatar & Logout */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              title="Ir a mi perfil"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover border border-indigo-400 group-hover:scale-105 transition-transform"
              />
              <span className="hidden xl:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {onLogout && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-extrabold transition-colors cursor-pointer"
                  title="Cambiar de cuenta o seleccionar otra cuenta guardada en el dispositivo"
                >
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden lg:inline text-[11px]">Cuentas</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Cerrar sesión de esta cuenta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-1.5 overflow-x-auto no-scrollbar gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] transition-all cursor-pointer shrink-0 ${
                isActive
                  ? `${item.activeStyle}`
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? item.iconActiveStyle : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </header>
  );
};

