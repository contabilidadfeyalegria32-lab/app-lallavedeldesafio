import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize2, RotateCcw,
  Sparkles, Target, Gamepad2, Calendar, FileText, User, Users, Brain, Key, Trophy,
  CheckCircle2, ArrowRight, X, Flame, Shield, Bookmark, MessageSquare
} from 'lucide-react';
import { NavigationTab } from './Header';

interface PlatformVideoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
}

interface Chapter {
  id: NavigationTab | 'intro';
  title: string;
  duration: number; // in seconds
  icon: React.FC<{ className?: string }>;
  badge: string;
  summary: string;
  narrationText: string;
  targetTab?: NavigationTab;
  visualHighlight: {
    title: string;
    description: string;
    bullets: string[];
    accentColor: string;
    bgGradient: string;
  };
}

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: '1. Propósito de la Plataforma',
    duration: 18,
    icon: Key,
    badge: 'Visión General',
    summary: '¿Para qué sirve La Llave del Desafío?',
    narrationText: '¡Bienvenido a La Llave del Desafío! Esta es una plataforma educativa gamificada diseñada para transformar la rutina académica en una experiencia motivadora. Aquí los estudiantes construyen hábitos diarios, superan retos académicos, ganan recompensas y fortalecen su aprendizaje en comunidad.',
    visualHighlight: {
      title: 'Plataforma Estudiantil & Crecimiento',
      description: 'Convierte tus hábitos de estudio en una aventura llena de motivación, metas diarias e incentivos positivos.',
      bullets: [
        'Organización académica integral',
        'Gamificación con XP, monedas y niveles',
        'Comunidad estudiantil colaborativa',
        'Herramientas de enfoque y productividad'
      ],
      accentColor: 'from-amber-400 to-indigo-600',
      bgGradient: 'from-indigo-950 via-slate-900 to-slate-950',
    }
  },
  {
    id: 'challenges',
    title: '2. Módulo de Desafíos',
    duration: 20,
    icon: Target,
    badge: 'Metas & Hábitos',
    summary: 'Retos diarios y semanales con recompensas',
    narrationText: 'En el módulo de Desafíos, los estudiantes encuentran misiones diarias y semanales adaptadas a sus materias. Completar tareas, repasar apuntes y mantener la racha otorga Puntos de Experiencia XP y monedas virtuales para desbloquear insignias y recompensas.',
    targetTab: 'challenges',
    visualHighlight: {
      title: 'Desafíos & Misiones Diarias',
      description: 'Gana XP y monedas al completar misiones académicas y mantener tu racha activa.',
      bullets: [
        'Misiones diarias de estudio y lectura',
        'Desafíos semanales en equipo o individuales',
        'Contador de racha (Streak) de días seguidos',
        'Recompensas inmediatas al subir de nivel'
      ],
      accentColor: 'from-indigo-500 to-violet-600',
      bgGradient: 'from-indigo-950 via-indigo-900 to-slate-950',
    }
  },
  {
    id: 'game',
    title: '3. Arcade & Trivia Estudiantil',
    duration: 22,
    icon: Gamepad2,
    badge: 'Aprende Jugando',
    summary: 'Laberintos y cuestionarios de preguntas',
    narrationText: 'La sección Arcade & Trivia combina el entretenimiento con la consolidación del conocimiento. Incluye el juego del Laberinto de las Llaves y un banco interactivo de preguntas de Escuela, Ciencia, Tecnología y Lógica con comodines 50/50 y explicaciones educativas.',
    targetTab: 'game',
    visualHighlight: {
      title: 'Arcade & Banco de Trivia',
      description: 'Refuerza lo aprendido en clase resolviendo trivias y superando el laberinto.',
      bullets: [
        'Preguntas dinámicas sin repetición por categorías',
        'Comodines de ayuda: 50/50 y Pista del Sabio',
        'Posibilidad de agregar preguntas propias al banco',
        'Juego arcade El Laberinto de las Llaves'
      ],
      accentColor: 'from-amber-400 to-emerald-500',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
    }
  },
  {
    id: 'calendar',
    title: '4. Calendario Inteligente',
    duration: 18,
    icon: Calendar,
    badge: 'Organización',
    summary: 'Gestión de exámenes, tareas y entregas',
    narrationText: 'El Calendario Inteligente permite programar exámenes, fechas de entrega de proyectos y sesiones de estudio. Mantiene un recordatorio claro de prioridades para evitar entregas de último momento y reducir el estrés académico.',
    targetTab: 'calendar',
    visualHighlight: {
      title: 'Calendario Académico Inteligente',
      description: 'Nunca olvides una fecha importante. Organiza entregas, exámenes y eventos.',
      bullets: [
        'Categorización por colores (Examen, Tarea, Proyecto)',
        'Alertas de proximidad de fechas límite',
        'Filtros por tipo de compromiso académico',
        'Vista rápida de eventos de la semana y mes'
      ],
      accentColor: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    }
  },
  {
    id: 'notes',
    title: '5. Bloc de Notas & Apuntes',
    duration: 18,
    icon: FileText,
    badge: 'Productividad',
    summary: 'Cuaderno digital de apuntes y resúmenes',
    narrationText: 'El bloc de Notas es el espacio personal para tomar apuntes de clase, elaborar resúmenes y crear listas de tareas. Permite etiquetar notas por materia y marcarlas como importantes para repasarlas antes de una evaluación.',
    targetTab: 'notes',
    visualHighlight: {
      title: 'Notas & Apuntes Digitales',
      description: 'Tu cuaderno digital interactivo para sintetizar información y repasar.',
      bullets: [
        'Creación y edición rápida de notas de clase',
        'Clasificación por etiquetas y colores',
        'Filtro de búsqueda por palabra clave',
        'Acceso rápido desde cualquier dispositivo'
      ],
      accentColor: 'from-emerald-400 to-teal-600',
      bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    }
  },
  {
    id: 'profile',
    title: '6. Perfil, Nivel & Logros',
    duration: 20,
    icon: User,
    badge: 'Reconocimiento',
    summary: 'Evolución del estudiante e insignias',
    narrationText: 'En Perfil & Logros, cada estudiante puede ver su progreso histórico: nivel actual, avatares personalizados, tarjeta de acceso estudiante con código QR e insignias desbloqueadas por constancia, esfuerzo y colaboración.',
    targetTab: 'profile',
    visualHighlight: {
      title: 'Perfil del Estudiante & Trofeos',
      description: 'Visualiza tu crecimiento, nivel de experiencia e insignias de honor.',
      bullets: [
        'Generador de Carnet / Credencial de Acceso QR',
        'Galería de insignias de honor desblocables',
        'Estadísticas detalladas de horas de enfoque y trivia',
        'Personalización de perfil y título académico'
      ],
      accentColor: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
    }
  },
  {
    id: 'community',
    title: '7. Muro Estudiantil',
    duration: 20,
    icon: Users,
    badge: 'Comunidad',
    summary: 'Red de colaboración y publicaciones',
    narrationText: 'Por último, el Muro Estudiantil une a la comunidad escolar. Los estudiantes pueden compartir recursos de estudio, hacer preguntas académicas, felicitar a sus compañeros y construir un ambiente seguro y enriquecedor.',
    targetTab: 'community',
    visualHighlight: {
      title: 'Muro Estudiantil Comunidad',
      description: 'Conéctate con otros estudiantes, comparte consejos y resuelve dudas juntos.',
      bullets: [
        'Publicaciones con etiquetas de materias',
        'Reacciones de apoyo y comentarios constructivos',
        'Anuncios destacados de la comunidad escolar',
        'Espacio seguro de interacción y motivación mutua'
      ],
      accentColor: 'from-rose-500 to-amber-500',
      bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
    }
  }
];

const TOTAL_TOUR_DURATION = CHAPTERS.reduce((acc, c) => acc + c.duration, 0);

export const PlatformVideoTour: React.FC<PlatformVideoTourProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedInChapter, setElapsedInChapter] = useState(0);

  const [spanishVoices, setSpanishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const safeChapterIdx = Math.max(0, Math.min(currentChapterIdx, CHAPTERS.length - 1));
  const currentChapter = CHAPTERS[safeChapterIdx] || CHAPTERS[0];

  // Load and filter Spanish voices from browser
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const esVoices = allVoices.filter((v) => v.lang.toLowerCase().includes('es'));
      setSpanishVoices(esVoices);

      if (esVoices.length > 0 && !selectedVoiceURI) {
        // Prioritize natural / neural / google / microsoft / apple voices
        const preferredVoice = esVoices.find(
          (v) =>
            v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('helena') ||
            v.name.toLowerCase().includes('sabina') ||
            v.name.toLowerCase().includes('jorge') ||
            v.name.toLowerCase().includes('monica') ||
            v.name.toLowerCase().includes('paulina')
        ) || esVoices[0];

        setSelectedVoiceURI(preferredVoice.voiceURI);
      }
    };

    loadVoices();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);

  // Speech narration helper with humanized rate, pitch, and chosen voice
  const speakCurrentChapterText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel previous speech
      if (isMuted) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      // Humanized speech parameters: slightly slower rate and natural pitch sound much less robotic
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      if (spanishVoices.length > 0) {
        const chosenVoice = spanishVoices.find((v) => v.voiceURI === selectedVoiceURI) || spanishVoices[0];
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      }

      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Speech synthesis error:', e);
    }
  };

  // Trigger speech when chapter changes, voice changes or unmuted
  useEffect(() => {
    if (isOpen && isPlaying && !isMuted && currentChapter) {
      speakCurrentChapterText(currentChapter.narrationText);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [safeChapterIdx, isOpen, isMuted, isPlaying, selectedVoiceURI]);

  // Clean speech synthesis on unmount / close
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // Timer loop for video playback simulation
  useEffect(() => {
    if (!isOpen || !isPlaying || !currentChapter) return;

    const interval = setInterval(() => {
      setElapsedInChapter((prev) => {
        if (prev + 1 >= currentChapter.duration) {
          // Move to next chapter
          if (safeChapterIdx < CHAPTERS.length - 1) {
            setCurrentChapterIdx((c) => Math.min(c + 1, CHAPTERS.length - 1));
            return 0;
          } else {
            // End of tour
            setIsPlaying(false);
            return currentChapter.duration;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, safeChapterIdx, currentChapter]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNextChapter = () => {
    if (safeChapterIdx < CHAPTERS.length - 1) {
      setCurrentChapterIdx(safeChapterIdx + 1);
      setElapsedInChapter(0);
    }
  };

  const handlePrevChapter = () => {
    if (safeChapterIdx > 0) {
      setCurrentChapterIdx(safeChapterIdx - 1);
      setElapsedInChapter(0);
    }
  };

  const handleRestart = () => {
    setCurrentChapterIdx(0);
    setElapsedInChapter(0);
    setIsPlaying(true);
  };

  const handleJumpToTab = (tab?: NavigationTab) => {
    if (tab) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onNavigateToTab(tab);
      onClose();
    }
  };

  const ChapterIcon = currentChapter?.icon || Key;

  // Calculate global progress %
  let accumulatedSecondsBefore = 0;
  for (let i = 0; i < currentChapterIdx; i++) {
    accumulatedSecondsBefore += CHAPTERS[i].duration;
  }
  const currentTotalElapsed = accumulatedSecondsBefore + elapsedInChapter;
  const globalProgressPercent = (currentTotalElapsed / TOTAL_TOUR_DURATION) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative text-white">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Video Tour Explicativo de la Plataforma</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  HD 1080p
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Guía completa de Desafíos, Arcade & Trivia, Calendario, Notas, Perfil y Muro Estudiantil
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Screen Frame */}
        <div className={`relative flex-1 min-h-[320px] sm:min-h-[380px] bg-gradient-to-br ${currentChapter.visualHighlight.bgGradient} p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500`}>
          
          {/* Animated Background Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Video Player Header Overlay */}
          <div className="relative z-10 flex items-center justify-between gap-3 bg-slate-950/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                CAPÍTULO {currentChapterIdx + 1}/{CHAPTERS.length}
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs font-bold text-amber-300">
                {currentChapter.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span>{formatTime(currentTotalElapsed)}</span>
              <span className="text-slate-600">/</span>
              <span>{formatTime(TOTAL_TOUR_DURATION)}</span>
            </div>
          </div>

          {/* Main Visual Stage Content */}
          <div className="relative z-10 my-auto py-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Description Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold">
                <ChapterIcon className="w-4 h-4 text-amber-400" />
                <span>{currentChapter.title}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {currentChapter.visualHighlight.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentChapter.visualHighlight.description}
              </p>

              <div className="space-y-2 pt-1">
                {currentChapter.visualHighlight.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {currentChapter.targetTab && (
                <div className="pt-2">
                  <button
                    onClick={() => handleJumpToTab(currentChapter.targetTab)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    <span>Ir a esta Sección Ahora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Interactive Mockup Graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-xs bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3 relative group">
                
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-white/30 animate-bounce">
                  ✨ Demostración
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <ChapterIcon className="w-4 h-4 text-indigo-400" />
                    <span>Vista Previa</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">En Vivo</span>
                </div>

                {/* Dynamic Content Preview Box based on Chapter */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                  {currentChapter.id === 'intro' && (
                    <div className="space-y-2 text-center py-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-md">
                        <Key className="w-6 h-6 text-amber-200" />
                      </div>
                      <p className="font-extrabold text-white text-xs">La Llave del Desafío</p>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Aprende + Gana XP + Gamificación
                      </span>
                    </div>
                  )}

                  {currentChapter.id === 'challenges' && (
                    <div className="space-y-2">
                      <div className="bg-indigo-900/40 p-2 rounded-lg border border-indigo-500/30 flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">Misión: Leer 15 min</span>
                        <span className="text-amber-300 font-black text-[10px]">+50 XP</span>
                      </div>
                      <div className="bg-emerald-900/40 p-2 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">Racha de Estudio</span>
                        <span className="text-emerald-300 font-mono font-extrabold text-[10px]">5 Días 🔥</span>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'game' && (
                    <div className="space-y-2">
                      <div className="bg-amber-950/60 p-2 rounded-lg border border-amber-500/30 text-[11px]">
                        <p className="font-bold text-amber-200">Trivia: ¿Fórmula del Agua?</p>
                        <div className="grid grid-cols-2 gap-1 mt-1 font-mono text-[10px]">
                          <span className="bg-slate-800 p-1 rounded text-center">A) CO2</span>
                          <span className="bg-emerald-600 font-bold p-1 rounded text-center text-white">B) H2O ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'calendar' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="bg-blue-900/40 p-2 rounded-lg border border-blue-500/30 flex justify-between items-center">
                        <span className="font-bold text-white">Examen de Física</span>
                        <span className="text-blue-300 text-[10px]">Viernes</span>
                      </div>
                      <div className="bg-purple-900/40 p-2 rounded-lg border border-purple-500/30 flex justify-between items-center">
                        <span className="font-bold text-white">Entrega Proyecto</span>
                        <span className="text-purple-300 text-[10px]">Lunes</span>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'notes' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="bg-emerald-900/40 p-2 rounded-lg border border-emerald-500/30">
                        <p className="font-bold text-emerald-200">Resumen Biología Celular</p>
                        <p className="text-[10px] text-slate-300 truncate">Mitocondrias y producción de ATP...</p>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'profile' && (
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center font-black text-slate-950">
                          🎓
                        </div>
                        <div>
                          <p className="font-bold text-white">Estudiante Nivel 8</p>
                          <p className="text-[10px] text-amber-300">Medalla: Maestro del Saber</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'community' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="bg-rose-950/50 p-2 rounded-lg border border-rose-500/30">
                        <p className="font-bold text-rose-200">Post de Mateo:</p>
                        <p className="text-[10px] text-slate-300">"¡Aprobé el examen de matemáticas gracias a las trivias!"</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Subtitles / Narrator Caption Banner */}
          <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs text-amber-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/80 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-indigo-400 block">
                NARRACIÓN EN ESPAÑOL:
              </span>
              <p className="text-slate-100 font-medium leading-tight">
                "{currentChapter.narrationText}"
              </p>
            </div>
          </div>

        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
          
          {/* Scrubber Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative">
              <div
                className="bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${globalProgressPercent}%` }}
              />
            </div>

            {/* Chapter Markers */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 overflow-x-auto gap-2">
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapterIdx(idx);
                    setElapsedInChapter(0);
                    setIsPlaying(true);
                  }}
                  className={`px-2 py-0.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    idx === currentChapterIdx
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {ch.title.split('.')[1] || ch.title}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Play Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 rounded-xl cursor-pointer transition-colors"
                title="Capítulo Anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === CHAPTERS.length - 1}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 rounded-xl cursor-pointer transition-colors"
                title="Siguiente Capítulo"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer transition-colors ml-1"
                title="Reiniciar Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Toggle, Voice Selector & Mute */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Voice selector if multiple Spanish voices exist */}
              {spanishVoices.length > 0 && !isMuted && (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                  <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Voz:</span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="bg-transparent text-amber-300 text-xs font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
                  >
                    {spanishVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white text-xs">
                        {v.name.replace(/(Google|Microsoft|Apple|eSpeak)\s*/gi, '').substring(0, 24)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleToggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isMuted
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Voz Silenciada</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Voz Activada</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
