import type { Lineup } from '../types/game';

export const LINEUPS: Lineup[] = [
  {
    id: 'league_mono_citadel',
    name: 'League Holy Citadel (Full Mono Burst)',
    gameMode: 'pvp',
    tier: 'S+',
    description: 'The premier defensive and magical burst lineup in current meta. Paragon and Secret Keeper form an impenetrable wall while Pyromancer and Astrologer wipe the enemy backline with meteor barrage.',
    notes: 'Frontline survives initial alpha strikes through Paragon shields. Bard provides crucial early energy so Pyromancer casts meteor first.',
    patchVersion: '1.24.0',
    lastVerified: 'October 2026',
    slots: [
      { slotIndex: 1, position: 'front', heroId: 'paragon', isCore: true, substitutes: ['barbarian', 'treant'] },
      { slotIndex: 2, position: 'front', heroId: 'secret_keeper', isCore: true, substitutes: ['treant', 'knight'] },
      { slotIndex: 3, position: 'back', heroId: 'pyromancer', isCore: true, substitutes: ['astrologer', 'warlock'] },
      { slotIndex: 4, position: 'back', heroId: 'astrologer', isCore: true, substitutes: ['pyromancer', 'sage'] },
      { slotIndex: 5, position: 'back', heroId: 'bard', isCore: false, substitutes: ['bishop', 'druid'] },
      { slotIndex: 6, position: 'back', heroId: 'bishop', isCore: false, substitutes: ['druid', 'shaman'] },
    ],
  },
  {
    id: 'nature_mono_overgrowth',
    name: 'Nature Primordial Dominion (Control & Sustain)',
    gameMode: 'pvp',
    tier: 'S+',
    description: 'Relentless crowd-control and constant regeneration. Forest Maiden locks down the entire battlefield while Windwalker snipes key threats and Treant soaks infinite damage.',
    notes: 'Excels against slower lineups. Windwalker takes down squishy casters while enemy frontlines are permanently rooted by Forest Maiden and Sage.',
    patchVersion: '1.24.0',
    lastVerified: 'October 2026',
    slots: [
      { slotIndex: 1, position: 'front', heroId: 'treant', isCore: true, substitutes: ['paragon', 'barbarian'] },
      { slotIndex: 2, position: 'front', heroId: 'pathfinder', isCore: false, substitutes: ['secret_keeper', 'barbarian'] },
      { slotIndex: 3, position: 'back', heroId: 'forest_maiden', isCore: true, substitutes: ['soulmancer', 'sage'] },
      { slotIndex: 4, position: 'back', heroId: 'windwalker', isCore: true, substitutes: ['headhunter', 'pyromancer'] },
      { slotIndex: 5, position: 'back', heroId: 'sage', isCore: true, substitutes: ['astrologer', 'warlock'] },
      { slotIndex: 6, position: 'back', heroId: 'druid', isCore: false, substitutes: ['bishop', 'shaman'] },
    ],
  },
  {
    id: 'horde_mono_bloodfrenzy',
    name: 'Horde Wasteland Cleave (Boss & Aggro Rush)',
    gameMode: 'pve_boss',
    tier: 'S+',
    description: 'High-octane aggression built on bleed, lifesteal, and execute mechanics. Desert Prince spins through formations while Shaman provides massive team crit buffs.',
    notes: 'The number one lineup for high-score Guild Bosses and Castle sieges. Warlock anti-heal shuts down enemy sustain entirely.',
    patchVersion: '1.24.0',
    lastVerified: 'October 2026',
    slots: [
      { slotIndex: 1, position: 'front', heroId: 'barbarian', isCore: true, substitutes: ['paragon', 'treant'] },
      { slotIndex: 2, position: 'front', heroId: 'desert_prince', isCore: true, substitutes: ['headhunter', 'windwalker'] },
      { slotIndex: 3, position: 'back', heroId: 'soulmancer', isCore: true, substitutes: ['forest_maiden', 'astrologer'] },
      { slotIndex: 4, position: 'back', heroId: 'warlock', isCore: true, substitutes: ['pyromancer', 'sage'] },
      { slotIndex: 5, position: 'back', heroId: 'headhunter', isCore: false, substitutes: ['windwalker', 'astrologer'] },
      { slotIndex: 6, position: 'back', heroId: 'shaman', isCore: false, substitutes: ['bard', 'druid'] },
    ],
  },
  {
    id: 'hybrid_nature_league',
    name: 'Verdant Citadel (3 Nature + 3 League Hybrid)',
    gameMode: 'all',
    tier: 'S',
    description: 'Combines the top tier resilience of League with the unbeatable crowd control and sniping of Nature. Unlocks the dual 3+3 faction synergy aura.',
    notes: 'Extremely forgiving for mid-game players who pull both Paragon and Forest Maiden early.',
    patchVersion: '1.24.0',
    lastVerified: 'October 2026',
    slots: [
      { slotIndex: 1, position: 'front', heroId: 'paragon', isCore: true, substitutes: ['secret_keeper', 'treant'] },
      { slotIndex: 2, position: 'front', heroId: 'treant', isCore: false, substitutes: ['secret_keeper', 'barbarian'] },
      { slotIndex: 3, position: 'back', heroId: 'forest_maiden', isCore: true, substitutes: ['soulmancer', 'druid'] },
      { slotIndex: 4, position: 'back', heroId: 'pyromancer', isCore: true, substitutes: ['astrologer', 'windwalker'] },
      { slotIndex: 5, position: 'back', heroId: 'windwalker', isCore: true, substitutes: ['astrologer', 'sage'] },
      { slotIndex: 6, position: 'back', heroId: 'bard', isCore: false, substitutes: ['druid', 'bishop'] },
    ],
  },
  {
    id: 'hybrid_horde_league',
    name: 'Blood & Aegis (3 Horde + 3 League Hybrid)',
    gameMode: 'pvp',
    tier: 'S',
    description: 'Pairs the unbreakable defensive frontline of League with the explosive execution of Desert Prince and Soulmancer.',
    notes: 'Paragon keeps Desert Prince alive until his execute stacks scale to maximum potency.',
    patchVersion: '1.24.0',
    lastVerified: 'October 2026',
    slots: [
      { slotIndex: 1, position: 'front', heroId: 'paragon', isCore: true, substitutes: ['barbarian', 'secret_keeper'] },
      { slotIndex: 2, position: 'front', heroId: 'desert_prince', isCore: true, substitutes: ['headhunter', 'barbarian'] },
      { slotIndex: 3, position: 'back', heroId: 'soulmancer', isCore: true, substitutes: ['astrologer', 'warlock'] },
      { slotIndex: 4, position: 'back', heroId: 'pyromancer', isCore: true, substitutes: ['warlock', 'astrologer'] },
      { slotIndex: 5, position: 'back', heroId: 'secret_keeper', isCore: false, substitutes: ['headhunter', 'bard'] },
      { slotIndex: 6, position: 'back', heroId: 'shaman', isCore: false, substitutes: ['bard', 'bishop'] },
    ],
  },
];

export function getLineupById(id: string): Lineup | undefined {
  return LINEUPS.find((l) => l.id === id);
}

