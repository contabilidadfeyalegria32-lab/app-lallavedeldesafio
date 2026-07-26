import React, { useState } from 'react';
import { CommunityPost, PostComment, ChallengeCategory } from '../types';
import {
  Users, Heart, MessageSquare, Repeat2, Sparkles, Send,
  Image as ImageIcon, Filter, X, Flame, Trophy, Share2,
  CheckCircle2, Smile, Award, BookOpen, Zap, Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioEffect } from '../utils/audio';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (id: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onRepostPost?: (postId: string, quoteText?: string) => void;
}

const BADGE_PRESETS = [
  '🧠 Mente Brillante',
  '🔥 Racha Inmortal',
  '🎯 Enfoque Pomodoro',
  '🎨 Creatividad Escolar',
  '⚡ Récord Gamer',
  '📚 Tarea Cumplida',
];

const PRESET_IMAGES = [
  { id: 'none', label: 'Sin foto', url: '' },
  { id: 'study', label: '📖 Mesa de Estudio', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' },
  { id: 'gaming', label: '🎮 Setup / Laberinto', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  { id: 'lofi', label: '☕ Café & Lofi', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80' },
  { id: 'code', label: '💻 Proyecto & Código', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  onLikeComment,
  onRepostPost,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ChallengeCategory>('all');
  const [commentText, setCommentText] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('🧠 Mente Brillante');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('educacion');
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Comment drawers state per post
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [newCommentInput, setNewCommentInput] = useState<{ [postId: string]: string }>({});

  // Repost modal state
  const [repostModalPost, setRepostModalPost] = useState<CommunityPost | null>(null);
  const [repostQuoteText, setRepostQuoteText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const finalImage = customImageUrl.trim() || selectedPresetImage || undefined;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      username: 'Alex Rivera (Tú)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      challengeTitle: challengeTitle.trim() || 'Logro de Estudio o Hábito Diario',
      category: selectedCategory,
      comment: commentText.trim(),
      imageUrl: finalImage,
      likes: 1,
      likedByMe: true,
      timestamp: 'Ahora mismo',
      commentsCount: 0,
      commentsList: [],
      repostsCount: 0,
      reactionBadge: selectedBadge,
    };

    onAddPost(newPost);
    playAudioEffect('win');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#3b82f6', '#f59e0b', '#10b981']
    });

    setCommentText('');
    setChallengeTitle('');
    setSelectedPresetImage('');
    setCustomImageUrl('');
  };

  const toggleCommentsDrawer = (postId: string) => {
    playAudioEffect('click');
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSendComment = (postId: string) => {
    const text = newCommentInput[postId];
    if (!text || !text.trim()) return;

    if (onAddComment) {
      onAddComment(postId, text.trim());
      playAudioEffect('coin');
    }

    setNewCommentInput((prev) => ({
      ...prev,
      [postId]: '',
    }));
  };

  const handleConfirmRepost = () => {
    if (!repostModalPost || !onRepostPost) return;

    onRepostPost(repostModalPost.id, repostQuoteText);
    playAudioEffect('win');
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981']
    });

    setRepostModalPost(null);
    setRepostQuoteText('');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Muro Estudiantil & Comunidad 🚀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Logros, Ideas & Reposteos
            </h2>
            <p className="text-xs text-slate-300">
              Comparte tus victorias, comenta el progreso de tus compañeros y repostea contenido inspirador. Gana <span className="text-amber-300 font-bold">+25 XP por repostear</span> y <span className="text-emerald-400 font-bold">+10 XP por comentar</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase block">Publicaciones</span>
              <span className="text-lg font-black font-mono text-amber-300">{posts.length}</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase block">Comunidad</span>
              <span className="text-xs font-extrabold text-emerald-400">Activa ⚡</span>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar">
          {[
            { id: 'all', label: '🌟 Todos los Temas' },
            { id: 'educacion', label: '📚 Tareas & Escuela' },
            { id: 'entretenimiento', label: '🎮 Gaming & Récords' },
            { id: 'bienestar', label: '🌱 Mente & Hábitos' },
            { id: 'salud', label: '⚡ Deporte & Salud' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedFilter(tab.id as any);
                playAudioEffect('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer border ${
                selectedFilter === tab.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Creative Share Box Form */}
      <form onSubmit={handleCreatePost} className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Crear Publicación Creativa</h3>
        </div>

        <div className="space-y-3">
          {/* User input + title */}
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
              alt="Alex"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="¿Qué reto o tarea completaste hoy? (ej. 100% en guía de historia)..."
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                rows={2}
                placeholder="Escribe tus notas, reflexiones o consejos para inspirar a otros estudiantes..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Reaction Badge Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Elige tu Insignia de Reacción:</label>
            <div className="flex flex-wrap gap-1.5">
              {BADGE_PRESETS.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setSelectedBadge(badge)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedBadge === badge
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Image Attachments */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fondo o Foto Temática:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setSelectedPresetImage(img.url);
                    setCustomImageUrl('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedPresetImage === img.url
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-semibold">
              ¡Gana <span className="text-indigo-600 font-bold">+50 XP</span> por publicar!
            </span>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar en el Muro</span>
            </button>
          </div>
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((p) => {
          const isCommentsOpen = !!expandedComments[p.id];
          const postComments = p.commentsList || [];

          return (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 hover:border-indigo-200 transition-colors">
              
              {/* Repost Header Banner if applicable */}
              {p.originalAuthor && (
                <div className="bg-amber-50 border border-amber-200/80 p-2 px-3 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                  <Repeat2 className="w-4 h-4 text-amber-600" />
                  <span>Publicación reposteada de <strong className="text-amber-950 font-black">{p.originalAuthor}</strong></span>
                </div>
              )}

              {/* Author Info Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>{p.username}</span>
                      {p.reactionBadge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          {p.reactionBadge}
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{p.timestamp}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  p.category === 'educacion' ? 'bg-indigo-100 text-indigo-800' :
                  p.category === 'salud' ? 'bg-emerald-100 text-emerald-800' :
                  p.category === 'bienestar' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.category}
                </span>
              </div>

              {/* Challenge Tag */}
              <div className="bg-indigo-50/70 border border-indigo-100/90 p-3 rounded-2xl text-xs font-bold text-indigo-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Desafío Completado: "{p.challengeTitle}"</span>
              </div>

              {/* Post Comment Text */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">{p.comment}</p>

              {/* Attached Image if any */}
              {p.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
                  <img src={p.imageUrl} alt="Evidencia" className="w-full max-h-72 object-cover" />
                </div>
              )}

              {/* Action Bar (Like, Comment Drawer Toggle, Repost) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                
                <div className="flex items-center gap-3 sm:gap-5">
                  {/* Like Button */}
                  <button
                    onClick={() => {
                      onLikePost(p.id);
                      playAudioEffect('click');
                    }}
                    className={`inline-flex items-center gap-1.5 font-extrabold transition-transform active:scale-125 cursor-pointer ${
                      p.likedByMe ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${p.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{p.likes} Me gusta</span>
                  </button>

                  {/* Comment Drawer Toggle Button */}
                  <button
                    onClick={() => toggleCommentsDrawer(p.id)}
                    className={`inline-flex items-center gap-1.5 font-extrabold transition-colors cursor-pointer ${
                      isCommentsOpen ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{p.commentsCount} Comentarios</span>
                  </button>
                </div>

                {/* Repost Button */}
                <button
                  onClick={() => {
                    playAudioEffect('click');
                    setRepostModalPost(p);
                  }}
                  className={`inline-flex items-center gap-1.5 font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    p.repostedByMe
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80'
                  }`}
                  title="Repostear en Muro Estudiantil"
                >
                  <Repeat2 className="w-4 h-4 text-amber-500" />
                  <span>{p.repostsCount || 0} Repostear</span>
                </button>
              </div>

              {/* Expandable Comments Drawer Section */}
              {isCommentsOpen && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Comentarios ({postComments.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">+10 XP por comentar</span>
                  </div>

                  {/* List of comments */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {postComments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-2">
                        Sé el primero en comentar esta publicación... 💬
                      </p>
                    ) : (
                      postComments.map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.avatarUrl}
                                alt={c.username}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-900">{c.username}</span>
                              <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                            </div>

                            {onLikeComment && (
                              <button
                                onClick={() => {
                                  onLikeComment(p.id, c.id);
                                  playAudioEffect('click');
                                }}
                                className={`text-[11px] font-bold inline-flex items-center gap-1 ${
                                  c.likedByMe ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${c.likedByMe ? 'fill-rose-600' : ''}`} />
                                <span>{c.likes || 0}</span>
                              </button>
                            )}
                          </div>

                          <p className="text-slate-700 pl-8">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={newCommentInput[p.id] || ''}
                      onChange={(e) =>
                        setNewCommentInput((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendComment(p.id);
                        }
                      }}
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleSendComment(p.id)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Repost Modal */}
      {repostModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            
            <button
              onClick={() => setRepostModalPost(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <Repeat2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Repostear en Muro Estudiantil</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Compartir Publicación</h3>
              <p className="text-xs text-slate-500">
                Ganas <span className="text-indigo-600 font-bold">+25 XP y +10 Monedas</span> al compartir logros con tus compañeros.
              </p>
            </div>

            {/* Original Post Preview Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 block">{repostModalPost.username}</span>
              <p className="text-slate-700 line-clamp-2">"{repostModalPost.comment}"</p>
            </div>

            {/* Optional Quote Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Añade tus palabras o nota motivacional (Opcional):
              </label>
              <textarea
                rows={2}
                placeholder="¡Qué gran avance! Inspira a los demás..."
                value={repostQuoteText}
                onChange={(e) => setRepostQuoteText(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRepostModalPost(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmRepost}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Repeat2 className="w-4 h-4" />
                <span>Confirmar Repost</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
