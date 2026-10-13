import { CANONICAL_GEAR_SETS, TITAN_MARKS, ALL_HERO_GEAR_RECOMMENDATIONS, type GearSetInfo } from './progression';

export interface GearSet {
  id: string;
  name: string;
  rarity: 'mythic' | 'legendary' | 'epic';
  recommendedFor: string;
  gearAttackPct: number;
  gearHpPct: number;
  otherBonusName: string;
  otherBonusPct: number;
  description: string;
  twoPieceBonus: string;
  fourPieceBonus: string;
}

export interface EquipItem {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'helmet' | 'boots';
  rarity: 'mythic' | 'legendary' | 'epic';
  setId: string;
  stats: {
    hp: number;
    atk: number;
    def?: number;
    spd?: number;
    critRate?: number;
  };
}

export interface Artifact {
  id: string;
  name: string;
  rarity: 'mythic' | 'legendary';
  recommendedRole: string;
  effect: string;
  stats: {
    hp?: number;
    atk?: number;
    def?: number;
    critRate?: number;
    energyRegen?: number;
  };
}

// Canonical Top Heroes 4-piece endgame gear sets
export const GEAR_SETS: GearSet[] = [
  {
    id: 'fury_of_blood',
    name: 'Fury of Blood',
    rarity: 'mythic',
    recommendedFor: 'Tanks, healers, HP-scaling kits, Nature faction',
    gearAttackPct: 0,
    gearHpPct: 160,
    otherBonusName: 'Damage Reduction',
    otherBonusPct: 6,
    description: '+160% Gear HP, +6% Damage Reduction. Supreme defensive durability for frontline tanks and HP healers.',
    twoPieceBonus: '+40% Gear HP',
    fourPieceBonus: '+160% Gear HP & +6% Universal Damage Reduction',
  },
  {
    id: 'glory_of_the_knight',
    name: 'Glory of the Knight',
    rarity: 'mythic',
    recommendedFor: 'Skill-damage & AoE nukers (Paragon, Bishop, Pyromancer)',
    gearAttackPct: 40,
    gearHpPct: 80,
    otherBonusName: 'Skill Damage Amplify',
    otherBonusPct: 8,
    description: '+40% Gear ATK, +80% Gear HP, +8% Skill Damage Amplify. Optimal for skill and ultimate burst damage.',
    twoPieceBonus: '+20% Gear ATK & +40% Gear HP',
    fourPieceBonus: '+40% Gear ATK, +80% Gear HP & +8% Skill Damage Amplify',
  },
  {
    id: 'titans_might',
    name: "Titan's Might",
    rarity: 'mythic',
    recommendedFor: 'Flat-ATK scaling & raw DPS carries (Wanderer, Storm Maiden, Astrologer)',
    gearAttackPct: 80,
    gearHpPct: 0,
    otherBonusName: 'Damage Increase',
    otherBonusPct: 6,
    description: "+80% Gear ATK, +6% Damage Increase. Maximum sustained physical and attack-scaling damage output.",
    twoPieceBonus: '+40% Gear ATK',
    fourPieceBonus: "+80% Gear ATK & +6% Universal Damage Increase",
  },
];

// Equipment items per set (4 slots: Weapon / Sword, Armor, Helmet, Boots)
// In Top Heroes: Sword & Boots provide Gear Attack primary; Helmet & Armor provide Gear HP primary
export const EQUIP_ITEMS: EquipItem[] = [
  // ================= Fury of Blood =================
  {
    id: 'fury_sword',
    name: "Bloodfury Blade",
    slot: 'weapon',
    rarity: 'mythic',
    setId: 'fury_of_blood',
    stats: { atk: 3200, hp: 12000, def: 400 },
  },
  {
    id: 'fury_armor',
    name: "Bloodfury Carapace",
    slot: 'armor',
    rarity: 'mythic',
    setId: 'fury_of_blood',
    stats: { atk: 1200, hp: 42000, def: 2100 },
  },
  {
    id: 'fury_helmet',
    name: "Bloodfury Greathelm",
    slot: 'helmet',
    rarity: 'mythic',
    setId: 'fury_of_blood',
    stats: { atk: 1400, hp: 36000, def: 1800 },
  },
  {
    id: 'fury_boots',
    name: "Bloodfury Warboots",
    slot: 'boots',
    rarity: 'mythic',
    setId: 'fury_of_blood',
    stats: { atk: 3100, hp: 14000, spd: 45 },
  },

  // ================= Glory of the Knight =================
  {
    id: 'glory_sword',
    name: "Knight's Radiant Edge",
    slot: 'weapon',
    rarity: 'mythic',
    setId: 'glory_of_the_knight',
    stats: { atk: 4500, hp: 14000, critRate: 6 },
  },
  {
    id: 'glory_armor',
    name: "Knight's Regal Cuirass",
    slot: 'armor',
    rarity: 'mythic',
    setId: 'glory_of_the_knight',
    stats: { atk: 1800, hp: 32000, def: 1500 },
  },
  {
    id: 'glory_helmet',
    name: "Knight's Crested Visor",
    slot: 'helmet',
    rarity: 'mythic',
    setId: 'glory_of_the_knight',
    stats: { atk: 2100, hp: 28000, def: 1200 },
  },
  {
    id: 'glory_boots',
    name: "Knight's Gilded Sabatons",
    slot: 'boots',
    rarity: 'mythic',
    setId: 'glory_of_the_knight',
    stats: { atk: 4200, hp: 16000, spd: 55 },
  },

  // ================= Titan's Might =================
  {
    id: 'titan_sword',
    name: "Titan's Crushing Cleaver",
    slot: 'weapon',
    rarity: 'mythic',
    setId: 'titans_might',
    stats: { atk: 5800, hp: 8000, critRate: 8 },
  },
  {
    id: 'titan_armor',
    name: "Titan's Colossus Mail",
    slot: 'armor',
    rarity: 'mythic',
    setId: 'titans_might',
    stats: { atk: 2800, hp: 22000, def: 1100 },
  },
  {
    id: 'titan_helmet',
    name: "Titan's Horned Crown",
    slot: 'helmet',
    rarity: 'mythic',
    setId: 'titans_might',
    stats: { atk: 3000, hp: 18000, critRate: 5 },
  },
  {
    id: 'titan_boots',
    name: "Titan's Earthshaker Greaves",
    slot: 'boots',
    rarity: 'mythic',
    setId: 'titans_might',
    stats: { atk: 5400, hp: 9000, spd: 65 },
  },
];

export const ARTIFACTS: Artifact[] = [
  {
    id: 'crown_realm',
    name: 'Crown of the Realm',
    rarity: 'mythic',
    recommendedRole: 'Tanks',
    effect: 'Increases team Damage Reduction by 8%. When carrier takes critical hit, heals 5% Max HP.',
    stats: { hp: 45000, def: 2200 },
  },
  {
    id: 'phoenix_feather',
    name: 'Phoenix Flamefeather',
    rarity: 'mythic',
    recommendedRole: 'Magic DPS',
    effect: 'Attacks ignite enemies for 50% ATK per second. Carrier gains +20% Magic Damage against burned targets.',
    stats: { atk: 6500, critRate: 12 },
  },
  {
    id: 'scimitar_sands',
    name: 'Scimitar of the Sands',
    rarity: 'mythic',
    recommendedRole: 'Physical Carries',
    effect: 'Critical hits ignore 25% of target defense and grant +15% Attack Speed for 5 seconds.',
    stats: { atk: 6800, critRate: 14 },
  },
  {
    id: 'emerald_scepter',
    name: 'Emerald Scepter of Grove',
    rarity: 'mythic',
    recommendedRole: 'Supports & Healers',
    effect: 'Increases healing effectiveness by 30%. Ultimates grant front row +20% Max HP barrier.',
    stats: { hp: 35000, energyRegen: 25 },
  },
];

export { TITAN_MARKS, ALL_HERO_GEAR_RECOMMENDATIONS };
