import React, { useState, useEffect } from 'react';
import { Header, NavigationTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChallengeSection } from './components/ChallengeSection';
import { KeyMazeGame } from './components/KeyMazeGame';
import { SmartCalendar } from './components/SmartCalendar';
import { NotesApp } from './components/NotesApp';
import { UserProfileView } from './components/UserProfileView';
import { CommunityFeed } from './components/CommunityFeed';
import { QrModal } from './components/QrModal';
import { FocusTimerModal } from './components/FocusTimerModal';

import {
  INITIAL_USER_PROFILE,
  INITIAL_CHALLENGES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTES,
  INITIAL_HIGH_SCORES,
  INITIAL_COMMUNITY_POSTS,
} from './data/initialData';

import { Challenge, CalendarEvent, NoteItem, HighScore, CommunityPost, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_user_profile');
      if (saved) {
        try {
          return { ...INITIAL_USER_PROFILE, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Error loading user profile:', e);
        }
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [highScores, setHighScores] = useState<HighScore[]>(INITIAL_HIGH_SCORES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);

  // Sync user profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user profile:', e);
    }
  }, [user]);

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://llave-desafio.app';


  // Toggle or complete a challenge
  const handleToggleChallenge = (id: string, evidenceNote?: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isCompleting = !c.completed;
          if (isCompleting) {
            // Reward User
            setUser((u) => {
              const newXp = u.xp + c.xpReward;
              const newCoins = u.coins + c.coinReward;
              const newCompletedCount = u.completedChallengesCount + 1;
              let newLevel = u.level;
              let newXpToNext = u.xpToNextLevel;

              if (newXp >= u.xpToNextLevel) {
                newLevel += 1;
                newXpToNext += 1000;
              }

              return {
                ...u,
                xp: newXp,
                coins: newCoins,
                level: newLevel,
                xpToNextLevel: newXpToNext,
                completedChallengesCount: newCompletedCount,
              };
            });
          }

          return {
            ...c,
            completed: isCompleting,
            completedAt: isCompleting ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            evidenceNote: evidenceNote || c.evidenceNote,
          };
        }
        return c;
      })
    );
  };

  // Add custom challenge
  const handleAddChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  // Share challenge to Community
  const handleShareToCommunity = (challenge: Challenge, comment: string) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      username: user.name,
      avatarUrl: user.avatarUrl,
      challengeTitle: challenge.title,
      category: challenge.category,
      comment: comment,
      likes: 1,
      likedByMe: true,
      timestamp: 'Ahora mismo',
      commentsCount: 0,
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  // Game rewards
  const handleEarnGameRewards = (earnedXp: number, earnedCoins: number) => {
    setUser((u) => {
      const newXp = u.xp + earnedXp;
      const newCoins = u.coins + earnedCoins;
      let newLevel = u.level;
      let newXpToNext = u.xpToNextLevel;

      if (newXp >= u.xpToNextLevel) {
        newLevel += 1;
        newXpToNext += 1000;
      }

      return {
        ...u,
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        xpToNextLevel: newXpToNext,
      };
    });
  };

  // Add High Score
  const handleAddHighScore = (score: HighScore) => {
    setHighScores((prev) => [...prev, score].sort((a, b) => b.score - a.score).slice(0, 10));
  };

  // Calendar handlers
  const handleAddEvent = (ev: CalendarEvent) => {
    setEvents((prev) => [ev, ...prev]);
  };

  const handleToggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev))
    );
  };

  // Notes handlers
  const handleAddNote = (note: NoteItem) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleUpdateNote = (note: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Community handlers
  const handleAddPost = (post: CommunityPost) => {
    setCommunityPosts((prev) => [post, ...prev]);
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = p.likedByMe;
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedByMe: !isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      username: 'Alex Rivera (Tú)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      text: text.trim(),
      timestamp: 'Ahora mismo',
      likes: 0,
      likedByMe: false,
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedList = p.commentsList ? [...p.commentsList, newComment] : [newComment];
          return {
            ...p,
            commentsCount: updatedList.length,
            commentsList: updatedList,
          };
        }
        return p;
      })
    );

    // Award XP & Coins for commenting
    handleEarnGameRewards(10, 5);
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.commentsList) {
          const updatedList = p.commentsList.map((c) => {
            if (c.id === commentId) {
              const isLiked = c.likedByMe;
              return {
                ...c,
                likes: isLiked ? (c.likes || 1) - 1 : (c.likes || 0) + 1,
                likedByMe: !isLiked,
              };
            }
            return c;
          });
          return { ...p, commentsList: updatedList };
        }
        return p;
      })
    );
  };

  const handleRepostPost = (postId: string, quoteText?: string) => {
    const originalPost = communityPosts.find((p) => p.id === postId);
    if (!originalPost) return;

    // Increment original post reposts count
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            repostsCount: (p.repostsCount || 0) + 1,
            repostedByMe: true,
          };
        }
        return p;
      })
    );

    // Create new post representing the repost
    const newRepostPost: CommunityPost = {
      id: Date.now().toString(),
      username: 'Alex Rivera (Tú)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      challengeTitle: originalPost.challengeTitle,
      category: originalPost.category,
      comment: quoteText?.trim() ? `💬 "${quoteText.trim()}"` : `🔁 Reposteó la publicación de ${originalPost.username}: "${originalPost.comment}"`,
      imageUrl: originalPost.imageUrl,
      likes: 1,
      likedByMe: true,
      timestamp: 'Ahora mismo',
      commentsCount: 0,
      commentsList: [],
      repostsCount: 0,
      originalAuthor: originalPost.username,
      reactionBadge: '🔁 Reposteo Estudiantil',
    };

    setCommunityPosts((prev) => [newRepostPost, ...prev]);

    // Reward for sharing knowledge
    handleEarnGameRewards(25, 10);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
      />

      {/* Main App Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            challenges={challenges}
            events={events}
            notes={notes}
            onToggleChallenge={handleToggleChallenge}
            onNavigate={setActiveTab}
            onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
          />
        )}


        {activeTab === 'challenges' && (
          <ChallengeSection
            challenges={challenges}
            onToggleChallenge={handleToggleChallenge}
            onAddChallenge={handleAddChallenge}
            onShareToCommunity={handleShareToCommunity}
          />
        )}

        {activeTab === 'game' && (
          <KeyMazeGame
            onEarnRewards={handleEarnGameRewards}
            highScores={highScores}
            onAddHighScore={handleAddHighScore}
          />
        )}

        {activeTab === 'calendar' && (
          <SmartCalendar
            events={events}
            onAddEvent={handleAddEvent}
            onToggleEvent={handleToggleEvent}
          />
        )}

        {activeTab === 'notes' && (
          <NotesApp
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            user={user}
            onUpdateProfile={(updated) => setUser((u) => ({ ...u, ...updated }))}
            onUpdateTitle={(title) => setUser((u) => ({ ...u, title }))}
            onSelectTheme={(selectedTheme) => setUser((u) => ({ ...u, selectedTheme }))}
          />
        )}

        {activeTab === 'community' && (
          <CommunityFeed
            posts={communityPosts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onRepostPost={handleRepostPost}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">La Llave del Desafío 🗝️</span>
            <span>— Crecimiento personal recompensado</span>
          </div>
          <p>© {new Date().getFullYear()} La Llave del Desafío. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* QR Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        appUrl={currentAppUrl}
      />

      {/* Focus Timer Modal */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onEarnRewards={handleEarnGameRewards}
      />

    </div>
  );
}

