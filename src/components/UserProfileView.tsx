import React, { useState, useRef } from 'react';
import { UserProfile, Badge } from '../types';
import { AVATAR_PRESETS, DEFAULT_AVATAR_URL } from '../data/initialData';
import { User, Award, Flame, Coins, Trophy, Clock, Sparkles, CheckCircle2, Shield, Palette, Star, Crown, Pencil, Camera, Upload, Image as ImageIcon, Check, X, UserCheck } from 'lucide-react';
import { MilestonesSection } from './MilestonesSection';

interface UserProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onUpdateTitle: (title: string) => void;
  onSelectTheme: (theme: UserProfile['selectedTheme']) => void;
  onClaimMilestone?: (milestoneXp: number) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateProfile,
  onUpdateTitle,
  onSelectTheme,
  onClaimMilestone,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editAvatarUrl, setEditAvatarUrl] = useState(user.avatarUrl);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditUsername(user.username);
    setEditAvatarUrl(user.avatarUrl);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    let formattedUsername = editUsername.trim();
    if (formattedUsername && !formattedUsername.startsWith('@')) {
      formattedUsername = `@${formattedUsername}`;
    }

    onUpdateProfile({
      name: editName.trim(),
      username: formattedUsername || user.username,
      avatarUrl: editAvatarUrl || user.avatarUrl,
    });

    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen seleccionada debe ser menor a 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">¡Perfil actualizado con éxito!</p>
              <p className="text-[11px] text-emerald-700">Tu nombre, usuario y foto de perfil han sido guardados.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-700 hover:text-emerald-950 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
            {/* Avatar & Level Ring */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-indigo-600 shadow-md">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-[22px]"
                />
              </div>
              <button
                onClick={handleOpenEdit}
                className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                title="Cambiar foto de perfil"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <span className="absolute -top-2 -left-2 bg-slate-900 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-white shadow-xs">
                Nv. {user.level}
              </span>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                    <span>{user.name}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      Activo
                    </span>
                  </h2>
                  <span className="text-xs font-mono text-slate-500 block mt-0.5">{user.username}</span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer self-center sm:self-start"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar Mi Perfil</span>
                </button>
              </div>

              {/* Current Active Title */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user.title}</span>
                </span>

                {/* Title Selector */}
                <select
                  value={user.title}
                  onChange={(e) => onUpdateTitle(e.target.value)}
                  className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
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

        </div>

        {/* Edit Profile Form Drawer/Card */}
        {isEditing && (
          <div className="bg-indigo-50/60 rounded-2xl border-2 border-indigo-200 p-5 sm:p-6 space-y-6 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Modificar Mi Información de Usuario</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 block">
                    Nombre o Apodo Estudiantil <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ej. Alex Rivera"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 block">
                    Nombre de Usuario (@usuario)
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="Ej. @alex_estudiante"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

              </div>

              {/* Photo Section */}
              <div className="space-y-4 pt-2">
                <label className="text-xs font-extrabold text-slate-800 block">
                  Foto de Perfil / Avatar
                </label>

                {/* Upload or Custom URL Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-indigo-100">
                  
                  {/* Avatar Preview */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500 shrink-0 shadow-xs">
                    <img src={editAvatarUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      {/* File Upload Trigger */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Foto desde tu Equipo</span>
                      </button>

                      {/* Reset to Neutral Avatar */}
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl(DEFAULT_AVATAR_URL)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        title="Restablecer a la silueta azul predeterminada"
                      >
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Silueta Neutra</span>
                      </button>

                      <span className="text-[11px] text-slate-400">o pega un enlace web abajo:</span>
                    </div>

                    <div className="relative">
                      <input
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="https://ejemplo.com/mi-foto.jpg"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Avatar Presets Selection */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    O elige uno de nuestros Avatares Estudiantiles Ilustrados:
                  </span>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = editAvatarUrl === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditAvatarUrl(preset.url)}
                          className={`relative group rounded-2xl overflow-hidden border-2 p-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-100/60 ring-2 ring-indigo-400 scale-105'
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-12 object-cover rounded-xl"
                          />
                          <span className="text-[9px] font-bold text-slate-700 block text-center truncate mt-1">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 bg-indigo-600 text-white p-0.5 rounded-full shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Mi Perfil</span>
                </button>
              </div>

            </form>
          </div>
        )}

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

      {/* 1,000 XP Milestones & Chests */}
      {onClaimMilestone && (
        <MilestonesSection
          user={user}
          onClaimMilestone={onClaimMilestone}
        />
      )}

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

