import React, { useState, useMemo } from 'react';
import { LEVEL_MILESTONES, STAR_TIERS, CASTLE_DATA } from '../data/calculatorData';
import { Calculator, Sparkles, Shield, Castle, Zap, ChevronRight, Award } from 'lucide-react';

export default function ResourceCalculator() {
  const [activeTab, setActiveTab] = useState<'level' | 'stars' | 'castle'>('level');

  // Hero Level Calculator State
  const [startLevel, setStartLevel] = useState<number>(1);
  const [targetLevel, setTargetLevel] = useState<number>(100);

  // Star Calculator State
  const [rarity, setRarity] = useState<'mythic' | 'legendary' | 'epic'>('mythic');
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [targetStars, setTargetStars] = useState<number>(5);

  // Castle Calculator State
  const [currentCastle, setCurrentCastle] = useState<number>(10);
  const [targetCastle, setTargetCastle] = useState<number>(25);

  // Calculations: Hero Level
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

  // Calculations: Stars
  const starCosts = useMemo(() => {
    const tierList = STAR_TIERS[rarity] || [];
    let totalShards = 0;
    const unlockedBonuses: string[] = [];

    tierList.forEach((t) => {
      if (t.stars > currentStars && t.stars <= targetStars) {
        totalShards += t.shardsRequired;
        unlockedBonuses.push(`${t.stars}★: ${t.statBonus}`);
      }
    });

    return { totalShards, unlockedBonuses };
  }, [rarity, currentStars, targetStars]);

  // Calculations: Castle
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
              Resource & Progression Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Top Heroes Resource Calculators
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Accurately estimate costs before investing. Compute Promotion Stones for hero breakpoints, shard requirements for star awakenings, and building resources for Castle milestones.
            </p>
          </div>

          {/* Calculator Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('level')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'level'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Hero Level & Stones</span>
            </button>
            <button
              onClick={() => setActiveTab('stars')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'stars'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Star & Shards</span>
            </button>
            <button
              onClick={() => setActiveTab('castle')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'castle'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Castle className="w-4 h-4" />
              <span>Castle Rush</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Hero Level & Promotion Stones Calculator */}
      {activeTab === 'level' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (5 cols) */}
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

          {/* Results Summary (7 cols) */}
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

              {/* Milestone Breakdown Table */}
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

      {/* Tab 2: Hero Star & Shard Awakening Calculator */}
      {activeTab === 'stars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Star & Awakening Targets
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Hero Rarity:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRarity('mythic')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      rarity === 'mythic' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mythic
                  </button>
                  <button
                    onClick={() => setRarity('legendary')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      rarity === 'legendary' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Legendary
                  </button>
                  <button
                    onClick={() => setRarity('epic')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      rarity === 'epic' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Epic
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Star Level: <span className="text-amber-400 font-bold">{currentStars}★</span>
                </label>
                <select
                  value={currentStars}
                  onChange={(e) => setCurrentStars(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={0}>0★ (Newly Summoned / Unstarred)</option>
                  <option value={1}>1★ Star</option>
                  <option value={2}>2★ Star</option>
                  <option value={3}>3★ Star (Skill Lv 2)</option>
                  <option value={4}>4★ Star</option>
                  <option value={5}>5★ Star (Ultimate Lv 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Star Level: <span className="text-purple-400 font-bold">{targetStars}★</span>
                </label>
                <select
                  value={targetStars}
                  onChange={(e) => setTargetStars(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>1★ Star</option>
                  <option value={2}>2★ Star</option>
                  <option value={3}>3★ Star</option>
                  <option value={4}>4★ Star</option>
                  <option value={5}>5★ Star</option>
                  <option value={6}>6★ Awakened Core (Max)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-6">
                Total Shard Requirements
              </h3>

              <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 text-center mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Specific {rarity.toUpperCase()} Shards Needed
                </div>
                <div className="text-4xl font-black text-purple-400 font-mono">
                  {starCosts.totalShards}
                </div>
                <div className="text-xs text-purple-300 font-semibold mt-1">
                  Required from {currentStars}★ &rarr; {targetStars}★
                </div>
              </div>

              {/* Stat Milestones Unlocked */}
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                Key Upgrades Unlocked Along This Path:
              </h4>
              <div className="space-y-2">
                {starCosts.unlockedBonuses.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl">
                    Target star tier must be higher than current star tier.
                  </div>
                ) : (
                  starCosts.unlockedBonuses.map((bonus, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{bonus}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Castle Upgrade Calculator */}
      {activeTab === 'castle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Castle className="w-5 h-5 text-blue-400" />
              Castle Level Goals
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Current Castle Level: <span className="text-amber-400 font-bold">{currentCastle}</span>
                </label>
                <select
                  value={currentCastle}
                  onChange={(e) => setCurrentCastle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Castle 1</option>
                  <option value={5}>Castle 5</option>
                  <option value={10}>Castle 10 (Queue 2)</option>
                  <option value={15}>Castle 15 (Tier 2 Troops)</option>
                  <option value={20}>Castle 20 (Queue 3)</option>
                  <option value={25}>Castle 25 (Tier 3 Troops)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Target Castle Level: <span className="text-blue-400 font-bold">{targetCastle}</span>
                </label>
                <select
                  value={targetCastle}
                  onChange={(e) => setTargetCastle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={10}>Castle 10</option>
                  <option value={15}>Castle 15 (Tier 2 Troops)</option>
                  <option value={20}>Castle 20 (Queue 3)</option>
                  <option value={25}>Castle 25 (Tier 3 Troops)</option>
                  <option value={30}>Castle 30 (Apex Citadel)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h3 className="text-lg font-black text-white">
                  Resources & Construction Time ({currentCastle} &rarr; {targetCastle})
                </h3>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                  Base Time: ~{castleCosts.timeStr}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Meat</div>
                  <div className="text-lg font-black text-white font-mono mt-1">{(castleCosts.meat / 1000000).toFixed(1)}M</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Wood</div>
                  <div className="text-lg font-black text-white font-mono mt-1">{(castleCosts.wood / 1000000).toFixed(1)}M</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Stone</div>
                  <div className="text-lg font-black text-white font-mono mt-1">{(castleCosts.stone / 1000000).toFixed(1)}M</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Iron</div>
                  <div className="text-lg font-black text-white font-mono mt-1">{(castleCosts.iron / 1000000).toFixed(1)}M</div>
                </div>
              </div>

              {/* Key Unlocks */}
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Unlocks & Military Capacity:
              </h4>
              <div className="space-y-1.5 mb-4">
                {castleCosts.unlocks.map((u, i) => (
                  <div key={i} className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                    <span>👑</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>

              {/* Prerequisites */}
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Building Prerequisites:
              </h4>
              <div className="space-y-1 text-xs text-slate-400">
                {castleCosts.prerequisites.map((p, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {p}
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

