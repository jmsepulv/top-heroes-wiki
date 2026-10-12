import type { GearItem } from '../types/game';

export interface GearSet {
  id: string;
  name: string;
  rarity: 'mythic' | 'legendary' | 'epic';
  recommendedFor: string;
  twoPieceBonus: string;
  fourPieceBonus: string;
}

export const GEAR_SETS: GearSet[] = [
  {
    id: 'valiant_knight',
    name: "Valiant Guardian's Plate",
    rarity: 'mythic',
    recommendedFor: 'Tanks & Frontline Bruisers (Paragon, Secret Keeper, Treant)',
    twoPieceBonus: '+15% Max HP & +10% Damage Reduction',
    fourPieceBonus: 'Upon dropping below 40% HP, gain a shield equal to 35% Max HP for 8s (CD: 45s).',
  },
  {
    id: 'arcane_conduit',
    name: 'Arcane Conduit Robes',
    rarity: 'mythic',
    recommendedFor: 'Magic DPS & Nukers (Pyromancer, Astrologer, Warlock)',
    twoPieceBonus: '+18% Magic ATK & +12% Skill Haste',
    fourPieceBonus: 'Skills inflict Burn/Shock dealing 40% ATK every second for 4s, stacking up to 3 times.',
  },
  {
    id: 'savage_predator',
    name: 'Savage Predator Leather',
    rarity: 'mythic',
    recommendedFor: 'Physical DPS & Assassins (Desert Prince, Windwalker, Headhunter)',
    twoPieceBonus: '+15% Physical ATK & +12% Crit Rate',
    fourPieceBonus: 'Critical strikes increase ATK Speed by 25% and Armor Penetration by 20% for 6s.',
  },
  {
    id: 'celestial_hymn',
    name: 'Celestial Hymn Vestments',
    rarity: 'legendary',
    recommendedFor: 'Supports & Healers (Forest Maiden, Bard, Nun, Druid)',
    twoPieceBonus: '+15% Healing Output & +10% Energy Regen',
    fourPieceBonus: 'Casting an ultimate grants all allies +15% ATK and +15% DEF for 6s.',
  },
];

export const GEAR_ITEMS: GearItem[] = [
  { id: 'sword_radiance', name: 'Blade of Radiance', slot: 'weapon', rarity: 'mythic', bonus: '+2200 ATK, +8% Crit' },
  { id: 'shield_aegis', name: 'Aegis of the Realm', slot: 'armor', rarity: 'mythic', bonus: '+35000 HP, +12% DEF' },
  { id: 'helm_conqueror', name: 'Conqueror Crown', slot: 'helmet', rarity: 'mythic', bonus: '+18000 HP, +1000 DEF' },
  { id: 'boots_stride', name: 'Swiftwind Greaves', slot: 'boots', rarity: 'legendary', bonus: '+150 SPD, +15000 HP' },
  { id: 'ring_dominance', name: 'Signet of Dominance', slot: 'ring', rarity: 'mythic', bonus: '+1800 ATK, +10% Energy Rate' },
];

