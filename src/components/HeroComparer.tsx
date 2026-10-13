import React, { useState, useEffect, useMemo } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { getPath } from '../utils/paths';
import {
  Swords,
  Shield,
  Zap,
  Sparkles,
  Share2,
  Check,
  Trophy,
  ArrowRight,
  RotateCcw,
  Plus,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PresetMatchup {
  name: string;
  heroes: string[];
}

const PRESETS: PresetMatchup[] = [
  { name: 'Frontline Bastions: Paragon vs Treant vs Barbarian', heroes: ['paragon', 'treant', 'barbarian'] },
  { name: 'Hypercarry Clash: Pyromancer vs Desert Prince vs Windwalker', heroes: ['pyromancer', 'desert_prince', 'windwalker'] },
  { name: 'League Duo: Paragon vs Secret Keeper', heroes: ['paragon', 'secret_keeper'] },
  { name: 'Nature Sustain: Forest Maiden vs Druid', heroes: ['forest_maiden', 'druid'] },
  { name: 'Horde Executioners: Desert Prince vs Headhunter', heroes: ['desert_prince', 'headhunter'] },
];

export default function HeroComparer() {
  const [slotCount, setSlotCount] = useState<2 | 3>(3);
  const [selectedIds, setSelectedIds] = useState<string[]>(['paragon', 'desert_prince', 'forest_maiden']);
  const [copied, setCopied] = useState(false);
  const [selectorOpenSlot, setSelectorOpenSlot] = useState<number | null>(null);

  // Sync state from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const h1 = params.get('h1');
      const h2 = params.get('h2');
      const h3 = params.get('h3');
      if (h1 && HEROES.some((h) => h.id === h1)) {
        const newIds = [h1];
        if (h2 && HEROES.some((h) => h.id === h2)) newIds.push(h2);
        if (h3 && HEROES.some((h) => h.id === h3)) newIds.push(h3);
        while (newIds.length < 2) newIds.push('desert_prince');
        setSelectedIds(newIds);
        setSlotCount(newIds.length >= 3 ? 3 : 2);
      }
    }
  }, []);

  // Update query params on changes
  const updateShareUrl = () => {
    if (typeof window === 'undefined') return;
    const current = selectedIds.slice(0, slotCount);
    const params = new URLSearchParams();
    current.forEach((id, idx) => {
      params.set(`h${idx + 1}`, id);
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeHeroes: Hero[] = useMemo(() => {
    return selectedIds
      .slice(0, slotCount)
      .map((id) => HEROES.find((h) => h.id === id) || HEROES[0]);
  }, [selectedIds, slotCount]);

  const selectHero = (slotIdx: number, heroId: string) => {
    const updated = [...selectedIds];
    updated[slotIdx] = heroId;
    setSelectedIds(updated);
    setSelectorOpenSlot(null);
  };

  const applyPreset = (preset: PresetMatchup) => {
    setSelectedIds(preset.heroes);
    setSlotCount(preset.heroes.length >= 3 ? 3 : 2);
  };

  // Stat comparisons
  const maxStats = useMemo(() => {
    return {
      hp: Math.max(...activeHeroes.map((h) => h.baseStats.hp)),
      atk: Math.max(...activeHeroes.map((h) => h.baseStats.atk)),
      def: Math.max(...activeHeroes.map((h) => h.baseStats.def)),
      spd: Math.max(...activeHeroes.map((h) => h.baseStats.spd)),
    };
  }, [activeHeroes]);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'border-red-500/80 bg-red-950/60 text-red-300';
      case 'legendary':
        return 'border-amber-500/80 bg-amber-950/60 text-amber-300';
      case 'epic':
        return 'border-purple-500/80 bg-purple-950/60 text-purple-300';
      default:
        return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  const getFactionBadge = (faction: string) => {
    switch (faction) {
      case 'league':
        return 'border-blue-500/80 bg-blue-950/60 text-blue-300';
      case 'nature':
        return 'border-emerald-500/80 bg-emerald-950/60 text-emerald-300';
      case 'horde':
        return 'border-red-500/80 bg-red-950/60 text-red-300';
      default:
        return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'S+':
        return 'bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 font-black';
      case 'S':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'A':
        return 'bg-purple-600 text-white font-bold';
      case 'B':
        return 'bg-blue-600 text-white font-bold';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header controls & Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-400" />
              Hero Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Analyze base attributes, ability kits, and gear synergies side-by-side to optimize roster investments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 2 vs 3 Slots Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setSlotCount(2)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  slotCount === 2
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2 Heroes
              </button>
              <button
                onClick={() => {
                  setSlotCount(3);
                  if (selectedIds.length < 3) {
                    setSelectedIds([...selectedIds, 'treant']);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  slotCount === 3
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3 Heroes
              </button>
            </div>

            {/* Share Comparison */}
            <button
              onClick={updateShareUrl}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all"
              title="Copy shareable comparison link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Preset Matchups */}
        <div className="pt-3 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
            Featured Matchups:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className={`grid grid-cols-1 ${slotCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 items-start`}>
        {activeHeroes.map((hero, idx) => {
          const isSelectorOpen = selectorOpenSlot === idx;

          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6 relative flex flex-col justify-between"
            >
              {/* Slot Header & Hero Picker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    Slot #{idx + 1}
                  </span>
                  <button
                    onClick={() => setSelectorOpenSlot(isSelectorOpen ? null : idx)}
                    className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
                  >
                    <span>Change Hero</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Hero Selection Modal Dropdown */}
                {isSelectorOpen && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2 z-20 shadow-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 pb-1 border-b border-slate-800">
                      <span>Pick Champion:</span>
                      <button
                        onClick={() => setSelectorOpenSlot(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                      {HEROES.map((h) => (
                        <div
                          key={h.id}
                          onClick={() => selectHero(idx, h.id)}
                          className={`cursor-pointer rounded-xl p-1.5 border text-center transition-all ${
                            h.id === hero.id
                              ? 'border-amber-400 bg-amber-500/10'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-950 mx-auto mb-1">
                            <img src={getPath(h.avatar)} alt={h.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">{h.name.split(' ')[0]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Showcase Card */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-md bg-slate-950">
                      <img src={getPath(hero.avatar)} alt={hero.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getRarityBadge(hero.rarity)}`}>
                      {hero.rarity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white leading-tight">
                      {hero.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic line-clamp-1">
                      {hero.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getFactionBadge(hero.faction)}`}>
                        {hero.faction}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-300">
                        {hero.role}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-400">
                        {hero.damageType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Rankings Banner */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">PvP Tier</span>
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${getTierBadge(hero.tierRankings.pvp)}`}>
                    {hero.tierRankings.pvp}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">PvE Tier</span>
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${getTierBadge(hero.tierRankings.pve)}`}>
                    {hero.tierRankings.pve}
                  </span>
                </div>
              </div>

              {/* Base Stat Comparison Bars */}
              <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span>Base Attributes</span>
                  <span className="text-[10px] text-slate-500">Max scaling relative</span>
                </div>

                {/* HP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">HP (Health)</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {hero.baseStats.hp.toLocaleString()}
                      {hero.baseStats.hp === maxStats.hp && (
                        <Trophy className="w-3 h-3 text-amber-400" />
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hero.baseStats.hp === maxStats.hp ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.round((hero.baseStats.hp / maxStats.hp) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* ATK */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Attack (ATK)</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {hero.baseStats.atk.toLocaleString()}
                      {hero.baseStats.atk === maxStats.atk && (
                        <Trophy className="w-3 h-3 text-amber-400" />
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hero.baseStats.atk === maxStats.atk ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.round((hero.baseStats.atk / maxStats.atk) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* DEF */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Defense (DEF)</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {hero.baseStats.def.toLocaleString()}
                      {hero.baseStats.def === maxStats.def && (
                        <Trophy className="w-3 h-3 text-amber-400" />
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hero.baseStats.def === maxStats.def ? 'bg-amber-400' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.round((hero.baseStats.def / maxStats.def) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* SPD */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Speed (SPD)</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {hero.baseStats.spd}
                      {hero.baseStats.spd === maxStats.spd && (
                        <Trophy className="w-3 h-3 text-amber-400" />
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hero.baseStats.spd === maxStats.spd ? 'bg-amber-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${Math.round((hero.baseStats.spd / maxStats.spd) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>Combat Abilities</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {hero.skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{skill.name}</span>
                      <span className="text-[10px] uppercase font-semibold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {skill.type} {skill.cooldown ? `(${skill.cooldown}s)` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended Gear & Artifacts */}
              {hero.builds[0] && (
                <div className="space-y-2.5 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                    Recommended Armory
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Best Sets:</span>
                    <span className="font-bold text-white text-[11px]">
                      {hero.builds[0].recommendedGear.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Priority Stats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hero.builds[0].statPriorities.map((stat, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Links */}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={getPath(`/heroes/${hero.id}`)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Full Hero Guide</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href={getPath(`/gear?hero=${hero.id}`)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-center text-purple-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Configure Gear</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Hero Sandbox CTA */}
      <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-indigo-500/10 border border-amber-500/30 rounded-3xl p-6 md:p-8 text-center space-y-4">
        <h3 className="text-xl font-black text-white">
          Ready to Test These Heroes in Formation?
        </h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Take your compared heroes straight into the 6-slot Formation Sandbox to calculate live Faction Aura bonuses, Front/Back row synergies, and team survivability.
        </p>
        <a
          href={getPath(`/sandbox?team=${activeHeroes.map((h) => h.id).join(',')}`)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
        >
          <span>Load into Formation Sandbox</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

