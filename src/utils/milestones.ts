import { MilestoneRewardData } from '../components/MilestoneRewardModal';

export const getMilestoneReward = (milestoneXp: number): MilestoneRewardData => {
  switch (milestoneXp) {
    case 1000:
      return {
        milestoneXp: 1000,
        coinsBonus: 300,
        badgeName: 'Héroe del Milenio (1000+ XP) 🎖️',
        badgeIcon: '🏆',
        titleUnlocked: 'Maestro de los 1000 XP 🌟',
      };
    case 2000:
      return {
        milestoneXp: 2000,
        coinsBonus: 500,
        badgeName: 'Titán del Conocimiento (2000+ XP) ⚡',
        badgeIcon: '⚡',
        titleUnlocked: 'Leyenda de los 2000 XP 👑',
      };
    case 3000:
      return {
        milestoneXp: 3000,
        coinsBonus: 750,
        badgeName: 'Sabio Supremo (3000+ XP) 🎓',
        badgeIcon: '🎓',
        titleUnlocked: 'Conquistador de 3000 XP 🌌',
      };
    case 4000:
      return {
        milestoneXp: 4000,
        coinsBonus: 1000,
        badgeName: 'Guerrero Celestial (4000+ XP) ⚔️',
        badgeIcon: '⚔️',
        titleUnlocked: 'Dios del Estudio (4000 XP) 🌟',
      };
    default:
      return {
        milestoneXp: milestoneXp,
        coinsBonus: 1000 + Math.floor((milestoneXp - 4000) / 1000) * 250,
        badgeName: `Insignia de Leyenda (${milestoneXp} XP) 👑`,
        badgeIcon: '💎',
        titleUnlocked: `Imperador Estudiantil (${milestoneXp} XP) 👑`,
      };
  }
};

/**
  * Returns array of milestone thresholds (1000, 2000, 3000...) reached by userXp that have NOT been claimed yet.
  */
export const getUnclaimedMilestones = (userXp: number, claimedMilestones: number[] = []): number[] => {
  const unclaimed: number[] = [];
  const maxMilestoneReached = Math.floor(userXp / 1000) * 1000;
  
  for (let m = 1000; m <= maxMilestoneReached; m += 1000) {
    if (!claimedMilestones.includes(m)) {
      unclaimed.push(m);
    }
  }
  return unclaimed;
};

/**
  * Returns the next 1000 XP milestone target for the user.
  */
export const getNextMilestone = (userXp: number): number => {
  return (Math.floor(userXp / 1000) + 1) * 1000;
};
