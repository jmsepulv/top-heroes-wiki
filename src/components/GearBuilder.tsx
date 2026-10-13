import React, { useState, useMemo, useEffect } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { GEAR_SETS, EQUIP_ITEMS, ARTIFACTS, type EquipItem, type Artifact, type GearSet } from '../data/gear';
import {
  ALL_HERO_GEAR_RECOMMENDATIONS,
  TITAN_MARKS,
  ENHANCEMENT_MASTER_FLAT,
  ENHANCEMENT_MASTER_PERCENT,
  type HeroGearRecommendation,
} from '../data/progression';
import { Shield, Swords, Sparkles, Plus, X, RotateCcw, Share2, Check, Zap, Wand2, Search, Filter, Award } from 'lucide-react';
import { getPath } from '../utils/paths';

export default function GearBuilder() {
  const [selectedHeroId, setSelectedHeroId] = useState<string>('paragon');
  const [equippedGear, setEquippedGear] = useState<{
    weapon: string | null;
    armor: string | null;
    helmet: string | null;
    boots: string | null;
    artifact: string | null;
  }>({
    weapon: 'glory_sword',
    armor: 'glory_armor',
    helmet: 'glory_helmet',
    boots: 'glory_boots',
    artifact: 'crown_realm',
  });

  const [titanMarkFaction, setTitanMarkFaction] = useState<'none' | 'league' | 'nature' | 'horde'>('league');
  const [enhancementLevel, setEnhancementLevel] = useState<number>(30); // e.g. 0, 10, 20, 30, 40, 50
  const [activeSlotModal, setActiveSlotModal] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [gearSearch, setGearSearch] = useState<string>('');
  const [filterFaction, setFilterFaction] = useState<string>('all');

  // Load hero from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const heroParam = params.get('hero');
      if (heroParam && HEROES.some((h) => h.id === heroParam)) {
        setSelectedHeroId(heroParam);
      }
    }
  }, []);

  const selectedHero = useMemo(() => {
    return HEROES.find((h) => h.id === selectedHeroId) || HEROES[0];
  }, [selectedHeroId]);

  // Find recommendation from the 46-hero research database
  const heroRec = useMemo(() => {
    return ALL_HERO_GEAR_RECOMMENDATIONS.find(
      (r) => r.hero.toLowerCase() === selectedHero.name.toLowerCase()
    );
  }, [selectedHero]);

  // Equip full set helper
  const equipFullSet = (setNameOrId: string) => {
    let targetSetId = 'glory_of_the_knight';
    const lower = setNameOrId.toLowerCase();
    if (lower.includes('blood') || lower.includes('fury')) targetSetId = 'fury_of_blood';
    else if (lower.includes('titan') || lower.includes('might')) targetSetId = 'titans_might';
    else if (lower.includes('glory') || lower.includes('knight')) targetSetId = 'glory_of_the_knight';

    const weapon = EQUIP_ITEMS.find((i) => i.slot === 'weapon' && i.setId === targetSetId)?.id || null;
    const armor = EQUIP_ITEMS.find((i) => i.slot === 'armor' && i.setId === targetSetId)?.id || null;
    const helmet = EQUIP_ITEMS.find((i) => i.slot === 'helmet' && i.setId === targetSetId)?.id || null;
    const boots = EQUIP_ITEMS.find((i) => i.slot === 'boots' && i.setId === targetSetId)?.id || null;

    setEquippedGear((prev) => ({
      ...prev,
      weapon,
      armor,
      helmet,
      boots,
    }));
  };

  const equipItem = (slot: keyof typeof equippedGear, itemId: string) => {
    setEquippedGear((prev) => ({
      ...prev,
      [slot]: itemId,
    }));
    setActiveSlotModal(null);
  };

  const removeItem = (slot: keyof typeof equippedGear, e: React.MouseEvent) => {
    e.stopPropagation();
    setEquippedGear((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  const clearAllGear = () => {
    setEquippedGear({
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      artifact: null,
    });
  };

  const shareBuild = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('hero', selectedHeroId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Detected Equipped Items
  const currentItems = useMemo(() => {
    return {
      weapon: EQUIP_ITEMS.find((i) => i.id === equippedGear.weapon),
      armor: EQUIP_ITEMS.find((i) => i.id === equippedGear.armor),
      helmet: EQUIP_ITEMS.find((i) => i.id === equippedGear.helmet),
      boots: EQUIP_ITEMS.find((i) => i.id === equippedGear.boots),
      artifact: ARTIFACTS.find((a) => a.id === equippedGear.artifact),
    };
  }, [equippedGear]);

  // Set Counts
  const setCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const { weapon, armor, helmet, boots } = currentItems;
    [weapon, armor, helmet, boots].forEach((item) => {
      if (item && 'setId' in item && item.setId) {
        counts[item.setId] = (counts[item.setId] || 0) + 1;
      }
    });
    return counts;
  }, [currentItems]);

  // Active Set Bonuses
  const activeSetBonuses = useMemo(() => {
    const bonuses: { set: GearSet; pieces: number; text: string }[] = [];
    GEAR_SETS.forEach((set) => {
      const count = setCounts[set.id] || 0;
      if (count >= 4) {
        bonuses.push({ set, pieces: 4, text: `4-Piece: ${set.fourPieceBonus}` });
      } else if (count >= 2) {
        bonuses.push({ set, pieces: 2, text: `2-Piece: ${set.twoPieceBonus}` });
      }
    });
    return bonuses;
  }, [setCounts]);

  // Titan Mark Status
  const titanMarkActive = useMemo(() => {
    return titanMarkFaction !== 'none' && titanMarkFaction.toLowerCase() === selectedHero.faction.toLowerCase();
  }, [titanMarkFaction, selectedHero]);

  // Enhancement Master Status
  const enhancementMasterData = useMemo(() => {
    if (enhancementLevel <= 0) return null;
    const isFullSetEquipped = Boolean(currentItems.weapon && currentItems.armor && currentItems.helmet && currentItems.boots);
    const pctTier = ENHANCEMENT_MASTER_PERCENT.find((p) => p.level === `+${enhancementLevel}`) || {
      level: `+${enhancementLevel}`,
      gearAttackPct: enhancementLevel >= 50 ? 200 : enhancementLevel >= 40 ? 100 : enhancementLevel >= 30 ? 50 : enhancementLevel >= 20 ? 25 : 10,
      gearHpPct: enhancementLevel >= 50 ? 200 : enhancementLevel >= 40 ? 100 : enhancementLevel >= 30 ? 50 : enhancementLevel >= 20 ? 25 : 10,
    };
    return {
      isFullSetEquipped,
      pctTier,
    };
  }, [enhancementLevel, currentItems]);

  // Final Stat Calculation
  const finalStats = useMemo(() => {
    let rawGearHp = 0;
    let rawGearAtk = 0;
    let rawGearDef = 0;
    let bonusSpd = 0;
    let bonusCrit = 0;
    let bonusDmgRed = 0;
    let bonusDmgAmp = 0;

    // Add stats from 4 gear pieces
    const { weapon, armor, helmet, boots, artifact } = currentItems;
    [weapon, armor, helmet, boots].forEach((item) => {
      if (!item) return;
      if (item.stats.hp) rawGearHp += item.stats.hp;
      if (item.stats.atk) rawGearAtk += item.stats.atk;
      if (item.stats.def) rawGearDef += item.stats.def;
      if (item.stats.spd) bonusSpd += item.stats.spd;
      if (item.stats.critRate) bonusCrit += item.stats.critRate;
    });

    // Add Artifact stats
    if (artifact) {
      if (artifact.stats.hp) rawGearHp += artifact.stats.hp;
      if (artifact.stats.atk) rawGearAtk += artifact.stats.atk;
      if (artifact.stats.def) rawGearDef += artifact.stats.def;
      if (artifact.stats.critRate) bonusCrit += artifact.stats.critRate;
    }

    // Apply Titan Mark: +30% to all gear stats if faction matches
    if (titanMarkActive) {
      rawGearHp = Math.round(rawGearHp * 1.3);
      rawGearAtk = Math.round(rawGearAtk * 1.3);
      rawGearDef = Math.round(rawGearDef * 1.3);
    }

    // Apply Enhancement Master percentage scaling to gear stats
    if (enhancementMasterData && enhancementMasterData.isFullSetEquipped) {
      const atkMult = 1 + enhancementMasterData.pctTier.gearAttackPct / 100;
      const hpMult = 1 + enhancementMasterData.pctTier.gearHpPct / 100;
      rawGearAtk = Math.round(rawGearAtk * atkMult);
      rawGearHp = Math.round(rawGearHp * hpMult);
    }

    // Apply 4-Piece / 2-Piece Set Bonuses
    GEAR_SETS.forEach((set) => {
      const count = setCounts[set.id] || 0;
      if (count >= 4) {
        if (set.gearHpPct) rawGearHp += Math.round((selectedHero.baseStats.hp * set.gearHpPct) / 100);
        if (set.gearAttackPct) rawGearAtk += Math.round((selectedHero.baseStats.atk * set.gearAttackPct) / 100);
        if (set.otherBonusName === 'Damage Reduction') bonusDmgRed += set.otherBonusPct;
        if (set.otherBonusName === 'Skill Damage Amplify' || set.otherBonusName === 'Damage Increase') bonusDmgAmp += set.otherBonusPct;
      } else if (count >= 2) {
        if (set.id === 'fury_of_blood') rawGearHp += Math.round((selectedHero.baseStats.hp * 40) / 100);
        if (set.id === 'glory_of_the_knight') {
          rawGearAtk += Math.round((selectedHero.baseStats.atk * 20) / 100);
          rawGearHp += Math.round((selectedHero.baseStats.hp * 40) / 100);
        }
        if (set.id === 'titans_might') rawGearAtk += Math.round((selectedHero.baseStats.atk * 40) / 100);
      }
    });

    return {
      hp: selectedHero.baseStats.hp + rawGearHp,
      atk: selectedHero.baseStats.atk + rawGearAtk,
      def: selectedHero.baseStats.def + rawGearDef,
      spd: selectedHero.baseStats.spd + bonusSpd,
      critRate: bonusCrit,
      dmgRed: bonusDmgRed,
      dmgAmp: bonusDmgAmp,
      rawGearHp,
      rawGearAtk,
      rawGearDef,
    };
  }, [selectedHero, currentItems, setCounts, titanMarkActive, enhancementMasterData]);

  const slotsList: { key: keyof typeof equippedGear; label: string; icon: string }[] = [
    { key: 'weapon', label: 'Sword (Weapon)', icon: '⚔️' },
    { key: 'armor', label: 'Chest / Armor', icon: '🛡️' },
    { key: 'helmet', label: 'Helmet', icon: '👑' },
    { key: 'boots', label: 'Boots', icon: '👢' },
    { key: 'artifact', label: 'Mythic Artifact', icon: '✨' },
  ];

  // Filter recommendations table
  const filteredRecs = useMemo(() => {
    return ALL_HERO_GEAR_RECOMMENDATIONS.filter((r) => {
      const matchSearch = r.hero.toLowerCase().includes(gearSearch.toLowerCase()) || r.recommendedSet.toLowerCase().includes(gearSearch.toLowerCase());
      const matchFaction = filterFaction === 'all' || r.faction.toLowerCase() === filterFaction.toLowerCase();
      return matchSearch && matchFaction;
    });
  }, [gearSearch, filterFaction]);

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
              <Wand2 className="w-3.5 h-3.5" />
              Verified Armory Engine • 4-Piece Sets & Titan Marks
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Interactive Gear & Titan Mark Optimizer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Equip canonical endgame sets (Fury of Blood, Glory of the Knight, Titan's Might), toggle Titan Marks for +30% faction resonance, and calculate exact Enhancement Master bonuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shareBuild}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Loadout'}</span>
            </button>
            <button
              onClick={clearAllGear}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Strip All Gear"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Armory Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Hero & Equipment Slots Paperdoll (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
          {/* Hero Selector Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/50 shadow-md">
                <img src={getPath(selectedHero.avatar)} alt={selectedHero.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <select
                  value={selectedHeroId}
                  onChange={(e) => setSelectedHeroId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  {HEROES.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.rarity.toUpperCase()} • {h.faction.toUpperCase()})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1 capitalize flex items-center gap-2">
                  <span>{selectedHero.role} • {selectedHero.damageType} Damage</span>
                </div>
              </div>
            </div>

            {/* Quick Equip BiS */}
            {heroRec && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => equipFullSet(heroRec.recommendedSet)}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Equip {heroRec.recommendedSet}</span>
                </button>
                {heroRec.alternateSet && (
                  <button
                    onClick={() => equipFullSet(heroRec.alternateSet!)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-700"
                  >
                    Alt: {heroRec.alternateSet}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Systems Modifier Bar: Titan Mark & Enhancement Master */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            {/* Titan Mark */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
                <span>Titan Mark (Faction Mark)</span>
                {titanMarkActive ? (
                  <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    +30% STATS ACTIVE
                  </span>
                ) : titanMarkFaction !== 'none' ? (
                  <span className="text-amber-400 text-[10px]">Faction Mismatch</span>
                ) : null}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['none', 'league', 'nature', 'horde'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTitanMarkFaction(f)}
                    className={`text-xs py-1.5 px-2 rounded-lg font-bold capitalize transition-all ${
                      titanMarkFaction === f
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Grants +30% of total gear stats when assigned mark matches hero faction.
              </p>
            </div>

            {/* Enhancement Master */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
                <span>Enhancement Master</span>
                {enhancementMasterData && enhancementMasterData.isFullSetEquipped && (
                  <span className="text-purple-400 font-extrabold text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30">
                    +{enhancementMasterData.pctTier.gearAttackPct}% STATS
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1">
                {[0, 10, 20, 30, 40, 50].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setEnhancementLevel(lvl)}
                    className={`text-xs py-1.5 rounded-lg font-bold transition-all ${
                      enhancementLevel === lvl
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {lvl === 0 ? 'Off' : `+${lvl}`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Applies when all 4 gear pieces are at the same level or higher.
              </p>
            </div>
          </div>

          {/* 5 Slots Grid (4 Gear Pieces + 1 Artifact) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {slotsList.map(({ key, label, icon }) => {
              const item = currentItems[key];

              return (
                <div
                  key={key}
                  onClick={() => setActiveSlotModal(key)}
                  className={`relative cursor-pointer rounded-2xl p-4 border transition-all text-center ${
                    item
                      ? 'border-purple-500/50 bg-slate-950/80 shadow-md shadow-purple-500/5 hover:border-purple-400'
                      : 'border-dashed border-slate-800 bg-slate-950/30 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between mb-2">
                    <span>{icon} {label}</span>
                    {item && (
                      <button
                        onClick={(e) => removeItem(key, e)}
                        className="text-slate-500 hover:text-red-400 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {item ? (
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 mx-auto mb-2 flex items-center justify-center text-xl">
                        {icon}
                      </div>
                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-purple-400 font-semibold uppercase mt-0.5">
                        {'setId' in item ? GEAR_SETS.find((s) => s.id === item.setId)?.name : item.rarity}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center justify-center text-slate-500">
                      <Plus className="w-5 h-5 mb-1 text-slate-600" />
                      <span className="text-xs font-semibold">Empty Slot</span>
                      <span className="text-[10px] text-slate-600">Click to Equip</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Item Selection Drawer */}
          {activeSlotModal !== null && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span>Select {activeSlotModal.toUpperCase()} to Equip:</span>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Close &times;
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeSlotModal === 'artifact' ? (
                  ARTIFACTS.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => equipItem('artifact', art.id)}
                      className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-purple-400 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>✨ {art.name}</span>
                          <span className="text-[10px] text-red-400 font-semibold uppercase">[{art.rarity}]</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{art.effect}</p>
                      </div>
                      <span className="text-xs font-semibold text-purple-400 shrink-0">Equip &rarr;</span>
                    </div>
                  ))
                ) : (
                  EQUIP_ITEMS.filter((i) => i.slot === activeSlotModal).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => equipItem(activeSlotModal as keyof typeof equippedGear, item.id)}
                      className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-purple-400 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-purple-400 font-semibold uppercase">[{item.rarity}]</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Set: {GEAR_SETS.find((s) => s.id === item.setId)?.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-purple-400 shrink-0">Equip &rarr;</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Calculated Final Stats & Set Bonuses (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calculated Combat Attributes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Calculated Final Hero Attributes
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Max HP:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {finalStats.hp.toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (+{finalStats.rawGearHp.toLocaleString()})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Attack (ATK):</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {finalStats.atk.toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (+{finalStats.rawGearAtk.toLocaleString()})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Defense (DEF):</span>
                <span className="font-mono text-blue-400 font-bold text-sm">
                  {finalStats.def.toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (+{finalStats.rawGearDef.toLocaleString()})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Combat Speed:</span>
                <span className="font-mono text-white font-bold">{finalStats.spd}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Crit Rate</div>
                  <div className="text-sm font-black text-red-400 font-mono mt-0.5">+{finalStats.critRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Damage Red.</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">+{finalStats.dmgRed}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dmg Amplify</div>
                  <div className="text-sm font-black text-purple-400 font-mono mt-0.5">+{finalStats.dmgAmp}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Set Bonuses Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Active Set Synergies
            </h3>

            {activeSetBonuses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-500 text-center italic">
                Equip at least 2 pieces from the same set to activate bonuses.
              </div>
            ) : (
              <div className="space-y-3">
                {activeSetBonuses.map((bonus, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/40 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-purple-300 font-bold">{bonus.set.name}</strong>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
                        {bonus.pieces}-Piece Active
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{bonus.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 46 Heroes Official Gear Recommendation Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              Verified Per-Hero Gear Matrix (All 46 Heroes)
            </div>
            <h2 className="text-2xl font-black text-white">Recommended Sets by Hero</h2>
            <p className="text-xs text-slate-400 mt-1">
              Data sourced directly from top competitive meta reports and community guides. Click "Equip Loadout" to immediately simulate.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hero or set..."
                value={gearSearch}
                onChange={(e) => setGearSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-48"
              />
            </div>
            <select
              value={filterFaction}
              onChange={(e) => setFilterFaction(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Factions</option>
              <option value="league">League</option>
              <option value="nature">Nature</option>
              <option value="horde">Horde</option>
            </select>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRecs.map((rec) => {
            const isSelected = selectedHero.name.toLowerCase() === rec.hero.toLowerCase();
            return (
              <div
                key={rec.hero}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rec.hero}</span>
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${
                      rec.faction === 'League' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                      rec.faction === 'Nature' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                      'text-red-400 bg-red-500/10 border-red-500/30'
                    }`}>
                      {rec.faction}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">({rec.rarity})</span>
                  </div>
                  <button
                    onClick={() => {
                      const matchHero = HEROES.find((h) => h.name.toLowerCase() === rec.hero.toLowerCase());
                      if (matchHero) setSelectedHeroId(matchHero.id);
                      equipFullSet(rec.recommendedSet);
                    }}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    Simulate &rarr;
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">Recommended:</span>
                    <span className="font-semibold text-purple-300">{rec.recommendedSet}</span>
                  </div>
                  {rec.alternateSet && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">Alternate:</span>
                      <span className="font-medium text-slate-300">{rec.alternateSet}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
