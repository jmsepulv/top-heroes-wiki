export interface GearSet {
  id: string;
  name: string;
  rarity: 'mythic' | 'legendary' | 'epic';
  recommendedFor: string;
  twoPieceBonus: string;
  fourPieceBonus: string;
  twoPieceStats: {
    hpPercent?: number;
    atkPercent?: number;
    defPercent?: number;
    dmgRed?: number;
    critRate?: number;
    haste?: number;
    healing?: number;
  };
}

export interface EquipItem {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'helmet' | 'boots' | 'ring';
  rarity: 'mythic' | 'legendary' | 'epic';
  setId: string;
  stats: {
    hp?: number;
    atk?: number;
    def?: number;
    spd?: number;
    critRate?: number;
    haste?: number;
    dmgRed?: number;
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

export const GEAR_SETS: GearSet[] = [
  {
    id: 'valiant_knight',
    name: "Valiant Guardian's Plate",
    rarity: 'mythic',
    recommendedFor: 'Tanks & Frontline Bruisers (Paragon, Secret Keeper, Treant)',
    twoPieceBonus: '+15% Max HP & +10% Damage Reduction',
    fourPieceBonus: 'Upon dropping below 40% HP, gain a barrier equal to 35% Max HP for 8s (CD: 45s).',
    twoPieceStats: { hpPercent: 15, dmgRed: 10 },
  },
  {
    id: 'arcane_conduit',
    name: 'Arcane Conduit Robes',
    rarity: 'mythic',
    recommendedFor: 'Magic DPS & Nukers (Pyromancer, Astrologer, Warlock)',
    twoPieceBonus: '+18% Magic ATK & +12% Skill Haste',
    fourPieceBonus: 'Skills inflict Burn/Shock dealing 40% ATK per second for 4s, stacking up to 3 times.',
    twoPieceStats: { atkPercent: 18, haste: 12 },
  },
  {
    id: 'savage_predator',
    name: 'Savage Predator Leather',
    rarity: 'mythic',
    recommendedFor: 'Physical DPS & Assassins (Desert Prince, Windwalker, Headhunter)',
    twoPieceBonus: '+15% Physical ATK & +12% Crit Rate',
    fourPieceBonus: 'Critical strikes increase ATK Speed by 25% and Armor Penetration by 20% for 6s.',
    twoPieceStats: { atkPercent: 15, critRate: 12 },
  },
  {
    id: 'celestial_hymn',
    name: 'Celestial Hymn Vestments',
    rarity: 'legendary',
    recommendedFor: 'Supports & Healers (Forest Maiden, Bard, Shaman, Druid)',
    twoPieceBonus: '+15% Healing Output & +10% Energy Regen',
    fourPieceBonus: 'Casting an ultimate grants all allies +15% ATK and +15% DEF for 6s.',
    twoPieceStats: { healing: 15, haste: 10 },
  },
];

export const EQUIP_ITEMS: EquipItem[] = [
  // ================= Valiant Guardian Set =================
  { id: 'valiant_sword', name: "Guardian's Warblade", slot: 'weapon', rarity: 'mythic', setId: 'valiant_knight', stats: { atk: 1800, hp: 12000, def: 500 } },
  { id: 'valiant_armor', name: "Guardian's Heavy Plate", slot: 'armor', rarity: 'mythic', setId: 'valiant_knight', stats: { hp: 38000, def: 2400, dmgRed: 6 } },
  { id: 'valiant_helm', name: "Guardian's Greathelm", slot: 'helmet', rarity: 'mythic', setId: 'valiant_knight', stats: { hp: 22000, def: 1800 } },
  { id: 'valiant_boots', name: "Guardian's Iron Sabatons", slot: 'boots', rarity: 'mythic', setId: 'valiant_knight', stats: { hp: 18000, def: 1200, spd: 40 } },
  { id: 'valiant_ring', name: "Guardian's Bulwark Band", slot: 'ring', rarity: 'mythic', setId: 'valiant_knight', stats: { hp: 25000, def: 1500, dmgRed: 4 } },

  // ================= Arcane Conduit Set =================
  { id: 'arcane_staff', name: 'Conduit Astral Staff', slot: 'weapon', rarity: 'mythic', setId: 'arcane_conduit', stats: { atk: 4800, haste: 8, critRate: 6 } },
  { id: 'arcane_robe', name: 'Conduit Weave Robe', slot: 'armor', rarity: 'mythic', setId: 'arcane_conduit', stats: { hp: 16000, def: 900, haste: 6 } },
  { id: 'arcane_hood', name: 'Conduit Astromancer Hood', slot: 'helmet', rarity: 'mythic', setId: 'arcane_conduit', stats: { atk: 1500, hp: 12000, haste: 5 } },
  { id: 'arcane_boots', name: 'Conduit Starlight Slippers', slot: 'boots', rarity: 'mythic', setId: 'arcane_conduit', stats: { atk: 1200, spd: 70, haste: 4 } },
  { id: 'arcane_ring', name: 'Conduit Resonance Ring', slot: 'ring', rarity: 'mythic', setId: 'arcane_conduit', stats: { atk: 3200, critRate: 8, haste: 5 } },

  // ================= Savage Predator Set =================
  { id: 'savage_daggers', name: 'Predator Twin Fangs', slot: 'weapon', rarity: 'mythic', setId: 'savage_predator', stats: { atk: 5200, critRate: 10, spd: 50 } },
  { id: 'savage_chest', name: 'Predator Shadow Jerkin', slot: 'armor', rarity: 'mythic', setId: 'savage_predator', stats: { hp: 20000, def: 1100, critRate: 5 } },
  { id: 'savage_helm', name: 'Predator Wolf Cowl', slot: 'helmet', rarity: 'mythic', setId: 'savage_predator', stats: { atk: 1800, hp: 14000, critRate: 6 } },
  { id: 'savage_boots', name: 'Predator Swift Striders', slot: 'boots', rarity: 'mythic', setId: 'savage_predator', stats: { atk: 1400, spd: 90, critRate: 4 } },
  { id: 'savage_ring', name: 'Predator Blood Band', slot: 'ring', rarity: 'mythic', setId: 'savage_predator', stats: { atk: 3500, critRate: 10 } },

  // ================= Celestial Hymn Set =================
  { id: 'celestial_scepter', name: 'Hymn Blessed Scepter', slot: 'weapon', rarity: 'legendary', setId: 'celestial_hymn', stats: { atk: 2800, hp: 15000, haste: 8 } },
  { id: 'celestial_vest', name: 'Hymn Vestment Robe', slot: 'armor', rarity: 'legendary', setId: 'celestial_hymn', stats: { hp: 24000, def: 1400, dmgRed: 5 } },
  { id: 'celestial_mitre', name: 'Hymn Golden Mitre', slot: 'helmet', rarity: 'legendary', setId: 'celestial_hymn', stats: { hp: 18000, def: 1100, haste: 6 } },
  { id: 'celestial_boots', name: 'Hymn Pilgrim Sandals', slot: 'boots', rarity: 'legendary', setId: 'celestial_hymn', stats: { hp: 14000, spd: 60, haste: 5 } },
  { id: 'celestial_ring', name: 'Hymn Rosary Signet', slot: 'ring', rarity: 'legendary', setId: 'celestial_hymn', stats: { hp: 20000, atk: 1500, haste: 8 } },
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
