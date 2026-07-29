import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS, INITIAL_USER_PROFILE } from '../data/initialData';
import { 
  Key, Lock, User, AtSign, Eye, EyeOff, Upload, Check, 
  Sparkles, ShieldCheck, ArrowRight, Camera, UserPlus, LogIn, AlertCircle
} from 'lucide-react';

export interface AuthAccount {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  avatarUrl: string;
  profileData: UserProfile;
}

interface AuthModalProps {
  onLoginSuccess: (userProfile: UserProfile, password?: string) => void;
  savedAccounts: AuthAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLoginSuccess,
  savedAccounts,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(
    savedAccounts.length > 0 ? 'login' : 'register'
  );
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatarUrl, setRegAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [regError, setRegError] = useState('');

  // Shared UX states
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRegAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Por favor ingresa tu nombre completo o apodo.');
      return;
    }

    let cleanUsername = regUsername.trim();
    if (!cleanUsername) {
      setRegError('Por favor crea un nombre de usuario.');
      return;
    }
    if (!cleanUsername.startsWith('@')) {
      cleanUsername = `@${cleanUsername}`;
    }

    if (!regPassword || regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    // Check if username is taken
    const existing = savedAccounts.find(
      (a) => a.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (existing) {
      setRegError(`El nombre de usuario ${cleanUsername} ya está registrado. Intenta con otro o Inicia Sesión.`);
      return;
    }

    // Create fresh user profile
    const newProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: regName.trim(),
      username: cleanUsername,
      avatarUrl: regAvatarUrl || AVATAR_PRESETS[0].url,
      level: 1,
      xp: 100,
      xpToNextLevel: 1000,
      coins: 100,
      streakDays: 1,
      completedChallengesCount: 0,
      title: 'Novato Estudiantil 🌱',
    };

    // Save into list of accounts
    const newAccount: AuthAccount = {
      id: Date.now().toString(),
      name: regName.trim(),
      username: cleanUsername,
      passwordHash: regPassword,
      avatarUrl: regAvatarUrl,
      profileData: newProfile,
    };

    const updatedAccounts = [...savedAccounts, newAccount];
    try {
      localStorage.setItem('app_registered_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('app_active_account_id', newAccount.id);
    } catch (err) {
      console.error('Error saving account locally', err);
    }

    onLoginSuccess(newProfile, regPassword);
  };

  // Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    let cleanUser = loginUsername.trim();
    if (!cleanUser.startsWith('@') && !cleanUser.includes(' ')) {
      cleanUser = `@${cleanUser}`;
    }

    // Find account
    const matched = savedAccounts.find(
      (a) =>
        a.username.toLowerCase() === cleanUser.toLowerCase() ||
        a.name.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (!matched) {
      setLoginError('No encontramos ningún usuario registrado con ese nombre. Crea una cuenta nueva.');
      return;
    }

    if (matched.passwordHash && matched.passwordHash !== loginPassword) {
      setLoginError('Contraseña incorrecta. Revisa e intentalo de nuevo.');
      return;
    }

    // Success
    try {
      localStorage.setItem('app_active_account_id', matched.id);
    } catch (err) {
      console.error('Error saving active account', err);
    }

    onLoginSuccess(matched.profileData, loginPassword);
  };

  // Quick Demo Account Login option
  const handleQuickDemoLogin = () => {
    const demoProfile = INITIAL_USER_PROFILE;
    onLoginSuccess(demoProfile, '1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-tr from-indigo-900 via-indigo-700 to-indigo-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg mb-3">
            <Key className="w-8 h-8 text-slate-950 transform -rotate-45" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Acceso Obligatorio — Inicia Sesión o Regístrate</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            La Llave del Desafío
          </h2>
          <p className="text-xs text-indigo-100 font-medium mt-1">
            Plataforma Estudiantil & Crecimiento Personal 🚀
          </p>

          {/* Mode Switch Pills */}
          <div className="flex items-center justify-center gap-1 bg-indigo-950/40 p-1 rounded-2xl border border-indigo-400/30 max-w-xs mx-auto mt-6">
            <button
              onClick={() => { setMode('register'); setRegError(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrarse</span>
            </button>

            <button
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">Crea tu Cuenta de Estudiante</h3>
                <p className="text-xs text-slate-500">
                  Ingresa tu usuario, contraseña y foto de perfil para acceder de forma segura.
                </p>
              </div>

              {regError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Name input */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Nombre Completo o Apodo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Sofia Ramírez"
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium outline-none"
                  />
                </div>
              </div>

              {/* Username input */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Nombre de Usuario <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="sofia_estudiante"
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-indigo-700 font-bold outline-none"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Confirmar Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Avatar Selection */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                  <span>Selecciona tu Foto de Perfil</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Elige o sube una personalizada</span>
                </label>

                {/* Upload or Preset Grid */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-600 shrink-0 shadow-sm bg-white">
                    <img src={regAvatarUrl} alt="Avatar seleccionado" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Subir Imagen desde el Dispositivo</span>
                    </button>

                    <input
                      type="url"
                      value={regAvatarUrl}
                      onChange={(e) => setRegAvatarUrl(e.target.value)}
                      placeholder="o pega la URL de tu foto de perfil..."
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Avatar Presets */}
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = regAvatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setRegAvatarUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover" />
                        {isSelected && (
                          <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white p-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md hover:shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Crear Cuenta e Iniciar Mi Experiencia</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">Bienvenido de Nuevo</h3>
                <p className="text-xs text-slate-500">
                  Ingresa tu usuario y contraseña para acceder a tus progresos.
                </p>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username input */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Nombre de Usuario (@usuario) o Nombre
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="@alex_estudiante o Alex Rivera"
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium outline-none"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md hover:shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ingresar a Mi Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Access Option */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              ¿Quieres probar la plataforma al instante?
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              ⚡ Entrar como Alex Rivera (Cuenta Demo de Muestra)
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acceso seguro local
          </span>
          <span>La Llave del Desafío v2.0</span>
        </div>

      </div>
    </div>
  );
};
