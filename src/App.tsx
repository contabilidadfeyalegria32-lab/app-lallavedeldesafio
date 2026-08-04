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
import { SpotifyMusicPlayer } from './components/SpotifyMusicPlayer';
import { AuthModal, AuthAccount } from './components/AuthModal';
import { MilestoneRewardModal, MilestoneRewardData } from './components/MilestoneRewardModal';
import { PlatformVideoTour } from './components/PlatformVideoTour';
import { getMilestoneReward, getUnclaimedMilestones } from './utils/milestones';

import {
  INITIAL_USER_PROFILE,
  INITIAL_CHALLENGES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTES,
  INITIAL_HIGH_SCORES,
  INITIAL_COMMUNITY_POSTS,
  DEFAULT_AVATAR_URL,
} from './data/initialData';

import { Challenge, CalendarEvent, NoteItem, HighScore, CommunityPost, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  // Default starter accounts if none exist in localStorage
  const DEFAULT_SAVED_ACCOUNTS: AuthAccount[] = [
    {
      id: 'acc_demo_alex',
      name: 'Alex Rivera',
      username: '@alex_estudiante',
      passwordHash: '1234',
      avatarUrl: DEFAULT_AVATAR_URL,
      profileData: INITIAL_USER_PROFILE,
    },
    {
      id: 'acc_demo_sofia',
      name: 'Sofía Ramírez',
      username: '@sofia_estudiante',
      passwordHash: '1234',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      profileData: {
        ...INITIAL_USER_PROFILE,
        name: 'Sofía Ramírez',
        username: '@sofia_estudiante',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
        level: 3,
        xp: 950,
        coins: 320,
        streakDays: 5,
        title: 'Estudiante VIP ⚡',
      }
    }
  ];

  // Authentication & Session state
  const [savedAccounts, setSavedAccounts] = useState<AuthAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_registered_accounts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error loading saved accounts:', e);
        }
      }
      // Populate defaults if none exist
      try {
        localStorage.setItem('app_registered_accounts', JSON.stringify(DEFAULT_SAVED_ACCOUNTS));
      } catch (e) {}
      return DEFAULT_SAVED_ACCOUNTS;
    }
    return [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('app_active_account_id');
      const hasAuthSession = localStorage.getItem('app_auth_session');
      return Boolean(activeId || hasAuthSession);
    }
    return false;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_user_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.avatarUrl && (parsed.avatarUrl.includes('photo-1534528741775') || parsed.avatarUrl.includes('photo-1494790108377'))) {
            parsed.avatarUrl = DEFAULT_AVATAR_URL;
          }
          return { ...INITIAL_USER_PROFILE, ...parsed };
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
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const [isVideoTourOpen, setIsVideoTourOpen] = useState(false);

  // Sync user profile to localStorage and keep savedAccounts up-to-date
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('app_user_profile', JSON.stringify(user));
        
        // Update active account in saved accounts array
        const activeId = localStorage.getItem('app_active_account_id');
        setSavedAccounts((prevAccounts) => {
          if (!prevAccounts || prevAccounts.length === 0) return prevAccounts;
          const updated = prevAccounts.map((acc) => {
            if (acc.id === activeId || acc.username.toLowerCase() === user.username.toLowerCase()) {
              return {
                ...acc,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                profileData: user,
              };
            }
            return acc;
          });
          try {
            localStorage.setItem('app_registered_accounts', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      } catch (e) {
        console.error('Error saving user profile:', e);
      }
    }
  }, [user, isAuthenticated]);

  // Auth Handlers
  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_auth_session', 'true');
      localStorage.setItem('app_user_profile', JSON.stringify(userProfile));
      // Refresh saved accounts list
      const saved = localStorage.getItem('app_registered_accounts');
      if (saved) {
        try { setSavedAccounts(JSON.parse(saved)); } catch (e) {}
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_auth_session');
      localStorage.removeItem('app_active_account_id');
    }
  };

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://llave-desafio.app';

  // 1,000 XP Milestone Modal state & handlers
  const [activeMilestoneModal, setActiveMilestoneModal] = useState<MilestoneRewardData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unclaimed = getUnclaimedMilestones(user.xp, user.claimedMilestones || []);
    if (unclaimed.length > 0 && !activeMilestoneModal) {
      setActiveMilestoneModal(getMilestoneReward(unclaimed[0]));
    }
  }, [user.xp, user.claimedMilestones, isAuthenticated, activeMilestoneModal]);

  const handleOpenClaimMilestoneModal = (milestoneXp: number) => {
    setActiveMilestoneModal(getMilestoneReward(milestoneXp));
  };

  const handleClaimMilestone = () => {
    if (!activeMilestoneModal) return;
    const mXp = activeMilestoneModal.milestoneXp;

    setUser((u) => {
      const currentClaimed = u.claimedMilestones || [];
      if (currentClaimed.includes(mXp)) return u;

      const updatedClaimed = [...currentClaimed, mXp];
      const newCoins = u.coins + activeMilestoneModal.coinsBonus;

      const newUnlockedTitles = u.unlockedTitles.includes(activeMilestoneModal.titleUnlocked)
        ? u.unlockedTitles
        : [...u.unlockedTitles, activeMilestoneModal.titleUnlocked];

      const badgeExists = u.badges.some((b) => b.name === activeMilestoneModal.badgeName);
      const updatedBadges = badgeExists
        ? u.badges
        : [
            ...u.badges,
            {
              id: `badge_m_${mXp}`,
              name: activeMilestoneModal.badgeName,
              description: `Desbloqueada por superar la gran meta de ${mXp} XP en La Llave del Desafío.`,
              category: 'general' as const,
              icon: activeMilestoneModal.badgeIcon,
              unlocked: true,
              unlockedAt: new Date().toISOString().split('T')[0],
              xpBonus: 250,
            },
          ];

      return {
        ...u,
        coins: newCoins,
        unlockedTitles: newUnlockedTitles,
        badges: updatedBadges,
        claimedMilestones: updatedClaimed,
      };
    });

    setActiveMilestoneModal(null);
  };


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

    const displayName = user.username ? `${user.name} (${user.username})` : user.name;

    const newComment = {
      id: Date.now().toString(),
      username: displayName,
      avatarUrl: user.avatarUrl,
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

  const handleMarkHelpfulAnswer = (postId: string, commentId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.commentsList) {
          const updatedComments = p.commentsList.map((c) => {
            if (c.id === commentId) {
              const newHelpfulState = !c.isHelpfulAnswer;
              return { ...c, isHelpfulAnswer: newHelpfulState };
            }
            return c;
          });
          const hasHelpful = updatedComments.some((c) => c.isHelpfulAnswer);
          return {
            ...p,
            commentsList: updatedComments,
            isAnswered: hasHelpful,
          };
        }
        return p;
      })
    );

    handleEarnGameRewards(25, 10);
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.pollData) {
          if (p.pollData.votedOptionId === optionId) return p;

          const prevVotedId = p.pollData.votedOptionId;
          const updatedOptions = p.pollData.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (opt.id === prevVotedId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          const newTotalVotes = prevVotedId ? p.pollData.totalVotes : p.pollData.totalVotes + 1;

          return {
            ...p,
            pollData: {
              ...p.pollData,
              options: updatedOptions,
              totalVotes: newTotalVotes,
              votedOptionId: optionId,
            },
          };
        }
        return p;
      })
    );

    handleEarnGameRewards(15, 5);
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

    const displayName = user.username ? `${user.name} (${user.username})` : user.name;

    // Create new post representing the repost
    const newRepostPost: CommunityPost = {
      id: Date.now().toString(),
      username: displayName,
      avatarUrl: user.avatarUrl,
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

  // Mandatory Authentication Gate: Lock entire platform if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans selection:bg-indigo-500 selection:text-white">
        <AuthModal
          savedAccounts={savedAccounts}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  const tabBgGradients: Record<NavigationTab, string> = {
    dashboard: 'bg-gradient-to-b from-emerald-50/80 via-teal-50/20 to-slate-50 border-t-2 border-emerald-300',
    challenges: 'bg-gradient-to-b from-indigo-50/80 via-purple-50/20 to-slate-50 border-t-2 border-indigo-300',
    game: 'bg-gradient-to-b from-amber-50/90 via-orange-50/20 to-slate-50 border-t-2 border-amber-300',
    calendar: 'bg-gradient-to-b from-sky-50/90 via-blue-50/20 to-slate-50 border-t-2 border-sky-300',
    notes: 'bg-gradient-to-b from-rose-50/80 via-pink-50/20 to-slate-50 border-t-2 border-rose-300',
    profile: 'bg-gradient-to-b from-purple-50/90 via-fuchsia-50/20 to-slate-50 border-t-2 border-purple-300',
    community: 'bg-gradient-to-b from-teal-50/90 via-cyan-50/20 to-slate-50 border-t-2 border-teal-300',
  };

  return (
    <div className={`min-h-screen text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${tabBgGradients[activeTab]}`}>
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
        onOpenMusicPlayer={() => setIsMusicPlayerOpen(true)}
        onOpenVideoTour={() => setIsVideoTourOpen(true)}
        onLogout={handleLogout}
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
            onOpenVideoTour={() => setIsVideoTourOpen(true)}
            onClaimMilestone={handleOpenClaimMilestoneModal}
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
            onClaimMilestone={handleOpenClaimMilestoneModal}
          />
        )}

        {activeTab === 'community' && (
          <CommunityFeed
            posts={communityPosts}
            currentUser={user}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onRepostPost={handleRepostPost}
            onVotePoll={handleVotePoll}
            onMarkHelpfulAnswer={handleMarkHelpfulAnswer}
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

      {/* Spotify & Study Music Player Modal / Mini-Player */}
      <SpotifyMusicPlayer
        isOpen={isMusicPlayerOpen}
        onClose={() => setIsMusicPlayerOpen(false)}
      />

      {/* Platform Interactive Video Tour Modal */}
      <PlatformVideoTour
        isOpen={isVideoTourOpen}
        onClose={() => setIsVideoTourOpen(false)}
        onNavigateToTab={setActiveTab}
      />

      {/* 1,000 XP Milestone Reward Modal */}
      {activeMilestoneModal && (
        <MilestoneRewardModal
          rewardData={activeMilestoneModal}
          onClaim={handleClaimMilestone}
        />
      )}

    </div>
  );
}

