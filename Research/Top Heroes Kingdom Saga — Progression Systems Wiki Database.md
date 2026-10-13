# Top Heroes: Kingdom Saga — Progression Systems Wiki Database

A structured markdown reference for the game's core hero progression systems: gear sets, Enhancement Master bonuses, Titan Marks, star promotion shard consumption, trait upgrades, and epic hero global passive traits.

## Scope & Evidence Policy

- **Sources**: Community wikis (Fandom, atwiki.jp), fan guide sites (guidetopheroes.com, topheroes.info, topheroestier.com), blog guides (LootBar, Packsify), and Reddit community threads.
- **No merged guesses**: Where two sources describe the same mechanic differently, both datasets are presented separately with attribution. The relationship between them is labeled "applicability not established" unless a source explicitly resolves it.
- **Unresolved data**: Exact diamond amounts to unlock each trait at level 1 are not documented in any fetched source; marked `n.a.`.
- **Source-level inconsistencies**: Where a source's own table rows do not sum to its own stated total, this is flagged rather than silently repaired.

---

## 1. Gear Sets

### 1.1 Named Set Aggregate Stats

Three endgame gear sets define hero gear choice. Each applies to a full 4-piece set (sword, helmet, chest/armor, boots) on a single hero.

| Set Name | Gear Attack | Gear HP | Other Bonus | Best Role | Source |
|---|---|---|---|---|---|
| **Fury of Blood** | — | **+160%** | Damage Reduction +6% | Tanks, healers, HP-scaling kits; entire Nature faction | [topheroes.info](https://topheroes.info/gear-guide.php) |
| **Glory of the Knight** | **+40%** | **+80%** | Skill Damage Amplify +8% | Skill-damage / AoE heroes (Paragon, Bishop, Pyromancer) | [topheroes.info](https://topheroes.info/gear-guide.php) |
| **Titan's Might** | **+80%** | — | Damage Increase +6% | Flat-ATK scaling heroes (Wanderer, Storm Maiden, Astrologer) | [topheroes.info](https://topheroes.info/gear-guide.php) |

Source: [topheroes.info Gear Strategy Guide](https://topheroes.info/gear-guide.php).

### 1.2 Piece Types

| Piece Type | Primary Stat | Secondary | Source |
|---|---|---|---|
| Sword | Gear Attack | Gear HP | [guidetopheroes.com Gear](https://www.guidetopheroes.com/html/gear.html) |
| Boots | Gear Attack | Gear HP | [guidetopheroes.com Gear](https://www.guidetopheroes.com/html/gear.html) |
| Helmet | Gear HP | Gear Attack | [guidetopheroes.com Gear](https://www.guidetopheroes.com/html/gear.html) |
| Chest / Armor | Gear HP | Gear Attack | [guidetopheroes.com Gear](https://www.guidetopheroes.com/html/gear.html) |

Note: boots give Attack, not HP ([atwiki.jp](https://w.atwiki.jp/topheroesjp/pages/18.html)).

### 1.3 2-Piece / 4-Piece Set Effects (Japanese community data)

The Japanese wiki (atwiki.jp) documents piece-count-triggered set effects for gear series. These are a **different mechanic** from the named sets in section 1.1 — they describe effects triggered at 2-piece and 4-piece thresholds of the same series.

| Series (JP) | 2-Piece Effect | 4-Piece Effect | Source |
|---|---|---|---|
| Sage (賢者) | Gear Attack +5% | On any skill trigger, +15% Crit Rate for 6s (CD 18s) | [atwiki.jp](https://w.atwiki.jp/topheroesjp/pages/18.html) |
| Earth (大地) | Gear HP +5% | On receiving damage, +25% damage reduction for 6s (CD 24s) | [atwiki.jp](https://w.atwiki.jp/topheroesjp/pages/18.html) |
| Victor (勝者) | Gear HP +5% | On rare skill trigger, +10% ally unit attack for 6s | [atwiki.jp](https://w.atwiki.jp/topheroesjp/pages/18.html) |

**Applicability not established**: The relationship between these triggered set effects and the named-set aggregate stats (section 1.1) is not resolved by any fetched source. Community reports indicate the gear system differs between server generations; see [Reddit r/TopHeroes equipment thread](https://www.reddit.com/r/TopHeroes/comments/1jj6njf/up_to_date_equipment_lists/). Do not assume these map 1:1.

### 1.4 Recommended Gear by Hero

Source: [topheroestier.com Gear Planner](https://topheroestier.com/gear-planner/) — full per-hero recommendation table.

| Hero | Rarity | Faction | Recommended Set | Alternate |
|---|---|---|---|---|
| Adjudicator | Legendary | League | Fury of Blood | — |
| Artificer | Mythic | League | Glory of the Knight | Fury of Blood |
| Astrologer | Legendary | League | Titan's Might | — |
| Bard | Legendary | League | Fury of Blood | Glory of the Knight |
| Bishop | Mythic | League | Glory of the Knight | Titan's Might |
| Hostess | Legendary | League | Fury of Blood | — |
| Nun | Legendary | League | Fury of Blood | Glory of the Knight |
| Paragon | Mythic | League | Glory of the Knight | Titan's Might |
| Pyromancer | Legendary | League | Glory of the Knight | Titan's Might |
| Rose Princess | Mythic | League | Fury of Blood | Glory of the Knight |
| Secret Keeper | Legendary | League | Fury of Blood | — |
| Altar Marshal | Mythic | Nature | Fury of Blood | Glory of the Knight |
| Druid | Legendary | Nature | Fury of Blood | — |
| Forest Maiden | Legendary | Nature | Fury of Blood | Glory of the Knight |
| Monk | Mythic | Nature | Fury of Blood | Glory of the Knight |
| Petalis | Mythic | Nature | Glory of the Knight | Fury of Blood |
| Pixie | Legendary | Nature | Glory of the Knight | Titan's Might |
| Sage | Legendary | Nature | Fury of Blood | Glory of the Knight |
| Tidecaller | Mythic | Nature | Fury of Blood | Glory of the Knight |
| Treeguard | Legendary | Nature | Fury of Blood | — |
| Watcher | Legendary | Nature | Titan's Might | — |
| Windwalker | Legendary | Nature | Titan's Might | Glory of the Knight |
| Barbarian | Legendary | Horde | Fury of Blood | Titan's Might |
| Beastmaster | Mythic | Horde | Fury of Blood | Glory of the Knight |
| Desert Prince | Mythic | Horde | Glory of the Knight | Titan's Might |
| Shaman | Legendary | Horde | Fury of Blood | — |
| Soalmancer | Legendary | Horde | Fury of Blood | Glory of the Knight |
| Storm Maiden | Mythic | Horde | Titan's Might | Glory of the Knight |
| Swordmaster | Legendary | Horde | Fury of Blood | Titan's Might |
| Wanderer | Mythic | Horde | Titan's Might | Glory of the Knight |
| Warlock | Legendary | Horde | Glory of the Knight | Fury of Blood |
| Wilderness Hunter | Legendary | Horde | Titan's Might | — |
| Witch | Mythic | Horde | Glory of the Knight | Fury of Blood |
| Ranger | Epic | League | Glory of the Knight | Titan's Might |
| Minister | Epic | League | Fury of Blood | Glory of the Knight |
| Knight | Epic | League | Fury of Blood | — |
| Dancer | Epic | Nature | Fury of Blood | — |
| Priestess | Epic | Nature | Fury of Blood | — |
| Outlaw | Epic | Horde | Fury of Blood | — |
| Rogue | Epic | Horde | Titan's Might | — |
| Archer | Rare | Nature | Titan's Might | — |
| Pharmacist | Rare | Nature | Fury of Blood | — |
| Blacksmith | Rare | Horde | Fury of Blood | — |
| Guard | Rare | Horde | Fury of Blood | — |
| Warrior | Rare | League | Fury of Blood | — |
| Wizard | Rare | League | Glory of the Knight | — |

---

## 2. Enhancement Master Bonus

The Enhancement Master bonus activates when **all 4 gear pieces** on a hero are at the **same level or higher, and same rarity or higher**. The bonus counts once per hero, not per piece; only the lowest-level piece determines the tier reached ([Fandom Gear page](https://topheroes1.fandom.com/wiki/Gear)).

### 2.1 Flat-Stat Ladder by Rarity & Level (Fandom wiki)

All values from [Top Heroes Wiki — Gear page](https://topheroes1.fandom.com/wiki/Gear).

| Rarity | Level / Star | Gear Attack | Gear HP |
|---|---|---|---|
| Rare | Lv 10 | 700 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 7,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Epic | Lv 10 | 1,900 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 19,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Epic | Lv 20 | 3,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 32,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Epic | Lv 30 | 4,100 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 47,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Lv 10 | 5,600 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 69,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Lv 20 | 7,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 94,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Lv 30 | 8,900 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 128,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Lv 40 | 11,100 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 171,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Gear ★1 | 14,800 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 250,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Gear ★2 | 18,500 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 340,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Gear ★3 | 22,200 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 441,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Legendary | Gear ★4 | 33,400 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 712,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |
| Mythic | (level n.a.) | 44,500 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) | 949,000 ([Fandom](https://topheroes1.fandom.com/wiki/Gear)) |

Note: The Legendary ★1–★4 rows belong to gear **star promotion** (section 7.2), not the +10 level ladder. They appear in the Fandom Enhancement Master table as sourced.

### 2.2 Percentage Ladder (Japanese community data)

Source: [atwiki.jp — 装備 page](https://w.atwiki.jp/topheroesjp/pages/18.html). Values were halved in a 2/3 patch per the source.

| Enhancement Level | Gear Attack % | Gear HP % |
|---|---|---|
| +10 | +10 | +10 |
| +20 | +25 | +25 |
| +30 | +50 | +50 |
| +40 | +100 | +100 |
| +50 | +200 | +200 |

**Applicability not established**: The Fandom flat-stat ladder (2.1) and the atwiki percentage ladder (2.2) are separate datasets. Their relationship is not resolved by any fetched source.

### 2.3 Per-Piece Gear Level Rewards (Fandom wiki)

At levels 10/20/30 (and 40 for Legendary), each gear piece grants an additional attribute independent of the Enhancement Master set bonus. Source: [Top Heroes Wiki — Gear page](https://topheroes1.fandom.com/wiki/Gear).

| Rarity | Piece | Lv 10 | Lv 20 | Lv 30 | Lv 40 |
|---|---|---|---|---|---|
| Epic | Knight's Ceremonial Sword | World PVE Damage +2% | World PVE Damage +2% | World PVE Damage +2% | — |
| Epic | Knight's Ancient Chestplate | World PVE Damage Reduction +2% | World PVE Damage Reduction +2% | World PVE Damage Reduction +2% | — |
| Epic | Knight's Ancient Boots | World PVE Damage +2% | World PVE Damage +2% | World PVE Damage +2% | — |
| Epic | Knight's Ancient Helmet | World PVE Damage Reduction +2% | World PVE Damage Reduction +2% | World PVE Damage Reduction +2% | — |
| Legendary | Marshal's Command Sword | Gear Attack +832 | Critical Rate +5.2% | Gear Attack +832 | Critical Rate +5.2% |
| Legendary | Marshal's Arcane Chestplate | Gear HP +7,442 | Block +5.2% | Gear HP +7,442 | Block +5.2% |
| Legendary | Marshal's Enchanted Boots | Gear Attack +832 | Critical Damage +5.2% | Gear Attack +832 | Critical Damage +5.2% |
| Legendary | Marshal's Enchanted Helmet | Gear HP +7,442 | Normal Damage Reduction +5.2% | Gear HP +7,442 | Normal Damage Reduction +5.2% |

---

## 3. Titan Mark (Faction Mark)

### 3.1 Effect

Titan Marks add a faction-specific bonus to gear. Assigning a mark to a weapon of a chosen faction causes that gear to grant an **additional +30% of its total stats** when equipped on a hero of the same faction. Source: [Reddit r/TopHeroes — Titan/Faction Marks thread](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/).

### 3.2 How to Obtain

- Star Gem Shop — 240 Star Gems each
- Guild Vault — via weekly Guild Points shop
- Special packs / events

Source: [guidetopheroes.com Gear](https://www.guidetopheroes.com/html/gear.html), [Reddit thread above](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/).

### 3.3 Faction Bonus Table

| Faction | Mark Effect | Source |
|---|---|---|
| League | +30% of total gear stats when equipped on League hero | [Reddit](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/) |
| Nature | +30% of total gear stats when equipped on Nature hero | [Reddit](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/) |
| Horde | +30% of total gear stats when equipped on Horde hero | [Reddit](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/) |

---

## 4. Hero Star Promotion Shard Consumption

### 4.1 Total Shards to Fully Promote

Source: [guidetopheroes.com Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html), consistent with [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes). The Cost Tables source covers Legendary and Mythic only; Epic totals are from the Fandom source. Rare totals are not documented in either fetched source.

| Hero Rarity | Total Shards (all 15 stars) | Source |
|---|---|---|
| Rare | n.a. | — |
| Epic | 500 | [Fandom](https://topheroes1.fandom.com/wiki/Heroes) |
| Legendary | 500 | [Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html), [Fandom](https://topheroes1.fandom.com/wiki/Heroes) |
| Mythic | 1,000 | [Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html), [Fandom](https://topheroes1.fandom.com/wiki/Heroes) |

### 4.2 Star Promotion Per-Star Cost

Epic and Rare data from [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes); Legendary and Mythic data from [guidetopheroes.com Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html), whose per-star values sum correctly to its stated band totals. Each star is promoted in **5 steps** (one per sub-star). Values below are **shards per star** (5 steps summed). "Band total" is the total for that 5-star band; "Cumulative" is the running sum at the end of each band.

| Star Band | Epic /Star | Epic Band Total | Epic Cumulative | Legendary /Star | Legendary Band Total | Legendary Cumulative | Mythic /Star | Mythic Band Total | Mythic Cumulative |
|---|---|---|---|---|---|---|---|---|---|
| Band 1 ★ | 5 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 50 | 50 | 5 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 50 | 50 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 100 | 100 |
| Band 1 ★★ | 5 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 50 | 50 | 5 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 50 | 50 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 100 | 100 |
| Band 1 ★★★ | 10 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 50 | 50 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 50 | 50 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 100 | 100 |
| Band 1 ★★★★ | 10 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 50 | 50 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 50 | 50 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 100 | 100 |
| Band 1 ★★★★★ | 20 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 50 | 50 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 50 | 50 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 100 | 100 |
| Band 2 ★ | 30 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 150 | 200 | 30 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 150 | 200 | 60 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 400 |
| Band 2 ★★ | 20 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 150 | 200 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 150 | 200 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 400 |
| Band 2 ★★★ | 20 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 150 | 200 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 150 | 200 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 400 |
| Band 2 ★★★★ | 40 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 150 | 200 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 150 | 200 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 400 |
| Band 2 ★★★★★ | 40 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 150 | 200 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 150 | 200 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 400 |
| Band 3 ★ | 80 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 300 | 500 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 500 | 160 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 600 | 1000 |
| Band 3 ★★ | 20 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 300 | 500 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 500 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 600 | 1000 |
| Band 3 ★★★ | 40 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 300 | 500 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 500 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 600 | 1000 |
| Band 3 ★★★★ | 80 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 300 | 500 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 500 | 160 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 600 | 1000 |
| Band 3 ★★★★★ | 80 ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)) | 300 | 500 | 80 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 300 | 500 | 160 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 600 | 1000 |
| **Total** | | **500** | **500** | | **500** | **500** | | **1,000** | **1,000** |

**Cumulative column note**: "Cumulative" means the cumulative shard count at the end of that band — the value repeats across all stars within a band.

**Arithmetic check** (calculated from the cited per-star inputs):
- Epic: 50 + 150 + 300 = 500 ✓
- Legendary: 50 + 150 + 300 = 500 ✓
- Mythic: 100 + 300 + 600 = 1,000 ✓ (band 3: 160+40+80+160+160 = 600 ✓)

### 4.2.1 Rare Star Promotion (Fandom)

Source: [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes). Band 3 and overall total are not documented in the fetched source; shown as n.a.

| Star Band | Rare /Star |
|---|---|
| Band 1 ★ | 5 |
| Band 1 ★★ | 5 |
| Band 1 ★★★ | 10 |
| Band 1 ★★★★ | 10 |
| Band 1 ★★★★★ | n.a. |
| Band 2 ★ | 20 |
| Band 2 ★★ | 20 |
| Band 2 ★★★ | n.a. |
| Band 2 ★★★★ | 40 |
| Band 2 ★★★★★ | 40 |
| Band 3 ★–★★★★★ | n.a. |
| **Total** | **n.a.** |

**Cross-source conflict (Fandom, Mythic band 3)**: The [Fandom Heroes page](https://topheroes1.fandom.com/wiki/Heroes) reports a Mythic band-3 per-star schedule of 160/80/80/80/80, which sums to **480**, not the stated band total of 600. The Cost Tables schedule above (160/40/80/160/160) sums correctly to 600 and is used as the primary reference for Legendary and Mythic. The Fandom per-star values for Mythic band 3 are preserved here as a known source-level error and should be treated with caution. For all other bands, the two sources agree.

### 4.3 Awakening (Legendary Heroes)

Source: [guidetopheroes.com Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html), consistent with [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes). The Cost Tables source provides the full per-row detail including soul stones; both sources agree on the totals of 345 shards and 9 soul stones. The two sources have slightly different per-row shard allocations within tiers but identical totals.

| Tier | Level | Shards | Soul Stones |
|---|---|---|---|
| 0 | 0 | 5 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 1 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) |
| 1 | 0 | 5 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 1 | 1 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 1 | 2 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 1 | 3 | 10 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 1 | 4 | 15 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 1 | 5 | 15 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 2 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) |
| 2 | 0 | 15 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 2 | 1 | 15 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 2 | 2 | 15 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 2 | 3 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 2 | 4 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 2 | 5 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 2 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) |
| 3 | 0 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 3 | 1 | 20 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 3 | 2 | 30 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 3 | 3 | 30 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 3 | 4 | 30 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | — |
| 3 | 5 | 40 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) | 4 ([Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)) |
| **Total** | | **345** | **9** |

**Arithmetic check**: 5 + (5+10+10+10+15+15) + (15+15+15+20+20+20) + (20+20+30+30+30+40) = 5 + 65 + 105 + 170 = **345** ✓ matches source total.

**Soul-stone allocation**: The Cost Tables source assigns soul stones at tier transitions only (Tier 0 = 1, Tier 1 = 2, Tier 2 = 2, Tier 3 = 4), summing to 9 ✓. Per-row detail-row soul-stone costs between transitions are empty in the source.

---

## 5. Hero Trait Upgrades

### 5.1 Structure & Rotation

Source: [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes), [Reddit r/TopHeroes traits discussion](https://www.reddit.com/r/TopHeroes/comments/1n03kxz/does_activatingupgrading_hero_traits_do_anything/).

- Each hero has **4 traits**.
- **Entry gate**: The [Fandom source](https://topheroes1.fandom.com/wiki/Heroes) states traits require a maxed hero (5 silver stars) without specifying rarity scope. A [Reddit thread](https://www.reddit.com/r/TopHeroes/comments/1kzfs1a/heroes_upgrades_and_best_use_of_shards/) indicates Epic heroes can begin trait upgrades at 1-star silver. The rarity scope of the Fandom statement is not resolved by the source.
- **Global-passive unlock (Epic)**: topheroes.info and guidetopheroes.com describe a bonus that unlocks at 2-star Platinum / 12 stars and reaches its maximum at "trait level 30" ([topheroes.info](https://topheroes.info/hero-guide.php), [guidetopheroes.com Heroes](https://www.guidetopheroes.com/html/heroes.html)). **Terminology unresolved**: these sources describe the bonus variously as "third trait," "Skill 3," and "global passive." Whether this is the same system as the post-promotion trait system in section 5.1 (with the same 10-shards-per-level cost and 30-level cap), or a separate normal hero skill, is not established by the fetched sources. The relationship is marked unknown rather than assumed.
- **Diamonds unlock level 1** of each trait; shards upgrade it thereafter. Exact diamond amounts n.a.
- **5-level rotation**: To advance past each 5-level band (5, 10, 15, 20, 25, 30), all 4 traits must first reach that band.
- **Max trait level: 30** ([Fandom](https://topheroes1.fandom.com/wiki/Heroes)).

### 5.2 Cost per Level

| Item | Cost | Source |
|---|---|---|
| Trait level 1 unlock | Diamonds — amount n.a. | [Fandom Heroes](https://topheroes1.fandom.com/wiki/Heroes) |
| Trait levels 2–30 upgrade | 10 shards per level | [Fandom Heroes](https://topheroes1.fandom.com/wiki/Heroes) |
| Trait swap between heroes | 2,000 diamonds | [Reddit — Hero Traits thread](https://www.reddit.com/r/TopHeroes/comments/1qlj2dt/hero_traits/) |

### 5.3 Total Shards to Max All 4 Traits

Source: [Reddit — Is this a joke?? thread](https://www.reddit.com/r/TopHeroes/comments/1p2i9ab/is_this_a_joke/).

Calculation: (30 levels − 1 diamond-unlocked level) × 10 shards × 4 traits = 29 × 10 × 4 = **1,160 shards**.

**Scope note**: This figure is explicitly discussed in the context of Mythic heroes. It is derived from the documented schedule (4 traits, 10 shards/level, diamond unlock at lv 1, max lv 30) and is presented as the total under that schedule; it is not independently confirmed as applying to every rarity.

### 5.4 5-Level Rotation Table

Source: [Reddit — trait rotation explanation](https://www.reddit.com/r/TopHeroes/comments/1n03kxz/does_activatingupgrading_hero_traits_do_anything/).

| Rotation Step | Requirement to Advance |
|---|---|
| Traits 1–4 → Lv 5 | All 4 traits unlocked (diamonds) and upgraded to Lv 5 with shards |
| Lv 5 → Lv 10 | All 4 traits at Lv 5; wrap back to first trait |
| Lv 10 → Lv 15 | All 4 traits at Lv 10 |
| Lv 15 → Lv 20 | All 4 traits at Lv 15 |
| Lv 20 → Lv 25 | All 4 traits at Lv 20 |
| Lv 25 → Lv 30 (max) | All 4 traits at Lv 25 |

---

## 6. Epic Hero Global Passive Traits

Epic heroes provide an account-wide bonus that applies **even when the hero is not in the active queue**. Source: [topheroes.info Hero Strategy Guide](https://topheroes.info/hero-guide.php), confirmed by [Reddit thread](https://www.reddit.com/r/TopHeroes/comments/1n03kxz/does_activatingupgrading_hero_traits_do_anything/).

**Terminology note**: Sources use "third trait," "Skill 3," and "global passive" for this bonus. Whether this is the same trait system documented in section 5 (10 shards per level, 30-level cap, diamond unlock at lv 1) or a separate skill is not established. The "max at trait level 30" statement is from topheroes.info and is reproduced as sourced.

### 6.1 Epic Passive Trait Table

| Hero | Faction | Passive Bonus | Max Bonus | Unlock Requirement | Priority | Source |
|---|---|---|---|---|---|---|
| **Brawler** | League | Tech Research Speed | +30% | 2-star Platinum / 12 stars | HIGHEST | [topheroes.info](https://topheroes.info/hero-guide.php) |
| **Knight** | League | Soldier Training Speed | +30% | 2-star Platinum / 12 stars | HIGHEST | [topheroes.info](https://topheroes.info/hero-guide.php) |
| **Ranger** | League | Ruby Gathering Speed | +30% | 2-star Platinum / 12 stars | HIGH | [topheroes.info](https://topheroes.info/hero-guide.php) |
| **Minister** | League | Soldier Healing Speed | +30% | 2-star Platinum / 12 stars | MEDIUM | [topheroes.info](https://topheroes.info/hero-guide.php) |
| **Outlaw** | Horde | Wood Gathering Speed | +30% | 2-star Platinum / 12 stars | LOW | [topheroes.info](https://topheroes.info/hero-guide.php) |

**Max requirement**: topheroes.info states the full +30% bonus requires trait level 30 ([topheroes.info](https://topheroes.info/hero-guide.php)). The relationship between this "trait level 30" and the post-promotion trait system in section 5 is not established by the sources.

---

## 7. Reference: Gear Upgrade Costs (Fandom wiki)

Source: [Top Heroes Wiki — Gear page](https://topheroes1.fandom.com/wiki/Gear).

### 7.1 Legendary — Marshal's Command Sword (full table)

| Level | Rune Cost | Ruby Cost | Power | Gear Attack | Gear HP | Gear Attack % | Critical Rate |
|---|---|---|---|---|---|---|---|
| Initial | 750 Solar Gold Ingot | 16,000 Rubies | 9,152 | 640 | 2,455 | 2.5% | 3.0% |
| 1 | 1,500 | 7,200 | 9,550 | 710 | 2,720 | 3.5% | 3.15% |
| 2 | 1,500 | 7,200 | 9,948 | 780 | 2,985 | 4.5% | 3.30% |
| 3 | 1,500 | 7,200 | 10,346 | 850 | 3,250 | 5.5% | 3.45% |
| 4 | 1,500 | 7,200 | 10,744 | 920 | 3,515 | 6.5% | 3.60% |
| 5 | 2,250 | 10,800 | 11,141 | 990 | 3,780 | 7.5% | 3.75% |
| 6 | 2,250 | 10,800 | 11,539 | 1,060 | 4,045 | 8.5% | 3.90% |
| 7 | 2,250 | 10,800 | 11,937 | 1,130 | 4,310 | 9.5% | 4.05% |
| 8 | 2,250 | 10,800 | 12,335 | 1,200 | 4,575 | 10.5% | 4.20% |
| 9 | 3,000 | 14,400 | 12,732 | 1,270 | 4,840 | 11.5% | 4.35% |
| 10 | 3,000 | 14,400 | 14,297 | 1,545 | 5,885 | 12.5% | 4.50% |
| 11 | 3,000 | 14,400 | 14,892 | 1,650 | 6,280 | 13.5% | 4.65% |
| 12 | 3,000 | 14,400 | 15,488 | 1,755 | 6,675 | 14.5% | 4.80% |
| 13 | 3,750 | 18,000 | 16,084 | 1,860 | 7,070 | 15.5% | 4.95% |
| 14 | 3,750 | 18,000 | 16,679 | 1,965 | 7,465 | 16.5% | 5.10% |
| 15 | 3,750 | 18,000 | 17,275 | 2,070 | 7,860 | 17.5% | 5.25% |
| 16 | 3,750 | 18,000 | 17,870 | 2,175 | 8,255 | 18.5% | 5.40% |
| 17 | 4,500 | 21,600 | 18,466 | 2,280 | 8,650 | 19.5% | 5.55% |
| 18 | 4,500 | 21,600 | 19,061 | 2,385 | 9,045 | 20.5% | 5.70% |
| 19 | 4,500 | 21,600 | 19,657 | 2,490 | 9,440 | 21.5% | 5.85% |
| 20 | 4,500 | 21,600 | 21,992 | 2,900 | 11,005 | 22.5% | 6.00% |
| 21 | 5,250 | 25,200 | 23,161 | 3,105 | 11,790 | 23.5% | 6.15% |
| 22 | 5,250 | 25,200 | 24,330 | 3,310 | 12,575 | 24.5% | 6.30% |
| 23 | 5,250 | 25,200 | 25,499 | 3,515 | 13,360 | 25.5% | 6.45% |
| 24 | 5,250 | 25,200 | 26,668 | 3,720 | 14,145 | 26.5% | 6.60% |
| 25 | 6,000 | 28,800 | 27,837 | 3,925 | 14,930 | 27.5% | 6.75% |
| 26 | 6,000 | 28,800 | 29,006 | 4,130 | 15,715 | 28.5% | 6.90% |
| 27 | 6,000 | 28,800 | 30,175 | 4,335 | 16,500 | 29.5% | 7.05% |
| 28 | 6,000 | 28,800 | 31,344 | 4,540 | 17,285 | 30.5% | 7.20% |
| 29 | 6,750 | 32,400 | 32,512 | 4,745 | 18,070 | 31.5% | 7.35% |
| 30 | 6,750 | 32,400 | 37,161 | 5,560 | 21,195 | 32.5% | 7.50% |
| 31–40 | 6,750–8,250 | 32,400–39,600 | n.a. | n.a. | n.a. | n.a. | n.a. |

Levels 31–40 are listed in the source with material costs but no attribute values populated.

### 7.2 Gear Star Promotion (Fandom wiki — Legendary Sword)

| Star | Solar Gold Ingot | Rune Cost | Ruby Cost | Legendary Promotion Stone |
|---|---|---|---|---|
| ★1 | 150 | 12,500 | 750,000 | — |
| ★2 | 150 | 12,500 | 750,000 | — |
| ★3 | 150 | 12,500 | 750,000 | — |
| ★4 | 150 | 12,500 | 750,000 | — |
| ★5 | 150 | 12,500 | 750,000 | 5 |
| ★6–★10 | 195 | 16,250 | — | 10 (at ★10) |
| ★11–★15 | 240 | 20,000 | — | 15 (at ★15) |
| ★16–★20 | 285 | 23,500 | — | 15 (at ★20) |

Cross-source note: [guidetopheroes.com Gear page](https://www.guidetopheroes.com/html/gear.html) lists star promotion costs as ★1 = 5 Legendary Promotion Stones, ★2 = 10, ★3 = 15, ★4 = 20, ★5 = 10 Mythic Promotion Stones. Both sources are preserved; the discrepancy is not resolved.

### 7.3 Exclusive Gear Shard Cost (Fandom wiki)

| Level | Shard Cost | Cumulative |
|---|---|---|
| 1 | 5 | 5 |
| 2 | 10 | 15 |
| 3 | 15 | 30 |
| 4 | 20 | 50 |
| 5 | 25 | 75 |
| 6 | 30 | 105 |
| 7 | 35 | 140 |
| 8 | 40 | 180 |
| 9 | 45 | 225 |
| 10 | 50 | 275 |
| 11 | 55 | 330 |
| 12 | 60 | 390 |
| 13 | 65 | 455 |
| 14 | 70 | 525 |
| 15 | 80 | 605 |
| 16 | 90 | 695 |
| 17 | 100 | 795 |
| 18 | 110 | 905 |
| 19 | 120 | 1,025 |
| 20 | 150 | 1,175 |

**Arithmetic note**: The cumulative column here is recalculated from the listed per-level costs. The Fandom source's own stated cumulative values at levels 19 and 20 (1,035 and 1,185) do not match the arithmetic sum of its per-level costs (1,025 and 1,175). The recalculated values are shown; the source's stated values are noted here as a discrepancy.

---

## 8. Skill Book Consumption (Appendix)

Source: [Top Heroes Wiki — Heroes page](https://topheroes1.fandom.com/wiki/Heroes).

| Skill Level | Cost (Skill Books) |
|---|---|
| 2 | 100 |
| 3 | 200 |
| 4 | 400 |
| 5 | 600 |
| 6 | 800 |
| 7 | 1,100 |
| 8 | 1,400 |
| 9 | 1,700 |
| 10 | 2,000 |
| 11 | 2,200 |
| 12 | 2,700 |
| 13 | 3,200 |
| 14 | 3,900 |
| 15 | 4,700 |

---

## 9. Companion CSV Files

The following CSV files are provided alongside this document for sorting and filtering:

- `gear_sets.csv` — Named gear set stats
- `gear_piece_types.csv` — Gear piece types and stats
- `gear_piece_recommendations.csv` — Per-hero recommended set
- `enhancement_master.csv` — Enhancement Master tier bonuses (flat and percent systems)
- `titan_marks.csv` — Titan Mark faction bonuses
- `star_promotion.csv` — Star promotion shard consumption (per-step, per-star, band totals, cumulative)
- `awakening.csv` — Awakening tier shard costs
- `traits.csv` — Trait upgrade structure and costs
- `trait_rotation.csv` — 5-level rotation table
- `epic_passives.csv` — Epic hero global passive traits

---

## Sources

1. [Top Heroes Wiki (Fandom) — Gear](https://topheroes1.fandom.com/wiki/Gear)
2. [Top Heroes Wiki (Fandom) — Heroes](https://topheroes1.fandom.com/wiki/Heroes)
3. [guidetopheroes.com — Gear](https://www.guidetopheroes.com/html/gear.html)
4. [guidetopheroes.com — Heroes](https://www.guidetopheroes.com/html/heroes.html)
5. [guidetopheroes.com — Cost Tables](https://www.guidetopheroes.com/tc/html/tips.html)
6. [topheroes.info — Hero Strategy Guide](https://topheroes.info/hero-guide.php)
7. [topheroes.info — Gear Strategy Guide](https://topheroes.info/gear-guide.php)
8. [topheroes.info — Hero Hub](https://topheroes.info/hero.php)
9. [topheroestier.com — Gear Planner](https://topheroestier.com/gear-planner/)
10. [atwiki.jp — Top Heroes 装備 (equipment)](https://w.atwiki.jp/topheroesjp/pages/18.html)
11. [LootBar — Top Heroes Kingdom Saga: Gear Sets and Stat Priorities](https://www.lootbar.com/blog/en/top-heroes-kingdom-saga-gear-sets-and-stat-priorities.html)
12. [Packsify — Top Heroes: Kingdom Saga Gear Guide](https://www.packsify.com/blogs/top-heroes-kingdom-saga-gear-guide)
13. [Reddit r/TopHeroes — Titan/Faction Marks and crafting](https://www.reddit.com/r/TopHeroes/comments/1egrqgj/titanfaction_marks_and_crafting/)
14. [Reddit r/TopHeroes — Does activating/upgrading hero traits do anything...](https://www.reddit.com/r/TopHeroes/comments/1n03kxz/does_activatingupgrading_hero_traits_do_anything/)
15. [Reddit r/TopHeroes — Is this a joke??](https://www.reddit.com/r/TopHeroes/comments/1p2i9ab/is_this_a_joke/)
16. [Reddit r/TopHeroes — Hero Traits](https://www.reddit.com/r/TopHeroes/comments/1qlj2dt/hero_traits/)
17. [Reddit r/TopHeroes — traits?](https://www.reddit.com/r/TopHeroes/comments/1iwwfuu/traits/)
18. [Reddit r/TopHeroes — Heroes upgrades and best use of shards](https://www.reddit.com/r/TopHeroes/comments/1kzfs1a/heroes_upgrades_and_best_use_of_shards/)
19. [Reddit r/TopHeroes — Up to date Equipment Lists](https://www.reddit.com/r/TopHeroes/comments/1jj6njf/up_to_date_equipment_lists/)
