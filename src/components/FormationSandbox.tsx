import React, { useState, useMemo, useEffect } from 'react';
import { HEROES, type Hero } from '../data/heroes';
import { calculateAura, getFactionById } from '../data/factions';
import {
  Shield,
  Swords,
  Sparkles,
  Plus,
  X,
  RotateCcw,
  Share2,
  Check,
  AlertTriangle,
  CheckCircle2,
  Download,
  Image,
  Loader2,
  Copy
} from 'lucide-react';
import { getPath } from '../utils/paths';
import { downloadFormationCard, copyFormationCardToClipboard } from '../utils/cardExporter';

export default function FormationSandbox() {
  // 6 slots: index 0 & 1 = Front, index 2,3,4,5 = Back
  const [team, setTeam] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [cardDownloaded, setCardDownloaded] = useState<boolean>(false);
  const [cardCopied, setCardCopied] = useState<boolean>(false);

  // Load from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const teamParam = params.get('team');
      if (teamParam) {
        const ids = teamParam.split(',');
        const newTeam: (string | null)[] = [null, null, null, null, null, null];
        ids.forEach((id, idx) => {
          if (idx < 6 && HEROES.some((h) => h.id === id)) {
            newTeam[idx] = id;
          }
        });
        setTeam(newTeam);
      }
    }
  }, []);

  const assignHero = (slotIndex: number, heroId: string) => {
    setTeam((prev) => {
      const next = [...prev];
      // If hero already assigned to another slot, remove it from that slot
      const existingIdx = next.indexOf(heroId);
      if (existingIdx !== -1) {
        next[existingIdx] = null;
      }
      next[slotIndex] = heroId;
      return next;
    });
    setSelectedSlotIndex(null);
  };

  const removeHero = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTeam((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const clearTeam = () => {
    setTeam([null, null, null, null, null, null]);
    setSelectedSlotIndex(null);
  };

  const shareTeam = () => {
    if (typeof window === 'undefined') return;
    const filled = team.map((id) => id || '').join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('team', filled);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Team Synergy Metrics
  const activeHeroes = useMemo(() => {
    return team.map((id) => (id ? HEROES.find((h) => h.id === id) : null)).filter(Boolean) as Hero[];
  }, [team]);

  const auraAnalysis = useMemo(() => {
    const counts: Record<string, number> = {};
    activeHeroes.forEach((h) => {
      counts[h.faction] = (counts[h.faction] || 0) + 1;
    });
    return calculateAura(counts);
  }, [activeHeroes]);

  const tacticalChecklist = useMemo(() => {
    const tanks = activeHeroes.filter((h) => h.role === 'tank').length;
    const carries = activeHeroes.filter((h) => h.role === 'dps').length;
    const supports = activeHeroes.filter((h) => h.role === 'support').length;
    const controllers = activeHeroes.filter((h) => h.role === 'control').length;

    const physical = activeHeroes.filter((h) => h.damageType === 'physical').length;
    const magic = activeHeroes.filter((h) => h.damageType === 'magic').length;

    const checks = [
      {
        label: 'Frontline Anchor',
        passed: tanks >= 1,
        text: tanks >= 1 ? `${tanks} Dedicated Tank(s) protect the squad.` : 'Missing a frontline tank! Carries are vulnerable to burst.',
      },
      {
        label: 'Damage Output',
        passed: carries >= 2,
        text: carries >= 2 ? `${carries} DPS hypercarries provide lethal kill pressure.` : 'Low damage! Recommend fielding at least 2 primary carries.',
      },
      {
        label: 'Support & Sustain',
        passed: supports >= 1,
        text: supports >= 1 ? `${supports} Support hero providing heals/haste.` : 'No healer or buffer. Team will struggle in prolonged battles.',
      },
      {
        label: 'Damage Distribution',
        passed: (physical > 0 && magic > 0) || activeHeroes.length < 4,
        text: physical > 0 && magic > 0 ? `Balanced (${physical} Physical / ${magic} Magic). Prevents enemy single-resistance countering.` : 'Mono-damage type detected. Enemies with high specific defense will counter you.',
      },
    ];

    return { checks, tanks, carries, supports, controllers, physical, magic };
  }, [activeHeroes]);

  const teamTotals = useMemo(() => {
    return activeHeroes.reduce(
      (acc, h) => {
        acc.atk += h.baseStats.atk;
        acc.hp += h.baseStats.hp;
        acc.def += h.baseStats.def;
        return acc;
      },
      { atk: 0, hp: 0, def: 0 }
    );
  }, [activeHeroes]);

  const handleDownloadCard = async () => {
    if (activeHeroes.length === 0) return;
    setIsExporting(true);
    try {
      const teamHeroes = team.map((id) => (id ? HEROES.find((h) => h.id === id) || null : null));
      await downloadFormationCard({
        heroes: teamHeroes,
        auraTitle: auraAnalysis.title,
        auraBonusText: auraAnalysis.description || '',
        totalAtk: teamTotals.atk,
        totalHp: teamTotals.hp,
        totalDef: teamTotals.def,
      });
      setCardDownloaded(true);
      setTimeout(() => setCardDownloaded(false), 2500);
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCard = async () => {
    if (activeHeroes.length === 0) return;
    setIsExporting(true);
    try {
      const teamHeroes = team.map((id) => (id ? HEROES.find((h) => h.id === id) || null : null));
      const success = await copyFormationCardToClipboard({
        heroes: teamHeroes,
        auraTitle: auraAnalysis.title,
        auraBonusText: auraAnalysis.description || '',
        totalAtk: teamTotals.atk,
        totalHp: teamTotals.hp,
        totalDef: teamTotals.def,
      });
      if (success) {
        setCardCopied(true);
        setTimeout(() => setCardCopied(false), 2500);
      } else {
        // Fallback to direct download
        await handleDownloadCard();
      }
    } catch (err) {
      console.error('Failed to copy card to clipboard:', err);
      await handleDownloadCard();
    } finally {
      setIsExporting(false);
    }
  };

  const loadPreset = (presetIds: string[]) => {
    setTeam(presetIds);
    setSelectedSlotIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Shield className="w-3.5 h-3.5" />
              Custom Formation Sandbox
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              6-Slot Lineup Builder & Synergy Checker
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Design custom formations, test faction aura multipliers (+25% mono and 3+3 hybrid), and run real-time balance diagnostics against tactical archetypes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export Card PNG Button */}
            <button
              onClick={handleDownloadCard}
              disabled={isExporting || activeHeroes.length === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                activeHeroes.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-105 active:scale-95'
              }`}
              title="Download high-res lineup PNG card for Discord/Reddit"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : cardDownloaded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Generating...' : cardDownloaded ? 'Downloaded!' : 'Export Card (PNG)'}</span>
            </button>

            {/* Copy Card to Clipboard */}
            <button
              onClick={handleCopyCard}
              disabled={isExporting || activeHeroes.length === 0}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeHeroes.length === 0
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white'
              }`}
              title="Copy formation image to clipboard"
            >
              {cardCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Share URL Button */}
            <button
              onClick={shareTeam}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Lineup'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={clearTeam}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Reset Sandbox"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Presets Row */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Meta Presets:
          </span>
          <button
            onClick={() => loadPreset(['paragon', 'secret_keeper', 'pyromancer', 'astrologer', 'bard', 'bishop'])}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-300 hover:text-white transition-colors"
          >
            Mono League (+25%)
          </button>
          <button
            onClick={() => loadPreset(['treant', 'druid', 'forest_maiden', 'windwalker', 'sage', 'pathfinder'])}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 hover:text-white transition-colors"
          >
            Mono Nature (+25%)
          </button>
          <button
            onClick={() => loadPreset(['barbarian', 'desert_prince', 'soulmancer', 'warlock', 'headhunter', 'shaman'])}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-red-300 hover:text-white transition-colors"
          >
            Mono Horde (+25%)
          </button>
          <button
            onClick={() => loadPreset(['paragon', 'desert_prince', 'pyromancer', 'soulmancer', 'astrologer', 'warlock'])}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 hover:text-white transition-colors"
          >
            League + Horde Hybrid (+15%)
          </button>
        </div>
      </div>

      {/* Main Formation Board & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 6-Slot Formation Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-8">
          {/* Front Row (Slots 1 & 2) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Shield className="w-4 h-4" />
                Front Row (Tanks & Melee Bruisers)
              </span>
              <span>Slots 1 & 2</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((slotIdx) => {
                const heroId = team[slotIdx];
                const hero = heroId ? HEROES.find((h) => h.id === heroId) : null;
                const isSelected = selectedSlotIndex === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => setSelectedSlotIndex(isSelected ? null : slotIdx)}
                    className={`relative cursor-pointer rounded-2xl p-4 border text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : hero
                        ? 'border-slate-700 bg-slate-950 hover:border-slate-600'
                        : 'border-dashed border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    {hero ? (
                      <div>
                        <button
                          onClick={(e) => removeHero(slotIdx, e)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 mx-auto mb-2 border border-slate-800">
                          <img src={getPath(hero.avatar)} alt={hero.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm font-bold text-white truncate">{hero.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{hero.role} • {hero.faction}</div>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                        <Plus className="w-6 h-6 mb-1 text-slate-600" />
                        <span className="text-xs font-semibold">Slot {slotIdx + 1} (Empty)</span>
                        <span className="text-[10px] text-slate-600">Click to Select</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back Row (Slots 3, 4, 5, 6) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Swords className="w-4 h-4" />
                Back Row (Carries, Healers, Buffers)
              </span>
              <span>Slots 3 - 6</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[2, 3, 4, 5].map((slotIdx) => {
                const heroId = team[slotIdx];
                const hero = heroId ? HEROES.find((h) => h.id === heroId) : null;
                const isSelected = selectedSlotIndex === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => setSelectedSlotIndex(isSelected ? null : slotIdx)}
                    className={`relative cursor-pointer rounded-2xl p-3 border text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : hero
                        ? 'border-slate-700 bg-slate-950 hover:border-slate-600'
                        : 'border-dashed border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    {hero ? (
                      <div>
                        <button
                          onClick={(e) => removeHero(slotIdx, e)}
                          className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 mx-auto mb-1.5 border border-slate-800">
                          <img src={getPath(hero.avatar)} alt={hero.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs font-bold text-white truncate">{hero.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{hero.role}</div>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center justify-center text-slate-500">
                        <Plus className="w-5 h-5 mb-1 text-slate-600" />
                        <span className="text-[11px] font-semibold">Slot {slotIdx + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero Selection Picker Drawer */}
          {selectedSlotIndex !== null && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Select Hero for Slot {selectedSlotIndex + 1}:</span>
                <button
                  onClick={() => setSelectedSlotIndex(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Close &times;
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
                {HEROES.map((h) => {
                  const isAssigned = team.includes(h.id);
                  return (
                    <div
                      key={h.id}
                      onClick={() => assignHero(selectedSlotIndex, h.id)}
                      className={`cursor-pointer rounded-xl p-2 border text-center transition-all ${
                        isAssigned
                          ? 'border-slate-800 bg-slate-900/40 opacity-40 hover:opacity-100'
                          : 'border-slate-800 bg-slate-900 hover:border-amber-400 hover:scale-105'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 mx-auto mb-1">
                        <img src={getPath(h.avatar)} alt={h.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[10px] font-bold text-white truncate">{h.name.split(' ')[0]}</div>
                      <div className="text-[9px] text-slate-400 uppercase">{h.faction}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Diagnostics & Aura (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Faction Aura Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Active Faction Synergy Aura
            </h3>

            {auraAnalysis ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 text-center">
                <div className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Dominant: <strong className="text-white capitalize">{auraAnalysis.dominantFaction} ({auraAnalysis.count}/6)</strong>
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  +{auraAnalysis.atkPercent}% ATK & +{auraAnalysis.hpPercent}% HP
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {auraAnalysis.description}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-500 text-center italic">
                Add at least 2 heroes of the same faction to trigger an aura bonus.
              </div>
            )}

            {/* Role & Damage Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Roles:</span>
                <div className="space-y-0.5 text-slate-300">
                  <div>Tanks: <strong>{tacticalChecklist.tanks}</strong></div>
                  <div>Carries: <strong>{tacticalChecklist.carries}</strong></div>
                  <div>Supports: <strong>{tacticalChecklist.supports}</strong></div>
                  <div>Control: <strong>{tacticalChecklist.controllers}</strong></div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Damage Split:</span>
                <div className="space-y-0.5 text-slate-300">
                  <div>Physical: <strong>{tacticalChecklist.physical}</strong></div>
                  <div>Magic: <strong>{tacticalChecklist.magic}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Balance Checklist */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-black text-white mb-4">
              Team Balance Diagnostic
            </h3>

            <div className="space-y-2.5">
              {tacticalChecklist.checks.map((check, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    check.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider mb-0.5">{check.label}</strong>
                    <span>{check.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

