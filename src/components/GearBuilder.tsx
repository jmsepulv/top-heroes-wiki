import React, { useState, useMemo, useEffect } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { GEAR_SETS, EQUIP_ITEMS, ARTIFACTS, type EquipItem, type Artifact, type GearSet } from '../data/gear';
import { Shield, Swords, Sparkles, Plus, X, RotateCcw, Share2, Check, Zap, Wand2 } from 'lucide-react';
import { getPath } from '../utils/paths';

export default function GearBuilder() {
  const [selectedHeroId, setSelectedHeroId] = useState<string>('paragon');
  const [equippedGear, setEquippedGear] = useState<{
    weapon: string | null;
    armor: string | null;
    helmet: string | null;
    boots: string | null;
    ring: string | null;
    artifact: string | null;
  }>({
    weapon: 'valiant_sword',
    armor: 'valiant_armor',
    helmet: 'valiant_helm',
    boots: 'valiant_boots',
    ring: 'valiant_ring',
    artifact: 'crown_realm',
  });
  const [activeSlotModal, setActiveSlotModal] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Load from URL if present
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

  const applyRecommendedBuild = () => {
    if (selectedHero.role === 'tank') {
      setEquippedGear({
        weapon: 'valiant_sword',
        armor: 'valiant_armor',
        helmet: 'valiant_helm',
        boots: 'valiant_boots',
        ring: 'valiant_ring',
        artifact: 'crown_realm',
      });
    } else if (selectedHero.damageType === 'magic' && selectedHero.role !== 'support') {
      setEquippedGear({
        weapon: 'arcane_staff',
        armor: 'arcane_robe',
        helmet: 'arcane_hood',
        boots: 'arcane_boots',
        ring: 'arcane_ring',
        artifact: 'phoenix_feather',
      });
    } else if (selectedHero.damageType === 'physical' && selectedHero.role === 'dps') {
      setEquippedGear({
        weapon: 'savage_daggers',
        armor: 'savage_chest',
        helmet: 'savage_helm',
        boots: 'savage_boots',
        ring: 'savage_ring',
        artifact: 'scimitar_sands',
      });
    } else {
      // Support
      setEquippedGear({
        weapon: 'celestial_scepter',
        armor: 'celestial_vest',
        helmet: 'celestial_mitre',
        boots: 'celestial_boots',
        ring: 'celestial_ring',
        artifact: 'emerald_scepter',
      });
    }
  };

  const clearAllGear = () => {
    setEquippedGear({
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      ring: null,
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
      ring: EQUIP_ITEMS.find((i) => i.id === equippedGear.ring),
      artifact: ARTIFACTS.find((a) => a.id === equippedGear.artifact),
    };
  }, [equippedGear]);

  // Set Counts
  const setCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(currentItems).forEach((item) => {
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

  // Final Stat Calculation
  const finalStats = useMemo(() => {
    let bonusHp = 0;
    let bonusAtk = 0;
    let bonusDef = 0;
    let bonusSpd = 0;
    let bonusCrit = 0;
    let bonusHaste = 0;
    let bonusDmgRed = 0;

    // Add stats from 5 gear pieces
    Object.values(currentItems).forEach((item) => {
      if (!item) return;
      if (item.stats.hp) bonusHp += item.stats.hp;
      if (item.stats.atk) bonusAtk += item.stats.atk;
      if (item.stats.def) bonusDef += item.stats.def;
      if ('spd' in item.stats && item.stats.spd) bonusSpd += item.stats.spd;
      if (item.stats.critRate) bonusCrit += item.stats.critRate;
      if ('haste' in item.stats && item.stats.haste) bonusHaste += item.stats.haste;
      if ('dmgRed' in item.stats && item.stats.dmgRed) bonusDmgRed += item.stats.dmgRed;
    });

    // Add set bonus stats
    GEAR_SETS.forEach((set) => {
      const count = setCounts[set.id] || 0;
      if (count >= 2) {
        if (set.twoPieceStats.hpPercent) {
          bonusHp += Math.round((selectedHero.baseStats.hp * set.twoPieceStats.hpPercent) / 100);
        }
        if (set.twoPieceStats.atkPercent) {
          bonusAtk += Math.round((selectedHero.baseStats.atk * set.twoPieceStats.atkPercent) / 100);
        }
        if (set.twoPieceStats.dmgRed) bonusDmgRed += set.twoPieceStats.dmgRed;
        if (set.twoPieceStats.critRate) bonusCrit += set.twoPieceStats.critRate;
        if (set.twoPieceStats.haste) bonusHaste += set.twoPieceStats.haste;
      }
    });

    return {
      hp: selectedHero.baseStats.hp + bonusHp,
      atk: selectedHero.baseStats.atk + bonusAtk,
      def: selectedHero.baseStats.def + bonusDef,
      spd: selectedHero.baseStats.spd + bonusSpd,
      critRate: bonusCrit,
      haste: bonusHaste,
      dmgRed: bonusDmgRed,
      bonusHp,
      bonusAtk,
      bonusDef,
    };
  }, [selectedHero, currentItems, setCounts]);

  const slotsList: { key: keyof typeof equippedGear; label: string; icon: string }[] = [
    { key: 'weapon', label: 'Weapon', icon: '⚔️' },
    { key: 'armor', label: 'Armor Plate', icon: '🛡️' },
    { key: 'helmet', label: 'Helmet / Hood', icon: '👑' },
    { key: 'boots', label: 'Boots', icon: '👢' },
    { key: 'ring', label: 'Signet Ring', icon: '💍' },
    { key: 'artifact', label: 'Mythic Artifact', icon: '✨' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
              <Wand2 className="w-3.5 h-3.5" />
              Armory & Equipment Simulator
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Interactive Gear & Artifact Optimizer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Equip 2-piece and 4-piece gear sets, pair Mythic artifacts, and calculate exact final stat scalings for any hero in your roster.
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
                <img src={selectedHero.avatar} alt={selectedHero.name} className="w-full h-full object-cover" />
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
                <div className="text-xs text-slate-400 mt-1 capitalize">
                  {selectedHero.role} • {selectedHero.damageType} Damage
                </div>
              </div>
            </div>

            <button
              onClick={applyRecommendedBuild}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors border border-amber-500/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Equip BiS (Meta Loadout)</span>
            </button>
          </div>

          {/* 6 Equipment Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {slotsList.map(({ key, label, icon }) => {
              const item = currentItems[key];
              const isArtifact = key === 'artifact';

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
                        {item.rarity}
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
                    (+{finalStats.bonusHp.toLocaleString()})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Attack (ATK):</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {finalStats.atk.toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (+{finalStats.bonusAtk.toLocaleString()})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Defense (DEF):</span>
                <span className="font-mono text-blue-400 font-bold text-sm">
                  {finalStats.def.toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (+{finalStats.bonusDef.toLocaleString()})
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
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Skill Haste</div>
                  <div className="text-sm font-black text-purple-400 font-mono mt-0.5">+{finalStats.haste}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Damage Red.</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">+{finalStats.dmgRed}%</div>
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
                Equip at least 2 pieces from the same set to unlock bonus abilities.
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
    </div>
  );
}
