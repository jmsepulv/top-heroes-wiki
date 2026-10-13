import React, { useState, useMemo, useEffect } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { getPath } from '../utils/paths';
import {
  Swords,
  Shield,
  Zap,
  Target,
  Flame,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Skull
} from 'lucide-react';
import GuildBossBenchmark from './GuildBossBenchmark';

// Faction Triangle Advantage (+20% dealt, -20% received)
// League beats Nature, Nature beats Horde, Horde beats League
function getFactionAdvantage(attackerFaction: string, defenderFaction: string): {
  multiplier: number;
  label: string;
  badgeColor: string;
  isAdvantage: boolean;
  isDisadvantage: boolean;
} {
  if (attackerFaction === defenderFaction) {
    return { multiplier: 1.0, label: 'Neutral (Same Faction: 0%)', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700', isAdvantage: false, isDisadvantage: false };
  }

  if (
    (attackerFaction === 'league' && defenderFaction === 'nature') ||
    (attackerFaction === 'nature' && defenderFaction === 'horde') ||
    (attackerFaction === 'horde' && defenderFaction === 'league')
  ) {
    return { multiplier: 1.2, label: 'Advantage (+20% Faction Damage)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', isAdvantage: true, isDisadvantage: false };
  }

  if (
    (attackerFaction === 'nature' && defenderFaction === 'league') ||
    (attackerFaction === 'horde' && defenderFaction === 'nature') ||
    (attackerFaction === 'league' && defenderFaction === 'horde')
  ) {
    return { multiplier: 0.8, label: 'Disadvantage (-20% Faction Damage)', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40', isAdvantage: false, isDisadvantage: true };
  }

  return { multiplier: 1.0, label: 'Neutral Matchup (0%)', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700', isAdvantage: false, isDisadvantage: false };
}

interface MatchupPreset {
  name: string;
  attackerId: string;
  defenderId: string;
  skillType: 'basic' | 'active' | 'ultimate';
  notes: string;
}

const PRESETS: MatchupPreset[] = [
  {
    name: 'Pyromancer Meteor vs Paragon Bastion (League Duel)',
    attackerId: 'pyromancer',
    defenderId: 'paragon',
    skillType: 'ultimate',
    notes: 'Testing magic nuke against maximum physical frontline tank armor.',
  },
  {
    name: 'Desert Prince Execute vs Treant (Horde vs Nature)',
    attackerId: 'desert_prince',
    defenderId: 'treant',
    skillType: 'ultimate',
    notes: 'Demonstrates faction advantage (+20%) and execute bonus against low HP.',
  },
  {
    name: 'Windwalker Snipe vs Soulmancer (Nature vs Horde)',
    attackerId: 'windwalker',
    defenderId: 'soulmancer',
    skillType: 'active',
    notes: 'Nature marksman firing piercing physical shot into Horde spellcaster.',
  },
  {
    name: 'Paragon Smite vs Barbarian Berserker (League vs Horde)',
    attackerId: 'paragon',
    defenderId: 'barbarian',
    skillType: 'active',
    notes: 'League paladin stun vs Horde berserker with high natural damage reduction.',
  },
];

export default function DamageSimulator() {
  const [activeMode, setActiveMode] = useState<'duel' | 'boss_benchmark'>('duel');
  const [attackerId, setAttackerId] = useState<string>('pyromancer');
  const [defenderId, setDefenderId] = useState<string>('paragon');

  // Attacker modifiers
  const [skillType, setSkillType] = useState<'basic' | 'active' | 'ultimate'>('ultimate');
  const [customAtk, setCustomAtk] = useState<number>(0);
  const [critRate, setCritRate] = useState<number>(30); // 30%
  const [critDmg, setCritDmg] = useState<number>(150); // 150% base
  const [armorPen, setArmorPen] = useState<number>(0); // 0%
  const [hasFactionAura, setHasFactionAura] = useState<boolean>(true); // +20% ATK aura
  const [extraDamageAmp, setExtraDamageAmp] = useState<number>(0); // e.g. +30% magic amp

  // Defender modifiers
  const [customHp, setCustomHp] = useState<number>(0);
  const [customDef, setCustomDef] = useState<number>(0);
  const [defShred, setDefShred] = useState<number>(0); // e.g. Sage 30% shred
  const [damageReduction, setDamageReduction] = useState<number>(0); // e.g. 40%
  const [currentHpPct, setCurrentHpPct] = useState<number>(100); // 100%

  const attacker = useMemo(() => HEROES.find((h) => h.id === attackerId) || HEROES[0], [attackerId]);
  const defender = useMemo(() => HEROES.find((h) => h.id === defenderId) || HEROES[1], [defenderId]);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'boss' || mode === 'guild_boss') setActiveMode('boss_benchmark');
      const att = params.get('attacker');
      const def = params.get('defender');
      if (att && HEROES.some((h) => h.id === att)) setAttackerId(att);
      if (def && HEROES.some((h) => h.id === def)) setDefenderId(def);
    }
  }, []);

  // Sync default stats on hero change
  useEffect(() => {
    setCustomAtk(attacker.baseStats.atk);
  }, [attacker]);

  useEffect(() => {
    setCustomHp(defender.baseStats.hp);
    setCustomDef(defender.baseStats.def);
  }, [defender]);

  // Find skill multiplier
  const skillMultiplier = useMemo(() => {
    if (skillType === 'basic') return 1.0;
    const activeSkill = attacker.skills.find((s) => s.type === 'active');
    const ultSkill = attacker.skills.find((s) => s.type === 'ultimate');

    if (skillType === 'active') {
      // Parse multiplier or default 3.0
      if (attackerId === 'pyromancer') return 2.6;
      if (attackerId === 'windwalker') return 4.2;
      if (attackerId === 'desert_prince') return 4.8;
      return 3.0;
    }

    if (skillType === 'ultimate') {
      if (attackerId === 'pyromancer') return 4.8;
      if (attackerId === 'windwalker') return 6.0;
      if (attackerId === 'desert_prince') return 5.6;
      if (attackerId === 'headhunter') return 6.5;
      return 5.0;
    }

    return 1.0;
  }, [attackerId, skillType]);

  // Execute bonus (e.g., Desert Prince deals +100% damage when target under 30% HP)
  const executeMultiplier = useMemo(() => {
    if (attackerId === 'desert_prince' && skillType === 'ultimate' && currentHpPct <= 30) {
      return 2.0; // +100%
    }
    return 1.0;
  }, [attackerId, skillType, currentHpPct]);

  // Faction Triangle Advantage
  const factionAdvantage = useMemo(() => {
    return getFactionAdvantage(attacker.faction, defender.faction);
  }, [attacker.faction, defender.faction]);

  // Damage Calculation Core
  const combatResult = useMemo(() => {
    const rawAtk = customAtk * (hasFactionAura ? 1.2 : 1.0);
    const baseDamage = rawAtk * skillMultiplier * executeMultiplier * (1 + extraDamageAmp / 100);

    // Defense mitigation: DEF / (DEF + 3500)
    // Armor Pen reduces defense before shred
    const effectiveDef = Math.max(0, customDef * (1 - armorPen / 100) * (1 - defShred / 100));
    const mitigationPct = effectiveDef > 0 ? effectiveDef / (effectiveDef + 3500) : 0;
    const defenseMultiplier = Math.max(0.05, 1 - mitigationPct); // Min 5% damage floor

    // Damage Reduction % (shield/buffs)
    const drMultiplier = Math.max(0, 1 - damageReduction / 100);

    // Non-crit damage
    const nonCritDamage = Math.round(
      baseDamage * defenseMultiplier * factionAdvantage.multiplier * drMultiplier
    );

    // Crit damage
    const critDamage = Math.round(nonCritDamage * (critDmg / 100));

    // Expected weighted average
    const effectiveCritRate = Math.min(100, Math.max(0, critRate)) / 100;
    const expectedAverage = Math.round(
      nonCritDamage * (1 - effectiveCritRate) + critDamage * effectiveCritRate
    );

    // Defender HP metrics
    const effectiveHp = customHp * (currentHpPct / 100);
    const nonCritHpPctRemoved = Math.min(100, (nonCritDamage / customHp) * 100);
    const critHpPctRemoved = Math.min(100, (critDamage / customHp) * 100);
    const hitsToKill = nonCritDamage > 0 ? Math.ceil(effectiveHp / nonCritDamage) : 999;
    const critHitsToKill = critDamage > 0 ? Math.ceil(effectiveHp / critDamage) : 999;

    return {
      rawAtk: Math.round(rawAtk),
      baseDamage: Math.round(baseDamage),
      effectiveDef: Math.round(effectiveDef),
      mitigationPct: Math.round(mitigationPct * 1000) / 10,
      defenseMultiplier,
      nonCritDamage,
      critDamage,
      expectedAverage,
      nonCritHpPctRemoved: Math.round(nonCritHpPctRemoved * 10) / 10,
      critHpPctRemoved: Math.round(critHpPctRemoved * 10) / 10,
      hitsToKill,
      critHitsToKill,
    };
  }, [
    customAtk,
    hasFactionAura,
    skillMultiplier,
    executeMultiplier,
    extraDamageAmp,
    customDef,
    armorPen,
    defShred,
    damageReduction,
    factionAdvantage.multiplier,
    critDmg,
    critRate,
    customHp,
    currentHpPct,
  ]);

  const applyPreset = (preset: MatchupPreset) => {
    setAttackerId(preset.attackerId);
    setDefenderId(preset.defenderId);
    setSkillType(preset.skillType);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveMode('duel')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeMode === 'duel'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-lg shadow-red-500/10'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>PvP & Duel Damage Calculator</span>
        </button>

        <button
          onClick={() => setActiveMode('boss_benchmark')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeMode === 'boss_benchmark'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800'
          }`}
        >
          <Skull className="w-4 h-4 text-purple-400" />
          <span>Guild Boss 60s DPS Benchmark</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold uppercase tracking-wide">
            PvE Engine
          </span>
        </button>
      </div>

      {activeMode === 'boss_benchmark' ? (
        <GuildBossBenchmark />
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
              <Flame className="w-3.5 h-3.5" />
              Combat Engine & Damage Formula Simulator
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Tactical Battle Damage Calculator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Model real-time Physical vs Magic mitigation curves, the +20% Faction Triangle advantage, armor shredding, and critical hit scaling for competitive PvP and Guild War.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCritRate(30);
                setCritDmg(150);
                setArmorPen(0);
                setDefShred(0);
                setDamageReduction(0);
                setCurrentHpPct(100);
                setHasFactionAura(true);
                setExtraDamageAmp(0);
                setSkillType('ultimate');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
              title="Reset modifier sliders"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Sliders</span>
            </button>
          </div>
        </div>

        {/* Preset Duel Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Famous Matchups:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Duel Setup & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Attacker & Defender Setup (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attacker Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                <Swords className="w-4 h-4" />
                Attacking Champion
              </span>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                {attacker.damageType} Damage
              </span>
            </div>

            {/* Attacker Hero Picker */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-red-500/50 shadow-md shrink-0">
                <img src={getPath(attacker.avatar)} alt={attacker.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <select
                  value={attackerId}
                  onChange={(e) => setAttackerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  {HEROES.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.faction.toUpperCase()} • {h.role.toUpperCase()})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1 capitalize">
                  {attacker.title} • {attacker.faction} Faction
                </div>
              </div>
            </div>

            {/* Attack Skill Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 uppercase block mb-1.5">
                Attack Action:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  onClick={() => setSkillType('basic')}
                  className={`py-2 px-3 rounded-xl border transition-all ${
                    skillType === 'basic'
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Basic (100%)
                </button>
                <button
                  onClick={() => setSkillType('active')}
                  className={`py-2 px-3 rounded-xl border transition-all ${
                    skillType === 'active'
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Active ({Math.round(skillMultiplier * 100)}%)
                </button>
                <button
                  onClick={() => setSkillType('ultimate')}
                  className={`py-2 px-3 rounded-xl border transition-all ${
                    skillType === 'ultimate'
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Ultimate ({Math.round(skillMultiplier * 100)}%)
                </button>
              </div>
            </div>

            {/* Attacker Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Attack Power (ATK)</span>
                  <span className="font-bold text-white">{customAtk.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="500"
                  value={customAtk}
                  onChange={(e) => setCustomAtk(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Crit Chance</span>
                  <span className="font-bold text-white">{critRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={critRate}
                  onChange={(e) => setCritRate(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Crit Damage Multiplier</span>
                  <span className="font-bold text-white">{critDmg}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="5"
                  value={critDmg}
                  onChange={(e) => setCritDmg(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Armor Penetration</span>
                  <span className="font-bold text-white">{armorPen}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={armorPen}
                  onChange={(e) => setArmorPen(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>
            </div>

            {/* Attacker Buff Checkboxes */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={hasFactionAura}
                  onChange={(e) => setHasFactionAura(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-0"
                />
                <span>+20% Faction Squad Aura Active</span>
              </label>

              {attackerId === 'desert_prince' && skillType === 'ultimate' && (
                <div className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  Execute Passive: +100% DMG active below 30% HP!
                </div>
              )}
            </div>
          </div>

          {/* Defender Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Shield className="w-4 h-4" />
                Defending Champion (Target)
              </span>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                {defender.role} Target
              </span>
            </div>

            {/* Defender Hero Picker */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-500/50 shadow-md shrink-0">
                <img src={getPath(defender.avatar)} alt={defender.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <select
                  value={defenderId}
                  onChange={(e) => setDefenderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                >
                  {HEROES.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.faction.toUpperCase()} • {h.role.toUpperCase()})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1 capitalize">
                  {defender.title} • {defender.faction} Faction
                </div>
              </div>
            </div>

            {/* Defender Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Target Max HP</span>
                  <span className="font-bold text-white">{customHp.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="250000"
                  step="2000"
                  value={customHp}
                  onChange={(e) => setCustomHp(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Target Defense (DEF)</span>
                  <span className="font-bold text-white">{customDef.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="200"
                  value={customDef}
                  onChange={(e) => setCustomDef(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Defense Shred (Sunder)</span>
                  <span className="font-bold text-white">-{defShred}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={defShred}
                  onChange={(e) => setDefShred(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Damage Reduction %</span>
                  <span className="font-bold text-white">{damageReduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={damageReduction}
                  onChange={(e) => setDamageReduction(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Target Current Health</span>
                  <span className="font-bold text-white">{currentHpPct}% HP Remaining</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={currentHpPct}
                  onChange={(e) => setCurrentHpPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-950 rounded-lg h-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Combat Analysis & Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Faction Advantage Indicator Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Faction Matchup Triangle
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${factionAdvantage.badgeColor}`}>
                {factionAdvantage.label}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Attacker</span>
                <span className="font-bold text-white capitalize">{attacker.faction}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <ArrowRight className="w-4 h-4" />
                <span className="font-bold text-[11px] text-amber-400">
                  x{factionAdvantage.multiplier}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Defender</span>
                <span className="font-bold text-white capitalize">{defender.faction}</span>
              </div>
            </div>

            {/* Defense Mitigation Curve Indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Armor Mitigation Curve:</span>
                <span className="font-bold text-blue-400">
                  {combatResult.mitigationPct}% Blocked ({combatResult.effectiveDef.toLocaleString()} Net DEF)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${combatResult.mitigationPct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Formula: DEF / (DEF + 3500). Higher defense yields diminishing returns.
              </p>
            </div>
          </div>

          {/* Damage Output Numbers Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Calculated Damage Output</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>

            {/* Damage Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Normal Hit */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Normal Hit</span>
                <div className="text-2xl font-black text-white">
                  {combatResult.nonCritDamage.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Takes {combatResult.nonCritHpPctRemoved}% of Max HP
                </span>
              </div>

              {/* Critical Hit */}
              <div className="bg-gradient-to-br from-red-950/40 to-slate-950/80 border border-red-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-400 block">Critical Strike</span>
                <div className="text-2xl font-black text-red-400">
                  {combatResult.critDamage.toLocaleString()}
                </div>
                <span className="text-[10px] text-red-400/70 block">
                  Takes {combatResult.critHpPctRemoved}% of Max HP
                </span>
              </div>
            </div>

            {/* Weighted Average DPS Expectation */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Expected Average Damage
                </span>
                <span className="text-xs text-slate-500">Factoring {critRate}% Crit Chance</span>
              </div>
              <div className="text-xl font-black text-amber-400">
                {combatResult.expectedAverage.toLocaleString()}
              </div>
            </div>

            {/* Visual Defender HP Bar After Strike */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Defender HP Status:</span>
                <span className="text-emerald-400">
                  {combatResult.hitsToKill === 1 ? 'LETHAL 1-SHOT!' : `${combatResult.hitsToKill} Hits to Eliminate`}
                </span>
              </div>

              <div className="relative w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
                {/* Remaining HP */}
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, currentHpPct - combatResult.nonCritHpPctRemoved)}%` }}
                ></div>
                {/* Damage chunk */}
                <div
                  className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-300"
                  style={{
                    left: `${Math.max(0, currentHpPct - combatResult.nonCritHpPctRemoved)}%`,
                    width: `${Math.min(currentHpPct, combatResult.nonCritHpPctRemoved)}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 HP</span>
                <span className="text-red-400 font-bold">
                  -{combatResult.nonCritHpPctRemoved}% HP Removed
                </span>
                <span>{customHp.toLocaleString()} HP</span>
              </div>
            </div>

            {/* Step-by-Step Formula Breakdown Accordion */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-[11px] space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Damage Formula Breakdown:</span>
              </div>
              <div className="space-y-1 text-slate-400 font-mono text-[10px] leading-relaxed">
                <div>• Raw ATK: {combatResult.rawAtk.toLocaleString()} (Aura: {hasFactionAura ? 'x1.2' : 'x1.0'})</div>
                <div>• Skill Multiplier: x{skillMultiplier} {executeMultiplier > 1 ? `(Execute: x${executeMultiplier})` : ''}</div>
                <div>• Effective DEF: {combatResult.effectiveDef.toLocaleString()} (Absorbs {combatResult.mitigationPct}%)</div>
                <div>• Faction Triangle: x{factionAdvantage.multiplier} ({factionAdvantage.label.split(' (')[0]})</div>
                <div>• Final Normal Damage = {combatResult.nonCritDamage.toLocaleString()}</div>
                <div>• Final Critical Strike = {combatResult.critDamage.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
