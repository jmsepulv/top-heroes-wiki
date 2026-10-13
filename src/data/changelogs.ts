export interface PatchChange {
  type: 'buff' | 'nerf' | 'new' | 'rework';
  target: string;
  description: string;
}

export interface PatchNote {
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  changes: PatchChange[];
}

export const PATCH_NOTES: PatchNote[] = [
  {
    version: '1.24.0',
    releaseDate: 'October 2026',
    title: 'The Primordial Awakening & Tank Rebalance',
    summary: 'Increased frontline survivability against burst magic compositions, refined Nature faction crowd-control cooldowns, and introduced Mythic artifact awakening bonuses.',
    changes: [
      {
        type: 'buff',
        target: 'Paragon',
        description: 'Divine Aegis shield scaling increased from 25% to 30% Max HP. Added 2s taunt effect to surrounding melee enemies.',
      },
      {
        type: 'buff',
        target: 'Desert Prince',
        description: 'Execute damage threshold increased from 25% HP to 30% HP. Lifesteal on Dune Flurry increased to 35%.',
      },
      {
        type: 'nerf',
        target: 'Pyromancer',
        description: 'Cataclysmic Meteor cooldown increased by 1 second (15s -> 16s). Burn damage scaling adjusted to prevent instant frontline wipeouts.',
      },
      {
        type: 'rework',
        target: 'Forest Maiden',
        description: 'Verdant Slumber now heals allies over 5 seconds while immobilizing enemies, creating more counter-play opportunities for high-speed assassins.',
      },
      {
        type: 'new',
        target: 'Mono-Faction Aura',
        description: 'Added +25% ATK & +25% HP synergy aura for fielding all 6 heroes from the same faction.',
      },
    ],
  },
  {
    version: '1.23.0',
    releaseDate: 'September 2026',
    title: 'Siege of the Citadel & Guild War Expansion',
    summary: 'Expanded Guild War castle hubs, optimized march movement speeds, and updated gear refinement bonus tiers.',
    changes: [
      {
        type: 'new',
        target: 'Guild Ruins Expeditions',
        description: 'Introduced bi-weekly elemental monolith expeditions for guild-wide rewards.',
      },
      {
        type: 'buff',
        target: 'Secret Keeper',
        description: 'Base Armor increased by 12%. Silent Resolve stacks faster when attacked by multi-hit skills.',
      },
      {
        type: 'buff',
        target: 'Windwalker',
        description: 'Armor penetration on Gale Barrage increased from 40% to 50%.',
      },
    ],
  },
];
