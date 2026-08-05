import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playAudioEffect } from '../utils/audio';
import {
  Sparkles, RefreshCw, Trophy, CheckCircle2, RotateCcw, HelpCircle, Search, Flame, Award
} from 'lucide-react';

interface WordSearchGameProps {
  onEarnRewards: (xp: number, coins: number) => void;
}

interface TargetWord {
  word: string;
  category: string;
  found: boolean;
  cells?: { r: number; c: number }[];
}

interface CategoryTheme {
  name: string;
  icon: string;
  words: string[];
}

const CATEGORIES: CategoryTheme[] = [
  {
    name: 'Ciencia & Naturaleza',
    icon: '🔬',
    words: ['FOTOSINTESIS', 'GRAVEDAD', 'CELULA', 'MOLECULA', 'ECOSISTEMA', 'ATOMO', 'ENERGIA', 'NEURONA', 'GENETICA', 'OXIGENO']
  },
  {
    name: 'Matemáticas & Lógica',
    icon: '📐',
    words: ['PITAGORAS', 'ALGEBRA', 'GEOMETRIA', 'VECTOR', 'MATRIZ', 'ECUACION', 'ANGULO', 'FRACCION', 'TANGENTE', 'POLIGONO']
  },
  {
    name: 'Tecnología & Futuro',
    icon: '💻',
    words: ['ALGORITMO', 'SOFTWARE', 'HARDWARE', 'ROBOTICA', 'INTERNET', 'SERVIDOR', 'SISTEMA', 'CODIGO', 'INTERFAZ', 'MEMORIA']
  },
  {
    name: 'Geografía & Historia',
    icon: '🌍',
    words: ['AMAZONAS', 'EVEREST', 'CULTURA', 'PLANETA', 'OCEANO', 'DESIERTO', 'IMPERIO', 'HISTORIA', 'CIVILIDAD', 'VOLCAN']
  }
];

// Directions: [dRow, dCol]
const DIRECTIONS = [
  [0, 1],   // Right
  [1, 0],   // Down
  [1, 1],   // Diagonal Down-Right
  [-1, 1],  // Diagonal Up-Right
  [0, -1],  // Left
  [-1, 0],  // Up
];

export const WordSearchGame: React.FC<WordSearchGameProps> = ({ onEarnRewards }) => {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(10); // 10x10 grid
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetWords, setTargetWords] = useState<TargetWord[]>([]);
  
  // Selection state
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // Found words highlighting coordinates map key: `${r}-${c}` -> color index or boolean
  const [foundCellMap, setFoundCellMap] = useState<Record<string, string>>({});

  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const colors = [
    'bg-emerald-500 text-white border-emerald-600',
    'bg-amber-500 text-slate-950 border-amber-600',
    'bg-indigo-500 text-white border-indigo-600',
    'bg-rose-500 text-white border-rose-600',
    'bg-purple-500 text-white border-purple-600',
    'bg-cyan-500 text-slate-950 border-cyan-600',
    'bg-orange-500 text-white border-orange-600',
    'bg-pink-500 text-white border-pink-600',
  ];

  // Generate pupiletras grid
  const generateGrid = useCallback(() => {
    const size = gridSize;
    const cat = CATEGORIES[selectedCategoryIdx];
    // Select 6-8 words from the category
    const pool = [...cat.words].sort(() => Math.random() - 0.5).slice(0, 6);

    const newGrid: string[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => '')
    );

    const placedTargetWords: TargetWord[] = [];
    const cellColorAssignments: Record<string, string> = {};

    pool.forEach((wordStr, wordIdx) => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startR = Math.floor(Math.random() * size);
        const startC = Math.floor(Math.random() * size);

        const endR = startR + dir[0] * (wordStr.length - 1);
        const endC = startC + dir[1] * (wordStr.length - 1);

        if (endR >= 0 && endR < size && endC >= 0 && endC < size) {
          // Check if path is free or matching existing letters
          let canPlace = true;
          for (let i = 0; i < wordStr.length; i++) {
            const r = startR + dir[0] * i;
            const c = startC + dir[1] * i;
            if (newGrid[r][c] !== '' && newGrid[r][c] !== wordStr[i]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            const wordCells: { r: number; c: number }[] = [];
            for (let i = 0; i < wordStr.length; i++) {
              const r = startR + dir[0] * i;
              const c = startC + dir[1] * i;
              newGrid[r][c] = wordStr[i];
              wordCells.push({ r, c });
            }

            placedTargetWords.push({
              word: wordStr,
              category: cat.name,
              found: false,
              cells: wordCells,
            });
            placed = true;
          }
        }
      }
    });

    // Fill remaining empty cells with random letters
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
    setTargetWords(placedTargetWords);
    setFoundCellMap({});
    setStartCell(null);
    setCurrentCell(null);
    setIsMouseDown(false);
    setTimer(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setHintMessage(null);
  }, [gridSize, selectedCategoryIdx]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  // Calculate straight line cells from startCell to currentCell
  const getSelectedCells = useCallback((): { r: number; c: number }[] => {
    if (!startCell || !currentCell) return [];
    const dr = currentCell.r - startCell.r;
    const dc = currentCell.c - startCell.c;

    if (dr === 0 && dc === 0) return [startCell];

    // Must be straight horizontal, vertical, or 45-deg diagonal
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    if (dr !== 0 && dc !== 0 && absDr !== absDc) {
      // Not a straight line, just return startCell
      return [startCell];
    }

    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    const steps = Math.max(absDr, absDc);
    const line: { r: number; c: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      line.push({
        r: startCell.r + stepR * i,
        c: startCell.c + stepC * i,
      });
    }

    return line;
  }, [startCell, currentCell]);

  const selectedCells = getSelectedCells();
  const selectedCellKeys = new Set(selectedCells.map((cell) => `${cell.r}-${cell.c}`));

  // Handle cell interactions
  const handleCellMouseDown = (r: number, c: number) => {
    if (isCompleted) return;
    if (!isTimerRunning) setIsTimerRunning(true);
    setIsMouseDown(true);
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    playAudioEffect('click');
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (isMouseDown) {
      setCurrentCell({ r, c });
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown || !startCell) return;
    setIsMouseDown(false);

    // Build the string formed by selection
    const selection = selectedCells.map((cell) => grid[cell.r]?.[cell.c] || '').join('');
    const reversedSelection = selection.split('').reverse().join('');

    // Check if matching any unfound target word
    const matchedWordIdx = targetWords.findIndex(
      (tw) => !tw.found && (tw.word === selection || tw.word === reversedSelection)
    );

    if (matchedWordIdx !== -1) {
      // MATCH FOUND!
      playAudioEffect('coin');
      const matchedWord = targetWords[matchedWordIdx];
      const colorClass = colors[matchedWordIdx % colors.length];

      // Update target words
      const updatedTargets = [...targetWords];
      updatedTargets[matchedWordIdx] = { ...matchedWord, found: true };
      setTargetWords(updatedTargets);

      // Add to found cells map
      const newFoundMap = { ...foundCellMap };
      selectedCells.forEach((cell) => {
        newFoundMap[`${cell.r}-${cell.c}`] = colorClass;
      });
      setFoundCellMap(newFoundMap);

      setHintMessage(`¡Encontraste "${matchedWord.word}"! 🎉`);
      setTimeout(() => setHintMessage(null), 2500);

      // Check for all words found
      const remainingUnfound = updatedTargets.filter((t) => !t.found).length;
      if (remainingUnfound === 0) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        playAudioEffect('win');

        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // fallback
        }

        const xpGain = 200 + targetWords.length * 30;
        const coinGain = 80 + targetWords.length * 15;
        onEarnRewards(xpGain, coinGain);
      }
    }

    setStartCell(null);
    setCurrentCell(null);
  };

  // Provide a hint
  const handleGiveHint = () => {
    const unfound = targetWords.find((t) => !t.found);
    if (!unfound || !unfound.cells || unfound.cells.length === 0) return;

    playAudioEffect('click');
    const firstCell = unfound.cells[0];
    setHintMessage(
      `💡 Pista: "${unfound.word}" inicia en la fila ${firstCell.r + 1}, columna ${firstCell.c + 1} (${grid[firstCell.r][firstCell.c]})`
    );
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 select-none"
      onMouseUp={handleMouseUp}
    >
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-600/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span>Agilidad Mental y Vocabulario Académico</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Pupiletras Estudiantil</span>
            <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-black">
              Arcade
            </span>
          </h2>
          <p className="text-xs text-amber-200/90 font-medium mt-1 max-w-xl leading-relaxed">
            Arrastra o haz clic desde la primera letra hasta la última para encontrar las palabras ocultas en la sopa de letras.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleGiveHint}
            disabled={isCompleted}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl transition-all font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Pista</span>
          </button>

          <button
            onClick={generateGrid}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Nuevo Tablero</span>
          </button>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mr-1">
          Categoría:
        </span>
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategoryIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              selectedCategoryIdx === idx
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            ⏱️
          </div>
          <div>
            <span className="text-[10px] text-amber-800 font-bold uppercase block">
              Tiempo
            </span>
            <span className="text-base font-extrabold font-mono text-amber-950">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
            🔍
          </div>
          <div>
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">
              Encontradas
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-950">
              {targetWords.filter((w) => w.found).length} / {targetWords.length}
            </span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold shadow-xs">
            🏆
          </div>
          <div>
            <span className="text-[10px] text-indigo-800 font-bold uppercase block">
              Recompensa
            </span>
            <span className="text-base font-extrabold font-mono text-indigo-950">
              +{200 + targetWords.length * 30} XP
            </span>
          </div>
        </div>
      </div>

      {/* Hint Banner Alert */}
      {hintMessage && (
        <div className="bg-amber-100 border border-amber-300 text-amber-950 px-4 py-2.5 rounded-xl text-xs font-bold animate-in fade-in duration-150 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{hintMessage}</span>
        </div>
      )}

      {/* Main Game Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Word Search Grid (8 cols) */}
        <div className="lg:col-span-8 flex justify-center bg-slate-900 p-4 sm:p-6 rounded-3xl border-2 border-slate-800 shadow-inner overflow-x-auto">
          <div
            className="grid gap-1.5 sm:gap-2 max-w-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const cellKey = `${r}-${c}`;
                const isSelected = selectedCellKeys.has(cellKey);
                const foundColor = foundCellMap[cellKey];

                return (
                  <button
                    key={cellKey}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-black text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer border select-none ${
                      foundColor
                        ? `${foundColor} shadow-xs scale-98 font-black`
                        : isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-300 ring-2 ring-amber-300 font-black scale-105 z-10'
                        : 'bg-slate-800 text-slate-200 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Target Words List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Palabras a Buscar</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                {targetWords.length}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {targetWords.map((tw, idx) => {
              const colorClass = colors[idx % colors.length];

              return (
                <div
                  key={tw.word}
                  className={`p-2.5 rounded-xl border transition-all text-xs font-bold flex items-center justify-between ${
                    tw.found
                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 line-through opacity-80'
                      : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <span className="tracking-wider">{tw.word}</span>
                  {tw.found ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      {isCompleted && (
        <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 text-2xl shadow-md mx-auto">
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-950">
              ¡Felicidades! Completaste la Sopa de Letras
            </h3>
            <p className="text-xs text-amber-900 font-medium mt-1">
              Encontraste las {targetWords.length} palabras educativas en un tiempo récord de{' '}
              <strong>{formatTime(timer)}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-amber-300 shadow-xs text-xs font-bold text-slate-800">
            <span>🎉 Recompensa: +{200 + targetWords.length * 30} XP</span>
            <span className="text-amber-300">|</span>
            <span>🪙 +{80 + targetWords.length * 15} Monedas</span>
          </div>

          <div className="pt-2">
            <button
              onClick={generateGrid}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Siguiente Sopa de Letras</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
