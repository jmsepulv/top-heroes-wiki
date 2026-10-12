import type { Faction } from '../types/game';

export const FACTIONS: Faction[] = [
  {
    id: 'league',
    name: 'League',
    themeColor: '#3b82f6',
    accentColor: '#60a5fa',
    description: 'Human kingdom champions relying on iron defense, holy blessings, and destructive elemental magic.',
    bonuses: [
      { count: 2, atkPercent: 5, hpPercent: 5, description: '2 League heroes: +5% ATK, +5% HP' },
      { count: 3, atkPercent: 10, hpPercent: 10, description: '3 League heroes: +10% ATK, +10% HP' },
      { count: 4, atkPercent: 15, hpPercent: 15, description: '4 League heroes: +15% ATK, +15% HP' },
      { count: 5, atkPercent: 20, hpPercent: 20, description: '5 League heroes: +20% ATK, +20% HP' },
      { count: 6, atkPercent: 25, hpPercent: 25, description: '6 League heroes (Mono Aura): +25% ATK, +25% HP' },
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    themeColor: '#10b981',
    accentColor: '#34d495',
    description: 'Forest spirits, beast tamers, and woodland protectors specializing in crowd control, sustain, and agile physical strikes.',
    bonuses: [
      { count: 2, atkPercent: 5, hpPercent: 5, description: '2 Nature heroes: +5% ATK, +5% HP' },
      { count: 3, atkPercent: 10, hpPercent: 10, description: '3 Nature heroes: +10% ATK, +10% HP' },
      { count: 4, atkPercent: 15, hpPercent: 15, description: '4 Nature heroes: +15% ATK, +15% HP' },
      { count: 5, atkPercent: 20, hpPercent: 20, description: '5 Nature heroes: +20% ATK, +20% HP' },
      { count: 6, atkPercent: 25, hpPercent: 25, description: '6 Nature heroes (Mono Aura): +25% ATK, +25% HP' },
    ],
  },
  {
    id: 'horde',
    name: 'Horde',
    themeColor: '#ef4444',
    accentColor: '#f87171',
    description: 'Brutal wasteland warlords and shamans driven by raw strength, bleed damage, and merciless critical strikes.',
    bonuses: [
      { count: 2, atkPercent: 5, hpPercent: 5, description: '2 Horde heroes: +5% ATK, +5% HP' },
      { count: 3, atkPercent: 10, hpPercent: 10, description: '3 Horde heroes: +10% ATK, +10% HP' },
      { count: 4, atkPercent: 15, hpPercent: 15, description: '4 Horde heroes: +15% ATK, +15% HP' },
      { count: 5, atkPercent: 20, hpPercent: 20, description: '5 Horde heroes: +20% ATK, +20% HP' },
      { count: 6, atkPercent: 25, hpPercent: 25, description: '6 Horde heroes (Mono Aura): +25% ATK, +25% HP' },
    ],
  },
];

export function getFactionById(id: string): Faction | undefined {
  return FACTIONS.find((f) => f.id === id);
}

export function calculateAura(heroFactionCounts: Record<string, number>): {
  dominantFaction: string;
  count: number;
  atkPercent: number;
  hpPercent: number;
  description: string;
} | null {
  let best = { faction: '', count: 0, atk: 0, hp: 0, desc: '' };

  for (const [factionId, count] of Object.entries(heroFactionCounts)) {
    const faction = getFactionById(factionId);
    if (!faction) continue;

    const applicableBonus = [...faction.bonuses]
      .filter((b) => b.count <= count)
      .sort((a, b) => b.count - a.count)[0];

    if (applicableBonus && applicableBonus.atkPercent > best.atk) {
      best = {
        faction: factionId,
        count,
        atk: applicableBonus.atkPercent,
        hp: applicableBonus.hpPercent,
        desc: applicableBonus.description,
      };
    }
  }

  if (best.count >= 2) {
    return {
      dominantFaction: best.faction,
      count: best.count,
      atkPercent: best.atk,
      hpPercent: best.hp,
      description: best.desc,
    };
  }

  return null;
}

