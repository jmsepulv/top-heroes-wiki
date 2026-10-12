import type { Hero, Lineup, LineupRecommendation, UserRoster, FactionId } from '../types/game';
import { calculateAura } from '../data/factions';
import { getHeroById } from '../data/heroes';

export function calculateRecommendations(
  roster: UserRoster,
  lineups: Lineup[],
  _heroes: Hero[]
): LineupRecommendation[] {
  const recommendations: LineupRecommendation[] = [];

  for (const lineup of lineups) {
    const filledSlots: LineupRecommendation['filledSlots'] = [];
    const missingCoreHeroes: string[] = [];
    const missingSubstitutableSlots: LineupRecommendation['missingSubstitutableSlots'] = [];
    const usedHeroes = new Set<string>();

    for (const slot of lineup.slots) {
      // 1. Check if user owns original hero and not yet placed in team
      if (roster[slot.heroId]?.owned && !usedHeroes.has(slot.heroId)) {
        filledSlots.push({
          slotIndex: slot.slotIndex,
          heroId: slot.heroId,
          isOriginal: true,
          isSubstitute: false,
        });
        usedHeroes.add(slot.heroId);
      } else {
        // 2. Try to find an owned substitute not yet placed
        const availableSub = slot.substitutes.find(
          (subId) => roster[subId]?.owned && !usedHeroes.has(subId)
        );

        if (availableSub) {
          filledSlots.push({
            slotIndex: slot.slotIndex,
            heroId: availableSub,
            isOriginal: false,
            isSubstitute: true,
          });
          usedHeroes.add(availableSub);
        } else {
          // Slot is missing
          if (slot.isCore) {
            missingCoreHeroes.push(slot.heroId);
          }
          missingSubstitutableSlots.push({
            slotIndex: slot.slotIndex,
            desiredHeroId: slot.heroId,
            substitutes: slot.substitutes,
          });
        }
      }
    }

    const filledCount = filledSlots.length;
    let status: 'ready' | 'one_away' | 'goal' = 'goal';
    let score = Math.round((filledCount / 6) * 60);

    if (filledCount === 6) {
      status = 'ready';
      score = 100;
    } else if (filledCount === 5) {
      status = 'one_away';
      score = 80;
    }

    // Calculate active aura for the heroes placed
    const factionCounts: Record<string, number> = {};
    for (const item of filledSlots) {
      const h = getHeroById(item.heroId);
      if (h) {
        factionCounts[h.faction] = (factionCounts[h.faction] || 0) + 1;
      }
    }
    const aura = calculateAura(factionCounts);

    recommendations.push({
      lineup,
      status,
      filledSlots,
      missingCoreHeroes,
      missingSubstitutableSlots,
      score,
      activeFactionAura: aura
        ? {
            faction: aura.dominantFaction as FactionId,
            count: aura.count,
            atkPercent: aura.atkPercent,
            hpPercent: aura.hpPercent,
            description: aura.description,
          }
        : undefined,
    });
  }

  // Sort: 'ready' first, then 'one_away', then highest score, then highest tier
  const tierWeight: Record<string, number> = { 'S+': 5, S: 4, A: 3, B: 2, C: 1 };

  return recommendations.sort((a, b) => {
    const statusWeight = { ready: 3, one_away: 2, goal: 1 };
    const diff = statusWeight[b.status] - statusWeight[a.status];
    if (diff !== 0) return diff;

    const tierDiff = (tierWeight[b.lineup.tier] || 0) - (tierWeight[a.lineup.tier] || 0);
    if (tierDiff !== 0) return tierDiff;

    return b.score - a.score;
  });
}

