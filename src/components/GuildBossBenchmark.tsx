import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { getPath } from '../utils/paths';
import {
  Skull,
  Swords,
  Shield,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  BarChart3,
  Flame,
  Award,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

interface BossProfile {
  id: string;
  name: string;
  title: string;
  faction: 'league' | 'nature' | 'horde' | 'neutral';
  maxHp: number;
  baseDef: number;
  description: string;
  color: string;
  bgGradient: string;
}

const GUILD_BOSSES: BossProfile[] = [
  {
    id: 'corrupted_titan',
    name: 'Corrupted Titan',
    title: 'Cathedral Destroyer',
    faction: 'league',
    maxHp: 40000000,
    baseDef: 8500,
    description: 'Heavily armored sacred golem corrupted by dark energy. Weak to Horde burst attacks.',
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-slate-900',
  },
  {
    id: 'verdant_wyrm',
    name: 'Ancient Bloom Wyrm',
    title: 'Grove Apex Predator',
    faction: 'nature',
    maxHp: 45000000,
    baseDef: 7800,
    description: 'Ancient serpent of the primal canopy. Susceptible to League magic and holy burst.',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-slate-900',
  },
  {
    id: 'infernal_behemoth',
    name: 'Infernal Behemoth',
    title: 'Blood Wastes Warlord',
    faction: 'horde',
    maxHp: 50000000,
    baseDef: 7200,
    description: 'Enraged demonic brute wielding obsidian war hammers. Vulnerable to Nature ranged focus.',
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-slate-900',
  },
  {
    id: 'training_dummy',
    name: 'Grand Training Automaton',
    title: 'Standard Guild Target',
    faction: 'neutral',
    maxHp: 60000000,
    baseDef: 5000,
    description: 'Neutral benchmark target with standard guild boss defense and zero faction bias.',
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-slate-900',
  },
];

interface HeroSlotConfig {
  heroId: string;
  stars: number; // 5 to 15
  awakened: boolean;
}

interface HeroCombatSimulationResult {
  hero: Hero;
  stars: number;
  awakened: boolean;
  totalDamage: number;
  dps: number;
  ultCount: number;
  critCount: number;
  damageSharePct: number;
  factionAdvantage: number;
}

interface SecondLog {
  second: number;
  bossDef: number;
  cumulativeDamage: number;
  intervalDamage: number;
  activeBuffs: string[];
}

export default function GuildBossBenchmark() {
  const [selectedBossId, setSelectedBossId] = useState<string>('training_dummy');
  const [simDuration, setSimDuration] = useState<number>(60); // 60 seconds standard
  const [includeDefShred, setIncludeDefShred] = useState<boolean>(true);
  const [includeTeamBuffs, setIncludeTeamBuffs] = useState<boolean>(true);
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(false);
  const [currentPlaybackSec, setCurrentPlaybackSec] = useState<number>(60);

  // 6-hero lineup configuration
  const [lineup, setLineup] = useState<HeroSlotConfig[]>([
    { heroId: 'pyromancer', stars: 12, awakened: true },
    { heroId: 'desert_prince', stars: 12, awakened: true },
    { heroId: 'windwalker', stars: 11, awakened: true },
    { heroId: 'sage', stars: 10, awakened: false },
    { heroId: 'bard', stars: 10, awakened: false },
    { heroId: 'paragon', stars: 12, awakened: true },
  ]);

  const boss = useMemo(
    () => GUILD_BOSSES.find((b) => b.id === selectedBossId) || GUILD_BOSSES[0],
    [selectedBossId]
  );

  // Quick Preset Teams
  const loadPreset = (type: 'meta_shred' | 'pure_league' | 'pure_nature' | 'pure_horde') => {
    if (type === 'meta_shred') {
      setLineup([
        { heroId: 'pyromancer', stars: 12, awakened: true },
        { heroId: 'desert_prince', stars: 12, awakened: true },
        { heroId: 'windwalker', stars: 11, awakened: true },
        { heroId: 'sage', stars: 10, awakened: false },
        { heroId: 'bard', stars: 10, awakened: false },
        { heroId: 'paragon', stars: 12, awakened: true },
      ]);
    } else if (type === 'pure_league') {
      setLineup([
        { heroId: 'pyromancer', stars: 12, awakened: true },
        { heroId: 'paragon', stars: 12, awakened: true },
        { heroId: 'astrologer', stars: 11, awakened: true },
        { heroId: 'bard', stars: 10, awakened: false },
        { heroId: 'secret_keeper', stars: 10, awakened: false },
        { heroId: 'bishop', stars: 10, awakened: false },
      ]);
    } else if (type === 'pure_nature') {
      setLineup([
        { heroId: 'windwalker', stars: 12, awakened: true },
        { heroId: 'sage', stars: 11, awakened: true },
        { heroId: 'forest_maiden', stars: 11, awakened: true },
        { heroId: 'treant', stars: 10, awakened: false },
        { heroId: 'druid', stars: 10, awakened: false },
        { heroId: 'pathfinder', stars: 10, awakened: false },
      ]);
    } else if (type === 'pure_horde') {
      setLineup([
        { heroId: 'desert_prince', stars: 12, awakened: true },
        { heroId: 'headhunter', stars: 12, awakened: true },
        { heroId: 'barbarian', stars: 11, awakened: true },
        { heroId: 'soulmancer', stars: 11, awakened: true },
        { heroId: 'shaman', stars: 10, awakened: false },
        { heroId: 'warlock', stars: 10, awakened: false },
      ]);
    }
    setCurrentPlaybackSec(simDuration);
  };

  // Update a single hero slot
  const updateSlotHero = (index: number, heroId: string) => {
    setLineup((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], heroId };
      return next;
    });
  };

  const updateSlotStars = (index: number, stars: number) => {
    setLineup((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], stars };
      return next;
    });
  };

  const toggleSlotAwakened = (index: number) => {
    setLineup((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], awakened: !next[index].awakened };
      return next;
    });
  };

  // Calculate Faction Synergy Aura
  const factionSynergy = useMemo(() => {
    const counts: Record<string, number> = { league: 0, nature: 0, horde: 0 };
    lineup.forEach((slot) => {
      const hero = HEROES.find((h) => h.id === slot.heroId);
      if (hero && hero.faction) {
        counts[hero.faction] = (counts[hero.faction] || 0) + 1;
      }
    });

    const maxCount = Math.max(counts.league, counts.nature, counts.horde);
    let atkBonus = 0;
    let label = 'No Synergy Bonus';

    if (maxCount >= 6) {
      atkBonus = 0.25;
      label = '6-Faction Apex Synergy (+25% ATK)';
    } else if (maxCount === 5) {
      atkBonus = 0.20;
      label = '5-Faction Harmony (+20% ATK)';
    } else if (maxCount === 4) {
      atkBonus = 0.15;
      label = '4-Faction Alliance (+15% ATK)';
    } else if (maxCount === 3) {
      atkBonus = 0.10;
      label = '3-Faction Synergy (+10% ATK)';
    }

    return { atkBonus, label, counts, maxCount };
  }, [lineup]);

  // Full 60-Second Simulation Engine
  const simulationData = useMemo(() => {
    const heroInstances = lineup.map((slot) => {
      const hero = HEROES.find((h) => h.id === slot.heroId) || HEROES[0];
      // Star scaling: +8% ATK per star above 5
      const starScale = 1 + (slot.stars - 5) * 0.08;
      // Awakening bonus: +15% ATK
      const awakeScale = slot.awakened ? 1.15 : 1.0;
      const baseAtk = hero.baseStats.atk * starScale * awakeScale * (1 + factionSynergy.atkBonus);

      // Faction triangle vs Boss
      let factionAdvantage = 1.0;
      if (boss.faction !== 'neutral') {
        if (
          (hero.faction === 'league' && boss.faction === 'nature') ||
          (hero.faction === 'nature' && boss.faction === 'horde') ||
          (hero.faction === 'horde' && boss.faction === 'league')
        ) {
          factionAdvantage = 1.20;
        } else if (
          (hero.faction === 'nature' && boss.faction === 'league') ||
          (hero.faction === 'horde' && boss.faction === 'nature') ||
          (hero.faction === 'league' && boss.faction === 'horde')
        ) {
          factionAdvantage = 0.80;
        }
      }

      // Hero role specific modifiers
      const isBuffer = slot.heroId === 'bard' || slot.heroId === 'astrologer';
      const isShredder = slot.heroId === 'sage' || slot.heroId === 'warlock' || slot.heroId === 'desert_prince';
      const isCarry = hero.role === 'mage' || hero.role === 'ranger' || slot.heroId === 'desert_prince';

      return {
        slot,
        hero,
        baseAtk,
        factionAdvantage,
        isBuffer,
        isShredder,
        isCarry,
        energy: 0,
        totalDamage: 0,
        ultCount: 0,
        critCount: 0,
        attackCooldown: 0,
        critRate: 0.35 + (slot.stars > 10 ? 0.10 : 0),
        critDmg: 1.60 + (slot.awakened ? 0.20 : 0),
      };
    });

    const secondLogs: SecondLog[] = [];
    let runningCumulativeDamage = 0;
    let currentShredStacks = 0; // Each stack is 5% DEF reduction, up to 40%

    // Loop through each second of battle
    for (let sec = 1; sec <= simDuration; sec++) {
      let secondDamage = 0;
      const activeBuffs: string[] = [];

      // Check team buffers (e.g., Bard ultimate gives 20% team ATK for 5 seconds)
      const isTeamAtkBuffActive = includeTeamBuffs && (sec % 15 >= 1 && sec % 15 <= 5);
      if (isTeamAtkBuffActive) {
        activeBuffs.push('Bard Anthem (+20% ATK)');
      }

      // Check shred buildup from Sage / Warlock / Desert Prince
      if (includeDefShred) {
        const hasShredHero = heroInstances.some((h) => h.isShredder);
        if (hasShredHero && currentShredStacks < 8) {
          currentShredStacks = Math.min(8, currentShredStacks + 1); // Max 40% shred
        }
        if (currentShredStacks > 0) {
          activeBuffs.push(`Armor Shred (${currentShredStacks * 5}%)`);
        }
      }

      const effectiveBossDef = boss.baseDef * (1 - (currentShredStacks * 0.05));
      const bossMitigation = effectiveBossDef / (effectiveBossDef + 3500);
      const defMultiplier = Math.max(0.1, 1 - bossMitigation);

      // Execute each hero's actions for this second
      heroInstances.forEach((inst) => {
        // Energy accumulates: 15 per second + bonus
        inst.energy += 16;

        let atkPower = inst.baseAtk * (isTeamAtkBuffActive ? 1.20 : 1.0);

        // Basic Attack every 1.5s (modeled continuously)
        let skillHitDamage = 0;

        // Check if Ultimate is ready (100 Energy)
        if (inst.energy >= 100) {
          inst.energy = 0;
          inst.ultCount += 1;

          // Ultimate skill multiplier (400% - 650% ATK depending on role)
          let ultMultiplier = 4.5;
          if (inst.hero.id === 'pyromancer') ultMultiplier = 5.8;
          if (inst.hero.id === 'windwalker') ultMultiplier = 6.2;
          if (inst.hero.id === 'desert_prince') ultMultiplier = 5.6;
          if (inst.hero.id === 'headhunter') ultMultiplier = 6.0;

          // Desert Prince execute bonus in second half of fight
          if (inst.hero.id === 'desert_prince' && sec > simDuration * 0.6) {
            ultMultiplier *= 1.5;
          }

          skillHitDamage = atkPower * ultMultiplier;
        } else {
          // Normal attack / active skill cycle (~140% ATK per second)
          skillHitDamage = atkPower * 1.35;
        }

        // Crit roll
        const isCrit = Math.random() < inst.critRate;
        if (isCrit) {
          skillHitDamage *= inst.critDmg;
          inst.critCount += 1;
        }

        // Apply Boss Defense & Faction Triangle
        const netHitDamage = Math.round(
          skillHitDamage * defMultiplier * inst.factionAdvantage
        );

        inst.totalDamage += netHitDamage;
        secondDamage += netHitDamage;
      });

      runningCumulativeDamage += secondDamage;
      secondLogs.push({
        second: sec,
        bossDef: Math.round(effectiveBossDef),
        cumulativeDamage: runningCumulativeDamage,
        intervalDamage: secondDamage,
        activeBuffs,
      });
    }

    const totalTeamDamage = heroInstances.reduce((sum, h) => sum + h.totalDamage, 0);
    const averageDps = Math.round(totalTeamDamage / simDuration);

    const heroResults: HeroCombatSimulationResult[] = heroInstances
      .map((inst) => ({
        hero: inst.hero,
        stars: inst.slot.stars,
        awakened: inst.slot.awakened,
        totalDamage: inst.totalDamage,
        dps: Math.round(inst.totalDamage / simDuration),
        ultCount: inst.ultCount,
        critCount: inst.critCount,
        damageSharePct: totalTeamDamage > 0 ? Math.round((inst.totalDamage / totalTeamDamage) * 1000) / 10 : 0,
        factionAdvantage: inst.factionAdvantage,
      }))
      .sort((a, b) => b.totalDamage - a.totalDamage);

    return {
      totalTeamDamage,
      averageDps,
      heroResults,
      secondLogs,
    };
  }, [lineup, boss, simDuration, includeDefShred, includeTeamBuffs, factionSynergy]);

  // Live timer simulation playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulatingLive) {
      interval = setInterval(() => {
        setCurrentPlaybackSec((prev) => {
          if (prev >= simDuration) {
            setIsSimulatingLive(false);
            return simDuration;
          }
          return prev + 1;
        });
      }, 250); // 4x speed playback
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingLive, simDuration]);

  // Playback interpolated data
  const currentLog = useMemo(() => {
    const idx = Math.min(simulationData.secondLogs.length - 1, Math.max(0, currentPlaybackSec - 1));
    return simulationData.secondLogs[idx] || simulationData.secondLogs[0];
  }, [currentPlaybackSec, simulationData.secondLogs]);

  const playbackDamage = currentLog?.cumulativeDamage || 0;
  const playbackDps = currentPlaybackSec > 0 ? Math.round(playbackDamage / currentPlaybackSec) : 0;
  const bossRemainingHp = Math.max(0, boss.maxHp - playbackDamage);
  const bossHpPct = Math.max(0, Math.min(100, Math.round((bossRemainingHp / boss.maxHp) * 100)));

  // Performance Rating Grade
  const grade = useMemo(() => {
    const dps = simulationData.averageDps;
    if (dps >= 600000) return { letter: 'S+', title: 'Mythic Guild Champion', color: 'text-amber-400 border-amber-500/50 bg-amber-500/10' };
    if (dps >= 450000) return { letter: 'S', title: 'Legendary DPS Raider', color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' };
    if (dps >= 300000) return { letter: 'A', title: 'Grandmaster Striker', color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' };
    if (dps >= 180000) return { letter: 'B', title: 'Veteran Guild Contender', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' };
    return { letter: 'C', title: 'Novice Formation', color: 'text-slate-400 border-slate-700 bg-slate-800' };
  }, [simulationData.averageDps]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
              <Skull className="w-3.5 h-3.5" />
              PvE Guild Boss 60-Second DPS Benchmark
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Continuous Guild Boss Battle Engine
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Model cumulative 60-second damage against high-HP Guild Bosses with real-time defense decay, energy cycle ultimates, faction auras, and individual DPS leaderboards.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset('meta_shred')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition-all"
            >
              ⭐ Meta Shred Team
            </button>
            <button
              onClick={() => loadPreset('pure_league')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition-all"
            >
              League Monoteam
            </button>
            <button
              onClick={() => loadPreset('pure_nature')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-bold transition-all"
            >
              Nature Monoteam
            </button>
            <button
              onClick={() => loadPreset('pure_horde')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-bold transition-all"
            >
              Horde Monoteam
            </button>
          </div>
        </div>
      </div>

      {/* Boss Selection & Target Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Boss Target Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Skull className="w-4 h-4" />
                Target Guild Boss
              </span>
              <span className="text-xs font-mono font-bold capitalize text-slate-400">
                {boss.faction} Faction
              </span>
            </div>

            {/* Boss Picker Dropdown */}
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">
                Select Encounter:
              </label>
              <select
                value={selectedBossId}
                onChange={(e) => {
                  setSelectedBossId(e.target.value);
                  setCurrentPlaybackSec(simDuration);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
              >
                {GUILD_BOSSES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.faction.toUpperCase()} • {b.title})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {boss.description}
            </p>

            {/* Boss Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Health</span>
                <span className="text-base font-black text-white font-mono">
                  {(boss.maxHp / 1000000).toFixed(0)}M HP
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Armor (DEF)</span>
                <span className="text-base font-black text-blue-400 font-mono">
                  {boss.baseDef.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Boss HP Bar */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Boss HP Remaining (at {currentPlaybackSec}s):</span>
              <span className={bossRemainingHp === 0 ? 'text-red-400' : 'text-emerald-400'}>
                {bossRemainingHp === 0 ? 'BOSS DEFEATED!' : `${bossHpPct}% (${(bossRemainingHp / 1000000).toFixed(2)}M)`}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  bossHpPct > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : bossHpPct > 20
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                }`}
                style={{ width: `${bossHpPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Global Benchmark Score & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Benchmark Scorecard
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Duration: {simDuration}s
              </span>
            </div>

            {/* Total Damage & DPS Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Total Damage */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Damage (60s)</span>
                <div className="text-2xl lg:text-3xl font-black text-amber-400 font-mono">
                  {simulationData.totalTeamDamage.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-300/80 block">
                  ~{(simulationData.totalTeamDamage / 1000000).toFixed(2)} Million
                </span>
              </div>

              {/* Team DPS */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Team DPS</span>
                <div className="text-2xl lg:text-3xl font-black text-purple-400 font-mono">
                  {simulationData.averageDps.toLocaleString()}
                </div>
                <span className="text-[10px] text-purple-300/80 block">Damage per second</span>
              </div>

              {/* Grade Badge */}
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${grade.color}`}>
                <span className="text-[10px] uppercase font-bold opacity-80 block">Raider Tier</span>
                <div className="text-3xl font-black tracking-wider">
                  {grade.letter}
                </div>
                <span className="text-[10px] font-bold mt-0.5 line-clamp-1">{grade.title}</span>
              </div>
            </div>

            {/* Synergy & Simulation Toggles */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-white">{factionSynergy.label}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDefShred}
                      onChange={(e) => setIncludeDefShred(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Armor Shred</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTeamBuffs}
                      onChange={(e) => setIncludeTeamBuffs(e.target.checked)}
                      className="accent-purple-500 rounded"
                    />
                    <span>Buffer Auras</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Playback Control Bar */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Timeline: {currentPlaybackSec}s / {simDuration}s
              </span>
              <span className="font-mono text-white">
                Live DPS: {playbackDps.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentPlaybackSec >= simDuration) {
                    setCurrentPlaybackSec(0);
                  }
                  setIsSimulatingLive(!isSimulatingLive);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isSimulatingLive
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 hover:bg-slate-800 text-white border-slate-800'
                }`}
              >
                {isSimulatingLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulatingLive ? 'Pause' : 'Play 4x'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSimulatingLive(false);
                  setCurrentPlaybackSec(simDuration);
                }}
                className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              >
                <span>Jump to End (60s)</span>
              </button>

              <input
                type="range"
                min="1"
                max={simDuration}
                value={currentPlaybackSec}
                onChange={(e) => {
                  setIsSimulatingLive(false);
                  setCurrentPlaybackSec(Number(e.target.value));
                }}
                className="flex-grow accent-purple-500 bg-slate-950 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6-Hero Lineup Customizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              6-Hero Raid Lineup Customizer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize each champion's star rank, awakening status, and role to optimize guild raid damage.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active Formation: 6 / 6 Slots
          </span>
        </div>

        {/* 6 Slot Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lineup.map((slot, idx) => {
            const hero = HEROES.find((h) => h.id === slot.heroId) || HEROES[0];
            return (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img
                      src={getPath(hero.avatar)}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Slot {idx + 1}
                    </span>
                    <select
                      value={slot.heroId}
                      onChange={(e) => updateSlotHero(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-amber-500 truncate"
                    >
                      {HEROES.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.faction.toUpperCase()})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                      {hero.role} • {hero.damageType}
                    </span>
                  </div>
                </div>

                {/* Stars and Awakening Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold">Stars:</span>
                    <select
                      value={slot.stars}
                      onChange={(e) => updateSlotStars(idx, Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-amber-400 font-bold"
                    >
                      {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((s) => (
                        <option key={s} value={s}>
                          {s}★
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => toggleSlotAwakened(idx)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                      slot.awakened
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {slot.awakened ? '✨ Awakened' : 'Base'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Damage Contribution Leaderboard (MMO Style Recount/Details) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              60s Damage Contribution Leaderboard (DPS Meter)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked breakdown of each hero's damage share, ultimate casts, and effective DPS against {boss.name}.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Sorted by Total Damage Dealt
          </span>
        </div>

        {/* Progress Bars List */}
        <div className="space-y-4">
          {simulationData.heroResults.map((result, idx) => {
            const isHighest = idx === 0;
            return (
              <div
                key={result.hero.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 relative overflow-hidden"
              >
                {/* Visual Background Contribution Fill */}
                <div
                  className={`absolute top-0 bottom-0 left-0 opacity-15 transition-all duration-500 pointer-events-none ${
                    isHighest ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${result.damageSharePct}%` }}
                ></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-black text-slate-500 font-mono">
                      #{idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      <img
                        src={getPath(result.hero.avatar)}
                        alt={result.hero.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {result.hero.name}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          {result.stars}★
                        </span>
                        {result.awakened && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            Awakened
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {result.hero.role.toUpperCase()} • {result.ultCount} Ultimates • {result.critCount} Crits
                        {result.factionAdvantage > 1.0 && (
                          <span className="ml-1 text-emerald-400 font-semibold">(+20% Faction)</span>
                        )}
                        {result.factionAdvantage < 1.0 && (
                          <span className="ml-1 text-red-400 font-semibold">(-20% Faction)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Damage numbers */}
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-white font-mono">
                      {result.totalDamage.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400 flex sm:justify-end items-center gap-2">
                      <span className="font-bold text-amber-400 font-mono">{result.damageSharePct}%</span>
                      <span>•</span>
                      <span className="font-mono text-purple-300">{result.dps.toLocaleString()} DPS</span>
                    </div>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      isHighest
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${result.damageSharePct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guild Boss Raid Pro-Tips Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Guild Boss Combat Optimizations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">1. Armor Shred Stacking</span>
            <p>
              Guild Bosses have up to 8,500 Base DEF, absorbing ~70% of all incoming damage. Heroes like Sage, Desert Prince, or Warlock reduce this armor, boosting whole-team damage exponentially.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">2. Exploit Faction Triangle</span>
            <p>
              Targeting the Boss's faction counter gives every hero a flat +20% damage multiplier. For example, fielding Horde against the Corrupted Titan yields massive score spikes.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">3. ATK Buffer Alignment</span>
            <p>
              Bard's Inspire anthem boosts team attack by 20%–25%. Aligning ultimate cast timing with active shred and attack buffs creates the highest burst DPS windows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

