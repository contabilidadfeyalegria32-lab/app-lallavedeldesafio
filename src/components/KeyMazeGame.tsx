import React, { useState, useEffect, useCallback } from 'react';
import { HighScore } from '../types';
import confetti from 'canvas-confetti';
import { playAudioEffect } from '../utils/audio';
import { TriviaGame } from './TriviaGame';
import { WordSearchGame } from './WordSearchGame';
import {
  Key, Gamepad2, Timer, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Sparkles, Coins, Award, Shield, Volume2, VolumeX, Flame, RefreshCw, Zap, Brain, Search
} from 'lucide-react';

interface KeyMazeGameProps {
  onEarnRewards: (xp: number, coins: number) => void;
  highScores: HighScore[];
  onAddHighScore: (score: HighScore) => void;
}


// Map Cell Types:
// 0 = Path, 1 = Wall, 2 = Coin (+20 pts), 3 = Chest (+60 pts), 4 = Key, 5 = Exit Gate, 6 = Trap (-5s), 7 = Shield Powerup
const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: Atrio del Estudiante 🏫',
    timeLimit: 45,
    xpReward: 200,
    coinReward: 80,
    startPos: { x: 1, y: 1 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 0, 1, 3, 0, 2, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 2, 1, 2, 0, 2, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 6, 0, 4, 0, 0, 2, 1],
      [1, 3, 1, 0, 1, 1, 1, 5, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  {
    id: 2,
    name: 'Nivel 2: Laberinto del Conocimiento 📚',
    timeLimit: 40,
    xpReward: 300,
    coinReward: 120,
    startPos: { x: 1, y: 1 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 1, 3, 0, 0, 2, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 2, 0, 6, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 7, 0, 0, 1, 4, 0, 0, 3, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 2, 6, 0, 0, 2, 0, 0, 5, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  {
    id: 3,
    name: 'Nivel 3: Desafío Mente Ágil ⚡',
    timeLimit: 35,
    xpReward: 450,
    coinReward: 180,
    startPos: { x: 1, y: 1 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 0, 1, 3, 0, 1, 2, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 0, 2, 0, 6, 0, 2, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 3, 0, 6, 0, 4, 0, 6, 0, 3, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 2, 0, 0, 1, 7, 1, 0, 0, 5, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  {
    id: 4,
    name: 'Nivel 4: La Cámara Suprema 👑',
    timeLimit: 30,
    xpReward: 600,
    coinReward: 250,
    startPos: { x: 1, y: 1 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 3, 0, 1, 2, 0, 1, 3, 0, 2, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 2, 1, 6, 0, 0, 6, 0, 2, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 2, 0, 4, 0, 2, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 3, 6, 0, 1, 7, 1, 0, 6, 2, 5, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  }
];

export const KeyMazeGame: React.FC<KeyMazeGameProps> = ({
  onEarnRewards,
  highScores,
  onAddHighScore,
}) => {
  const [activeGameMode, setActiveGameMode] = useState<'maze' | 'trivia' | 'pupiletras'>('maze');
  const [levelIdx, setLevelIdx] = useState(0);
  const [grid, setGrid] = useState<number[][]>([]);

  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [hasKey, setHasKey] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeLevel = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];

  // Sound trigger helper
  const playSound = (type: 'coin' | 'key' | 'chest' | 'trap' | 'win' | 'click' | 'powerup') => {
    if (soundEnabled) {
      playAudioEffect(type);
    }
  };

  // Start Level function
  const startLevel = (idx: number) => {
    const config = LEVELS[Math.min(idx, LEVELS.length - 1)];
    const mapCopy = config.map.map((row) => [...row]);

    setGrid(mapCopy);
    setPlayerPos({ ...config.startPos });
    setHasKey(false);
    setHasShield(false);
    setTimeLeft(config.timeLimit);
    setGameState('playing');
    setStatusMessage('¡Nivel Iniciado! Encuentra la Llave Dorada 🗝️ para abrir la Puerta de Salida 🚪.');
    playSound('click');
  };

  // Countdown Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          setStatusMessage('💀 ¡Tiempo Agotado! Inténtalo de nuevo.');
          playSound('trap');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Movement Logic
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (gameState !== 'playing') return;

      setPlayerPos((currPos) => {
        const nx = currPos.x + dx;
        const ny = currPos.y + dy;

        if (!grid[ny] || grid[ny][nx] === undefined || grid[ny][nx] === 1) {
          return currPos; // Hit wall
        }

        const cellType = grid[ny][nx];
        const newGrid = grid.map((r) => [...r]);

        if (cellType === 2) {
          // Coin
          setScore((s) => s + 20);
          newGrid[ny][nx] = 0;
          playSound('coin');
          setStatusMessage('🪙 +20 Puntos por Moneda');
        } else if (cellType === 3) {
          // Chest
          setScore((s) => s + 60);
          newGrid[ny][nx] = 0;
          playSound('chest');
          setStatusMessage('🎁 ¡Cofre de Gemas Encontrado! +60 Puntos');
        } else if (cellType === 4) {
          // Key
          setHasKey(true);
          newGrid[ny][nx] = 0;
          playSound('key');
          setStatusMessage('🗝️ ¡TIENES LA LLAVE DORADA! Corre a la Puerta 🚪');
        } else if (cellType === 7) {
          // Shield
          setHasShield(true);
          newGrid[ny][nx] = 0;
          playSound('powerup');
          setStatusMessage('🛡️ ¡Escudo Protector Activado!');
        } else if (cellType === 6) {
          // Trap
          if (hasShield) {
            setHasShield(false);
            newGrid[ny][nx] = 0;
            playSound('powerup');
            setStatusMessage('🛡️ ¡Tu Escudo bloqueó la Trampa!');
          } else {
            setScore((s) => Math.max(0, s - 25));
            setTimeLeft((t) => Math.max(0, t - 5));
            playSound('trap');
            setStatusMessage('⚠️ ¡Caíste en una Trampa! -5 Segundos');
          }
        } else if (cellType === 5) {
          // Exit
          if (hasKey) {
            setGameState('won');
            const finalScore = score + timeLeft * 10 + activeLevel.xpReward;
            setScore(finalScore);

            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#059669', '#4f46e5', '#f59e0b', '#ec4899', '#3b82f6']
            });

            playSound('win');
            onEarnRewards(activeLevel.xpReward, activeLevel.coinReward);

            onAddHighScore({
              id: Date.now().toString(),
              playerName: 'Alex Rivera (Tú)',
              score: finalScore,
              timeSeconds: activeLevel.timeLimit - timeLeft,
              levelReached: activeLevel.id,
              date: new Date().toISOString().split('T')[0],
            });

            setStatusMessage(`🎉 ¡NIVEL SUPERADO! Ganaste +${activeLevel.xpReward} XP y +${activeLevel.coinReward} 🪙`);
          } else {
            setStatusMessage('🔒 La Puerta de Salida está bloqueada. Busca la Llave Dorada 🗝️ primero.');
          }
        }

        setGrid(newGrid);
        return { x: nx, y: ny };
      });
    },
    [gameState, grid, hasKey, hasShield, score, timeLeft, activeLevel, soundEnabled]
  );

  // Cell Click Movement (Allow direct tap/click on adjacent cells)
  const handleCellClick = (rIdx: number, cIdx: number) => {
    if (gameState !== 'playing') return;
    const dx = cIdx - playerPos.x;
    const dy = rIdx - playerPos.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      movePlayer(dx, dy);
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Game Mode Switcher Tabs - Soft Warm Pastel Styling */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-amber-100/80 p-2 rounded-2xl border border-amber-300 max-w-xl mx-auto shadow-xs">
        <button
          onClick={() => setActiveGameMode('maze')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeGameMode === 'maze'
              ? 'bg-amber-400 text-amber-950 shadow-xs scale-102 border border-amber-500'
              : 'text-slate-700 hover:text-slate-900 hover:bg-amber-200/50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>🕹️ Laberinto 2D</span>
        </button>

        <button
          onClick={() => setActiveGameMode('trivia')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeGameMode === 'trivia'
              ? 'bg-indigo-600 text-white shadow-xs scale-102'
              : 'text-slate-700 hover:text-slate-900 hover:bg-amber-200/50'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-300" />
          <span>🧠 Trivia Estudiantil</span>
        </button>

        <button
          onClick={() => setActiveGameMode('pupiletras')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeGameMode === 'pupiletras'
              ? 'bg-amber-500 text-slate-950 shadow-xs scale-102 border border-amber-600'
              : 'text-slate-700 hover:text-slate-900 hover:bg-amber-200/50'
          }`}
        >
          <Search className="w-4 h-4 text-slate-900" />
          <span>🔤 Pupiletras</span>
        </button>
      </div>

      {activeGameMode === 'trivia' ? (
        <TriviaGame onEarnRewards={onEarnRewards} />
      ) : activeGameMode === 'pupiletras' ? (
        <WordSearchGame onEarnRewards={onEarnRewards} />
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Game Header Banner - Soft Warm Yellow Pastel */}

      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-50 text-slate-900 rounded-2xl p-6 shadow-xs border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 border border-amber-300 text-xs font-bold mb-2">
            <Key className="w-3.5 h-3.5 text-amber-700" />
            <span>Mini-Juego Oficial Interactivo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>El Laberinto de la Llave</span>
            <span className="text-xs bg-amber-300 text-amber-950 border border-amber-400 px-2.5 py-0.5 rounded-full font-black">Arcade</span>
          </h2>
          <p className="text-xs text-slate-700 font-medium mt-1 max-w-xl leading-relaxed">
            Navega por los niveles, esquiva trampas, junta tesoros y desbloquea el portal de salida para subir de nivel en la plataforma.
          </p>
        </div>

        {/* Level Selectors & Sound Toggle */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Efectos de Sonido'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <select
            value={levelIdx}
            onChange={(e) => {
              const newIndex = parseInt(e.target.value, 10);
              setLevelIdx(newIndex);
              startLevel(newIndex);
            }}
            className="bg-slate-800 text-white text-xs font-bold border border-slate-700 rounded-xl px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {LEVELS.map((lvl, idx) => (
              <option key={lvl.id} value={idx}>
                {lvl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HUD Info Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            ⏱️
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Tiempo</span>
            <span className={`text-base font-extrabold font-mono ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-3 rounded-2xl border border-indigo-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
            ⭐
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">Puntos</span>
            <span className="text-base font-extrabold font-mono text-white">{score} pts</span>
          </div>
        </div>

        <div className="bg-emerald-900 text-white p-3 rounded-2xl border border-emerald-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
            🔑
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">Llave Dorada</span>
            <span className={`text-xs font-extrabold ${hasKey ? 'text-amber-300' : 'text-slate-400'}`}>
              {hasKey ? '¡Conseguida!' : 'Pendiente'}
            </span>
          </div>
        </div>

        <div className="bg-rose-900 text-white p-3 rounded-2xl border border-rose-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
            🛡️
          </div>
          <div>
            <span className="text-[10px] text-rose-300 font-bold uppercase block">Escudo</span>
            <span className={`text-xs font-extrabold ${hasShield ? 'text-emerald-300' : 'text-slate-400'}`}>
              {hasShield ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Game Stage & Interactive Maze */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Maze Grid View */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="relative bg-slate-950 p-4 sm:p-6 rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden w-full max-w-lg flex flex-col items-center min-h-[340px] justify-center">
            
            {/* Status Banner */}
            {statusMessage && gameState === 'playing' && (
              <div className="w-full mb-3 px-3 py-1.5 bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs font-bold rounded-xl text-center backdrop-blur-xs animate-in fade-in">
                {statusMessage}
              </div>
            )}

            {/* Active Grid */}
            {grid.length > 0 && (
              <div
                className="grid gap-1 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                  width: '100%',
                  maxWidth: '380px',
                }}
              >
                {grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isPlayer = playerPos.x === cIdx && playerPos.y === rIdx;
                    const isAdjacent =
                      Math.abs(cIdx - playerPos.x) + Math.abs(rIdx - playerPos.y) === 1;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-base sm:text-lg font-bold transition-all cursor-pointer relative ${
                          cell === 1
                            ? 'bg-slate-800 border border-slate-700/80 shadow-xs'
                            : isAdjacent && gameState === 'playing'
                            ? 'bg-slate-900 border border-indigo-500/50 hover:bg-indigo-900/40 hover:scale-105'
                            : 'bg-slate-950/80 border border-slate-900'
                        }`}
                      >
                        {isPlayer ? (
                          <div className="relative flex items-center justify-center">
                            <span className="text-xl animate-bounce z-10">🏃</span>
                            {hasShield && (
                              <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
                            )}
                          </div>
                        ) : cell === 2 ? (
                          <span className="text-amber-300 drop-shadow-sm">🪙</span>
                        ) : cell === 3 ? (
                          <span className="text-amber-400 animate-pulse">🎁</span>
                        ) : cell === 4 ? (
                          <span className="text-amber-300 animate-bounce">🗝️</span>
                        ) : cell === 5 ? (
                          <span className={hasKey ? 'text-emerald-400 text-xl font-extrabold animate-pulse' : 'opacity-40'}>
                            🚪
                          </span>
                        ) : cell === 6 ? (
                          <span className="text-rose-500">🔥</span>
                        ) : cell === 7 ? (
                          <span className="text-emerald-400 animate-pulse">🛡️</span>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Overlay Start & End Game Screen */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in z-20">
                {gameState === 'idle' && (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-slate-950 flex items-center justify-center text-3xl font-bold shadow-xl">
                      🔑
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold">{activeLevel.name}</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xs">
                        Recoge monedas, encuentra la llave dorada y escapa antes de que venza el tiempo.
                      </p>
                    </div>
                    <button
                      onClick={() => startLevel(levelIdx)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>¡Jugar Nivel {activeLevel.id}!</span>
                    </button>
                  </>
                )}

                {gameState === 'won' && (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl font-bold shadow-xl">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-emerald-400">¡Nivel Superado!</h3>
                      <p className="text-xs text-slate-300 mt-1">{statusMessage}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {levelIdx < LEVELS.length - 1 ? (
                        <button
                          onClick={() => {
                            const next = levelIdx + 1;
                            setLevelIdx(next);
                            startLevel(next);
                          }}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
                        >
                          Siguiente Nivel ➔
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setLevelIdx(0);
                            startLevel(0);
                          }}
                          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
                        >
                          🔄 Reiniciar Todo el Juego
                        </button>
                      )}
                    </div>
                  </>
                )}

                {gameState === 'lost' && (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
                      💀
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-rose-400">¡Fin de la Misión!</h3>
                      <p className="text-xs text-slate-300 mt-1">{statusMessage}</p>
                    </div>
                    <button
                      onClick={() => startLevel(levelIdx)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Reintentar Nivel
                    </button>
                  </>
                )}
              </div>
            )}

          </div>

          {/* Touch D-Pad for Mobile & Touchpad Users */}
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Controles Táctiles (o Teclado W, A, S, D / Flechas ⬆️⬇️⬅️➡️)
            </span>
            <button
              onClick={() => movePlayer(0, -1)}
              className="w-12 h-12 bg-slate-900 active:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-800"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => movePlayer(-1, 0)}
                className="w-12 h-12 bg-slate-900 active:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                className="w-12 h-12 bg-slate-900 active:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-800"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
              <button
                onClick={() => movePlayer(1, 0)}
                className="w-12 h-12 bg-slate-900 active:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-800"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboard & Guide */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* High Scores Leaderboard */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Ranking de Jugadores</span>
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                Top Semanal
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {highScores.map((hs, idx) => (
                <div
                  key={hs.id}
                  className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{hs.playerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Nivel {hs.levelReached}</span>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-indigo-600">
                    {hs.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Item Legend */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
              Guía de Elementos del Juego:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-1"><span>🏃</span><span>Jugador</span></div>
              <div className="flex items-center gap-1"><span>🗝️</span><span>Llave Dorada</span></div>
              <div className="flex items-center gap-1"><span>🚪</span><span>Puerta Salida</span></div>
              <div className="flex items-center gap-1"><span>🪙</span><span>Moneda (+20 pts)</span></div>
              <div className="flex items-center gap-1"><span>🎁</span><span>Cofre (+60 pts)</span></div>
              <div className="flex items-center gap-1"><span>🛡️</span><span>Escudo</span></div>
              <div className="flex items-center gap-1"><span>🔥</span><span>Trampa (-5s)</span></div>
              <div className="flex items-center gap-1"><span>🧱</span><span>Pared</span></div>
            </div>
          </div>

        </div>

      </div>
      </div>
      )}

    </div>
  );
};



