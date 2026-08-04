import React, { useState } from 'react';
import { CommunityPost, PostComment, ChallengeCategory, UserProfile, PostType, PollOption } from '../types';
import {
  Users, Heart, MessageSquare, Repeat2, Sparkles, Send,
  Image as ImageIcon, Filter, X, Flame, Trophy, Share2,
  CheckCircle2, Smile, Award, BookOpen, Zap, Lightbulb,
  HelpCircle, BarChart3, Search, Music, Tag, Plus, Check,
  ThumbsUp, CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioEffect } from '../utils/audio';

interface CommunityFeedProps {
  posts: CommunityPost[];
  currentUser: UserProfile;
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (id: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onRepostPost?: (postId: string, quoteText?: string) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
  onMarkHelpfulAnswer?: (postId: string, commentId: string) => void;
}

const BADGE_PRESETS = [
  '🧠 Mente Brillante',
  '🔥 Racha Inmortal',
  '🎯 Enfoque Pomodoro',
  '🎨 Creatividad Escolar',
  '⚡ Récord Gamer',
  '📚 Tarea Cumplida',
  '💡 Sabio Estudiantil',
  '🎵 Lofi Master',
];

const SUBJECT_TAGS = [
  '#Matemáticas',
  '#Física',
  '#Química',
  '#Historia',
  '#Inglés',
  '#Exámenes',
  '#TipsEstudio',
  '#MúsicaEnfoque',
  '#ArcadeGamer',
  '#General',
];

const PRESET_IMAGES = [
  { id: 'none', label: 'Sin foto', url: '' },
  { id: 'study', label: '📖 Mesa de Estudio', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' },
  { id: 'gaming', label: '🎮 Setup / Laberinto', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  { id: 'lofi', label: '☕ Café & Lofi', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80' },
  { id: 'code', label: '💻 Proyecto & Código', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
  { id: 'art', label: '🎨 Arte & Cuaderno', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80' },
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  currentUser,
  onAddPost,
  onLikePost,
  onAddComment,
  onLikeComment,
  onRepostPost,
  onVotePoll,
  onMarkHelpfulAnswer,
}) => {
  // Filters & Search State
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | PostType>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | ChallengeCategory>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [postType, setPostType] = useState<PostType>('logro');
  const [titleInput, setTitleInput] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#Matemáticas');
  const [selectedBadge, setSelectedBadge] = useState('🧠 Mente Brillante');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('educacion');
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Poll Form Inputs
  const [pollOptions, setPollOptions] = useState<string[]>([
    'Opción A',
    'Opción B',
    'Opción C',
  ]);

  // Comment drawers state per post
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [newCommentInput, setNewCommentInput] = useState<{ [postId: string]: string }>({});

  // Repost modal state
  const [repostModalPost, setRepostModalPost] = useState<CommunityPost | null>(null);
  const [repostQuoteText, setRepostQuoteText] = useState('');

  const handleAddPollOptionInput = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Opción ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOptionInput = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleUpdatePollOptionText = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodyText.trim()) return;

    const finalImage = customImageUrl.trim() || selectedPresetImage || undefined;

    const displayName = currentUser.username
      ? `${currentUser.name} (${currentUser.username})`
      : currentUser.name;

    let defaultTitle = 'Publicación Estudiantil';
    if (postType === 'logro') defaultTitle = '🏆 Logro de Estudio o Hábito Diario';
    if (postType === 'pregunta') defaultTitle = '❓ Pregunta o Duda Escolar';
    if (postType === 'encuesta') defaultTitle = '📊 Encuesta Estudiantil';
    if (postType === 'tip') defaultTitle = '💡 Consejo & Método de Estudio';
    if (postType === 'lofi' as any || postType === 'recomendacion') defaultTitle = '🎵 Recomendación Lofi / Recurso';

    const finalTitle = titleInput.trim() || defaultTitle;

    // Poll structure if type is encuesta
    let finalPollData = undefined;
    if (postType === 'encuesta') {
      const validOpts: PollOption[] = pollOptions
        .filter((opt) => opt.trim().length > 0)
        .map((opt, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: opt.trim(),
          votes: Math.floor(Math.random() * 3), // Initial friendly vote count
        }));

      const initialTotal = validOpts.reduce((acc, o) => acc + o.votes, 0);

      finalPollData = {
        question: finalTitle,
        options: validOpts,
        totalVotes: initialTotal,
      };
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      username: displayName,
      avatarUrl: currentUser.avatarUrl,
      challengeTitle: finalTitle,
      category: selectedCategory,
      comment: bodyText.trim(),
      imageUrl: finalImage,
      likes: 1,
      likedByMe: true,
      timestamp: 'Ahora mismo',
      commentsCount: 0,
      commentsList: [],
      repostsCount: 0,
      reactionBadge: selectedBadge,
      postType: postType,
      subjectTag: selectedTag,
      pollData: finalPollData,
    };

    onAddPost(newPost);
    playAudioEffect('win');
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#f59e0b', '#10b981', '#ec4899'],
    });

    // Reset form
    setBodyText('');
    setTitleInput('');
    setSelectedPresetImage('');
    setCustomImageUrl('');
    setPollOptions(['Opción A', 'Opción B', 'Opción C']);
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
      colors: ['#f59e0b', '#6366f1', '#10b981'],
    });

    setRepostModalPost(null);
    setRepostQuoteText('');
  };

  const handleVoteOnPoll = (postId: string, optionId: string) => {
    if (onVotePoll) {
      onVotePoll(postId, optionId);
      playAudioEffect('coin');
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleToggleHelpfulAnswer = (postId: string, commentId: string) => {
    if (onMarkHelpfulAnswer) {
      onMarkHelpfulAnswer(postId, commentId);
      playAudioEffect('win');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  };

  // Filter Posts
  const filteredPosts = posts.filter((p) => {
    // Type Filter
    if (selectedTypeFilter !== 'all') {
      const pType = p.postType || 'logro';
      if (pType !== selectedTypeFilter) return false;
    }

    // Category Filter
    if (selectedCategoryFilter !== 'all') {
      if (p.category !== selectedCategoryFilter) return false;
    }

    // Tag Filter
    if (selectedTagFilter !== 'all') {
      if (p.subjectTag !== selectedTagFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = p.comment.toLowerCase().includes(q);
      const matchTitle = p.challengeTitle.toLowerCase().includes(q);
      const matchUser = p.username.toLowerCase().includes(q);
      const matchTag = p.subjectTag?.toLowerCase().includes(q);
      if (!matchText && !matchTitle && !matchUser && !matchTag) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* Header Banner - Soft Pastel Teal/Cyan Theme */}
      <div className="bg-gradient-to-r from-teal-100 via-cyan-50 to-teal-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-teal-200/90 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-200/80 text-teal-950 border border-teal-300 text-xs font-bold">
              <Users className="w-4 h-4 text-teal-700 animate-pulse" />
              <span>Muro Estudiantil Multitema & Comunidad 🚀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Logros, Preguntas, Encuestas & Tips
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Un espacio colaborativo con <strong className="text-teal-900 font-extrabold">gran variedad de contenido</strong>: publica tus dudas escolares, vota en encuestas en vivo, comparte trucos de estudio o repite los mejores posts.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase block">Publicaciones</span>
              <span className="text-xl font-black font-mono text-amber-300">{posts.length}</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase block">Incentivos</span>
              <span className="text-xs font-extrabold text-emerald-400">+50 XP / Post</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Primary Type Filters */}
        <div className="relative z-10 space-y-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por tema (#Matemáticas, #Exámenes), usuario o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 text-xs text-white pl-10 pr-10 py-2.5 rounded-2xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: '🌟 Todos los Tipos', icon: Users },
              { id: 'logro', label: '🏆 Logros & Hábitos', icon: Trophy },
              { id: 'encuesta', label: '📊 Encuestas Votables', icon: BarChart3 },
              { id: 'pregunta', label: '❓ Preguntas & Dúdas', icon: HelpCircle },
              { id: 'tip', label: '💡 Tips de Estudio', icon: Lightbulb },
              { id: 'recomendacion', label: '🎵 Lofi & Recomendaciones', icon: Music },
            ].map((f) => {
              const IconComp = f.icon;
              const isActive = selectedTypeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedTypeFilter(f.id as any);
                    playAudioEffect('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subject Hashtags Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-400" />
              Materia:
            </span>
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                selectedTagFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Todas
            </button>
            {SUBJECT_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTagFilter(selectedTagFilter === tag ? 'all' : tag);
                  playAudioEffect('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedTagFilter === tag
                    ? 'bg-indigo-600 text-white border-indigo-400 font-extrabold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Multi-Format Post Creator Form */}
      <form onSubmit={handleCreatePost} className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-4">
        
        {/* Form Top Title & Type Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Crear Nueva Publicación Variada</h3>
          </div>

          {/* Selector de Tipo de Post */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'logro', label: '🏆 Logro', icon: Trophy },
              { id: 'pregunta', label: '❓ Duda', icon: HelpCircle },
              { id: 'encuesta', label: '📊 Encuesta', icon: BarChart3 },
              { id: 'tip', label: '💡 Tip', icon: Lightbulb },
              { id: 'recomendacion', label: '🎵 Lofi/Rec', icon: Music },
            ].map((typeItem) => {
              const IconComp = typeItem.icon;
              const isSelected = postType === typeItem.id;
              return (
                <button
                  key={typeItem.id}
                  type="button"
                  onClick={() => {
                    setPostType(typeItem.id as any);
                    playAudioEffect('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{typeItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          
          {/* User Header & Main Input */}
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                <span>
                  Publicando como: <strong className="text-indigo-600 font-extrabold">{currentUser.name}</strong>{' '}
                  <span className="font-mono text-slate-400">{currentUser.username}</span>
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Tipo: {postType.toUpperCase()}
                </span>
              </div>

              {/* Title / Question Field */}
              <input
                type="text"
                placeholder={
                  postType === 'logro' ? 'Título de tu logro o reto (ej. 100% en guía de historia)...' :
                  postType === 'pregunta' ? '¿Cuál es tu pregunta o duda escolar? (ej. ¿Cómo se resuelve esta ecuación?)...' :
                  postType === 'encuesta' ? 'Escribe la pregunta de tu encuesta para la comunidad...' :
                  postType === 'tip' ? 'Título de tu tip de estudio (ej. Método de colores para apuntes)...' :
                  'Título de tu recomendación (ej. Canal de Lofi o libro genial)...'
                }
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Body Details / Reflection Text */}
              <textarea
                rows={2}
                placeholder={
                  postType === 'logro' ? 'Describe tus notas, tiempo dedicado o cómo lograste superar el reto...' :
                  postType === 'pregunta' ? 'Agrega más contexto o detalles sobre el problema para que tus compañeros te ayuden...' :
                  postType === 'encuesta' ? 'Explica brevemente el motivo de la encuesta o invita a votar...' :
                  postType === 'tip' ? 'Escribe paso a paso cómo aplicar tu consejo de estudio...' :
                  'Cuéntanos por qué recomiendas este contenido y cómo te ayuda a estudiar...'
                }
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Poll Options Builder (If Poll Type) */}
          {postType === 'encuesta' && (
            <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  <span>Opciones de la Encuesta (de 2 a 5 opciones)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddPollOptionInput}
                  disabled={pollOptions.length >= 5}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 text-[11px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Opción</span>
                </button>
              </div>

              <div className="space-y-2">
                {pollOptions.map((optText, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-800 w-5 text-center font-mono">{idx + 1}.</span>
                    <input
                      type="text"
                      value={optText}
                      onChange={(e) => handleUpdatePollOptionText(idx, e.target.value)}
                      placeholder={`Opción ${idx + 1}...`}
                      className="flex-1 text-xs bg-white border border-amber-300/80 rounded-xl px-3 py-1.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOptionInput(idx)}
                        className="p-1.5 text-amber-700 hover:text-rose-600 rounded-lg hover:bg-amber-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Hashtag & Reaction Badge Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Subject Hashtag Picker */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-600" />
                <span>Materia / Etiqueta:</span>
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {SUBJECT_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Reaction Badge Picker */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                <span>Insignia del Post:</span>
              </label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {BADGE_PRESETS.map((badge) => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Preset Image Attachments */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Imagen o Fondo Adjunto:</span>
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
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ganas <strong className="text-indigo-600 font-black">+50 XP</strong> por publicar</span>
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

      {/* Posts List Header */}
      <div className="flex items-center justify-between px-2 pt-2">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span>Feed de la Comunidad</span>
          <span className="text-xs font-bold text-slate-500 font-mono">({filteredPosts.length} publicaciones)</span>
        </h3>

        {selectedTypeFilter !== 'all' && (
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">No se encontraron publicaciones</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Prueba cambiando la búsqueda o seleccionando otro filtro de materia o tipo de contenido.
            </p>
          </div>
        ) : (
          filteredPosts.map((p) => {
            const isCommentsOpen = !!expandedComments[p.id];
            const postComments = p.commentsList || [];
            const pType = p.postType || 'logro';

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 hover:border-indigo-200 transition-colors relative"
              >
                
                {/* Repost Header Banner if applicable */}
                {p.originalAuthor && (
                  <div className="bg-amber-50 border border-amber-200/80 p-2 px-3 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                    <Repeat2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Publicación reposteada de <strong className="text-amber-950 font-black">{p.originalAuthor}</strong>
                    </span>
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
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <span>{p.username}</span>
                        {p.reactionBadge && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            {p.reactionBadge}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{p.timestamp}</span>
                        {p.subjectTag && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-extrabold font-sans">{p.subjectTag}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        pType === 'encuesta' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        pType === 'pregunta' ? (p.isAnswered ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-rose-100 text-rose-900 border border-rose-200') :
                        pType === 'tip' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        pType === 'recomendacion' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                        'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {pType === 'encuesta' && <BarChart3 className="w-3 h-3 text-amber-600" />}
                      {pType === 'pregunta' && <HelpCircle className="w-3 h-3 text-rose-600" />}
                      {pType === 'tip' && <Lightbulb className="w-3 h-3 text-blue-600" />}
                      {pType === 'recomendacion' && <Music className="w-3 h-3 text-purple-600" />}
                      {pType === 'logro' && <Trophy className="w-3 h-3 text-indigo-600" />}
                      <span>
                        {pType === 'encuesta' ? 'Encuesta' :
                         pType === 'pregunta' ? (p.isAnswered ? '✅ Resuelta' : '❓ Duda') :
                         pType === 'tip' ? 'Tip Estudio' :
                         pType === 'recomendacion' ? 'Lofi / Rec' : 'Logro'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Challenge Title / Question Box */}
                <div className={`p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between border ${
                  pType === 'encuesta' ? 'bg-amber-50/90 border-amber-200/90 text-amber-950' :
                  pType === 'pregunta' ? 'bg-rose-50/90 border-rose-200/90 text-rose-950' :
                  pType === 'tip' ? 'bg-blue-50/90 border-blue-200/90 text-blue-950' :
                  'bg-indigo-50/80 border-indigo-100 text-indigo-950'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm tracking-tight">{p.challengeTitle}</span>
                  </div>
                </div>

                {/* Post Body Text */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {p.comment}
                </p>

                {/* Interactive Poll Display Card (If Poll Type) */}
                {pType === 'encuesta' && p.pollData && (
                  <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner border border-slate-800">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                        <span>Vota en esta Encuesta</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {p.pollData.totalVotes} votos registrados
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {p.pollData.options.map((opt) => {
                        const totalV = p.pollData?.totalVotes || 1;
                        const pct = Math.round((opt.votes / totalV) * 100) || 0;
                        const isMyChoice = p.pollData?.votedOptionId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleVoteOnPoll(p.id, opt.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                              isMyChoice
                                ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            {/* Animated Background Progress Fill */}
                            <div
                              className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-xl ${
                                isMyChoice ? 'bg-amber-400/30' : 'bg-slate-700/50'
                              }`}
                              style={{ width: `${pct}%` }}
                            />

                            <div className="relative z-10 flex items-center justify-between text-xs">
                              <span className="font-bold flex items-center gap-2">
                                {isMyChoice && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                                <span>{opt.text}</span>
                              </span>

                              <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                                <span className="text-slate-400">({opt.votes})</span>
                                <span className="font-black text-amber-300">{pct}%</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-400 text-center pt-1 font-semibold">
                      💡 Haz clic en una opción para votar y ganar <span className="text-amber-300 font-bold">+15 XP</span>
                    </div>
                  </div>
                )}

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
                        <span>Comentarios y Respuestas ({postComments.length})</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">+10 XP por responder</span>
                    </div>

                    {/* List of comments */}
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-2">
                          Sé el primero en comentar o responder a esta publicación... 💬
                        </p>
                      ) : (
                        postComments.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                              c.isHelpfulAnswer
                                ? 'bg-emerald-50 border-emerald-300/90 shadow-xs'
                                : 'bg-white border-slate-200/80'
                            }`}
                          >
                            {/* Comment Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={c.avatarUrl}
                                  alt={c.username}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="font-bold text-slate-900">{c.username}</span>
                                {c.isHelpfulAnswer && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Respuesta Útil</span>
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Mark as Helpful Answer for Question Posts */}
                                {pType === 'pregunta' && onMarkHelpfulAnswer && (
                                  <button
                                    onClick={() => handleToggleHelpfulAnswer(p.id, c.id)}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors border ${
                                      c.isHelpfulAnswer
                                        ? 'bg-emerald-600 text-white border-emerald-500'
                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-100 hover:text-emerald-800'
                                    }`}
                                    title="Marcar esta respuesta como útil"
                                  >
                                    💡 {c.isHelpfulAnswer ? 'Respuesta Útil ✓' : 'Marcar Útil'}
                                  </button>
                                )}

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
                            </div>

                            <p className="text-slate-700 pl-8 font-medium">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Escribe una respuesta o comentario..."
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
          })
        )}
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
                Ganas <strong className="text-indigo-600 font-bold">+25 XP y +10 Monedas</strong> al compartir ideas o encuestas con tus compañeros.
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
                placeholder="¡Qué gran avance o pregunta! Comparto para que todos respondan..."
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
