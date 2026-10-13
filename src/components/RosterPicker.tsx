import React, { useState, useEffect, useMemo } from 'react';
import type { UserRoster, FactionId, HeroRarity, HeroRole } from '../types/game';
import { HEROES } from '../data/heroes';
import { LINEUPS } from '../data/lineups';
import { calculateRecommendations } from '../utils/recommendations';
import {
  loadRosterFromStorage,
  saveRosterToStorage,
  generateShareableUrl,
} from '../utils/rosterStorage';
import { getPath } from '../utils/paths';
import {
  Check,
  Shield,
  Zap,
  Heart,
  Eye,
  Share2,
  Sparkles,
  Filter,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function RosterPicker() {
  const [roster, setRoster] = useState<UserRoster>({});
  const [isClient, setIsClient] = useState(false);
  const [factionFilter, setFactionFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'all'>('recommendations');

  // Load roster on mount
  useEffect(() => {
    setIsClient(true);
    const initial = loadRosterFromStorage();
    setRoster(initial);
  }, []);

  // Save roster when changed
  const toggleHero = (heroId: string) => {
    setRoster((prev) => {
      const next = {
        ...prev,
        [heroId]: {
          ...prev[heroId],
          owned: !prev[heroId]?.owned,
        },
      };
      saveRosterToStorage(next);
      return next;
    });
  };

  const handleSelectAll = (select: boolean) => {
    const next: UserRoster = {};
    HEROES.forEach((h) => {
      next[h.id] = { owned: select };
    });
    setRoster(next);
    saveRosterToStorage(next);
  };

  const applyPreset = (preset: 'starter' | 'nature_meta' | 'league_meta') => {
    const next: UserRoster = {};
    HEROES.forEach((h) => {
      next[h.id] = { owned: false };
    });

    if (preset === 'starter') {
      ['secret_keeper', 'bard', 'treant', 'druid', 'barbarian', 'shaman'].forEach((id) => {
        if (next[id]) next[id].owned = true;
      });
    } else if (preset === 'nature_meta') {
      ['forest_maiden', 'windwalker', 'sage', 'treant', 'druid', 'pathfinder'].forEach((id) => {
        if (next[id]) next[id].owned = true;
      });
    } else if (preset === 'league_meta') {
      ['paragon', 'secret_keeper', 'pyromancer', 'astrologer', 'bard', 'bishop'].forEach((id) => {
        if (next[id]) next[id].owned = true;
      });
    }

    setRoster(next);
    saveRosterToStorage(next);
  };

  const copyShareLink = () => {
    const url = generateShareableUrl(roster);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // Filtered heroes list for picker
  const filteredHeroes = useMemo(() => {
    return HEROES.filter((hero) => {
      if (factionFilter !== 'all' && hero.faction !== factionFilter) return false;
      if (rarityFilter !== 'all' && hero.rarity !== rarityFilter) return false;
      if (roleFilter !== 'all' && hero.role !== roleFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return hero.name.toLowerCase().includes(q) || hero.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [factionFilter, rarityFilter, roleFilter, searchQuery]);

  // Owned count stats
  const ownedStats = useMemo(() => {
    let total = 0;
    let mythic = 0;
    let legendary = 0;
    let epic = 0;

    HEROES.forEach((h) => {
      if (roster[h.id]?.owned) {
        total++;
        if (h.rarity === 'mythic') mythic++;
        if (h.rarity === 'legendary') legendary++;
        if (h.rarity === 'epic') epic++;
      }
    });

    return { total, mythic, legendary, epic, totalAvailable: HEROES.length };
  }, [roster]);

  // Recommendations calculated live
  const recommendations = useMemo(() => {
    if (!isClient) return [];
    return calculateRecommendations(roster, LINEUPS, HEROES);
  }, [roster, isClient]);

  const readyLineups = recommendations.filter((r) => r.status === 'ready');
  const oneAwayLineups = recommendations.filter((r) => r.status === 'one_away');
  const goalLineups = recommendations.filter((r) => r.status === 'goal');

  const getRarityBadge = (rarity: HeroRarity) => {
    switch (rarity) {
      case 'mythic':
        return 'border-red-500/80 bg-red-950/60 text-red-300';
      case 'legendary':
        return 'border-amber-500/80 bg-amber-950/60 text-amber-300';
      case 'epic':
        return 'border-purple-500/80 bg-purple-950/60 text-purple-300';
    }
  };

  const getFactionBadge = (faction: FactionId) => {
    switch (faction) {
      case 'league':
        return 'bg-blue-600/30 text-blue-300 border-blue-500/40';
      case 'nature':
        return 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40';
      case 'horde':
        return 'bg-red-600/30 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Banner & Quick Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Live Roster Synergy Engine
              </span>
              <span className="text-xs text-slate-400">Patch 1.24.0 Verified</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
              Mark Your Heroes, Discover Your Best Teams
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Toggle the heroes in your inventory below. The engine calculates the strongest competitive lineups you can field right now, substitutes you can use, and which hero you are just 1 pull away from.
            </p>
          </div>

          {/* Roster Counters & Share CTA */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-white">{ownedStats.total}<span className="text-slate-500 text-sm font-normal">/{ownedStats.totalAvailable}</span></div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Owned</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-red-400">{ownedStats.mythic}</div>
              <div className="text-[11px] text-red-400/80 font-semibold uppercase">Mythic</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-amber-400">{ownedStats.legendary}</div>
              <div className="text-[11px] text-amber-400/80 font-semibold uppercase">Legendary</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-purple-400">{ownedStats.epic}</div>
              <div className="text-[11px] text-purple-400/80 font-semibold uppercase">Epic</div>
            </div>

            <button
              onClick={copyShareLink}
              className="ml-auto w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Roster</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets & Bulk Actions */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Presets:</span>
            <button
              onClick={() => applyPreset('starter')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Starter Pack (Epic/Budget)
            </button>
            <button
              onClick={() => applyPreset('nature_meta')}
              className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              Nature Mono
            </button>
            <button
              onClick={() => applyPreset('league_meta')}
              className="px-2.5 py-1 rounded bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 transition-colors"
            >
              League Mono
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => handleSelectAll(true)}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Select All
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Roster
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column or Stack Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hero Picker & Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Faction Filter */}
              <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  onClick={() => setFactionFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${factionFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFactionFilter('league')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${factionFilter === 'league' ? 'bg-blue-600 text-white font-bold' : 'text-blue-400 hover:text-white'}`}
                >
                  League
                </button>
                <button
                  onClick={() => setFactionFilter('nature')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${factionFilter === 'nature' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-white'}`}
                >
                  Nature
                </button>
                <button
                  onClick={() => setFactionFilter('horde')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${factionFilter === 'horde' ? 'bg-red-600 text-white font-bold' : 'text-red-400 hover:text-white'}`}
                >
                  Horde
                </button>
              </div>

              {/* Rarity Filter */}
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Rarities</option>
                <option value="mythic">Mythic</option>
                <option value="legendary">Legendary</option>
                <option value="epic">Epic</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Roles</option>
                <option value="tank">Tank</option>
                <option value="dps">DPS</option>
                <option value="support">Support</option>
                <option value="control">Control</option>
              </select>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search hero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Heroes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredHeroes.map((hero) => {
              const isOwned = Boolean(roster[hero.id]?.owned);
              return (
                <div
                  key={hero.id}
                  onClick={() => toggleHero(hero.id)}
                  className={`group relative cursor-pointer select-none rounded-xl border p-3 transition-all duration-200 ${
                    isOwned
                      ? 'bg-slate-850 border-amber-500/80 shadow-md shadow-amber-500/10 scale-[1.01]'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator checkmark */}
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isOwned
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'border border-slate-700 bg-slate-950/80 text-transparent group-hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Hero Avatar & Visual */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-2 border-2 border-slate-800 group-hover:border-amber-500/40 transition-colors bg-slate-950">
                      <img
                        src={getPath(hero.avatar)}
                        alt={hero.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {hero.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getRarityBadge(hero.rarity)}`}>
                        {hero.rarity}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${getFactionBadge(hero.faction)}`}>
                        {hero.faction}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 font-medium">
                      Role: <span className="text-slate-300 capitalize">{hero.role}</span>
                    </div>
                  </div>

                  {/* Deep dive link */}
                  <a
                    href={getPath(`/heroes/${hero.id}`)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2.5 block text-center text-[10px] font-semibold text-slate-400 hover:text-amber-400 pt-2 border-t border-slate-800/60"
                  >
                    View Guide &rarr;
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Lineup Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-20 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Lineup Recommendations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated against your {ownedStats.total} owned heroes
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {readyLineups.length} Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {oneAwayLineups.length} One Away
                </span>
              </div>
            </div>

            {/* Recommendation Cards Scrollable List */}
            <div className="space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {recommendations.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Loading lineup recommendations...
                </div>
              ) : (
                recommendations.map((rec) => {
                  const isReady = rec.status === 'ready';
                  const isOneAway = rec.status === 'one_away';

                  return (
                    <div
                      key={rec.lineup.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isReady
                          ? 'bg-slate-950/80 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                          : isOneAway
                          ? 'bg-slate-950/80 border-amber-500/50 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                      }`}
                    >
                      {/* Lineup Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                              {rec.lineup.tier} Tier
                            </span>
                            <span className="text-xs uppercase font-semibold text-slate-400">
                              {rec.lineup.gameMode.replace('_', ' ')}
                            </span>
                            {rec.activeFactionAura && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Aura: +{rec.activeFactionAura.atkPercent}% ATK
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {rec.lineup.name}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isReady ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Ready Now!
                            </span>
                          ) : isOneAway ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                              <AlertCircle className="w-3 h-3" />
                              1 Hero Away
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-semibold">
                              {rec.filledSlots.length}/6 Heroes
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lineup Slots (6 Slots: 2 Front + 4 Back) */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5 flex justify-between">
                          <span>Team Formation:</span>
                          <span>Front Row (1-2) • Back Row (3-6)</span>
                        </div>
                        <div className="grid grid-cols-6 gap-1.5">
                          {rec.lineup.slots.map((slot) => {
                            const filled = rec.filledSlots.find((f) => f.slotIndex === slot.slotIndex);
                            const originalHero = HEROES.find((h) => h.id === slot.heroId);
                            const placedHero = filled ? HEROES.find((h) => h.id === filled.heroId) : originalHero;

                            return (
                              <div
                                key={slot.slotIndex}
                                title={`${placedHero?.name || 'Hero'} (${slot.position} row)`}
                                className={`relative rounded-lg p-1 text-center border transition-all ${
                                  filled
                                    ? filled.isOriginal
                                      ? 'border-emerald-500/60 bg-emerald-950/20'
                                      : 'border-blue-500/60 bg-blue-950/20'
                                    : 'border-red-500/60 bg-red-950/20'
                                }`}
                              >
                                <div className="w-full aspect-square rounded overflow-hidden bg-slate-900 mb-1">
                                  <img
                                    src={placedHero ? getPath(placedHero.avatar) : undefined}
                                    alt={placedHero?.name}
                                    className={`w-full h-full object-cover ${!filled ? 'grayscale opacity-50' : ''}`}
                                  />
                                </div>
                                <div className="text-[9px] font-bold text-slate-200 truncate">
                                  {placedHero?.name.split(' ')[0]}
                                </div>
                                <div className="text-[8px] uppercase text-slate-400">
                                  {filled ? (filled.isSubstitute ? 'Sub' : 'Core') : 'Need'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Missing Hero Callout (If One Away) */}
                      {isOneAway && rec.missingSubstitutableSlots.length > 0 && (
                        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200">
                          <span className="font-bold">Next Target to Unlock:</span>{' '}
                          Pull or target{' '}
                          <strong className="text-amber-400">
                            {HEROES.find((h) => h.id === rec.missingSubstitutableSlots[0].desiredHeroId)?.name}
                          </strong>{' '}
                          or substitute ({rec.missingSubstitutableSlots[0].substitutes.map(s => HEROES.find(h => h.id === s)?.name).filter(Boolean).join(', ')})
                        </div>
                      )}

                      {/* Notes / Action Link */}
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {rec.lineup.notes}
                        </span>
                        <a
                          href={getPath(`/lineups#${rec.lineup.id}`)}
                          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 hover:underline text-[11px]"
                        >
                          Strategy & Builds &rarr;
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
