import React from 'react';
import { UserProfile } from '../types';
import { getMilestoneReward, getNextMilestone, getUnclaimedMilestones } from '../utils/milestones';
import { Trophy, Coins, Crown, Sparkles, Gift, Check, Lock, ChevronRight, Zap } from 'lucide-react';

interface MilestonesSectionProps {
  user: UserProfile;
  onClaimMilestone: (milestoneXp: number) => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  user,
  onClaimMilestone,
}) => {
  const claimedList = user.claimedMilestones || [];
  const unclaimedList = getUnclaimedMilestones(user.xp, claimedList);
  const nextTarget = getNextMilestone(user.xp);

  // Dynamically calculate milestone tiers (1000, 2000, 3000, 4000, 5000...) based on user XP
  const maxDynamicMilestone = Math.max(4000, (Math.floor(user.xp / 1000) + 1) * 1000);
  const milestoneTiers: number[] = [];
  for (let m = 1000; m <= maxDynamicMilestone; m += 1000) {
    milestoneTiers.push(m);
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/30 relative overflow-hidden space-y-6">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
            <span>Sistema de Recompensas por 1,000 XP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🎁 Cofres del Milenio de XP</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            ¡Cada vez que alcanzas miles de Puntos de Experiencia (1,000 XP, 2,000 XP, 3,000 XP...), desbloqueas cofres legendarios con monedas de oro, medallas exclusivas y títulos de rango!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">XP Acumulados</span>
          <span className="text-xl font-black text-amber-400 flex items-center justify-end gap-1">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            {user.xp} XP
          </span>
        </div>
      </div>

      {/* Immediate Unclaimed Alert Banner if any */}
      {unclaimedList.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wide">¡TIENES {unclaimedList.length} RECOMPENSA(S) DE 1,000 XP SIN RECLAMAR!</div>
              <div className="text-[11px] font-bold text-slate-900">
                Alcanzaste los {unclaimedList[0]} XP. Toca el botón para abrir tu cofre legendario.
              </div>
            </div>
          </div>

          <button
            onClick={() => onClaimMilestone(unclaimedList[0])}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black shadow-md transition-transform hover:scale-105 cursor-pointer shrink-0 flex items-center justify-center gap-2 border border-amber-300"
          >
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>¡Abrir Cofre de {unclaimedList[0]} XP Ahora!</span>
          </button>
        </div>
      )}

      {/* Grid of Milestone Chest Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestoneTiers.map((milestoneXp) => {
          const reward = getMilestoneReward(milestoneXp);
          const isReached = user.xp >= milestoneXp;
          const isClaimed = claimedList.includes(milestoneXp);
          const isReadyToClaim = isReached && !isClaimed;

          // Calculate progress if not reached yet
          const progressPercent = !isReached
            ? Math.min(100, Math.round((user.xp / milestoneXp) * 100))
            : 100;

          return (
            <div
              key={milestoneXp}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                isReadyToClaim
                  ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-indigo-950 border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                  : isClaimed
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-white/10 text-slate-400'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-amber-300">
                  {milestoneXp} XP
                </span>

                {isClaimed ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Check className="w-3 h-3" />
                    Reclamado
                  </span>
                ) : isReadyToClaim ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 animate-bounce">
                    <Gift className="w-3 h-3" />
                    ¡Listo!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    <Lock className="w-3 h-3" />
                    Bloqueado
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="space-y-1">
                <div className="text-3xl mb-1">{reward.badgeIcon}</div>
                <h3 className="text-sm font-extrabold text-white">{reward.badgeName}</h3>
                <p className="text-[11px] text-slate-300">
                  Otorgado al acumular {milestoneXp} XP en la plataforma.
                </p>
              </div>

              {/* Rewards List */}
              <div className="space-y-1.5 text-[11px] bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Coins className="w-3.5 h-3.5 fill-amber-300" />
                  <span>+{reward.coinsBonus} Monedas de Oro</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-300 font-bold truncate">
                  <Crown className="w-3.5 h-3.5" />
                  <span className="truncate">{reward.titleUnlocked}</span>
                </div>
              </div>

              {/* Footer Button / Progress */}
              <div>
                {isReadyToClaim ? (
                  <button
                    onClick={() => onClaimMilestone(milestoneXp)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>¡Abrir y Reclamar!</span>
                  </button>
                ) : isClaimed ? (
                  <div className="text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/20">
                    ✓ Recompensa Reclamada
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Progreso hacia {milestoneXp} XP</span>
                      <span>{user.xp} / {milestoneXp}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Next target info */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Siguiente meta del Milenio: <strong className="text-amber-300 font-extrabold">{nextTarget} XP</strong>. Te faltan <strong className="text-emerald-400">{Math.max(0, nextTarget - user.xp)} XP</strong>.
          </span>
        </span>
        <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
          ¡Sigue completando desafíos para desbloquear más cofres!
        </span>
      </div>

    </div>
  );
};
