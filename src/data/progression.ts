// ============================================================================
// Top Heroes: Kingdom Saga - Progression Systems Database
// Extracted and verified from community research (Fandom, topheroes.info, 
// guidetopheroes.com, topheroestier.com, atwiki.jp, and Reddit community data).
// ============================================================================

export type Faction = 'League' | 'Nature' | 'Horde';
export type HeroRarity = 'Mythic' | 'Legendary' | 'Epic' | 'Rare';

// ----------------------------------------------------------------------------
// 1. GEAR SETS
// ----------------------------------------------------------------------------
export interface GearSetInfo {
  id: string;
  name: string;
  gearAttackPct: number;
  gearHpPct: number;
  otherBonusName: string;
  otherBonusPct: number;
  bestRole: string;
  description: string;
}

export const CANONICAL_GEAR_SETS: GearSetInfo[] = [
  {
    id: 'fury_of_blood',
    name: 'Fury of Blood',
    gearAttackPct: 0,
    gearHpPct: 160,
    otherBonusName: 'Damage Reduction',
    otherBonusPct: 6,
    bestRole: 'Tanks, healers, HP-scaling kits, entire Nature faction',
    description: 'Massive +160% Gear HP pool combined with 6% universal Damage Reduction. The premier set for frontline survivability and health-scaling abilities.',
  },
  {
    id: 'glory_of_the_knight',
    name: 'Glory of the Knight',
    gearAttackPct: 40,
    gearHpPct: 80,
    otherBonusName: 'Skill Damage Amplify',
    otherBonusPct: 8,
    bestRole: 'Skill-damage / AoE heroes (Paragon, Bishop, Pyromancer)',
    description: 'Balanced +40% Gear ATK and +80% Gear HP, crowned with +8% Skill Damage Amplify. Amplifies high-burst ultimate and active skill rotations.',
  },
  {
    id: 'titans_might',
    name: "Titan's Might",
    gearAttackPct: 80,
    gearHpPct: 0,
    otherBonusName: 'Damage Increase',
    otherBonusPct: 6,
    bestRole: 'Flat-ATK scaling / raw DPS heroes (Wanderer, Storm Maiden, Astrologer)',
    description: 'Pure offensive firepower with +80% Gear ATK and +6% Damage Increase. Essential for heroes whose skills and auto-attacks scale directly off raw base attack.',
  },
];

// ----------------------------------------------------------------------------
// 2. GEAR PIECE TYPES
// ----------------------------------------------------------------------------
export interface GearPieceType {
  pieceType: 'Sword' | 'Boots' | 'Helmet' | 'Chest / Armor';
  slotKey: 'weapon' | 'boots' | 'helmet' | 'armor';
  primaryStat: string;
  secondaryStat: string;
  notes: string;
}

export const GEAR_PIECE_TYPES: GearPieceType[] = [
  { pieceType: 'Sword', slotKey: 'weapon', primaryStat: 'Gear Attack', secondaryStat: 'Gear HP', notes: 'Offensive anchor; boots also provide attack.' },
  { pieceType: 'Boots', slotKey: 'boots', primaryStat: 'Gear Attack', secondaryStat: 'Gear HP', notes: 'Grants Attack rather than HP, contrary to typical RPG conventions.' },
  { pieceType: 'Helmet', slotKey: 'helmet', primaryStat: 'Gear HP', secondaryStat: 'Gear Attack', notes: 'Defensive piece with high health allocation.' },
  { pieceType: 'Chest / Armor', slotKey: 'armor', primaryStat: 'Gear HP', secondaryStat: 'Gear Attack', notes: 'Primary armor piece providing massive Gear HP scaling.' },
];

// ----------------------------------------------------------------------------
// 3. TITAN MARKS (FACTION MARKS)
// ----------------------------------------------------------------------------
export interface TitanMark {
  faction: Faction;
  bonusPct: number;
  condition: string;
  acquisitionSources: string[];
}

export const TITAN_MARKS: TitanMark[] = [
  {
    faction: 'League',
    bonusPct: 30,
    condition: 'Mark assigned to gear + equipped on League hero',
    acquisitionSources: ['Star Gem Shop (240 Star Gems each)', 'Guild Vault (weekly points shop)', 'Special event packs'],
  },
  {
    faction: 'Nature',
    bonusPct: 30,
    condition: 'Mark assigned to gear + equipped on Nature hero',
    acquisitionSources: ['Star Gem Shop (240 Star Gems each)', 'Guild Vault (weekly points shop)', 'Special event packs'],
  },
  {
    faction: 'Horde',
    bonusPct: 30,
    condition: 'Mark assigned to gear + equipped on Horde hero',
    acquisitionSources: ['Star Gem Shop (240 Star Gems each)', 'Guild Vault (weekly points shop)', 'Special event packs'],
  },
];

// ----------------------------------------------------------------------------
// 4. PER-HERO GEAR RECOMMENDATIONS (All 46 Heroes)
// ----------------------------------------------------------------------------
export interface HeroGearRecommendation {
  hero: string;
  rarity: HeroRarity;
  faction: Faction;
  recommendedSet: string;
  alternateSet?: string;
}

export const ALL_HERO_GEAR_RECOMMENDATIONS: HeroGearRecommendation[] = [
  // League
  { hero: 'Adjudicator', rarity: 'Legendary', faction: 'League', recommendedSet: 'Fury of Blood' },
  { hero: 'Artificer', rarity: 'Mythic', faction: 'League', recommendedSet: 'Glory of the Knight', alternateSet: 'Fury of Blood' },
  { hero: 'Astrologer', rarity: 'Legendary', faction: 'League', recommendedSet: "Titan's Might" },
  { hero: 'Bard', rarity: 'Legendary', faction: 'League', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Bishop', rarity: 'Mythic', faction: 'League', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Hostess', rarity: 'Legendary', faction: 'League', recommendedSet: 'Fury of Blood' },
  { hero: 'Nun', rarity: 'Legendary', faction: 'League', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Paragon', rarity: 'Mythic', faction: 'League', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Pyromancer', rarity: 'Legendary', faction: 'League', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Rose Princess', rarity: 'Mythic', faction: 'League', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Secret Keeper', rarity: 'Legendary', faction: 'League', recommendedSet: 'Fury of Blood' },
  { hero: 'Knight', rarity: 'Epic', faction: 'League', recommendedSet: 'Fury of Blood' },
  { hero: 'Minister', rarity: 'Epic', faction: 'League', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Ranger', rarity: 'Epic', faction: 'League', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Warrior', rarity: 'Rare', faction: 'League', recommendedSet: 'Fury of Blood' },
  { hero: 'Wizard', rarity: 'Rare', faction: 'League', recommendedSet: 'Glory of the Knight' },

  // Nature
  { hero: 'Altar Marshal', rarity: 'Mythic', faction: 'Nature', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Druid', rarity: 'Legendary', faction: 'Nature', recommendedSet: 'Fury of Blood' },
  { hero: 'Forest Maiden', rarity: 'Legendary', faction: 'Nature', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Monk', rarity: 'Mythic', faction: 'Nature', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Petalis', rarity: 'Mythic', faction: 'Nature', recommendedSet: 'Glory of the Knight', alternateSet: 'Fury of Blood' },
  { hero: 'Pixie', rarity: 'Legendary', faction: 'Nature', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Sage', rarity: 'Legendary', faction: 'Nature', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Tidecaller', rarity: 'Mythic', faction: 'Nature', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Treeguard', rarity: 'Legendary', faction: 'Nature', recommendedSet: 'Fury of Blood' },
  { hero: 'Watcher', rarity: 'Legendary', faction: 'Nature', recommendedSet: "Titan's Might" },
  { hero: 'Windwalker', rarity: 'Legendary', faction: 'Nature', recommendedSet: "Titan's Might", alternateSet: 'Glory of the Knight' },
  { hero: 'Dancer', rarity: 'Epic', faction: 'Nature', recommendedSet: 'Fury of Blood' },
  { hero: 'Priestess', rarity: 'Epic', faction: 'Nature', recommendedSet: 'Fury of Blood' },
  { hero: 'Archer', rarity: 'Rare', faction: 'Nature', recommendedSet: "Titan's Might" },
  { hero: 'Pharmacist', rarity: 'Rare', faction: 'Nature', recommendedSet: 'Fury of Blood' },

  // Horde
  { hero: 'Barbarian', rarity: 'Legendary', faction: 'Horde', recommendedSet: 'Fury of Blood', alternateSet: "Titan's Might" },
  { hero: 'Beastmaster', rarity: 'Mythic', faction: 'Horde', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Desert Prince', rarity: 'Mythic', faction: 'Horde', recommendedSet: 'Glory of the Knight', alternateSet: "Titan's Might" },
  { hero: 'Shaman', rarity: 'Legendary', faction: 'Horde', recommendedSet: 'Fury of Blood' },
  { hero: 'Soulmancer', rarity: 'Legendary', faction: 'Horde', recommendedSet: 'Fury of Blood', alternateSet: 'Glory of the Knight' },
  { hero: 'Storm Maiden', rarity: 'Mythic', faction: 'Horde', recommendedSet: "Titan's Might", alternateSet: 'Glory of the Knight' },
  { hero: 'Swordmaster', rarity: 'Legendary', faction: 'Horde', recommendedSet: 'Fury of Blood', alternateSet: "Titan's Might" },
  { hero: 'Wanderer', rarity: 'Mythic', faction: 'Horde', recommendedSet: "Titan's Might", alternateSet: 'Glory of the Knight' },
  { hero: 'Warlock', rarity: 'Legendary', faction: 'Horde', recommendedSet: 'Glory of the Knight', alternateSet: 'Fury of Blood' },
  { hero: 'Wilderness Hunter', rarity: 'Legendary', faction: 'Horde', recommendedSet: "Titan's Might" },
  { hero: 'Witch', rarity: 'Mythic', faction: 'Horde', recommendedSet: 'Glory of the Knight', alternateSet: 'Fury of Blood' },
  { hero: 'Outlaw', rarity: 'Epic', faction: 'Horde', recommendedSet: 'Fury of Blood' },
  { hero: 'Rogue', rarity: 'Epic', faction: 'Horde', recommendedSet: "Titan's Might" },
  { hero: 'Blacksmith', rarity: 'Rare', faction: 'Horde', recommendedSet: 'Fury of Blood' },
  { hero: 'Guard', rarity: 'Rare', faction: 'Horde', recommendedSet: 'Fury of Blood' },
];

// ----------------------------------------------------------------------------
// 5. ENHANCEMENT MASTER BONUS LADDERS
// ----------------------------------------------------------------------------
export interface EnhancementMasterFlatTier {
  rarity: string;
  tierLabel: string;
  gearAttack: number;
  gearHp: number;
}

export const ENHANCEMENT_MASTER_FLAT: EnhancementMasterFlatTier[] = [
  { rarity: 'Rare', tierLabel: 'Lv 10', gearAttack: 700, gearHp: 7000 },
  { rarity: 'Epic', tierLabel: 'Lv 10', gearAttack: 1900, gearHp: 19000 },
  { rarity: 'Epic', tierLabel: 'Lv 20', gearAttack: 3000, gearHp: 32000 },
  { rarity: 'Epic', tierLabel: 'Lv 30', gearAttack: 4100, gearHp: 47000 },
  { rarity: 'Legendary', tierLabel: 'Lv 10', gearAttack: 5600, gearHp: 69000 },
  { rarity: 'Legendary', tierLabel: 'Lv 20', gearAttack: 7000, gearHp: 94000 },
  { rarity: 'Legendary', tierLabel: 'Lv 30', gearAttack: 8900, gearHp: 128000 },
  { rarity: 'Legendary', tierLabel: 'Lv 40', gearAttack: 11100, gearHp: 171000 },
  { rarity: 'Legendary', tierLabel: 'Gear ★1', gearAttack: 14800, gearHp: 250000 },
  { rarity: 'Legendary', tierLabel: 'Gear ★2', gearAttack: 18500, gearHp: 340000 },
  { rarity: 'Legendary', tierLabel: 'Gear ★3', gearAttack: 22200, gearHp: 441000 },
  { rarity: 'Legendary', tierLabel: 'Gear ★4', gearAttack: 33400, gearHp: 712000 },
  { rarity: 'Mythic', tierLabel: 'Mythic Base', gearAttack: 44500, gearHp: 949000 },
];

export interface EnhancementMasterPercentTier {
  level: string;
  gearAttackPct: number;
  gearHpPct: number;
}

export const ENHANCEMENT_MASTER_PERCENT: EnhancementMasterPercentTier[] = [
  { level: '+10', gearAttackPct: 10, gearHpPct: 10 },
  { level: '+20', gearAttackPct: 25, gearHpPct: 25 },
  { level: '+30', gearAttackPct: 50, gearHpPct: 50 },
  { level: '+40', gearAttackPct: 100, gearHpPct: 100 },
  { level: '+50', gearAttackPct: 200, gearHpPct: 200 },
];

// Per-piece milestone level rewards (granted individually to each piece)
export const PER_PIECE_LEVEL_REWARDS = {
  epic: [
    { level: 10, bonus: 'World PvE Damage +2% (Weapons/Boots) or World PvE Damage Reduction +2% (Chest/Helm)' },
    { level: 20, bonus: 'World PvE Damage +2% (Weapons/Boots) or World PvE Damage Reduction +2% (Chest/Helm)' },
    { level: 30, bonus: 'World PvE Damage +2% (Weapons/Boots) or World PvE Damage Reduction +2% (Chest/Helm)' },
  ],
  legendary: [
    { level: 10, sword: 'Gear ATK +832', chest: 'Gear HP +7,442', boots: 'Gear ATK +832', helmet: 'Gear HP +7,442' },
    { level: 20, sword: 'Critical Rate +5.2%', chest: 'Block +5.2%', boots: 'Critical Damage +5.2%', helmet: 'Normal Damage Reduction +5.2%' },
    { level: 30, sword: 'Gear ATK +832', chest: 'Gear HP +7,442', boots: 'Gear ATK +832', helmet: 'Gear HP +7,442' },
    { level: 40, sword: 'Critical Rate +5.2%', chest: 'Block +5.2%', boots: 'Critical Damage +5.2%', helmet: 'Normal Damage Reduction +5.2%' },
  ],
};

// ----------------------------------------------------------------------------
// 6. HERO STAR PROMOTION (15 Stars across 3 Bands)
// ----------------------------------------------------------------------------
export interface StarPromotionStep {
  band: 1 | 2 | 3;
  bandName: string;
  star: number; // 1 to 5 within band
  globalStar: number; // 1 to 15
  epicShards: number;
  legendaryShards: number;
  mythicShards: number;
  epicCumulative: number;
  legendaryCumulative: number;
  mythicCumulative: number;
}

export const STAR_PROMOTION_SCHEDULE: StarPromotionStep[] = [
  // Band 1 (Stars 1-5, Gold)
  { band: 1, bandName: 'Band 1 (Gold)', star: 1, globalStar: 1, epicShards: 5, legendaryShards: 5, mythicShards: 10, epicCumulative: 5, legendaryCumulative: 5, mythicCumulative: 10 },
  { band: 1, bandName: 'Band 1 (Gold)', star: 2, globalStar: 2, epicShards: 5, legendaryShards: 5, mythicShards: 10, epicCumulative: 10, legendaryCumulative: 10, mythicCumulative: 20 },
  { band: 1, bandName: 'Band 1 (Gold)', star: 3, globalStar: 3, epicShards: 10, legendaryShards: 10, mythicShards: 20, epicCumulative: 20, legendaryCumulative: 20, mythicCumulative: 40 },
  { band: 1, bandName: 'Band 1 (Gold)', star: 4, globalStar: 4, epicShards: 10, legendaryShards: 10, mythicShards: 20, epicCumulative: 30, legendaryCumulative: 30, mythicCumulative: 60 },
  { band: 1, bandName: 'Band 1 (Gold)', star: 5, globalStar: 5, epicShards: 20, legendaryShards: 20, mythicShards: 40, epicCumulative: 50, legendaryCumulative: 50, mythicCumulative: 100 },

  // Band 2 (Stars 6-10, Silver)
  { band: 2, bandName: 'Band 2 (Silver)', star: 1, globalStar: 6, epicShards: 30, legendaryShards: 30, mythicShards: 60, epicCumulative: 80, legendaryCumulative: 80, mythicCumulative: 160 },
  { band: 2, bandName: 'Band 2 (Silver)', star: 2, globalStar: 7, epicShards: 20, legendaryShards: 20, mythicShards: 40, epicCumulative: 100, legendaryCumulative: 100, mythicCumulative: 200 },
  { band: 2, bandName: 'Band 2 (Silver)', star: 3, globalStar: 8, epicShards: 20, legendaryShards: 20, mythicShards: 40, epicCumulative: 120, legendaryCumulative: 120, mythicCumulative: 240 },
  { band: 2, bandName: 'Band 2 (Silver)', star: 4, globalStar: 9, epicShards: 40, legendaryShards: 40, mythicShards: 80, epicCumulative: 160, legendaryCumulative: 160, mythicCumulative: 320 },
  { band: 2, bandName: 'Band 2 (Silver)', star: 5, globalStar: 10, epicShards: 40, legendaryShards: 40, mythicShards: 80, epicCumulative: 200, legendaryCumulative: 200, mythicCumulative: 400 },

  // Band 3 (Stars 11-15, Platinum / Rainbow)
  { band: 3, bandName: 'Band 3 (Platinum)', star: 1, globalStar: 11, epicShards: 80, legendaryShards: 80, mythicShards: 160, epicCumulative: 280, legendaryCumulative: 280, mythicCumulative: 560 },
  { band: 3, bandName: 'Band 3 (Platinum)', star: 2, globalStar: 12, epicShards: 20, legendaryShards: 20, mythicShards: 40, epicCumulative: 300, legendaryCumulative: 300, mythicCumulative: 600 },
  { band: 3, bandName: 'Band 3 (Platinum)', star: 3, globalStar: 13, epicShards: 40, legendaryShards: 40, mythicShards: 80, epicCumulative: 340, legendaryCumulative: 340, mythicCumulative: 680 },
  { band: 3, bandName: 'Band 3 (Platinum)', star: 4, globalStar: 14, epicShards: 80, legendaryShards: 80, mythicShards: 160, epicCumulative: 420, legendaryCumulative: 420, mythicCumulative: 840 },
  { band: 3, bandName: 'Band 3 (Platinum)', star: 5, globalStar: 15, epicShards: 80, legendaryShards: 80, mythicShards: 160, epicCumulative: 500, legendaryCumulative: 500, mythicCumulative: 1000 },
];

export const TOTAL_SHARDS_BY_RARITY = {
  epic: 500,
  legendary: 500,
  mythic: 1000,
};

// ----------------------------------------------------------------------------
// 7. AWAKENING (Legendary Heroes)
// ----------------------------------------------------------------------------
export interface AwakeningLevelCost {
  tier: number;
  level: number;
  shards: number;
  soulStones: number;
}

export const AWAKENING_COSTS: AwakeningLevelCost[] = [
  { tier: 0, level: 0, shards: 5, soulStones: 1 },
  { tier: 1, level: 0, shards: 5, soulStones: 0 },
  { tier: 1, level: 1, shards: 10, soulStones: 0 },
  { tier: 1, level: 2, shards: 10, soulStones: 0 },
  { tier: 1, level: 3, shards: 10, soulStones: 0 },
  { tier: 1, level: 4, shards: 15, soulStones: 0 },
  { tier: 1, level: 5, shards: 15, soulStones: 2 },
  { tier: 2, level: 0, shards: 15, soulStones: 0 },
  { tier: 2, level: 1, shards: 15, soulStones: 0 },
  { tier: 2, level: 2, shards: 15, soulStones: 0 },
  { tier: 2, level: 3, shards: 20, soulStones: 0 },
  { tier: 2, level: 4, shards: 20, soulStones: 0 },
  { tier: 2, level: 5, shards: 20, soulStones: 2 },
  { tier: 3, level: 0, shards: 20, soulStones: 0 },
  { tier: 3, level: 1, shards: 20, soulStones: 0 },
  { tier: 3, level: 2, shards: 30, soulStones: 0 },
  { tier: 3, level: 3, shards: 30, soulStones: 0 },
  { tier: 3, level: 4, shards: 30, soulStones: 0 },
  { tier: 3, level: 5, shards: 40, soulStones: 4 },
];

export const TOTAL_AWAKENING_COST = {
  shards: 345,
  soulStones: 9,
};

// ----------------------------------------------------------------------------
// 8. HERO TRAIT UPGRADES & ROTATION
// ----------------------------------------------------------------------------
export interface TraitRotationStep {
  step: number;
  fromLevel: number;
  toLevel: number;
  requirement: string;
}

export const TRAIT_ROTATION_STEPS: TraitRotationStep[] = [
  { step: 1, fromLevel: 0, toLevel: 5, requirement: 'Unlock all 4 traits with diamonds, then upgrade all 4 traits to Lv 5 with shards' },
  { step: 2, fromLevel: 5, toLevel: 10, requirement: 'All 4 traits must be at Lv 5 before any trait can advance towards Lv 10' },
  { step: 3, fromLevel: 10, toLevel: 15, requirement: 'All 4 traits must be at Lv 10 before any trait can advance towards Lv 15' },
  { step: 4, fromLevel: 15, toLevel: 20, requirement: 'All 4 traits must be at Lv 15 before any trait can advance towards Lv 20' },
  { step: 5, fromLevel: 20, toLevel: 25, requirement: 'All 4 traits must be at Lv 20 before any trait can advance towards Lv 25' },
  { step: 6, fromLevel: 25, toLevel: 30, requirement: 'All 4 traits must be at Lv 25 before any trait can reach the Lv 30 cap' },
];

export const TRAIT_RULES = {
  traitCount: 4,
  maxTraitLevel: 30,
  unlockLevel1Cost: 'Diamonds (exact amount depends on hero)',
  upgradeCostPerLevel: 10, // shards per level from 2 to 30
  shardsPerTraitMax: 290, // (30 - 1) * 10
  shardsTotalAllTraitsMax: 1160, // 290 * 4
  traitSwapCost: 2000, // diamonds to swap traits between heroes
};

// ----------------------------------------------------------------------------
// 9. EPIC HERO GLOBAL PASSIVE TRAITS
// ----------------------------------------------------------------------------
export interface EpicGlobalPassive {
  hero: string;
  faction: Faction;
  bonusName: string;
  maxBonusPct: number;
  maxTraitLevel: number;
  unlockRequirement: string;
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  notes: string;
}

export const EPIC_GLOBAL_PASSIVES: EpicGlobalPassive[] = [
  {
    hero: 'Brawler',
    faction: 'League',
    bonusName: 'Tech Research Speed',
    maxBonusPct: 30,
    maxTraitLevel: 30,
    unlockRequirement: '2-Star Platinum / 12 Stars',
    priority: 'HIGHEST',
    description: '+30% account-wide Technology Research Speed. Saves hundreds of research hours across the entire account.',
    notes: 'Permanent passive buff active even when Brawler is not assigned to any march or queue.',
  },
  {
    hero: 'Knight',
    faction: 'League',
    bonusName: 'Soldier Training Speed',
    maxBonusPct: 30,
    maxTraitLevel: 30,
    unlockRequirement: '2-Star Platinum / 12 Stars',
    priority: 'HIGHEST',
    description: '+30% account-wide Soldier Training Speed. Drastically reduces troop replenishment cycles during arms races.',
    notes: 'Essential for maintaining army power and dominating weekly Arms Race events.',
  },
  {
    hero: 'Ranger',
    faction: 'League',
    bonusName: 'Ruby Gathering Speed',
    maxBonusPct: 30,
    maxTraitLevel: 30,
    unlockRequirement: '2-Star Platinum / 12 Stars',
    priority: 'HIGH',
    description: '+30% Ruby Gathering Speed on the world map.',
    notes: 'Accelerates ruby mining nodes on the kingdom map for consistent free gem generation.',
  },
  {
    hero: 'Minister',
    faction: 'League',
    bonusName: 'Soldier Healing Speed',
    maxBonusPct: 30,
    maxTraitLevel: 30,
    unlockRequirement: '2-Star Platinum / 12 Stars',
    priority: 'MEDIUM',
    description: '+30% Hospital Soldier Healing Speed.',
    notes: 'Vital during Guild Wars and Server-vs-Server siege battles to recover wounded troops rapidly.',
  },
  {
    hero: 'Outlaw',
    faction: 'Horde',
    bonusName: 'Wood Gathering Speed',
    maxBonusPct: 30,
    maxTraitLevel: 30,
    unlockRequirement: '2-Star Platinum / 12 Stars',
    priority: 'LOW',
    description: '+30% Wood Resource Gathering Speed on the kingdom map.',
    notes: 'Quality of life gathering boost for lumber mill upgrades and high-level construction demands.',
  },
];

// ----------------------------------------------------------------------------
// 10. SKILL BOOK CONSUMPTION (Appendix)
// ----------------------------------------------------------------------------
export const SKILL_BOOK_CONSUMPTION = [
  { skillLevel: 2, books: 100 },
  { skillLevel: 3, books: 200 },
  { skillLevel: 4, books: 400 },
  { skillLevel: 5, books: 600 },
  { skillLevel: 6, books: 800 },
  { skillLevel: 7, books: 1100 },
  { skillLevel: 8, books: 1400 },
  { skillLevel: 9, books: 1700 },
  { skillLevel: 10, books: 2000 },
  { skillLevel: 11, books: 2200 },
  { skillLevel: 12, books: 2700 },
  { skillLevel: 13, books: 3200 },
  { skillLevel: 14, books: 3900 },
  { skillLevel: 15, books: 4700 },
];

