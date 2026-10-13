import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HEROES } from '../data/heroes';
import { GEAR_SETS, ARTIFACTS } from '../data/gear';
import { GUIDES } from '../data/guides';
import { GAME_EVENTS } from '../data/events';
import { LINEUPS } from '../data/lineups';
import { getPath } from '../utils/paths';
import {
  Search,
  X,
  Swords,
  Shield,
  BookOpen,
  Calendar,
  Calculator,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  Flame,
  LayoutGrid
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'heroes' | 'gear' | 'guides' | 'events' | 'tools' | 'lineups';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  avatar?: string;
  href: string;
  icon?: string;
}

const TOOLS_ITEMS: SearchResultItem[] = [
  {
    id: 'tool_sandbox',
    category: 'tools',
    title: 'Formation Sandbox (6-Slot)',
    subtitle: 'Test 6-hero placements, frontline positioning, and calculate live faction auras',
    badge: 'Builder',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    href: '/sandbox',
  },
  {
    id: 'tool_compare',
    category: 'tools',
    title: 'Hero Comparison Matrix',
    subtitle: 'Side-by-side attribute bars, skill breakdown, and tier contrast for 2–3 champions',
    badge: 'Compare',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    href: '/compare',
  },
  {
    id: 'tool_simulator',
    category: 'tools',
    title: 'Combat & Battle Damage Simulator',
    subtitle: 'Model physical vs magic DEF mitigation curves, crit scaling, and the +20% Faction Triangle advantage',
    badge: 'Combat',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    href: '/simulator',
  },
  {
    id: 'tool_roster',
    category: 'tools',
    title: 'Interactive Roster Builder',
    subtitle: 'Check owned heroes and discover optimal meta team compositions',
    badge: 'Core',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    href: '/roster',
  },
  {
    id: 'tool_gear',
    category: 'tools',
    title: 'Gear & Artifact Optimizer',
    subtitle: 'Simulate 2-pc and 4-pc set bonuses and equip optimal artifacts for any hero',
    badge: 'Armory',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    href: '/gear',
  },
  {
    id: 'tool_calc',
    category: 'tools',
    title: 'Resource & Star Promotion Calculators',
    subtitle: 'Compute shard costs to reach 5 Stars and Castle level progression costs',
    badge: 'Math',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    href: '/calculators',
  },
  {
    id: 'tool_database',
    category: 'tools',
    title: 'Progression & Systems Wiki Database',
    subtitle: 'Verified tables for 4-pc gear sets, Titan Marks, Enhancement Master, 15-star shards, and Awakening costs',
    badge: 'Database',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    href: '/progression',
  },
  {
    id: 'tool_changelog',
    category: 'tools',
    title: 'Patch 1.24.0 Balance Changelog',
    subtitle: 'Inspect recent hero buffs, nerfs, system reworks, and meta shifts',
    badge: 'Patch',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    href: '/changelog',
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard shortcuts & Custom Event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Open on '/' if not inside an input/textarea
      if (e.key === '/' && !isOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsOpen(true);
          return;
        }
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input and reset query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Pre-compiled search corpus
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [...TOOLS_ITEMS];

    // Heroes
    HEROES.forEach((h) => {
      items.push({
        id: `hero_${h.id}`,
        category: 'heroes',
        title: h.name,
        subtitle: `${h.title} • ${h.role.toUpperCase()} (${h.faction.toUpperCase()}) • PvP ${h.tierRankings.pvp}`,
        badge: h.rarity.toUpperCase(),
        badgeColor:
          h.rarity === 'mythic'
            ? 'bg-red-500/20 text-red-400 border-red-500/30'
            : h.rarity === 'legendary'
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            : 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        avatar: h.avatar,
        href: `/heroes/${h.id}`,
      });
    });

    // Gear Sets
    GEAR_SETS.forEach((gs) => {
      items.push({
        id: `gear_set_${gs.id}`,
        category: 'gear',
        title: gs.name,
        subtitle: `2-pc: ${gs.twoPieceBonus} | 4-pc: ${gs.fourPieceBonus}`,
        badge: 'Gear Set',
        badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        href: `/gear?set=${gs.id}`,
      });
    });

    // Artifacts
    ARTIFACTS.forEach((art) => {
      items.push({
        id: `art_${art.id}`,
        category: 'gear',
        title: art.name,
        subtitle: `Role: ${art.recommendedRole} • ${art.effect}`,
        badge: 'Artifact',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        href: `/gear?art=${art.id}`,
      });
    });

    // Guides
    GUIDES.forEach((g) => {
      items.push({
        id: `guide_${g.slug}`,
        category: 'guides',
        title: g.title,
        subtitle: `${g.readTime} • ${g.summary}`,
        badge: g.category.toUpperCase(),
        badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        href: `/guides/${g.slug}`,
      });
    });

    // Meta Lineups
    LINEUPS.forEach((l) => {
      items.push({
        id: `lineup_${l.id}`,
        category: 'lineups',
        title: l.name,
        subtitle: `${l.archetype} • ${l.description}`,
        badge: `${l.tier} Lineup`,
        badgeColor: l.tier === 'S+' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        href: `/lineups`,
      });
    });

    // Events
    GAME_EVENTS.forEach((e) => {
      items.push({
        id: `event_${e.id}`,
        category: 'events',
        title: e.name,
        subtitle: `${e.category.toUpperCase()} • ${e.recurrence.toUpperCase()} • ${e.description}`,
        badge: `${e.category.toUpperCase()} EVENT`,
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        href: `/events`,
      });
    });

    return items;
  }, []);

  // Filtered results based on search query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default recommended items
      return [
        ...TOOLS_ITEMS,
        ...allSearchableItems.filter((i) => ['hero_paragon', 'hero_desert_prince', 'hero_forest_maiden', 'guide_castle-upgrade-priority'].includes(i.id)),
      ];
    }

    return allSearchableItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });
  }, [query, allSearchableItems]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Handle navigating results with keys
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        navigateToItem(filteredResults[selectedIndex]);
      }
    }
  };

  const navigateToItem = (item: SearchResultItem) => {
    setIsOpen(false);
    window.location.href = getPath(item.href);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heroes':
        return <Swords className="w-4 h-4 text-amber-400" />;
      case 'gear':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'guides':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'events':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'lineups':
        return <Flame className="w-4 h-4 text-red-400" />;
      default:
        return <LayoutGrid className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search heroes, gear, guides, events, calculators..."
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No matching results found</p>
              <p className="text-xs text-slate-500">
                Try searching for hero names (Paragon), roles (tank, dps), gear sets, or guides.
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => navigateToItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/40 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                  }`}
                >
                  {/* Item Icon or Hero Avatar */}
                  <div className="shrink-0">
                    {item.avatar ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                        <img src={getPath(item.avatar)} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">{item.title}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>

                  {/* Enter Indicator */}
                  {isSelected && (
                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <span>Jump</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <div>
            <span className="text-amber-500 font-semibold">{filteredResults.length}</span> results indexed
          </div>
        </div>
      </div>
    </div>
  );
}
