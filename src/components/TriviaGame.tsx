import React, { useState } from 'react';
import {
  Brain, Trophy, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Zap, HelpCircle, Flame, Plus, Layers, Lightbulb, Share2, Award, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioEffect } from '../utils/audio';

interface TriviaGameProps {
  onEarnRewards: (xp: number, coins: number) => void;
}

interface Question {
  id: number;
  question: string;
  category: 'Escuela' | 'Ciencia' | 'Gaming & Tech' | 'Cultura' | 'Lógica';
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  hint?: string;
  author?: string;
}

const DEFAULT_TRIVIA_QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Cuál es el planeta más grande de nuestro sistema solar?',
    category: 'Ciencia',
    options: ['Marte', 'Júpiter', 'Saturno', 'Neptuno'],
    correctAnswer: 1,
    explanation: 'Júpiter es un gigante gaseoso y el planeta de mayor tamaño en el sistema solar.',
    hint: 'Es un gigante gaseoso famoso por su Gran Mancha Roja.',
  },
  {
    id: 2,
    question: '¿Qué lenguaje de programación se utiliza ampliamente para crear páginas web interactivas?',
    category: 'Gaming & Tech',
    options: ['Python', 'C++', 'JavaScript', 'SQL'],
    correctAnswer: 2,
    explanation: 'JavaScript es el lenguaje estándar de la web ejecutado en todos los navegadores modernos.',
    hint: 'Forma la trinidad de la web junto con HTML y CSS.',
  },
  {
    id: 3,
    question: '¿Cuál es la fórmula química del agua?',
    category: 'Escuela',
    options: ['CO2', 'H2O', 'NaCl', 'O2'],
    correctAnswer: 1,
    explanation: 'El agua está compuesta por dos átomos de Hidrógeno y uno de Oxígeno (H2O).',
    hint: 'Tiene 2 átomos de hidrógeno y 1 de oxígeno.',
  },
  {
    id: 4,
    question: '¿Qué organelo celular es conocido como la "central de energía" de la célula?',
    category: 'Escuela',
    options: ['Núcleo', 'Ribosoma', 'Mitocondria', 'Aparato de Golgi'],
    correctAnswer: 2,
    explanation: 'La mitocondria produce ATP, la principal molécula de energía celular.',
    hint: 'Sintetiza la molécula ATP para darle energía a la célula.',
  },
  {
    id: 5,
    question: '¿Cuál es el valor aproximado del número Pi (π)?',
    category: 'Lógica',
    options: ['2.71', '3.1416', '1.618', '9.81'],
    correctAnswer: 1,
    explanation: 'Pi (π) representa la relación entre la circunferencia de un círculo y su diámetro (~3.14159).',
    hint: 'Se celebra mundialmente el 14 de marzo (3/14).',
  },
  {
    id: 6,
    question: 'En el desarrollo de software, ¿qué significa "HTML"?',
    category: 'Gaming & Tech',
    options: ['HyperText Markup Language', 'High Tech Machine Language', 'Home Tool Markup Level', 'Hyper Transfer Machine Link'],
    correctAnswer: 0,
    explanation: 'HTML significa HyperText Markup Language y define la estructura de las páginas web.',
    hint: 'Comienza con "HyperText".',
  },
  {
    id: 7,
    question: '¿En qué año llegó el ser humano por primera vez a la Luna en la misión Apolo 11?',
    category: 'Cultura',
    options: ['1955', '1969', '1975', '1982'],
    correctAnswer: 1,
    explanation: 'Neil Armstrong pisó la Luna el 20 de julio de 1969 pronunciando su famosa frase.',
    hint: 'Fue a finales de la década de los 60s.',
  },
  {
    id: 8,
    question: '¿Cuál es la velocidad aproximada de la luz en el vacío?',
    category: 'Ciencia',
    options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
    correctAnswer: 0,
    explanation: 'La luz viaja a aproximadamente 300,000 kilómetros por segundo (c ≈ 3x10^8 m/s).',
    hint: 'Recorre la distancia Tierra-Luna en aproximadamente 1.3 segundos.',
  }
];

export const TriviaGame: React.FC<TriviaGameProps> = ({ onEarnRewards }) => {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_TRIVIA_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Wildcards state
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  // Add question modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQCategory, setNewQCategory] = useState<'Escuela' | 'Ciencia' | 'Gaming & Tech' | 'Cultura' | 'Lógica'>('Escuela');
  const [newQOpt0, setNewQOpt0] = useState('');
  const [newQOpt1, setNewQOpt1] = useState('');
  const [newQOpt2, setNewQOpt2] = useState('');
  const [newQOpt3, setNewQOpt3] = useState('');
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState('');

  const q = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || disabledOptions.includes(idx)) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === q.correctAnswer) {
      playAudioEffect('win');
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Streak Bonus
      const streakBonus = newStreak > 1 ? newStreak * 15 : 0;
      const pointsEarned = 50 + streakBonus;

      setScore((s) => s + pointsEarned);
      setCorrectAnswersCount((c) => c + 1);

      if (newStreak >= 3) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#3b82f6', '#10b981'],
        });
      }
    } else {
      playAudioEffect('trap');
      setStreakCount(0);
    }
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswered) return;
    playAudioEffect('click');
    setFiftyFiftyUsed(true);

    // Pick 2 incorrect options to disable
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.correctAnswer);
    // Shuffle wrong indices and take first 2
    const toDisable = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setDisabledOptions(toDisable);
  };

  const handleUseHint = () => {
    if (hintUsed || isAnswered) return;
    playAudioEffect('click');
    setHintUsed(true);
    setShowHintText(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setDisabledOptions([]);
      setShowHintText(false);
      playAudioEffect('click');
    } else {
      setGameFinished(true);
      playAudioEffect('win');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#3b82f6', '#f59e0b', '#10b981']
      });

      const totalXp = correctAnswersCount * 45 + maxStreak * 20 + 100;
      const totalCoins = correctAnswersCount * 15 + maxStreak * 10 + 30;
      onEarnRewards(totalXp, totalCoins);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreakCount(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setGameFinished(false);
    setFiftyFiftyUsed(false);
    setDisabledOptions([]);
    setHintUsed(false);
    setShowHintText(false);
    playAudioEffect('click');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newQOpt0 || !newQOpt1 || !newQOpt2 || !newQOpt3) return;

    const createdQ: Question = {
      id: Date.now(),
      question: newQText.trim(),
      category: newQCategory,
      options: [newQOpt0, newQOpt1, newQOpt2, newQOpt3],
      correctAnswer: newQCorrect,
      explanation: newQExplanation.trim() || '¡Excelente pregunta agregada por un estudiante!',
      author: 'Tú',
    };

    setQuestions((prev) => [...prev, createdQ]);
    playAudioEffect('win');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setShowAddModal(false);
    setNewQText('');
    setNewQOpt0('');
    setNewQOpt1('');
    setNewQOpt2('');
    setNewQOpt3('');
    setNewQExplanation('');
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>Trivia Estudiantil & Ciencia 🧠</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Demuestra tus Conocimientos
          </h3>
          <p className="text-xs text-slate-400">
            Responde correctamente, activa comodines y acumula rachas de combo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Combo Streak */}
          <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-2 rounded-2xl border border-amber-500/40">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <div>
              <span className="text-[10px] text-amber-200 font-bold uppercase block leading-none">Racha</span>
              <span className="text-sm font-black font-mono text-amber-300">{streakCount}x</span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Puntos</span>
            <span className="text-lg font-black font-mono text-amber-300">{score} pts</span>
          </div>

          {/* Add Question Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-transform hover:scale-105 cursor-pointer"
            title="Crear tu propia pregunta"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!gameFinished ? (
        <div className="space-y-6 relative z-10">
          
          {/* Category, Question Number & Wildcards */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-400 font-mono">
                Pregunta {currentIdx + 1} de {questions.length}
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                {q.category}
              </span>
              {q.author && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Por: {q.author}
                </span>
              )}
            </div>

            {/* Wildcard Power-ups */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUseFiftyFifty}
                disabled={fiftyFiftyUsed || isAnswered}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                  fiftyFiftyUsed
                    ? 'bg-slate-800 text-slate-600 border-slate-700 line-through'
                    : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border-indigo-500/50 shadow-xs'
                }`}
              >
                <span>⚡ 50/50</span>
              </button>

              <button
                onClick={handleUseHint}
                disabled={hintUsed || isAnswered}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                  hintUsed
                    ? 'bg-slate-800 text-slate-600 border-slate-700 line-through'
                    : 'bg-amber-900/80 hover:bg-amber-800 text-amber-200 border-amber-500/50 shadow-xs'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pista</span>
              </button>
            </div>
          </div>

          {/* Hint Card if activated */}
          {showHintText && q.hint && (
            <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-200 flex items-center gap-2 animate-in fade-in">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Pista del Sabio:</strong> {q.hint}</span>
            </div>
          )}

          {/* Question Prompt */}
          <h4 className="text-lg sm:text-xl font-bold leading-relaxed text-white">
            {q.question}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              const isDisabled = disabledOptions.includes(idx);
              let btnStyle = 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700/80';

              if (isDisabled) {
                btnStyle = 'bg-slate-900 text-slate-600 border-slate-800/50 opacity-30 cursor-not-allowed line-through';
              } else if (isAnswered) {
                if (idx === q.correctAnswer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-lg font-black scale-[1.02]';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-600 text-white border-rose-400 shadow-md font-bold';
                } else {
                  btnStyle = 'bg-slate-800/40 text-slate-500 border-slate-800 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered || isDisabled}
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {isAnswered && idx === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-amber-300" />}
                  {isAnswered && idx === selectedOption && idx !== q.correctAnswer && <XCircle className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="bg-indigo-950/90 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  <span>Explicación Educativa:</span>
                </span>

                {selectedOption === q.correctAnswer && (
                  <span className="text-[11px] font-black text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    ¡Correcto! +{50 + (streakCount > 1 ? streakCount * 15 : 0)} pts
                  </span>
                )}
              </div>

              <p className="text-slate-200 leading-relaxed font-medium">{q.explanation}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
                >
                  <span>{currentIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Finish Game Summary View */
        <div className="text-center py-8 space-y-6 animate-in fade-in relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-emerald-400 text-slate-950 flex items-center justify-center text-4xl mx-auto font-black shadow-2xl">
            🏆
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl sm:text-3xl font-black text-white">¡Trivia Completada con Éxito!</h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Respondiste correctamente <strong className="text-emerald-400">{correctAnswersCount} de {questions.length}</strong> preguntas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntuación</span>
              <span className="text-2xl font-black font-mono text-amber-300">{score} pts</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Racha Máxima</span>
              <span className="text-xl font-black font-mono text-amber-400">{maxStreak}x 🔥</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Recompensas</span>
              <span className="text-xs font-black text-emerald-400">+{correctAnswersCount * 45 + maxStreak * 20 + 100} XP</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-xl inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Nuevamente</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal to Add Custom Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateQuestion} className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <span>Agregar Nueva Pregunta de Trivia</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Pregunta:</label>
                <input
                  type="text"
                  placeholder="Ej. ¿En qué continente se encuentra el desierto del Sahara?"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Categoría:</label>
                <select
                  value={newQCategory}
                  onChange={(e) => setNewQCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Escuela">Escuela</option>
                  <option value="Ciencia">Ciencia</option>
                  <option value="Gaming & Tech">Gaming & Tech</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Lógica">Lógica</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-300">Opciones de Respuesta:</label>
                <input
                  type="text"
                  placeholder="Opción A"
                  value={newQOpt0}
                  onChange={(e) => setNewQOpt0(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Opción B"
                  value={newQOpt1}
                  onChange={(e) => setNewQOpt1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Opción C"
                  value={newQOpt2}
                  onChange={(e) => setNewQOpt2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Opción D"
                  value={newQOpt3}
                  onChange={(e) => setNewQOpt3(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Respuesta Correcta:</label>
                <select
                  value={newQCorrect}
                  onChange={(e) => setNewQCorrect(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value={0}>Opción A</option>
                  <option value={1}>Opción B</option>
                  <option value={2}>Opción C</option>
                  <option value={3}>Opción D</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Explicación Educativa:</label>
                <textarea
                  rows={2}
                  placeholder="Breve explicación para cuando los estudiantes respondan..."
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md"
              >
                Guardar Pregunta
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
