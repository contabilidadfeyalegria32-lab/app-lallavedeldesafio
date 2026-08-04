import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS, INITIAL_USER_PROFILE } from '../data/initialData';
import { 
  Key, Lock, User, AtSign, Eye, EyeOff, Upload, Check, 
  Sparkles, ShieldCheck, ArrowRight, Camera, UserPlus, LogIn, AlertCircle,
  Smartphone, Trash2, Zap, Flame, Award, Coins, ChevronRight, CheckCircle2
} from 'lucide-react';

export interface AuthAccount {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  avatarUrl: string;
  profileData: UserProfile;
  rememberPassword?: boolean;
}

interface AuthModalProps {
  onLoginSuccess: (userProfile: UserProfile, password?: string) => void;
  savedAccounts: AuthAccount[];
  onDeleteAccount?: (accountId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLoginSuccess,
  savedAccounts,
  onDeleteAccount,
}) => {
  const [localAccounts, setLocalAccounts] = useState<AuthAccount[]>(savedAccounts);

  // Initial mode: if there are saved accounts, start in 'quick_accounts' view
  const [mode, setMode] = useState<'quick_accounts' | 'login' | 'register'>(
    localAccounts.length > 0 ? 'quick_accounts' : 'register'
  );

  // Remember password setting for 1-Tap entry
  const [rememberOnDevice, setRememberOnDevice] = useState(true);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatarUrl, setRegAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [regError, setRegError] = useState('');

  // Shared UX states
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep localAccounts synced if parent props update
  React.useEffect(() => {
    setLocalAccounts(savedAccounts);
  }, [savedAccounts]);

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

  // Direct 1-Tap Login for saved account
  const handleOneTapLogin = (acc: AuthAccount) => {
    try {
      localStorage.setItem('app_active_account_id', acc.id);
      localStorage.setItem('app_user_profile', JSON.stringify(acc.profileData));
      localStorage.setItem('app_auth_session', 'true');
    } catch (err) {
      console.error('Error setting 1-tap session', err);
    }
    onLoginSuccess(acc.profileData, acc.passwordHash);
  };

  // Pre-fill login form with selected account
  const handleSelectAccountForPassword = (acc: AuthAccount) => {
    setLoginUsername(acc.username);
    setLoginPassword(acc.rememberPassword ? acc.passwordHash : '');
    setLoginError('');
    setMode('login');
  };

  // Delete saved account from device
  const handleRemoveAccount = (accountId: string) => {
    const updated = localAccounts.filter((a) => a.id !== accountId);
    setLocalAccounts(updated);
    setConfirmDeleteId(null);
    try {
      localStorage.setItem('app_registered_accounts', JSON.stringify(updated));
    } catch (e) {}

    if (onDeleteAccount) {
      onDeleteAccount(accountId);
    }

    if (updated.length === 0 && mode === 'quick_accounts') {
      setMode('register');
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
    const existing = localAccounts.find(
      (a) => a.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (existing) {
      setRegError(`El nombre de usuario ${cleanUsername} ya está guardado en este dispositivo. Elige otro o Inicia Sesión.`);
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

    // Save account locally
    const newAccount: AuthAccount = {
      id: `acc_${Date.now()}`,
      name: regName.trim(),
      username: cleanUsername,
      passwordHash: regPassword,
      avatarUrl: regAvatarUrl,
      profileData: newProfile,
      rememberPassword: rememberOnDevice,
    };

    const updatedAccounts = [...localAccounts, newAccount];
    setLocalAccounts(updatedAccounts);

    try {
      localStorage.setItem('app_registered_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('app_active_account_id', newAccount.id);
      localStorage.setItem('app_auth_session', 'true');
    } catch (err) {
      console.error('Error saving account locally', err);
    }

    onLoginSuccess(newProfile, regPassword);
  };

  // Submit Manual Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    let cleanUser = loginUsername.trim();
    if (!cleanUser.startsWith('@') && !cleanUser.includes(' ')) {
      cleanUser = `@${cleanUser}`;
    }

    // Find account
    const matched = localAccounts.find(
      (a) =>
        a.username.toLowerCase() === cleanUser.toLowerCase() ||
        a.name.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (!matched) {
      setLoginError('No encontramos ese usuario en las cuentas de este dispositivo. Si eres nuevo, puedes Registrarte.');
      return;
    }

    if (matched.passwordHash && matched.passwordHash !== loginPassword) {
      setLoginError('Contraseña incorrecta. Verifica e inténtalo nuevamente.');
      return;
    }

    // Update remember setting if needed
    if (rememberOnDevice && !matched.rememberPassword) {
      matched.rememberPassword = true;
      const updated = localAccounts.map((a) => (a.id === matched.id ? matched : a));
      setLocalAccounts(updated);
      try {
        localStorage.setItem('app_registered_accounts', JSON.stringify(updated));
      } catch (e) {}
    }

    // Success
    try {
      localStorage.setItem('app_active_account_id', matched.id);
      localStorage.setItem('app_auth_session', 'true');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-400 text-slate-950 flex items-center justify-center shadow-lg mb-3 border border-amber-200">
            <Key className="w-8 h-8 text-slate-950 transform -rotate-45" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Guarda tus Cuentas en tu Celular / Dispositivo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            La Llave del Desafío
          </h2>
          <p className="text-xs text-indigo-100 font-medium mt-1">
            Plataforma Estudiantil & Crecimiento Personal 🚀
          </p>

          {/* Mode Switch Pills */}
          <div className="flex items-center justify-center gap-1 bg-indigo-950/60 p-1.5 rounded-2xl border border-indigo-400/30 max-w-md mx-auto mt-6">
            {localAccounts.length > 0 && (
              <button
                onClick={() => setMode('quick_accounts')}
                className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  mode === 'quick_accounts'
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mis Cuentas ({localAccounts.length})</span>
              </button>
            )}

            <button
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => { setMode('register'); setRegError(''); }}
              className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Cuenta</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* MODE 1: QUICK SAVED ACCOUNTS ON DEVICE (1-TAP LOGIN) */}
          {mode === 'quick_accounts' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start text-emerald-600 font-extrabold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cuentas Guardadas en este Dispositivo Móvil / PC</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Selecciona tu Cuenta de Estudiante
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ingresa de forma instantánea en 1-Tap. Tus monedas, medallas y niveles están seguros y nunca se borrarán.
                </p>
              </div>

              {/* Saved Accounts List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                {localAccounts.map((acc) => {
                  const p = acc.profileData;
                  const isConfirmingDelete = confirmDeleteId === acc.id;

                  return (
                    <div
                      key={acc.id}
                      className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-2xl border border-indigo-100 p-4 hover:border-indigo-300 transition-all shadow-xs relative group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        
                        {/* Avatar & User info */}
                        <div 
                          onClick={() => handleOneTapLogin(acc)}
                          className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="relative shrink-0">
                            <div className="w-13 h-13 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 to-indigo-600 shadow-xs overflow-hidden">
                              <img
                                src={acc.avatarUrl || p.avatarUrl || AVATAR_PRESETS[0].url}
                                alt={acc.name}
                                className="w-full h-full object-cover rounded-[14px]"
                              />
                            </div>
                            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white">
                              Nv.{p.level || 1}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                                {acc.name}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                                {p.title || 'Estudiante'}
                              </span>
                            </div>
                            <p className="text-xs font-mono font-bold text-indigo-600 truncate">
                              {acc.username}
                            </p>

                            {/* Stat badges */}
                            <div className="flex items-center gap-3 text-[11px] font-extrabold text-slate-600 pt-0.5">
                              <span className="flex items-center gap-1 text-amber-700">
                                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {p.streakDays || 1}d
                              </span>
                              <span className="flex items-center gap-1 text-emerald-700">
                                <Coins className="w-3 h-3 text-emerald-500" />
                                {p.coins || 100}
                              </span>
                              <span className="flex items-center gap-1 text-indigo-700">
                                <Award className="w-3 h-3 text-indigo-500" />
                                {p.xp || 100} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                              <button
                                onClick={() => handleRemoveAccount(acc.id)}
                                className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-black cursor-pointer hover:bg-rose-700"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1.5 py-1 text-slate-500 hover:text-slate-800 text-[10px] font-bold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOneTapLogin(acc)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-transform hover:scale-105 cursor-pointer"
                                title="Ingresar con 1-Tap sin escribir contraseña"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                                <span>Entrar</span>
                              </button>

                              <button
                                onClick={() => setConfirmDeleteId(acc.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="Quitar cuenta de este dispositivo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Permanent Storage Notice */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-[11px]">Almacenamiento Seguro e Ininterrumpido</p>
                  <p className="text-[11px] text-emerald-800 leading-normal">
                    Tus cuentas están guardadas localmente en este celular o computador. Puedes cerrar e iniciar sesión cuantas veces quieras sin perder tu avance.
                  </p>
                </div>
              </div>

              {/* Bottom add new or login manual */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => { setMode('register'); setRegError(''); }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Registrar Nueva Cuenta</span>
                </button>

                <button
                  onClick={() => { setMode('login'); setLoginError(''); }}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Ingresar manualmente con otro usuario
                </button>
              </div>

            </div>
          )}

          {/* MODE 2: REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">Crea tu Cuenta de Estudiante</h3>
                <p className="text-xs text-slate-500">
                  Ingresa tus datos y foto de perfil. Tu cuenta se guardará en tu celular/dispositivo de forma permanente.
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
                    placeholder="Ej. Sofía Ramírez"
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
                  <span>Foto de Perfil</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Elige o sube una imagen</span>
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
                      <span>Subir Imagen desde el Celular</span>
                    </button>

                    <input
                      type="url"
                      value={regAvatarUrl}
                      onChange={(e) => setRegAvatarUrl(e.target.value)}
                      placeholder="o pega URL de la imagen..."
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

              {/* Remember on Device Checkbox */}
              <label className="flex items-center gap-2.5 bg-amber-50/80 p-3 rounded-2xl border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberOnDevice}
                  onChange={(e) => setRememberOnDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Guardar cuenta en este celular para Inicio de Sesión de 1-Tap</span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md hover:shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Crear Cuenta y Guardar en Dispositivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* MODE 3: MANUAL LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">Iniciar Sesión de Estudiante</h3>
                <p className="text-xs text-slate-500">
                  Ingresa tu usuario y contraseña. Tu cuenta quedará lista para accesos rápidos.
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

              {/* Remember Checkbox */}
              <label className="flex items-center gap-2.5 bg-indigo-50/80 p-3 rounded-2xl border border-indigo-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberOnDevice}
                  onChange={(e) => setRememberOnDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span>Activar Inicio de Sesión de 1-Tap para esta cuenta</span>
                </span>
              </label>

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
            <p className="text-[11px] text-slate-400 font-medium">
              ¿Quieres explorar la plataforma inmediatamente sin registrarte?
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 underline cursor-pointer inline-flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Entrar como Alex Rivera (Cuenta Demo de Muestra)</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acceso local seguro en tu dispositivo
          </span>
          <span>La Llave del Desafío v2.0</span>
        </div>

      </div>
    </div>
  );
};
