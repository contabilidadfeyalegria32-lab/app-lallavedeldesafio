import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Volume2, VolumeX, Maximize2, Minimize2, X, ExternalLink,
  Sparkles, Radio, Headphones, Sliders, Check, CloudRain, Coffee,
  Wind, Disc, Heart, Play, Pause, RefreshCw, Bookmark, Flame
} from 'lucide-react';
import { playAudioEffect } from '../utils/audio';

interface SpotifyPlaylist {
  id: string;
  title: string;
  category: string;
  description: string;
  spotifyUrl: string;
  coverImage: string;
}

const PRESET_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: 'lofi_beats',
    title: 'Lofi Beats para Estudiar 🎧',
    category: 'Lofi / Hip Hop',
    description: 'Ritmos relajantes sin voz ideales para concentración profunda y lectura.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwF2ExWzM',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deep_focus',
    title: 'Deep Focus & Brain Waves 🧠',
    category: 'Binaural / Ambient',
    description: 'Música ambiental y ondas de concentración máxima para exámenes y proyectos.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZEKWh2L3a84',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'piano_study',
    title: 'Piano Acústico Relajante 🎹',
    category: 'Clásica & Instrumentos',
    description: 'Melodías sueltas de piano para estudiar tranquilamente en noches largas.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq31C5',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chill_beats',
    title: 'Chill Cafe Study Vibes ☕',
    category: 'Acoustic & Lounge',
    description: 'Sonidos de cafetería, guitarra suave y beats de baja fidelidad.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8U239M38Chh',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'electronic_focus',
    title: 'Electro Focus & Synthwave ⚡',
    category: 'Electrónica / Ritmo',
    description: 'Para programar, resolver matemáticas y tareas que requieren energía constante.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN2aqioXM',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'nature_ambient',
    title: 'Naturaleza, Lluvia & Bosque 🌿',
    category: 'Sonidos de la Naturaleza',
    description: 'Tormentas suaves, brisa de bosque y olas para calmar el estrés escolar.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP332iUt24',
    coverImage: 'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=400&q=80',
  },
];

// Helper to convert Spotify URLs into valid embed iframe URLs
export function getSpotifyEmbedUrl(urlOrUri: string): string {
  if (!urlOrUri) return 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwF2ExWzM?utm_source=generator';

  let clean = urlOrUri.trim();

  // If user pasted an iframe embed code snippet: <iframe src="https://open.spotify.com/embed/..."
  const iframeSrcMatch = clean.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    clean = iframeSrcMatch[1];
  }

  // If URI like spotify:playlist:37i9dQZF1DWWQRwF2ExWzM
  if (clean.startsWith('spotify:')) {
    const parts = clean.split(':');
    if (parts.length >= 3) {
      return `https://open.spotify.com/embed/${parts[1]}/${parts[2]}?utm_source=generator`;
    }
  }

  // Robust regex that handles localized URLs like /intl-es/playlist/..., /intl-pt/track/..., /playlist/..., /album/...
  const match = clean.match(/(playlist|album|track|artist|show|episode)\/([a-zA-Z0-9]+)/i);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
  }

  return 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwF2ExWzM?utm_source=generator';
}

interface SpotifyMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotifyMusicPlayer: React.FC<SpotifyMusicPlayerProps> = ({ isOpen, onClose }) => {
  // Saved playlist URL state
  const [currentSpotifyUrl, setCurrentSpotifyUrl] = useState<string>(() => {
    return localStorage.getItem('user_spotify_playlist_url') || PRESET_PLAYLISTS[0].spotifyUrl;
  });

  const [activePlaylistTitle, setActivePlaylistTitle] = useState<string>(() => {
    return localStorage.getItem('user_spotify_playlist_title') || PRESET_PLAYLISTS[0].title;
  });

  const [customInputUrl, setCustomInputUrl] = useState('');
  const [customInputTitle, setCustomInputTitle] = useState('');

  // User's saved playlists in localStorage
  const [savedUserPlaylists, setSavedUserPlaylists] = useState<Array<{ id: string; title: string; spotifyUrl: string }>>(() => {
    try {
      const saved = localStorage.getItem('user_saved_spotify_playlists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mode state: 'compact' (pantalla chiquita flotante), 'expanded' (modal completo), 'bubble' (minimizado a cápsula)
  const [displayMode, setDisplayMode] = useState<'compact' | 'expanded' | 'bubble'>('compact');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'ambient'>('presets');
  const [showQuickChange, setShowQuickChange] = useState(false);

  // Ambient sound synthesizer states
  const [rainVolume, setRainVolume] = useState(0);
  const [cafeVolume, setCafeVolume] = useState(0);
  const [wavesVolume, setWavesVolume] = useState(0);
  const [fireVolume, setFireVolume] = useState(0);

  // Audio Context Ref for Web Audio ambient sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const cafeGainRef = useRef<GainNode | null>(null);
  const wavesGainRef = useRef<GainNode | null>(null);
  const fireGainRef = useRef<GainNode | null>(null);

  // Synchronize localStorage when playlist changes
  useEffect(() => {
    localStorage.setItem('user_spotify_playlist_url', currentSpotifyUrl);
    localStorage.setItem('user_spotify_playlist_title', activePlaylistTitle);
  }, [currentSpotifyUrl, activePlaylistTitle]);

  // Helper function to create high-quality Pink Noise buffer (1/f spectral slope)
  const createPinkNoiseBuffer = (ctx: AudioContext, seconds = 4): AudioBuffer => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.12; // Scaled for pleasant headroom
      b6 = white * 0.115926;
    }
    return buffer;
  };

  // Helper function to create Brown Noise buffer (1/f^2 spectral slope for rich deep rumble)
  const createBrownNoiseBuffer = (ctx: AudioContext, seconds = 4): AudioBuffer => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.8; // Boosted for rich audible ocean and fireplace bass
    }
    return buffer;
  };

  // Synchronously initialize or resume AudioContext directly from user gestures (click/drag)
  const initOrResumeAudioCtx = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const pinkBuffer = createPinkNoiseBuffer(ctx, 4);
        const brownBuffer = createBrownNoiseBuffer(ctx, 4);

        // 1. Rain Synthesizer (Pink noise + Lowpass filter @ 1600Hz)
        const rainSource = ctx.createBufferSource();
        rainSource.buffer = pinkBuffer;
        rainSource.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(1600, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0, ctx.currentTime);
        rainGainRef.current = rainGain;

        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(ctx.destination);
        rainSource.start();

        // 2. Cafe Hum Synthesizer (Pink noise + Bandpass @ 650Hz)
        const cafeSource = ctx.createBufferSource();
        cafeSource.buffer = pinkBuffer;
        cafeSource.loop = true;

        const cafeFilter = ctx.createBiquadFilter();
        cafeFilter.type = 'bandpass';
        cafeFilter.frequency.setValueAtTime(650, ctx.currentTime);
        cafeFilter.Q.setValueAtTime(1.2, ctx.currentTime);

        const cafeGain = ctx.createGain();
        cafeGain.gain.setValueAtTime(0, ctx.currentTime);
        cafeGainRef.current = cafeGain;

        cafeSource.connect(cafeFilter);
        cafeFilter.connect(cafeGain);
        cafeGain.connect(ctx.destination);
        cafeSource.start();

        // 3. Ocean Waves Synthesizer (Brown noise + Modulated LFO filter @ 0.1Hz for wave swells)
        const wavesSource = ctx.createBufferSource();
        wavesSource.buffer = brownBuffer;
        wavesSource.loop = true;

        const wavesFilter = ctx.createBiquadFilter();
        wavesFilter.type = 'lowpass';
        wavesFilter.frequency.setValueAtTime(450, ctx.currentTime);

        const wavesGain = ctx.createGain();
        wavesGain.gain.setValueAtTime(0, ctx.currentTime);
        wavesGainRef.current = wavesGain;

        // LFO for rolling wave swells
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(220, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(wavesFilter.frequency);
        lfo.start();

        wavesSource.connect(wavesFilter);
        wavesFilter.connect(wavesGain);
        wavesGain.connect(ctx.destination);
        wavesSource.start();

        // 4. Fireplace Crackle (Brown noise + Lowpass filter @ 400Hz)
        const fireSource = ctx.createBufferSource();
        fireSource.buffer = brownBuffer;
        fireSource.loop = true;

        const fireFilter = ctx.createBiquadFilter();
        fireFilter.type = 'lowpass';
        fireFilter.frequency.setValueAtTime(400, ctx.currentTime);

        const fireGain = ctx.createGain();
        fireGain.gain.setValueAtTime(0, ctx.currentTime);
        fireGainRef.current = fireGain;

        fireSource.connect(fireFilter);
        fireFilter.connect(fireGain);
        fireGain.connect(ctx.destination);
        fireSource.start();
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (err) {
      console.warn('AudioContext init error:', err);
    }
  };

  // Update Gain Node Volumes whenever slider states change
  useEffect(() => {
    const totalVol = rainVolume + cafeVolume + wavesVolume + fireVolume;
    if (totalVol === 0) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      return;
    }

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const now = audioCtxRef.current.currentTime;
      // High-clarity volume scaling (up to ~0.75 max gain)
      if (rainGainRef.current) {
        rainGainRef.current.gain.setValueAtTime((rainVolume / 100) * 0.75, now);
      }
      if (cafeGainRef.current) {
        cafeGainRef.current.gain.setValueAtTime((cafeVolume / 100) * 0.65, now);
      }
      if (wavesGainRef.current) {
        wavesGainRef.current.gain.setValueAtTime((wavesVolume / 100) * 0.85, now);
      }
      if (fireGainRef.current) {
        fireGainRef.current.gain.setValueAtTime((fireVolume / 100) * 0.70, now);
      }
    }
  }, [rainVolume, cafeVolume, wavesVolume, fireVolume]);

  const handleSelectPreset = (playlist: SpotifyPlaylist) => {
    setCurrentSpotifyUrl(playlist.spotifyUrl);
    setActivePlaylistTitle(playlist.title);
    playAudioEffect('click');
    setShowQuickChange(false);
  };

  const savePlaylistsToStorage = (updated: Array<{ id: string; title: string; spotifyUrl: string }>) => {
    setSavedUserPlaylists(updated);
    try {
      localStorage.setItem('user_saved_spotify_playlists', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving playlist to storage:', e);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;

    const url = customInputUrl.trim();
    const title = customInputTitle.trim() || 'Mi Playlist de Spotify 🎵';

    setCurrentSpotifyUrl(url);
    setActivePlaylistTitle(title);
    playAudioEffect('win');

    // Automatically save to user's saved playlists library if not already saved
    const exists = savedUserPlaylists.some(p => p.spotifyUrl === url);
    if (!exists) {
      const newPlaylist = {
        id: `user_pl_${Date.now()}`,
        title,
        spotifyUrl: url,
      };
      savePlaylistsToStorage([newPlaylist, ...savedUserPlaylists]);
    }

    setCustomInputUrl('');
    setCustomInputTitle('');
    setShowQuickChange(false);
  };

  const handleDeleteSavedPlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedUserPlaylists.filter(p => p.id !== id);
    savePlaylistsToStorage(updated);
    playAudioEffect('click');
  };

  const embedSrcUrl = getSpotifyEmbedUrl(currentSpotifyUrl);

  if (!isOpen) return null;

  return (
    <>
      {/* 1. BUBBLE MINIMIZED MODE */}
      {displayMode === 'bubble' && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="bg-slate-950 text-white rounded-2xl shadow-2xl border border-emerald-500/40 p-2.5 flex items-center gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-500 flex items-center justify-center text-slate-950 shadow-md animate-pulse shrink-0">
              <Headphones className="w-4 h-4" />
            </div>

            <div className="max-w-[160px] sm:max-w-[200px]">
              <div className="text-[9px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
                <Disc className="w-3 h-3 animate-spin-slow text-emerald-400" />
                <span>Spotify Sonando</span>
              </div>
              <p className="text-xs font-bold text-white truncate">
                {activePlaylistTitle}
              </p>
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              <button
                onClick={() => {
                  setDisplayMode('compact');
                  playAudioEffect('click');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                title="Abrir reproductor en pantalla flotante"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  playAudioEffect('click');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar reproductor"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPACT FLOATING WIDGET MODE ("Pantalla Chiquita Flotante") */}
      {displayMode === 'compact' && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-full animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-950 text-white rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
            
            {/* Widget Header */}
            <div className="p-3 px-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Spotify Estudiantil</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {activePlaylistTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setShowQuickChange(!showQuickChange);
                    playAudioEffect('click');
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 border ${
                    showQuickChange
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Cambiar playlist o poner tu música"
                >
                  <Music className="w-3 h-3" />
                  <span>Cambiar</span>
                </button>

                <button
                  onClick={() => {
                    setDisplayMode('expanded');
                    playAudioEffect('click');
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Ver en pantalla grande"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setDisplayMode('bubble');
                    playAudioEffect('click');
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Minimizar a burbuja"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    playAudioEffect('click');
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Playlist & URL Switcher Dropdown (Inside Compact Widget) */}
            {showQuickChange && (
              <div className="bg-slate-900 p-3 border-b border-slate-800 space-y-3 animate-in fade-in duration-150">
                
                {/* Presets List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 block tracking-wider">
                    🎧 Selecciona una Playlist de Estudio:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto no-scrollbar pt-1">
                    {PRESET_PLAYLISTS.map((pl) => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => handleSelectPreset(pl)}
                        className={`text-left p-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer truncate ${
                          currentSpotifyUrl === pl.spotifyUrl
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {pl.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paste Link Form */}
                <form onSubmit={handleApplyCustomUrl} className="space-y-1.5 pt-1 border-t border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 block tracking-wider">
                    🔗 O pega el enlace de tu canción/playlist de Spotify:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="https://open.spotify.com/playlist/..."
                      value={customInputUrl}
                      onChange={(e) => setCustomInputUrl(e.target.value)}
                      className="flex-1 text-[11px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer transition-colors"
                    >
                      Cargar
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Embedded Spotify Iframe Container */}
            <div className="p-2 bg-slate-950 relative">
              <div className="w-full h-[180px] sm:h-[220px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-inner">
                <iframe
                  src={embedSrcUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Study Player"
                  className="w-full h-full rounded-2xl"
                />
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                <a
                  href={currentSpotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Abrir en App Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    setDisplayMode('expanded');
                    playAudioEffect('click');
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Sonidos ambientales 🌧️
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. EXPANDED FULL MODAL MODE */}
      {displayMode === 'expanded' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Top Modal Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-900/50">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>Música & Spotify para Estudiar</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Modo Completo
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Escucha tus canciones o playlists preferidas mientras completas tus desafíos.
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setDisplayMode('compact');
                    playAudioEffect('click');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Cambiar a pantalla chiquita flotante"
                >
                  <Minimize2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Pantalla Chiquita</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    playAudioEffect('click');
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Playlists / Mi Spotify / Ambiente) */}
            <div className="bg-slate-950/60 p-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'presets', label: '🎧 Playlists Recomendadas', icon: Sparkles },
                  { id: 'custom', label: '🔗 Vincular mi Spotify', icon: ExternalLink },
                  { id: 'ambient', label: '🌧️ Sonidos de Fondo', icon: Sliders },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        playAudioEffect('click');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Current Track Label */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-xl shrink-0">
                <Radio className="w-3 h-3 animate-pulse" />
                <span className="truncate max-w-[140px]">{activePlaylistTitle}</span>
              </div>
            </div>

            {/* Main Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar">
              {/* Actual Embedded Spotify Player Iframe */}
              <div className="bg-slate-950 rounded-2xl p-2 sm:p-3 border border-slate-800 shadow-inner space-y-2">
                <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 font-bold flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Disc className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Reproductor Integrado Spotify</span>
                  </span>
                  <a
                    href={currentSpotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50"
                  >
                    <span>Abrir en Spotify App / Web</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="w-full h-80 sm:h-88 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg relative">
                  <iframe
                    src={embedSrcUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Music Player"
                    className="w-full h-full rounded-xl"
                  />
                </div>

                <div className="px-2 pt-1 text-[11px] text-slate-400 leading-relaxed font-medium flex items-center justify-between flex-wrap gap-2 border-t border-slate-900">
                  <span>
                    💡 <strong>Tip:</strong> Puedes vincular cualquier playlist o canción usando la pestaña <em>"Vincular mi Spotify"</em>.
                  </span>
                  <a
                    href={currentSpotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Escuchar en Spotify ↗
                  </a>
                </div>
              </div>

              {/* TAB 1: Presets Selection Grid */}
              {activeTab === 'presets' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Elige una Playlist Estudiantil Recomendada</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Haz clic para cambiar</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRESET_PLAYLISTS.map((pl) => {
                      const isSelected = currentSpotifyUrl === pl.spotifyUrl;
                      return (
                        <div
                          key={pl.id}
                          onClick={() => handleSelectPreset(pl)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group relative overflow-hidden ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-400 shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                          }`}
                        >
                          <img
                            src={pl.coverImage}
                            alt={pl.title}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                          />

                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider truncate">
                                {pl.category}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-0.5 shrink-0">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Activo</span>
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-extrabold text-white truncate group-hover:text-emerald-300 transition-colors">
                              {pl.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 line-clamp-1 font-medium">
                              {pl.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Custom Spotify URL / Link Integration */}
              {activeTab === 'custom' && (
                <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-5 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                      <span>Vincular y Guardar tus Playlists de Spotify</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Pega el enlace de tus canciones, álbumes o playlists favoritas de Spotify. ¡Se guardarán en esta plataforma para que siempre las tengas a la mano en tus sesiones de estudio!
                    </p>
                  </div>

                  <form onSubmit={handleApplyCustomUrl} className="space-y-3.5 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Nombre de tu Playlist o Canción:
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Mis Canciones Favoritas para Concentrarme 🎧"
                        value={customInputTitle}
                        onChange={(e) => setCustomInputTitle(e.target.value)}
                        className="w-full text-xs font-semibold text-white bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Enlace de Spotify (URL o URI):
                      </label>
                      <input
                        type="text"
                        placeholder="ej. https://open.spotify.com/playlist/37i9dQZF1DX8NTLI29MZaM..."
                        value={customInputUrl}
                        onChange={(e) => setCustomInputUrl(e.target.value)}
                        className="w-full text-xs font-mono text-white bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-600"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-emerald-400" />
                        <span>Quedará guardada en esta plataforma</span>
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Guardar y Reproducir</span>
                      </button>
                    </div>
                  </form>

                  {/* Saved User Playlists List */}
                  {savedUserPlaylists.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h5 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mis Playlists Guardadas en la Plataforma ({savedUserPlaylists.length})</span>
                      </h5>

                      <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar pr-1">
                        {savedUserPlaylists.map((pl) => {
                          const isSelected = currentSpotifyUrl === pl.spotifyUrl;
                          return (
                            <div
                              key={pl.id}
                              onClick={() => {
                                setCurrentSpotifyUrl(pl.spotifyUrl);
                                setActivePlaylistTitle(pl.title);
                                playAudioEffect('click');
                              }}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                  <Music className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h6 className="text-xs font-extrabold truncate text-white">
                                    {pl.title}
                                  </h6>
                                  <p className="text-[10px] font-mono text-slate-500 truncate">
                                    {pl.spotifyUrl}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isSelected ? (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                    <span>Sonando</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950">
                                    Cargar
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSavedPlaylist(pl.id, e)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                  title="Eliminar playlist guardada"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Ambient Sound Mixers (Rain, Cafe, Ocean, Fireplace) */}
              {activeTab === 'ambient' && (
                <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>Generador Sintetizado de Sonidos Ambientales</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mezcla frecuencias relajantes sintetizadas en tiempo real (lluvia, cafetería, olas y chimenea) para aislar el ruido exterior y enfocar tu mente.
                    </p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      ⚡ Combinaciones Rápida de Sonido:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          initOrResumeAudioCtx();
                          setRainVolume(65);
                          setCafeVolume(0);
                          setWavesVolume(0);
                          setFireVolume(0);
                          playAudioEffect('click');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800/80 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CloudRain className="w-3.5 h-3.5" />
                        <span>Lluvia Suave (65%)</span>
                      </button>

                      <button
                        onClick={() => {
                          initOrResumeAudioCtx();
                          setRainVolume(0);
                          setCafeVolume(60);
                          setWavesVolume(0);
                          setFireVolume(0);
                          playAudioEffect('click');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/80 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Cafetería Focus (60%)</span>
                      </button>

                      <button
                        onClick={() => {
                          initOrResumeAudioCtx();
                          setRainVolume(0);
                          setCafeVolume(0);
                          setWavesVolume(70);
                          setFireVolume(0);
                          playAudioEffect('click');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-800/80 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Wind className="w-3.5 h-3.5" />
                        <span>Olas de Mar (70%)</span>
                      </button>

                      <button
                        onClick={() => {
                          initOrResumeAudioCtx();
                          setRainVolume(0);
                          setCafeVolume(0);
                          setWavesVolume(0);
                          setFireVolume(65);
                          playAudioEffect('click');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Chimenea Cálida (65%)</span>
                      </button>
                    </div>
                  </div>

                  {/* Sliders List */}
                  <div className="space-y-3.5 pt-2">
                    {/* Rain Slider */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="flex items-center gap-2 text-sky-400">
                          <CloudRain className="w-4 h-4" />
                          <span>Lluvia Suave en la Ventana</span>
                        </span>
                        <span className="font-mono text-slate-400">{rainVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={rainVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRainVolume(val);
                          if (val > 0) initOrResumeAudioCtx();
                        }}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* Cafe Hum Slider */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="flex items-center gap-2 text-amber-400">
                          <Coffee className="w-4 h-4" />
                          <span>Ambiente de Cafetería Tranquila</span>
                        </span>
                        <span className="font-mono text-slate-400">{cafeVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cafeVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCafeVolume(val);
                          if (val > 0) initOrResumeAudioCtx();
                        }}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* Ocean Waves Slider */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="flex items-center gap-2 text-teal-400">
                          <Wind className="w-4 h-4" />
                          <span>Olas Marinas & Viento de Fondo</span>
                        </span>
                        <span className="font-mono text-slate-400">{wavesVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={wavesVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWavesVolume(val);
                          if (val > 0) initOrResumeAudioCtx();
                        }}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* Fireplace Slider */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="flex items-center gap-2 text-rose-400">
                          <Flame className="w-4 h-4" />
                          <span>Fuego & Crujido de Chimenea</span>
                        </span>
                        <span className="font-mono text-slate-400">{fireVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={fireVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFireVolume(val);
                          if (val > 0) initOrResumeAudioCtx();
                        }}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        initOrResumeAudioCtx();
                        setRainVolume(50);
                        playAudioEffect('click');
                      }}
                      className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 Probar Sonido Ahora</span>
                    </button>

                    <button
                      onClick={() => {
                        setRainVolume(0);
                        setCafeVolume(0);
                        setWavesVolume(0);
                        setFireVolume(0);
                        playAudioEffect('click');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Silenciar Todo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Música lista para acompañar tu sesión de estudio</span>
              </span>

              <button
                onClick={() => {
                  setDisplayMode('compact');
                  playAudioEffect('click');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pasar a Pantalla Chiquita Flotante</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
