import React, { useState } from 'react';
import { Challenge, ChallengeCategory, ChallengeFrequency } from '../types';
import confetti from 'canvas-confetti';
import { Target, CheckCircle2, Circle, Plus, Sparkles, Image as ImageIcon, MessageSquare, Share2, Award, Flame, Filter, Check } from 'lucide-react';

interface ChallengeSectionProps {
  challenges: Challenge[];
  onToggleChallenge: (id: string, evidenceNote?: string) => void;
  onAddChallenge: (challenge: Challenge) => void;
  onShareToCommunity: (challenge: Challenge, comment: string) => void;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  challenges,
  onToggleChallenge,
  onAddChallenge,
  onShareToCommunity,
}) => {
  const [statusTab, setStatusTab] = useState<'pending' | 'completed'>('pending');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<ChallengeFrequency>('daily');
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<Challenge | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New challenge form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ChallengeCategory>('bienestar');
  const [newFrequency, setNewFrequency] = useState<ChallengeFrequency>('daily');

  // Filter logic: Filter category, frequency, and completed state. Capped at max 6 for daily active.
  const rawFiltered = challenges.filter((c) => {
    const categoryMatch = selectedCategory === 'all' || c.category === selectedCategory;
    const frequencyMatch = c.frequency === selectedFrequency;
    const statusMatch = statusTab === 'pending' ? !c.completed : c.completed;
    return categoryMatch && frequencyMatch && statusMatch;
  });

  const filtered = (selectedFrequency === 'daily' && statusTab === 'pending')
    ? rawFiltered.slice(0, 6)
    : rawFiltered;

  const handleOpenEvidence = (challenge: Challenge) => {
    if (challenge.completed) {
      onToggleChallenge(challenge.id);
      return;
    }
    setActiveEvidenceModal(challenge);
    setEvidenceNote('');
  };

  const handleConfirmCompletion = () => {
    if (!activeEvidenceModal) return;

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#059669', '#4f46e5', '#f59e0b', '#ec4899']
    });

    onToggleChallenge(activeEvidenceModal.id, evidenceNote);
    
    // Automatically offer to share to community if note was provided
    if (evidenceNote.trim()) {
      onShareToCommunity(activeEvidenceModal, evidenceNote);
    }

    setActiveEvidenceModal(null);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Challenge = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Desafío personalizado de crecimiento.',
      category: newCategory,
      frequency: newFrequency,
      xpReward: newFrequency === 'daily' ? 100 : newFrequency === 'weekly' ? 250 : 500,
      coinReward: newFrequency === 'daily' ? 25 : newFrequency === 'weekly' ? 60 : 150,
      completed: false,
      iconName: 'Target',
    };

    onAddChallenge(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner - Soft Lavender Indigo Pastel */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-50 rounded-2xl border border-indigo-200/90 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-200/80 text-indigo-950 text-xs font-bold mb-1">
            <Target className="w-3.5 h-3.5 text-indigo-700" />
            <span>Sistema de Crecimiento Personal</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catálogo de Desafíos Estudiantiles</h2>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            Selecciona misiones en Bienestar, Salud, Educación y Entretenimiento para ganar XP y subir de nivel.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Mi Propio Desafío</span>
        </button>
      </div>

      {/* Frequency & Status Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['daily', 'weekly', 'monthly'] as ChallengeFrequency[]).map((freq) => (
            <button
              key={freq}
              onClick={() => setSelectedFrequency(freq)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedFrequency === freq
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {freq === 'daily' ? '📅 Diarios (Máx. 6)' : freq === 'weekly' ? '🗓️ Semanales' : '🏆 Mensuales'}
            </button>
          ))}

          {/* Pending vs Completed Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setStatusTab('pending')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                statusTab === 'pending'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Activos / Pendientes
            </button>
            <button
              onClick={() => setStatusTab('completed')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                statusTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✅ Completados
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'Todos', icon: '✨' },
            { id: 'bienestar', label: 'Bienestar', icon: '🌱' },
            { id: 'salud', label: 'Salud', icon: '💪' },
            { id: 'educacion', label: 'Educación', icon: '📚' },
            { id: 'entretenimiento', label: 'Entretenimiento', icon: '🎮' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice Banner */}
      {selectedFrequency === 'daily' && statusTab === 'pending' && (
        <div className="flex items-center justify-between text-xs text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-4 py-2.5 rounded-2xl">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Sistema de Misiones Diarias: Asignación máxima de 6 desafíos por día.</span>
          </span>
          <span className="hidden sm:inline font-bold text-indigo-700 text-[11px] bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
            Al completar un desafío, se elimina de tu lista activa
          </span>
        </div>
      )}

      {/* Challenges Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
            {statusTab === 'pending' ? '✨' : '🏆'}
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            {statusTab === 'pending' ? '¡No tienes desafíos pendientes!' : 'Aún no hay desafíos completados en esta categoría.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {statusTab === 'pending'
              ? 'Has completado todos tus desafíos activos disponibles. ¡Excelente trabajo! Todos los desafíos completados se eliminan de tu lista pendiente.'
              : 'Completa desafíos desde la pestaña de pendientes para ir sumando tu historial.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xs hover:shadow-md ${
              c.completed
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-white border-slate-200/90 hover:border-indigo-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  c.category === 'bienestar' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  c.category === 'salud' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  c.category === 'educacion' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {c.category}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="text-indigo-600">+{c.xpReward} XP</span>
                  <span className="text-amber-600">+{c.coinReward} 🪙</span>
                </div>
              </div>

              <h3 className={`text-base font-bold mb-1 ${c.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                {c.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{c.description}</p>

              {c.evidenceNote && (
                <div className="bg-white/80 border border-emerald-200/80 p-2.5 rounded-xl text-xs text-emerald-800 italic mb-4">
                  <span className="font-bold text-emerald-900 block not-italic text-[10px] uppercase">Evidencia Registrada:</span>
                  "{c.evidenceNote}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {c.completed ? `Completado ${c.completedAt || ''}` : 'Pendiente'}
              </span>

              <button
                onClick={() => handleOpenEvidence(c)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  c.completed
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                {c.completed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Completado</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Marcar y Ganar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Completion & Evidence Modal */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                🏆
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¡Completar Desafío!</h3>
                <p className="text-xs text-slate-500">{activeEvidenceModal.title}</p>
              </div>
            </div>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex justify-between font-semibold">
              <span>Recompensa Instantánea:</span>
              <span>+{activeEvidenceModal.xpReward} XP y +{activeEvidenceModal.coinReward} Monedas</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Añadir Comentario o Evidencia (Opcional):
              </label>
              <textarea
                rows={3}
                placeholder="Escribe cómo realizaste el desafío o qué aprendiste..."
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
              >
                ¡Reclamar XP!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Crear Nuevo Desafío Personalizado
            </h3>

            <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Desafío</label>
                <input
                  type="text"
                  placeholder="Ej. Salir a trotar 20 min / Leer 1 Capítulo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones o detalles de tu reto..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="bienestar">Bienestar 🌱</option>
                    <option value="salud">Salud 💪</option>
                    <option value="educacion">Educación 📚</option>
                    <option value="entretenimiento">Entretenimiento 🎮</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  Guardar Desafío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
