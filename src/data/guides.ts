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
    title: 'Endgame Gear Sets, Titan Marks & Enhancement Master',
    category: 'gear',
    readTime: '7 min read',
    summary: 'The definitive guide to endgame 4-piece equipment sets (Fury of Blood, Glory of the Knight, Titan’s Might), Titan Mark faction resonance, and Enhancement Master tier stacking.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. The Three Canonical 4-Piece Sets',
        content: 'Equipment in Top Heroes consists of 4 core pieces: Sword, Chestplate, Helmet, and Boots. Completing a full 4-piece set activates colossal stat multipliers:',
        bulletPoints: [
          'Fury of Blood: +160% Gear HP & +6% Universal Damage Reduction. The indisputable baseline for all frontline tanks, healers, and the entire Nature faction.',
          'Glory of the Knight: +40% Gear ATK, +80% Gear HP & +8% Skill Damage Amplify. Best for skill-burst, ultimate, and AoE nukers (Paragon, Bishop, Pyromancer, Desert Prince).',
          "Titan's Might: +80% Gear ATK & +6% Universal Damage Increase. The ultimate offensive choice for heroes scaling off flat attack (Wanderer, Storm Maiden, Astrologer, Windwalker).",
        ],
      },
      {
        title: '2. Piece Type Stat Allocation',
        content: 'Understanding piece types prevents stat misallocation. Unlike many RPGs, Boots in Top Heroes allocate attack:',
        bulletPoints: [
          'Sword: Primary Gear Attack, Secondary Gear HP.',
          'Boots: Primary Gear Attack, Secondary Gear HP (Grants offensive attack scaling).',
          'Helmet: Primary Gear HP, Secondary Gear Attack.',
          'Chest / Armor: Primary Gear HP, Secondary Gear Attack.',
        ],
      },
      {
        title: '3. Titan Marks (Faction Marks) & +30% Resonance',
        content: 'Titan Marks allow assigning a faction mark to a piece of gear. When worn by a hero of that matching faction (League, Nature, Horde), the gear gains an additional +30% to all stats.',
        callout: {
          type: 'tip',
          text: 'Acquire Titan Marks via the Star Gem Shop (240 Star Gems each) or the weekly Guild Vault points shop.',
        },
      },
      {
        title: '4. Enhancement Master Milestone Bonuses',
        content: 'When all 4 pieces on a hero reach equal enhancement levels (+10, +20, +30, +40, +50), Enhancement Master grants substantial flat and percentage stat surges (+10% up to +200% gear stats).',
      },
    ],
  },
  {
    slug: 'epic-passives-and-traits-progression',
    title: 'Epic Hero Global Passives & Trait Upgrade Priority',
    category: 'progression',
    readTime: '6 min read',
    summary: 'Never neglect your Epic heroes. Unlock account-wide permanent +30% buffs to research, troop training, and gathering, and master the 5-level trait rotation lock.',
    lastUpdated: 'October 2026',
    patchVersion: '1.24.0',
    sections: [
      {
        title: '1. Why Epic Heroes Are Top Priority',
        content: 'Certain Epic heroes provide permanent, account-wide global passive buffs that are active 24/7 even when the hero is not in your active battle formation.',
        bulletPoints: [
          'Brawler (League): +30% Technology Research Speed (HIGHEST PRIORITY). Saves hundreds of days of research time.',
          'Knight (League): +30% Soldier Training Speed (HIGHEST PRIORITY). Crucial for troop replenishing and Arms Race points.',
          'Ranger (League): +30% Ruby Gathering Speed (HIGH PRIORITY). Boosts gem economy on kingdom map nodes.',
          'Minister (League): +30% Soldier Healing Speed (MEDIUM PRIORITY). Accelerates hospital recovery during Guild Wars.',
          'Outlaw (Horde): +30% Wood Gathering Speed (LOW PRIORITY). High-yield lumber harvesting.',
        ],
        callout: {
          type: 'important',
          text: 'These passives unlock at 2-Star Platinum (12 total stars) and scale to their maximum +30% at trait level 30.',
        },
      },
      {
        title: '2. The 5-Level Trait Rotation Rule',
        content: 'Every hero features 4 traits. You cannot rush a single trait to level 30 immediately. Game mechanics enforce a strict 5-level rotation lock:',
        bulletPoints: [
          'Unlock: Level 1 of each trait is unlocked with Diamonds.',
          'Upgrade Cost: Levels 2 through 30 cost 10 hero shards per level per trait.',
          'Rotation Checkpoints: All 4 traits must reach Lv 5 before any trait can be upgraded to Lv 6. Then all 4 must reach Lv 10, Lv 15, Lv 20, and Lv 25 before anyone can reach Lv 30.',
          'Total Shard Investment: Fully maxing all 4 traits requires 1,160 shards (29 levels × 10 shards × 4 traits).',
          'Trait Swap: You can transfer active traits between heroes for 2,000 Diamonds.',
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

