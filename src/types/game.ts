export type FactionId = 'league' | 'nature' | 'horde';
export type HeroRarity = 'mythic' | 'legendary' | 'epic';
export type HeroRole = 'tank' | 'dps' | 'support' | 'control';
export type DamageType = 'physical' | 'magic';
export type GameMode = 'pvp' | 'pve_boss' | 'adventure' | 'all';
export type TierRank = 'S+' | 'S' | 'A' | 'B' | 'C';

export interface Skill {
  id: string;
  name: string;
  type: 'active' | 'passive' | 'ultimate';
  description: string;
  cooldown?: number;
}

export interface HeroBuild {
  id: string;
  name: string;
  gameMode: GameMode;
  statPriorities: string[];
  recommendedGear: string[];
  recommendedArtifacts: string[];
  notes: string;
  patchVersion: string;
  lastVerified: string;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  faction: FactionId;
  rarity: HeroRarity;
  role: HeroRole;
  damageType: DamageType;
  avatar: string;
  description: string;
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
  skills: Skill[];
  bestTeammates: string[];
  tierRankings: {
    pvp: TierRank;
    pve: TierRank;
  };
  builds: HeroBuild[];
}

export interface FactionBonus {
  count: number;
  atkPercent: number;
  hpPercent: number;
  description: string;
}

export interface Faction {
  id: FactionId;
  name: string;
  themeColor: string;
  accentColor: string;
  description: string;
  bonuses: FactionBonus[];
}

export interface LineupSlot {
  slotIndex: number;
  position: 'front' | 'back';
  heroId: string;
  isCore: boolean;
  substitutes: string[];
}

export interface Lineup {
  id: string;
  name: string;
  gameMode: GameMode;
  tier: TierRank;
  description: string;
  notes: string;
  patchVersion: string;
  lastVerified: string;
  slots: LineupSlot[];
}

export interface GearItem {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'helmet' | 'boots' | 'ring';
  rarity: HeroRarity;
  bonus: string;
}

export interface UserHeroState {
  owned: boolean;
  stars?: number;
  level?: number;
}

export type UserRoster = Record<string, UserHeroState>;

export interface LineupRecommendation {
  lineup: Lineup;
  status: 'ready' | 'one_away' | 'goal';
  filledSlots: {
    slotIndex: number;
    heroId: string;
    isOriginal: boolean;
    isSubstitute: boolean;
  }[];
  missingCoreHeroes: string[];
  missingSubstitutableSlots: {
    slotIndex: number;
    desiredHeroId: string;
    substitutes: string[];
  }[];
  score: number;
  activeFactionAura?: {
    faction: FactionId;
    count: number;
    atkPercent: number;
    hpPercent: number;
    description: string;
  };
}
