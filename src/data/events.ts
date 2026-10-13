export interface GameEvent {
  id: string;
  name: string;
  category: 'daily' | 'guild' | 'pvp' | 'boss';
  recurrence: 'daily' | 'weekly' | 'biweekly';
  description: string;
  rewards: string[];
  tips: string[];
  // Schedule definition in UTC
  scheduleUtc: {
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    hourUtc: number; // 0-23
    minuteUtc: number; // 0-59
    durationHours: number;
  };
}

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'daily_reset',
    name: 'Daily Server Reset',
    category: 'daily',
    recurrence: 'daily',
    description: 'Global daily reset. Resets daily quests, tavern free recruitment, guild donations, stamina purchases, and mystery shop refreshes.',
    rewards: ['100 Free Rubies', 'Tavern Summon Token', '50 Stamina', 'Daily Quest Chests'],
    tips: [
      'Collect your daily free tavern recruitment immediately after reset.',
      'Purchase stamina refreshes early to begin energy regeneration cycles.',
      'Max out daily guild donations for Guild Honor coins.',
    ],
    scheduleUtc: {
      hourUtc: 0,
      minuteUtc: 0,
      durationHours: 24,
    },
  },
  {
    id: 'arms_race',
    name: 'Daily Arms Race',
    category: 'daily',
    recurrence: 'daily',
    description: 'Rotating competition featuring targeted score milestones for building construction, soldier training, hero recruitment, and tech research.',
    rewards: ['Mythic Shards', 'Speedup Chests', 'Promotion Stones', 'Hero XP Potions'],
    tips: [
      'Save large building completions and speedups until the corresponding Arms Race cycle activates.',
      'Hitting Tier 3 milestone rewards every day provides steady passive hero progression.',
    ],
    scheduleUtc: {
      hourUtc: 4,
      minuteUtc: 0,
      durationHours: 20,
    },
  },
  {
    id: 'world_boss',
    name: 'Primal World Boss Hunt',
    category: 'boss',
    recurrence: 'weekly',
    scheduleUtc: {
      daysOfWeek: [3, 5], // Wednesday & Friday
      hourUtc: 12,
      minuteUtc: 0,
      durationHours: 12,
    },
    description: 'Server-wide cooperative raid against massive primal beasts. Leaderboards grant high-tier gear upgrade stones and mythic equipment chests.',
    rewards: ['Mythic Gear Chests', 'Refinement Runes', 'Guild Prestige', 'Beast Hunt Medals'],
    tips: [
      'Field single-target sustained DPS hypercarries (like Desert Prince, Windwalker, and Warlock).',
      'Avoid heavy frontline tanks; run 1 bruiser and 5 offensive supports/carries to maximize DPS score.',
      'Pair Pathfinder with Shaman for huge crit multiplier phases.',
    ],
  },
  {
    id: 'guild_ruins',
    name: 'Castle Ruins Expedition',
    category: 'guild',
    recurrence: 'weekly',
    scheduleUtc: {
      daysOfWeek: [2, 4], // Tuesday & Thursday
      hourUtc: 14,
      minuteUtc: 0,
      durationHours: 8,
    },
    description: 'Guild-only coordinated assault against ancient elemental monoliths. Coordinate rally marching times with guild officers.',
    rewards: ['Guild Honor Coins', 'Legendary Gear Shards', 'Guild Castle Tech XP'],
    tips: [
      'Always join rallies led by your strongest guild members to benefit from higher rally capacity bonuses.',
      'Ensure marching heroes match elemental damage weaknesses of the monolith.',
    ],
  },
  {
    id: 'guild_war',
    name: 'Guild War: Siege of Thrones',
    category: 'guild',
    recurrence: 'weekly',
    scheduleUtc: {
      daysOfWeek: [6], // Saturday
      hourUtc: 18,
      minuteUtc: 0,
      durationHours: 6,
    },
    description: 'The weekly guild showdown. Guilds clash for territory control, resource hubs, and citadel points in timed tactical matches.',
    rewards: ['Huge Ruby Bags', 'Exclusive Guild Frames', 'Mythic Promotion Chests', 'Citadel Honor'],
    tips: [
      'Coordinate garrison defense rotations on voice or guild chat.',
      'Position League mono or Nature control teams on front defensive watchtowers.',
      'Attack weaker enemy queues first to build continuous attack buffs.',
    ],
  },
  {
    id: 'realm_war_kvk',
    name: 'Realm vs Realm (KvK Warzone)',
    category: 'pvp',
    recurrence: 'biweekly',
    scheduleUtc: {
      daysOfWeek: [0], // Sunday
      hourUtc: 15,
      minuteUtc: 0,
      durationHours: 8,
    },
    description: 'High-stakes inter-server war. Invade enemy kingdoms, battle opposing top alliances, and fight for the Royal Capital throne.',
    rewards: ['Cross-Server Supreme Title', 'Mythic Hero Selection Chests', '5,000+ Rubies', 'Imperial Artifacts'],
    tips: [
      'Activate 8-hour Peace Shields if offline during war hours to avoid losing precious troop reserves.',
      'Coordinate cross-server rallies with top alliance leaders.',
      'Use fast teleport scrolls to snipe enemy rally staging camps.',
    ],
  },
];

