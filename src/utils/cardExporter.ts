import type { Hero } from '../data/heroes';
import { getPath } from './paths';

export interface FormationCardData {
  teamName?: string;
  heroes: (Hero | null)[];
  auraTitle: string;
  auraBonusText: string;
  totalAtk: number;
  totalHp: number;
  totalDef: number;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load image for canvas:', src);
      resolve(null);
    };
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export async function generateFormationCardCanvas(data: FormationCardData): Promise<HTMLCanvasElement> {
  const width = 1200;
  const height = 675;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Pre-load all hero avatar images
  const loadedAvatars = await Promise.all(
    data.heroes.map((hero) => (hero ? loadImage(getPath(hero.avatar)) : Promise.resolve(null)))
  );

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0d1527');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 16, 16, width - 32, height - 32, 24);
  ctx.stroke();

  // Subtle golden glow accent border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 22, 22, width - 44, height - 44, 20);
  ctx.stroke();

  // 2. Header
  // Brand title
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('TOP HEROES', 48, 62);

  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TACTICAL FORMATION', 205, 62);

  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('PATCH 1.24.0 VERIFIED • BATTLE MATRIX', 48, 84);

  // Faction Aura & Combat Stats Badge on top right
  const auraX = width - 48;
  ctx.textAlign = 'right';

  // Faction Aura Pill
  const auraLabel = data.auraTitle || 'AURA: STANDARD';
  ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText(auraLabel.toUpperCase(), auraX, 58);

  // Total Power Metrics
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  const statsSummary = `ATK: ${data.totalAtk.toLocaleString()}  •  HP: ${data.totalHp.toLocaleString()}  •  DEF: ${data.totalDef.toLocaleString()}`;
  ctx.fillText(statsSummary, auraX, 80);

  ctx.textAlign = 'left';

  // Header Divider
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 104);
  ctx.lineTo(width - 48, 104);
  ctx.stroke();

  // 3. FRONT ROW (Slots 1 & 2)
  const frontY = 125;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('FRONT ROW (DEFENDERS & MELEE BRUISERS)', 48, frontY);

  const frontSlotWidth = 530;
  const frontSlotHeight = 160;

  [0, 1].forEach((idx) => {
    const slotX = 48 + idx * (frontSlotWidth + 44);
    const slotY = frontY + 14;
    const hero = data.heroes[idx];
    const avatar = loadedAvatars[idx];

    // Card background
    ctx.fillStyle = hero ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.4)';
    drawRoundedRect(ctx, slotX, slotY, frontSlotWidth, frontSlotHeight, 18);
    ctx.fill();

    ctx.strokeStyle = hero ? 'rgba(51, 65, 85, 0.9)' : 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, slotX, slotY, frontSlotWidth, frontSlotHeight, 18);
    ctx.stroke();

    // Slot Pill Badge
    ctx.fillStyle = '#1e293b';
    drawRoundedRect(ctx, slotX + 16, slotY + 14, 60, 22, 6);
    ctx.fill();
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`SLOT ${idx + 1}`, slotX + 24, slotY + 29);

    if (hero) {
      // Role & Faction Pill
      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${hero.role.toUpperCase()} • ${hero.faction.toUpperCase()}`, slotX + 86, slotY + 29);

      // Hero Avatar image
      const imgX = slotX + 18;
      const imgY = slotY + 48;
      const imgSize = 96;

      ctx.save();
      drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 14);
      ctx.clip();
      if (avatar) {
        ctx.drawImage(avatar, imgX, imgY, imgSize, imgSize);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(imgX, imgY, imgSize, imgSize);
      }
      ctx.restore();

      // Avatar Border
      ctx.strokeStyle =
        hero.faction === 'league' ? '#3b82f6' : hero.faction === 'nature' ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 14);
      ctx.stroke();

      // Hero Details Text
      const textX = imgX + imgSize + 20;
      ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hero.name, textX, slotY + 74);

      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(hero.title, textX, slotY + 94);

      // Rarity & Damage Badge
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = hero.rarity === 'mythic' ? '#f87171' : '#f59e0b';
      ctx.fillText(`${hero.rarity.toUpperCase()}  |  ${hero.damageType.toUpperCase()} DAMAGE`, textX, slotY + 118);

      // Base Stats snippet
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`HP: ${hero.baseStats.hp.toLocaleString()}   DEF: ${hero.baseStats.def.toLocaleString()}`, textX, slotY + 138);
    } else {
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Empty Slot (No Champion)', slotX + 32, slotY + 90);
    }
  });

  // 4. BACK ROW (Slots 3, 4, 5, 6)
  const backY = 345;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('BACK ROW (CARRIES, HEALERS & BUFFERS)', 48, backY);

  const backSlotWidth = 258;
  const backSlotHeight = 220;

  [2, 3, 4, 5].forEach((slotIdx, i) => {
    const slotX = 48 + i * (backSlotWidth + 24);
    const slotY = backY + 14;
    const hero = data.heroes[slotIdx];
    const avatar = loadedAvatars[slotIdx];

    // Card background
    ctx.fillStyle = hero ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.4)';
    drawRoundedRect(ctx, slotX, slotY, backSlotWidth, backSlotHeight, 18);
    ctx.fill();

    ctx.strokeStyle = hero ? 'rgba(51, 65, 85, 0.9)' : 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, slotX, slotY, backSlotWidth, backSlotHeight, 18);
    ctx.stroke();

    // Slot badge
    ctx.fillStyle = '#1e293b';
    drawRoundedRect(ctx, slotX + 14, slotY + 12, 54, 20, 6);
    ctx.fill();
    ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`SLOT ${slotIdx + 1}`, slotX + 20, slotY + 26);

    if (hero) {
      // Role & Faction pill
      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${hero.role.toUpperCase()}`, slotX + 76, slotY + 26);

      // Hero Avatar image
      const imgX = slotX + 16;
      const imgY = slotY + 42;
      const imgSize = 74;

      ctx.save();
      drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 12);
      ctx.clip();
      if (avatar) {
        ctx.drawImage(avatar, imgX, imgY, imgSize, imgSize);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(imgX, imgY, imgSize, imgSize);
      }
      ctx.restore();

      // Avatar Border
      ctx.strokeStyle =
        hero.faction === 'league' ? '#3b82f6' : hero.faction === 'nature' ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 12);
      ctx.stroke();

      // Text to the right of avatar
      const textX = imgX + imgSize + 12;
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hero.name, textX, slotY + 68);

      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = hero.rarity === 'mythic' ? '#f87171' : '#f59e0b';
      ctx.fillText(hero.rarity.toUpperCase(), textX, slotY + 86);

      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(hero.faction.toUpperCase(), textX, slotY + 104);

      // Stats block under avatar
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`ATK: ${hero.baseStats.atk.toLocaleString()}`, slotX + 18, slotY + 144);
      ctx.fillText(`HP: ${hero.baseStats.hp.toLocaleString()}`, slotX + 18, slotY + 164);
      ctx.fillText(`SPD: ${hero.baseStats.spd}  |  ${hero.damageType}`, slotX + 18, slotY + 184);

      // PvP Tier badge
      ctx.fillStyle = '#1e293b';
      drawRoundedRect(ctx, slotX + 18, slotY + 192, 70, 18, 5);
      ctx.fill();
      ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`PVP: ${hero.tierRankings.pvp}`, slotX + 24, slotY + 205);
    } else {
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Empty Slot', slotX + 20, slotY + 90);
    }
  });

  // 5. Footer Watermark
  const footerY = height - 34;
  ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Generated by Top Heroes Interactive Roster & Lineup Optimizer', 48, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('jmsepulv.github.io/top-heroes-wiki', width - 48, footerY);
  ctx.textAlign = 'left';

  return canvas;
}

export async function downloadFormationCard(data: FormationCardData, filename = 'top-heroes-formation.png'): Promise<void> {
  const canvas = await generateFormationCardCanvas(data);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to create PNG blob');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyFormationCardToClipboard(data: FormationCardData): Promise<boolean> {
  try {
    const canvas = await generateFormationCardCanvas(data);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;

    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy card to clipboard:', err);
    return false;
  }
}
