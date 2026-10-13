export interface GuideSection {
  title: string;
  content: string;
  bulletPoints?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'important';
    text: string;
  };
}

export interface GuideArticle {
  slug: string;
  title: string;
  category: 'progression' | 'economy' | 'gear' | 'guild';
  readTime: string;
  summary: string;
  lastUpdated: string;
  patchVersion: string;
  sections: GuideSection[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'castle-upgrade-priority',
    title: 'Castle Upgrade Priority & Progression Roadmap',
    category: 'progression',
    readTime: '6 min read',
    summary: 'The optimal building upgrade sequence to rush Castle levels 15, 20, 25, and 30 without hitting severe resource or speedup bottlenecks.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. The Golden Rule of Castle Rushing',
        content: 'In Top Heroes, Castle level dictates your maximum troop tier, military queue capacity, hero level cap, and tech research tree availability. Never upgrade non-essential resource buildings unless required as a Castle prerequisite.',
        callout: {
          type: 'important',
          text: 'Rushing Castle unlocks higher-tier troops earlier. Higher troop tiers vastly increase combat power and gathering load efficiency.',
        },
      },
      {
        title: '2. Critical Castle Level Milestones',
        content: 'Focus your resources on hitting these critical breakthrough checkpoints:',
        bulletPoints: [
          'Castle 10: Unlocks Queue 2 and basic Faction tech research.',
          'Castle 15: Unlocks Tier 2 Soldiers and advanced training grounds.',
          'Castle 20: Unlocks Queue 3 and Legendary Hero promotion caps.',
          'Castle 25: Unlocks Tier 3 Elite Soldiers and massive troop march capacities.',
          'Castle 30: Endgame cap unlocking Mythic 5-star resonance and apex military technologies.',
        ],
      },
      {
        title: '3. Construction Speedup & Help Etiquette',
        content: 'Never use raw diamonds or speedups immediately upon starting a build. Always request Guild Help first! Every guild help click reduces remaining construction time by 1% (or a minimum of 1-3 minutes).',
        callout: {
          type: 'tip',
          text: 'Only apply construction speedups after all guild helps are filled, and time your completions with the daily Arms Race building cycle.',
        },
      },
    ],
  },
  {
    slug: 'ruby-spending-and-tavern-summoning',
    title: 'Ruby Spending & Tavern Summoning Guide',
    category: 'economy',
    readTime: '5 min read',
    summary: 'Master the game economy. Learn exactly where F2P and low-spenders should invest diamonds and how to hoard summon tokens for max event returns.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. The Best Uses for Rubies / Diamonds',
        content: 'Rubies are the premium currency in Top Heroes. Wasting them on instant building rushes or standard recruitment pulls is the most common beginner mistake.',
        bulletPoints: [
          'VIP / Privilege Points: Spend rubies to hit VIP 6+ early for permanent construction and march speed buffs.',
          'Daily Stamina Potions: Always buy the 50-100 ruby stamina refreshes daily to accelerate account EXP.',
          'Mystery Merchant Discounts: Buy discounted Speedup chests and Mythic Shards priced at 50%-70% off.',
          'Limited Fortune Wheels: Save at least 15,000 rubies for rotating Mythic Hero wheel events.',
        ],
      },
      {
        title: '2. Tavern Token Hoarding Strategy',
        content: 'Do NOT pull recruitment scrolls as soon as you receive them. Top Heroes features rotating "Hero Recruitment" Arms Race milestones and server summoning carnivals.',
        callout: {
          type: 'tip',
          text: 'Save at least 100-200 Gold Summon Scrolls before spending them. Reaching top tier event chests grants guaranteed Mythic selection chests.',
        },
      },
    ],
  },
  {
    slug: 'gear-refinement-and-set-bonuses',
    title: 'Gear Sets, Refinement & Stat Allocation Guide',
    category: 'gear',
    readTime: '7 min read',
    summary: 'Everything you need to know about gearing tanks, nukers, and supports. Understand 2-piece vs 4-piece set synergies and gear awakening priorities.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. Gear Set Hierarchy & Synergy',
        content: 'Equipment is divided into Weapons, Armor, Helmets, Boots, and Rings. Completing matching sets provides game-changing passive abilities that alter battle outcomes.',
        bulletPoints: [
          "Valiant Guardian's Plate: Best for frontline anchors (Paragon, Secret Keeper, Treant). 4-piece grants a 35% HP emergency shield under 40% health.",
          'Arcane Conduit Robes: Premier set for Magic carries (Pyromancer, Astrologer, Warlock). Inflicts continuous burn/shock stacks.',
          'Savage Predator Leather: Essential for Physical assassins (Desert Prince, Windwalker, Headhunter). Provides high Crit Rate and armor shred.',
          'Celestial Hymn Vestments: Dedicated support set (Forest Maiden, Bard, Shaman). Boosts team ATK and DEF by 15% following ultimate casts.',
        ],
      },
      {
        title: '2. Priority Substat Rolling',
        content: 'When refining gear attributes:',
        bulletPoints: [
          'Tanks: Prioritize Damage Reduction% > Max HP% > DEF% > Block Rate.',
          'DPS Carries: Prioritize Crit Rate% > Skill Haste% > Attack% > Armor Penetration%.',
          'Supports / Healers: Prioritize Energy Regen% > Skill Haste% > Healing Output% > HP%.',
        ],
      },
    ],
  },
  {
    slug: 'guild-war-siege-manual',
    title: 'Guild War & Siege of Thrones Tactical Manual',
    category: 'guild',
    readTime: '8 min read',
    summary: 'Coordinate your alliance to dominate weekly Guild Wars. Defense tower layouts, rally marching mechanics, and point-scoring strategies.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. Garrison Defense Architecture',
        content: 'Tower defense order determines whether your guild survives aggressive opening rushes. Always assign members with high-resilience teams (Paragon or Treant mono-compositions) to frontline garrisons.',
        callout: {
          type: 'important',
          text: 'Defense teams with high sustain and crowd control stall enemy timers and waste opposing rally stamina.',
        },
      },
      {
        title: '2. Rally Leading & Soldier Capacity',
        content: 'Only designated Guild Rally Captains with maxed Hall of War capacity should initiate assaults on enemy citadels. Sub-members must send matching troop tiers to avoid slowing down march speed.',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
