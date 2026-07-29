import React from 'react';
import { Trophy, Coins, Award, Crown, Sparkles, Check, Gift, Zap } from 'lucide-react';

export interface MilestoneRewardData {
  milestoneXp: number;
  coinsBonus: number;
  badgeName: string;
  badgeIcon: string;
  titleUnlocked: string;
}

interface MilestoneRewardModalProps {
  rewardData: MilestoneRewardData;
  onClaim: () => void;
}

export const MilestoneRewardModal: React.FC<MilestoneRewardModalProps> = ({
  rewardData,
  onClaim,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-auto animate-in zoom-in-95 duration-300 relative">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header Banner */}
        <div className="bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-6 text-center relative">
          
          <div className="inline-flex items-center gap-1 bg-slate-950/20 backdrop-blur-md text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-slate-950/10">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>¡Hito Legendario de XP Alcanzado!</span>
          </div>

          <div className="relative w-24 h-24 mx-auto my-2">
            <div className="absolute inset-0 bg-white/40 rounded-3xl blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-slate-950 to-indigo-950 text-amber-400 flex items-center justify-center shadow-2xl border-2 border-amber-300 transform rotate-3">
              <Trophy className="w-12 h-12 text-amber-400" />
            </div>
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md animate-bounce">
              +{rewardData.milestoneXp} XP
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-950 mt-1">
            ¡Cofre de {rewardData.milestoneXp} XP Desbloqueado!
          </h2>
          <p className="text-xs font-bold text-slate-900/80 mt-1">
            Has demostrado una constancia increíble acumulando más de {rewardData.milestoneXp} Puntos de Experiencia.
          </p>
        </div>

        {/* Rewards Unlocked List */}
        <div className="p-6 space-y-4 bg-slate-50/50">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">
            Recompensas Especiales Obtenidas:
          </p>

          <div className="space-y-2.5">
            {/* Coins Reward */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-900">+{rewardData.coinsBonus} Monedas de Oro</div>
                <div className="text-[11px] text-slate-500">Bonificación directa a tu monedero estudiantil</div>
              </div>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                🪙 Gratis
              </span>
            </div>

            {/* Badge Unlocked */}
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0 text-xl">
                {rewardData.badgeIcon}
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-900">{rewardData.badgeName}</div>
                <div className="text-[11px] text-slate-500">Insignia especial añadida a tu perfil</div>
              </div>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                🎖️ Medalla
              </span>
            </div>

            {/* Title Unlocked */}
            <div className="bg-white p-3.5 rounded-2xl border border-purple-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-900">{rewardData.titleUnlocked}</div>
                <div className="text-[11px] text-slate-500">Nuevo título de rango disponible para equipar</div>
              </div>
              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                👑 Rango
              </span>
            </div>

            {/* Game Power-up */}
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-900">Pase Dorado de Desafíos & Multiplicador x2</div>
                <div className="text-[11px] text-slate-500">Multiplicador de bonificación para tus próximos juegos</div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ⚡ Power-up
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClaim}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-200 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Gift className="w-4 h-4" />
            <span>¡Reclamar Todo e Ingresar al Siguiente Nivel!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
