import React, { useState, useMemo, useEffect } from 'react';
import {
  LEVEL_MILESTONES,
  CASTLE_DATA,
  STAR_PROMOTION_SCHEDULE,
  TOTAL_SHARDS_BY_RARITY,
  AWAKENING_COSTS,
  TOTAL_AWAKENING_COST,
  TRAIT_ROTATION_STEPS,
  TRAIT_RULES,
  EPIC_GLOBAL_PASSIVES,
} from '../data/calculatorData';
import { HEROES } from '../data/heroes';
import { getPath } from '../utils/paths';
import {
  Calculator,
  Sparkles,
  Shield,
  Castle,
  Zap,
  Award,
  Star,
  BookOpen,
  Crown,
  Layers,
  Check,
  Calendar,
  TrendingUp,
  Clock,
  Save,
  Target,
  ArrowRight
} from 'lucide-react';

export default function ResourceCalculator() {
  const [activeTab, setActiveTab] = useState<'level' | 'stars' | 'awakening' | 'traits' | 'passives' | 'castle'>('stars');

  // Hero Level Calculator State
  const [startLevel, setStartLevel] = useState<number>(1);
  const [targetLevel, setTargetLevel] = useState<number>(100);

  // Star Calculator State (15-star / 3-band verified model)
  const [starRarity, setStarRarity] = useState<'mythic' | 'legendary' | 'epic'>('mythic');
  const [currentStar, setCurrentStar] = useState<number>(0); // 0 to 15
  const [targetStar, setTargetStar] = useState<number>(15); // 1 to 15

  // Awakening Calculator State (Legendary heroes: tiers 0-3, 345 shards + 9 soul stones)
  const [selectedAwakenHeroId, setSelectedAwakenHeroId] = useState<string>('pyromancer');
  const [startAwakeningIndex, setStartAwakeningIndex] = useState<number>(0);
  const [targetAwakeningIndex, setTargetAwakeningIndex] = useState<number>(AWAKENING_COSTS.length);
  const [ownedShards, setOwnedShards] = useState<number>(0);
  const [ownedSoulStones, setOwnedSoulStones] = useState<number>(0);
  const [dailyGuildShards, setDailyGuildShards] = useState<number>(5);
  const [weeklyEventShards, setWeeklyEventShards] = useState<number>(20);
  const [rubyPullsPerWeek, setRubyPullsPerWeek] = useState<number>(10);
  const [goalSavedToast, setGoalSavedToast] = useState<boolean>(false);

  // Trait Calculator State (4 traits, lv 1 to 30, 1160 shards total)
  const [traitStartLevel, setTraitStartLevel] = useState<number>(1);
  const [traitTargetLevel, setTraitTargetLevel] = useState<number>(30);
  const [activeTraitsCount, setActiveTraitsCount] = useState<number>(4);

  // Castle Calculator State
  const [currentCastle, setCurrentCastle] = useState<number>(10);
  const [targetCastle, setTargetCastle] = useState<number>(25);

  // 1. Calculations: Hero Level
  const levelCosts = useMemo(() => {
    let totalStones = 0;
    let totalMeat = 0;
    let totalXp = 0;

    LEVEL_MILESTONES.forEach((m) => {
      if (m.level > startLevel && m.level <= targetLevel) {
        totalStones += m.promotionStonesNeeded;
        totalMeat += m.totalMeatToNextMilestone;
        totalXp += m.totalXpToNextMilestone;
      }
    });

    return { totalStones, totalMeat, totalXp };
  }, [startLevel, targetLevel]);

  // 2. Calculations: 15-Star Promotion
  const starCosts = useMemo(() => {
    let totalShards = 0;
    const stepsIncluded = STAR_PROMOTION_SCHEDULE.filter(
      (s) => s.globalStar > currentStar && s.globalStar <= targetStar
    );

    stepsIncluded.forEach((s) => {
      if (starRarity === 'mythic') totalShards += s.mythicShards;
      else if (starRarity === 'legendary') totalShards += s.legendaryShards;
      else totalShards += s.epicShards;
    });

    const unlocks: string[] = [];
    if (currentStar < 5 && targetStar >= 5) unlocks.push('Band 1 Complete (5 Gold Stars)');
    if (currentStar < 10 && targetStar >= 10) unlocks.push('Band 2 Complete (5 Silver Stars)');
    if (currentStar < 12 && targetStar >= 12) unlocks.push('2-Star Platinum (12 Stars) — Unlocks Epic Global Passives (+30% Accounts Buffs)');
    if (currentStar < 15 && targetStar >= 15) unlocks.push('Band 3 Complete (5 Platinum / Rainbow Stars) — Fully Maxed Star Promotion');

    return { totalShards, stepsIncluded, unlocks };
  }, [starRarity, currentStar, targetStar]);

  // 3. Calculations: Awakening
  const awakeningCosts = useMemo(() => {
    let shards = 0;
    let soulStones = 0;

    for (let i = startAwakeningIndex; i < targetAwakeningIndex; i++) {
      const step = AWAKENING_COSTS[i];
      if (step) {
        shards += step.shards;
        soulStones += step.soulStones;
      }
    }

    return { shards, soulStones };
  }, [startAwakeningIndex, targetAwakeningIndex]);

  // Load saved awakening goal from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('topheroes_awakening_goal');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.heroId && HEROES.some((h) => h.id === parsed.heroId)) {
            setSelectedAwakenHeroId(parsed.heroId);
          }
          if (typeof parsed.startStep === 'number') setStartAwakeningIndex(parsed.startStep);
          if (typeof parsed.targetStep === 'number') setTargetAwakeningIndex(parsed.targetStep);
          if (typeof parsed.ownedShards === 'number') setOwnedShards(parsed.ownedShards);
          if (typeof parsed.ownedSoulStones === 'number') setOwnedSoulStones(parsed.ownedSoulStones);
          if (typeof parsed.dailyGuildShards === 'number') setDailyGuildShards(parsed.dailyGuildShards);
          if (typeof parsed.weeklyEventShards === 'number') setWeeklyEventShards(parsed.weeklyEventShards);
          if (typeof parsed.rubyPullsPerWeek === 'number') setRubyPullsPerWeek(parsed.rubyPullsPerWeek);
        }
      } catch (err) {
        // ignore
      }
    }
  }, []);

  const saveGoal = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'topheroes_awakening_goal',
          JSON.stringify({
            heroId: selectedAwakenHeroId,
            startStep: startAwakeningIndex,
            targetStep: targetAwakeningIndex,
            ownedShards,
            ownedSoulStones,
            dailyGuildShards,
            weeklyEventShards,
            rubyPullsPerWeek,
          })
        );
        setGoalSavedToast(true);
        setTimeout(() => setGoalSavedToast(false), 2500);
      } catch (err) {
        // ignore
      }
    }
  };

  const awakenHero = useMemo(() => {
    return HEROES.find((h) => h.id === selectedAwakenHeroId) || HEROES[0];
  }, [selectedAwakenHeroId]);

  const netShardsNeeded = Math.max(0, awakeningCosts.shards - ownedShards);
  const netSoulStonesNeeded = Math.max(0, awakeningCosts.soulStones - ownedSoulStones);

  // Daily shard velocity (Guild store + Weekly events + Tavern pulls)
  const dailyShardPace = useMemo(() => {
    const fromGuild = dailyGuildShards;
    const fromEvents = weeklyEventShards / 7;
    const fromTavern = (rubyPullsPerWeek * 0.7) / 7;
    return Math.round((fromGuild + fromEvents + fromTavern) * 100) / 100;
  }, [dailyGuildShards, weeklyEventShards, rubyPullsPerWeek]);

  const daysToComplete = useMemo(() => {
    if (netShardsNeeded <= 0) return 0;
    if (dailyShardPace <= 0) return 999;
    return Math.ceil(netShardsNeeded / dailyShardPace);
  }, [netShardsNeeded, dailyShardPace]);

  const completionDateString = useMemo(() => {
    if (netShardsNeeded <= 0) return 'Goal Reached!';
    if (daysToComplete >= 999) return 'Pace too slow';
    const d = new Date(Date.now() + daysToComplete * 86400000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [netShardsNeeded, daysToComplete]);

  const awakeningProgressPct = useMemo(() => {
    if (awakeningCosts.shards <= 0) return 100;
    return Math.min(100, Math.round((ownedShards / awakeningCosts.shards) * 100));
  }, [ownedShards, awakeningCosts.shards]);

  // 4. Calculations: Traits
  const traitCosts = useMemo(() => {
    // Shards needed per trait from traitStartLevel to traitTargetLevel
    const levelsToGain = Math.max(0, traitTargetLevel - Math.max(1, traitStartLevel));
    const shardsPerTrait = levelsToGain * TRAIT_RULES.upgradeCostPerLevel;
    const totalShards = shardsPerTrait * activeTraitsCount;
    const diamondUnlockNeeded = traitStartLevel === 0;

    return { levelsToGain, shardsPerTrait, totalShards, diamondUnlockNeeded };
  }, [traitStartLevel, traitTargetLevel, activeTraitsCount]);

  // 5. Calculations: Castle
  const castleCosts = useMemo(() => {
    let meat = 0;
    let wood = 0;
    let stone = 0;
    let iron = 0;
    let hours = 0;
    const unlocks: string[] = [];
    const prerequisites: string[] = [];

    CASTLE_DATA.forEach((c) => {
      if (c.level > currentCastle && c.level <= targetCastle) {
        meat += c.meat;
        wood += c.wood;
        stone += c.stone;
        iron += c.iron;
        hours += c.baseTimeHours;
        unlocks.push(`Lv.${c.level}: ${c.keyUnlocks}`);
        prerequisites.push(`Lv.${c.level}: ${c.prerequisite}`);
      }
    });

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    return { meat, wood, stone, iron, hours, timeStr: `${days}d ${remHours}h`, unlocks, prerequisites };
  }, [currentCastle, targetCastle]);

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              Verified Progression Engines & Calculators
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Top Heroes Resource Calculators
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Plan your investments with exact mathematical precision. Compute 15-star shard milestones (500/1,000 shards), Legendary awakening costs (345 shards & 9 soul stones), trait rotation locks (1,160 shards), and Castle construction costs.
            </p>
          </div>

          {/* Calculator Tabs */}
          <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 gap-1">
            <button
              onClick={() => setActiveTab('stars')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'stars'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>15-Star Shards</span>
            </button>
            <button
              onClick={() => setActiveTab('awakening')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'awakening'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Awakening</span>
            </button>
            <button
              onClick={() => setActiveTab('traits')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'traits'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Traits & Rotation</span>
            </button>
            <button
              onClick={() => setActiveTab('passives')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'passives'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Epic Passives</span>
            </button>
            <button
              onClick={() => setActiveTab('level')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'level'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Hero Level</span>
            </button>
            <button
              onClick={() => setActiveTab('castle')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'castle'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Castle className="w-3.5 h-3.5" />
              <span>Castle Rush</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab: 15-Star Promotion Shard Calculator */}
      {activeTab === 'stars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Star Promotion Shard Engine
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Hero Rarity:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setStarRarity('mythic')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      starRarity === 'mythic' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Mythic (1,000 Shards)
                  </button>
                  <button
                    onClick={() => setStarRarity('legendary')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      starRarity === 'legendary' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Legendary (500 Shards)
                  </button>
                  <button
                    onClick={() => setStarRarity('epic')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      starRarity === 'epic' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Epic (500 Shards)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Star Level: <span className="text-amber-400 font-bold">{currentStar === 0 ? '0★ (Unstarred)' : `${currentStar}★ (${STAR_PROMOTION_SCHEDULE[currentStar - 1]?.bandName})`}</span>
                </label>
                <select
                  value={currentStar}
                  onChange={(e) => setCurrentStar(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={0}>0★ (Newly Summoned)</option>
                  {STAR_PROMOTION_SCHEDULE.map((s) => (
                    <option key={s.globalStar} value={s.globalStar}>
                      {s.globalStar}★ Star — {s.bandName} {s.star}★
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Star Level: <span className="text-purple-400 font-bold">{targetStar}★ ({STAR_PROMOTION_SCHEDULE[targetStar - 1]?.bandName})</span>
                </label>
                <select
                  value={targetStar}
                  onChange={(e) => setTargetStar(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {STAR_PROMOTION_SCHEDULE.map((s) => (
                    <option key={s.globalStar} value={s.globalStar}>
                      {s.globalStar}★ Star — {s.bandName} {s.star}★
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
              <div>
                ⭐ <strong>Band Breakdown:</strong> Band 1 (Stars 1-5, Gold) costs 50 shards (100 for Mythic). Band 2 (Stars 6-10, Silver) costs 150 shards (300 for Mythic). Band 3 (Stars 11-15, Platinum) costs 300 shards (600 for Mythic).
              </div>
              <div>
                ⭐ <strong>Key Threshold:</strong> 12 Stars (2-Star Platinum) unlocks Epic Heroes' 30% Account-Wide Global Passives!
              </div>
            </div>
          </div>

          {/* Results Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-6">
                Total Shard Investment Required
              </h3>

              <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 text-center mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Specific {starRarity.toUpperCase()} Shards Needed
                </div>
                <div className="text-4xl font-black text-purple-400 font-mono">
                  {starCosts.totalShards.toLocaleString()}
                </div>
                <div className="text-xs text-purple-300 font-semibold mt-1">
                  Required from {currentStar}★ &rarr; {targetStar}★ (Total Rarity Cap: {TOTAL_SHARDS_BY_RARITY[starRarity]} shards)
                </div>
              </div>

              {/* Milestone Unlocks */}
              {starCosts.unlocks.length > 0 && (
                <div className="mb-6 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Milestones Passed:
                  </h4>
                  {starCosts.unlocks.map((u, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Breakdown Table */}
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                Star Step Cost Breakdown:
              </h4>
              <div className="overflow-x-auto max-h-72 overflow-y-auto pr-1">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Global Star</th>
                      <th className="p-2.5">Band</th>
                      <th className="p-2.5">Shards per Star</th>
                      <th className="p-2.5 rounded-r-lg">Cumulative Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {starCosts.stepsIncluded.map((s) => {
                      const cost = starRarity === 'mythic' ? s.mythicShards : starRarity === 'legendary' ? s.legendaryShards : s.epicShards;
                      const cum = starRarity === 'mythic' ? s.mythicCumulative : starRarity === 'legendary' ? s.legendaryCumulative : s.epicCumulative;
                      return (
                        <tr key={s.globalStar} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-white">{s.globalStar}★</td>
                          <td className="p-2.5 text-slate-400">{s.bandName} (★{s.star})</td>
                          <td className="p-2.5 text-purple-400 font-mono font-bold">+{cost} shards</td>
                          <td className="p-2.5 text-slate-300 font-mono">{cum} shards</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Awakening & Shard Goal Planner */}
      {activeTab === 'awakening' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Hero Selector & Inventory Inputs (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Awakening Goal Planner
              </h2>
              <button
                onClick={saveGoal}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Save goal to device"
              >
                {goalSavedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                <span>{goalSavedToast ? 'Saved!' : 'Save Goal'}</span>
              </button>
            </div>

            {/* Target Hero Card */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                Target Champion:
              </label>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                  <img src={getPath(awakenHero.avatar)} alt={awakenHero.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <select
                    value={selectedAwakenHeroId}
                    onChange={(e) => setSelectedAwakenHeroId(e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-white focus:outline-none"
                  >
                    {HEROES.map((h) => (
                      <option key={h.id} value={h.id} className="bg-slate-950">
                        {h.name} ({h.rarity.toUpperCase()} • {h.faction.toUpperCase()})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{awakenHero.title}</p>
                </div>
              </div>
            </div>

            {/* Milestone Step Range */}
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Awakening Progress:
                </label>
                <select
                  value={startAwakeningIndex}
                  onChange={(e) => setStartAwakeningIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={0}>Unawakened (Base Lv 0)</option>
                  {AWAKENING_COSTS.map((step, idx) => (
                    <option key={idx} value={idx + 1}>
                      Tier {step.tier} - Level {step.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Awakening Goal:
                </label>
                <select
                  value={targetAwakeningIndex}
                  onChange={(e) => setTargetAwakeningIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {AWAKENING_COSTS.map((step, idx) => (
                    <option key={idx} value={idx + 1}>
                      Tier {step.tier} - Level {step.level} {step.soulStones > 0 ? `(${step.soulStones} Soul Stones)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current In-Inventory Reserves */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase block tracking-wider">
                Current Inventory In Bag (Deduct from Goal):
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                    Owned Shards
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={ownedShards}
                    onChange={(e) => setOwnedShards(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                    Owned Soul Stones
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={ownedSoulStones}
                    onChange={(e) => setOwnedSoulStones(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Daily Acquisition Velocity Sliders */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase block tracking-wider">
                Estimated Shard Velocity:
              </span>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Daily Guild Store Purchases:</span>
                  <span className="font-bold text-white font-mono">{dailyGuildShards} shards/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={dailyGuildShards}
                  onChange={(e) => setDailyGuildShards(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Weekly Event & Arena Rewards:</span>
                  <span className="font-bold text-white font-mono">{weeklyEventShards} shards/wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={weeklyEventShards}
                  onChange={(e) => setWeeklyEventShards(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Tavern Summons / Ruby Pace:</span>
                  <span className="font-bold text-white font-mono">{rubyPullsPerWeek} pulls/wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={rubyPullsPerWeek}
                  onChange={(e) => setRubyPullsPerWeek(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Calculated Daily Inflow:</span>
                <span className="font-bold text-amber-400 font-mono">+{dailyShardPace} shards / day</span>
              </div>
            </div>
          </div>

          {/* Right: Timeline Diagnostics & Resource Needs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Breakthrough Stepper Banner */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Awakening Breakthrough Tiers</span>
                <span className="text-purple-400">Total: 345 Shards + 9 💎</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className={`p-3 rounded-2xl border transition-all ${targetAwakeningIndex >= 1 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">Tier 0 (Base)</span>
                  <div className="font-bold text-white text-xs">Tree Unlock</div>
                  <span className="text-[10px] text-slate-400 block mt-1">5 Shards • 1 💎</span>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${targetAwakeningIndex >= 7 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">Tier 1 Cap</span>
                  <div className="font-bold text-white text-xs">Active Mastery</div>
                  <span className="text-[10px] text-slate-400 block mt-1">+65 Shards • 2 💎</span>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${targetAwakeningIndex >= 13 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">Tier 2 Cap</span>
                  <div className="font-bold text-white text-xs">Passive Boost</div>
                  <span className="text-[10px] text-slate-400 block mt-1">+105 Shards • 2 💎</span>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${targetAwakeningIndex >= 19 ? 'bg-purple-500/10 border-purple-500/40' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <span className="text-[10px] font-black uppercase text-purple-400 block mb-1">Tier 3 Apex</span>
                  <div className="font-bold text-white text-xs">Ultimate Surge</div>
                  <span className="text-[10px] text-slate-400 block mt-1">+170 Shards • 4 💎</span>
                </div>
              </div>
            </div>

            {/* Net Deficit & Progress Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white">Net Resources Required</h3>
                <span className="text-xs text-slate-400">Inventory deducted</span>
              </div>

              {/* Resource Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 text-center space-y-1">
                  <div className="text-xs uppercase font-bold text-slate-400">Remaining Shards</div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    {netShardsNeeded}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gross: {awakeningCosts.shards} ({ownedShards} in Bag)
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/40 text-center space-y-1">
                  <div className="text-xs uppercase font-bold text-slate-400">Remaining Soul Stones</div>
                  <div className="text-4xl font-black text-purple-400 font-mono">
                    {netSoulStonesNeeded}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gross: {awakeningCosts.soulStones} ({ownedSoulStones} in Bag)
                  </div>
                </div>
              </div>

              {/* Progress Bar toward Goal */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Shard Goal Completion:</span>
                  <span className="font-bold text-amber-400 font-mono">{awakeningProgressPct}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${awakeningProgressPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Projected Timeline Forecast Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Estimated Completion Time:
                    </span>
                    <span className="text-base font-black text-white">
                      {daysToComplete === 0 ? 'Goal Met!' : `${daysToComplete} Days (${completionDateString})`}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Instant Ruby Rush Cost:
                  </span>
                  <span className="text-sm font-black text-purple-300 font-mono">
                    ~{(netShardsNeeded * 60).toLocaleString()} Rubies
                  </span>
                </div>
              </div>

              {/* Step by Step Schedule Table */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                  Step-by-Step Level Costs:
                </h4>
                <div className="overflow-x-auto max-h-56 overflow-y-auto pr-1">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold sticky top-0">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Tier</th>
                        <th className="p-2.5">Level</th>
                        <th className="p-2.5">Shards</th>
                        <th className="p-2.5 rounded-r-lg">Soul Stones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {AWAKENING_COSTS.map((c, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-slate-800/40 ${
                            i >= startAwakeningIndex && i < targetAwakeningIndex
                              ? 'bg-amber-500/5 font-semibold text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          <td className="p-2.5">Tier {c.tier}</td>
                          <td className="p-2.5">Lv {c.level}</td>
                          <td className="p-2.5 font-mono">{c.shards}</td>
                          <td className="p-2.5 font-mono text-purple-400">
                            {c.soulStones > 0 ? `${c.soulStones} 💎` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Traits & 5-Level Rotation */}
      {activeTab === 'traits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Hero Trait Progression Engine
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Number of Traits Being Upgraded:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setActiveTraitsCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTraitsCount === cnt
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cnt} {cnt === 4 ? '(All Traits)' : 'Trait'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Trait Level: <span className="text-amber-400 font-bold">Lv {traitStartLevel}</span>
                </label>
                <select
                  value={traitStartLevel}
                  onChange={(e) => setTraitStartLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={0}>Locked (Level 0)</option>
                  <option value={1}>Level 1 (Diamond Unlocked)</option>
                  <option value={5}>Level 5 (Rotation Checkpoint 1)</option>
                  <option value={10}>Level 10 (Rotation Checkpoint 2)</option>
                  <option value={15}>Level 15 (Rotation Checkpoint 3)</option>
                  <option value={20}>Level 20 (Rotation Checkpoint 4)</option>
                  <option value={25}>Level 25 (Rotation Checkpoint 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Trait Level: <span className="text-emerald-400 font-bold">Lv {traitTargetLevel}</span>
                </label>
                <select
                  value={traitTargetLevel}
                  onChange={(e) => setTraitTargetLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={5}>Level 5</option>
                  <option value={10}>Level 10</option>
                  <option value={15}>Level 15</option>
                  <option value={20}>Level 20</option>
                  <option value={25}>Level 25</option>
                  <option value={30}>Level 30 (Apex Cap)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
              <div>
                ⚙️ <strong>Costs:</strong> Level 1 is unlocked using Diamonds. Levels 2–30 cost exactly <strong>10 Shards per level</strong> per trait.
              </div>
              <div>
                ⚙️ <strong>Max Cap:</strong> Maxing all 4 traits to Lv 30 requires (29 levels &times; 10 shards &times; 4 traits) = <strong>1,160 Shards</strong>.
              </div>
              <div>
                ⚙️ <strong>Trait Swap:</strong> Swapping active traits between heroes costs <strong>2,000 Diamonds</strong>.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-6">Trait Upgrade Requirements</h3>

              <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 text-center mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Total Shards Required ({activeTraitsCount} Traits from Lv {traitStartLevel} &rarr; Lv {traitTargetLevel})
                </div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  {traitCosts.totalShards.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-300 font-semibold mt-1">
                  ({traitCosts.shardsPerTrait} shards per trait)
                  {traitCosts.diamondUnlockNeeded && ' + Diamonds for Lv 1 unlock'}
                </div>
              </div>

              {/* 5-Level Rotation Rules Table */}
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                Mandatory 5-Level Rotation Lock Rules:
              </h4>
              <div className="space-y-2.5">
                {TRAIT_ROTATION_STEPS.map((r) => (
                  <div key={r.step} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
                    <span className="font-mono font-bold text-emerald-400 shrink-0 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      Lv {r.fromLevel}&rarr;{r.toLevel}
                    </span>
                    <span className="text-slate-300">{r.requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Epic Global Passives Hub */}
      {activeTab === 'passives' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Account-Wide Passive Priority List
              </div>
              <h2 className="text-2xl font-black text-white">Epic Hero Global Passive Buffs</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Epic heroes provide permanent account-wide bonuses that apply <strong>even when the hero is not deployed in any march or battle queue</strong>. Unlocks at 2-Star Platinum (12 stars) and reaches +30% maximum at trait level 30.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EPIC_GLOBAL_PASSIVES.map((p) => (
              <div key={p.hero} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white">{p.hero}</span>
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${
                      p.faction === 'League' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30'
                    }`}>
                      {p.faction}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    p.priority === 'HIGHEST' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                    p.priority === 'HIGH' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                    p.priority === 'MEDIUM' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                    'text-slate-400 bg-slate-500/10 border-slate-500/30'
                  }`}>
                    {p.priority} Priority
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Global Effect</div>
                  <div className="text-lg font-black text-indigo-400 font-mono mt-0.5">
                    {p.bonusName}: +{p.maxBonusPct}%
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 italic">
                  💡 {p.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Hero Level & Promotion Stones Calculator */}
      {activeTab === 'level' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Level Progression Targets
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Starting Level: <span className="text-amber-400 font-mono text-sm">{startLevel}</span>
                </label>
                <select
                  value={startLevel}
                  onChange={(e) => setStartLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>Level 1 (New Summon)</option>
                  <option value={20}>Level 20 (Milestone 1)</option>
                  <option value={40}>Level 40 (Milestone 2)</option>
                  <option value={60}>Level 60 (Milestone 3)</option>
                  <option value={80}>Level 80 (Milestone 4)</option>
                  <option value={100}>Level 100 (Mid-game Cap)</option>
                  <option value={120}>Level 120</option>
                  <option value={140}>Level 140</option>
                  <option value={160}>Level 160</option>
                  <option value={180}>Level 180</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Level: <span className="text-emerald-400 font-mono text-sm">{targetLevel}</span>
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={40}>Level 40</option>
                  <option value={60}>Level 60</option>
                  <option value={80}>Level 80</option>
                  <option value={100}>Level 100</option>
                  <option value={120}>Level 120</option>
                  <option value={140}>Level 140</option>
                  <option value={160}>Level 160</option>
                  <option value={180}>Level 180</option>
                  <option value={200}>Level 200 (Apex Cap)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              💡 <strong>Pro Tip:</strong> Promotion Stones are the biggest mid-game bottleneck in Top Heroes. Collect them daily through Tavern rewards, Arms Race Tier 3, and Guild Shop refreshes.
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-6">
                Total Required Materials ({startLevel} &rarr; {targetLevel})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-center">
                  <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Promotion Stones</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {levelCosts.totalStones.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-400/80 font-semibold mt-1">Stones Needed</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-center">
                  <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Meat Consumed</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {levelCosts.totalMeat.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400/80 font-semibold mt-1">Farm Meat</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 text-center">
                  <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Hero EXP</div>
                  <div className="text-2xl font-black text-blue-400 font-mono">
                    {levelCosts.totalXp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-blue-400/80 font-semibold mt-1">Experience Pts</div>
                </div>
              </div>

              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                Breakpoint Breakdown:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Milestone</th>
                      <th className="p-2.5">Promotion Stones</th>
                      <th className="p-2.5">Meat Needed</th>
                      <th className="p-2.5 rounded-r-lg">EXP Needed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {LEVEL_MILESTONES.filter((m) => m.level > startLevel && m.level <= targetLevel).map((m) => (
                      <tr key={m.level} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">Level {m.level}</td>
                        <td className="p-2.5 text-amber-400 font-mono font-bold">+{m.promotionStonesNeeded.toLocaleString()}</td>
                        <td className="p-2.5 text-slate-300 font-mono">{m.totalMeatToNextMilestone.toLocaleString()}</td>
                        <td className="p-2.5 text-slate-300 font-mono">{m.totalXpToNextMilestone.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Castle Calculator */}
      {activeTab === 'castle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Castle className="w-5 h-5 text-blue-400" />
              Castle Milestone Rush
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Castle Level: <span className="text-blue-400 font-bold">Lv.{currentCastle}</span>
                </label>
                <select
                  value={currentCastle}
                  onChange={(e) => setCurrentCastle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={0}>Castle Lv.1 (New Settlement)</option>
                  <option value={5}>Castle Lv.5</option>
                  <option value={10}>Castle Lv.10 (Queue 2)</option>
                  <option value={15}>Castle Lv.15 (Tier 2 Troops)</option>
                  <option value={20}>Castle Lv.20 (Queue 3)</option>
                  <option value={25}>Castle Lv.25 (Tier 3 Troops)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Castle Level: <span className="text-emerald-400 font-bold">Lv.{targetCastle}</span>
                </label>
                <select
                  value={targetCastle}
                  onChange={(e) => setTargetCastle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={10}>Castle Lv.10</option>
                  <option value={15}>Castle Lv.15 (Tier 2 Troops)</option>
                  <option value={20}>Castle Lv.20 (Queue 3)</option>
                  <option value={25}>Castle Lv.25 (Tier 3 Troops)</option>
                  <option value={30}>Castle Lv.30 (Endgame Cap)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              🏰 <strong>Strategic Rush:</strong> Rushing to Castle Lv.20 unlocks Queue 3, unlocking a massive 50% increase in daily resource gathering and Arms Race scoring capability.
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-6">
                Total City Construction Requirements
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-950 p-3 rounded-2xl border border-red-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Meat</div>
                  <div className="text-lg font-black text-red-400 font-mono">
                    {(castleCosts.meat / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Wood</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {(castleCosts.wood / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Stone</div>
                  <div className="text-lg font-black text-blue-400 font-mono">
                    {(castleCosts.stone / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-purple-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Iron</div>
                  <div className="text-lg font-black text-purple-400 font-mono">
                    {(castleCosts.iron / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs mb-6">
                <span className="text-slate-400">Total Base Construction Time:</span>
                <span className="text-amber-400 font-bold font-mono text-sm">{castleCosts.timeStr}</span>
              </div>

              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Critical Level Breakthroughs:
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                {castleCosts.unlocks.map((u, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/50">
                    <span className="text-emerald-400">&check;</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
