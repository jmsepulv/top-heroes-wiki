// Data models and progression tables for Top Heroes calculators

export interface LevelMilestone {
  level: number;
  promotionStonesNeeded: number;
  totalMeatToNextMilestone: number;
  totalXpToNextMilestone: number;
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 20, promotionStonesNeeded: 50, totalMeatToNextMilestone: 25000, totalXpToNextMilestone: 15000 },
  { level: 40, promotionStonesNeeded: 150, totalMeatToNextMilestone: 80000, totalXpToNextMilestone: 55000 },
  { level: 60, promotionStonesNeeded: 400, totalMeatToNextMilestone: 220000, totalXpToNextMilestone: 160000 },
  { level: 80, promotionStonesNeeded: 900, totalMeatToNextMilestone: 550000, totalXpToNextMilestone: 420000 },
  { level: 100, promotionStonesNeeded: 1800, totalMeatToNextMilestone: 1200000, totalXpToNextMilestone: 950000 },
  { level: 120, promotionStonesNeeded: 3200, totalMeatToNextMilestone: 2500000, totalXpToNextMilestone: 2000000 },
  { level: 140, promotionStonesNeeded: 5000, totalMeatToNextMilestone: 4800000, totalXpToNextMilestone: 3900000 },
  { level: 160, promotionStonesNeeded: 7500, totalMeatToNextMilestone: 8500000, totalXpToNextMilestone: 7000000 },
  { level: 180, promotionStonesNeeded: 11000, totalMeatToNextMilestone: 14000000, totalXpToNextMilestone: 12000000 },
  { level: 200, promotionStonesNeeded: 16000, totalMeatToNextMilestone: 22000000, totalXpToNextMilestone: 19000000 },
];

export interface StarTier {
  stars: number;
  shardsRequired: number;
  statBonus: string;
}

export const STAR_TIERS: Record<string, StarTier[]> = {
  mythic: [
    { stars: 1, shardsRequired: 20, statBonus: '+10% Base HP & ATK' },
    { stars: 2, shardsRequired: 40, statBonus: '+20% Base HP & ATK' },
    { stars: 3, shardsRequired: 80, statBonus: '+35% Base HP & ATK, Skill Lv 2' },
    { stars: 4, shardsRequired: 140, statBonus: '+55% Base HP & ATK' },
    { stars: 5, shardsRequired: 220, statBonus: '+80% Base HP & ATK, Ultimate Lv 3' },
    { stars: 6, shardsRequired: 300, statBonus: 'Awakened Core: +110% Stats, Exclusive Aura' },
  ],
  legendary: [
    { stars: 1, shardsRequired: 15, statBonus: '+8% Base HP & ATK' },
    { stars: 2, shardsRequired: 30, statBonus: '+18% Base HP & ATK' },
    { stars: 3, shardsRequired: 60, statBonus: '+30% Base HP & ATK, Skill Lv 2' },
    { stars: 4, shardsRequired: 100, statBonus: '+45% Base HP & ATK' },
    { stars: 5, shardsRequired: 160, statBonus: '+65% Base HP & ATK, Ultimate Lv 3' },
    { stars: 6, shardsRequired: 240, statBonus: 'Awakened Core: +90% Stats' },
  ],
  epic: [
    { stars: 1, shardsRequired: 10, statBonus: '+6% Base HP & ATK' },
    { stars: 2, shardsRequired: 20, statBonus: '+14% Base HP & ATK' },
    { stars: 3, shardsRequired: 40, statBonus: '+25% Base HP & ATK, Skill Lv 2' },
    { stars: 4, shardsRequired: 70, statBonus: '+38% Base HP & ATK' },
    { stars: 5, shardsRequired: 110, statBonus: '+55% Base HP & ATK, Ultimate Lv 3' },
    { stars: 6, shardsRequired: 160, statBonus: 'Awakened Core: +75% Stats' },
  ],
};

export interface CastleLevelRequirement {
  level: number;
  meat: number;
  wood: number;
  stone: number;
  iron: number;
  baseTimeHours: number;
  prerequisite: string;
  keyUnlocks: string;
}

export const CASTLE_DATA: CastleLevelRequirement[] = [
  { level: 5, meat: 50000, wood: 50000, stone: 20000, iron: 0, baseTimeHours: 1, prerequisite: 'Wall Lv.4', keyUnlocks: 'Queue 1 Army capacity +10%' },
  { level: 10, meat: 250000, wood: 250000, stone: 120000, iron: 50000, baseTimeHours: 6, prerequisite: 'Wall Lv.9, Barracks Lv.9', keyUnlocks: 'Queue 2 Unlocked, Faction Tech' },
  { level: 15, meat: 1200000, wood: 1200000, stone: 650000, iron: 300000, baseTimeHours: 24, prerequisite: 'Wall Lv.14, Training Ground Lv.14', keyUnlocks: 'Tier 2 Soldiers, Advanced Research' },
  { level: 20, meat: 4500000, wood: 4500000, stone: 2600000, iron: 1400000, baseTimeHours: 72, prerequisite: 'Wall Lv.19, Hospital Lv.19', keyUnlocks: 'Queue 3 Unlocked, Hero Promotion Lv 140' },
  { level: 25, meat: 16000000, wood: 16000000, stone: 9500000, iron: 5200000, baseTimeHours: 192, prerequisite: 'Wall Lv.24, Embassy Lv.24', keyUnlocks: 'Tier 3 Soldiers, March Cap +30%' },
  { level: 30, meat: 65000000, wood: 65000000, stone: 42000000, iron: 25000000, baseTimeHours: 480, prerequisite: 'Wall Lv.29, Hall of War Lv.29', keyUnlocks: 'Queue 4 Unlocked, Mythic Resonance Cap' },
];

