import * as THREE from 'three';
import type { CubeSkill } from '../data/skills';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSymbolWatermark(
  ctx: CanvasRenderingContext2D,
  symbol: CubeSkill['symbol'],
  ink: string,
) {
  if (!symbol) return;
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.globalAlpha = ink === '#ffffff' ? 0.34 : 0.24;
  ctx.lineWidth = 7.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = 128;
  const cy = 78;

  switch (symbol) {
    case 'atom':
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 34, 13, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'hex':
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        const px = cx + Math.cos(a) * 28;
        const py = cy + Math.sin(a) * 28;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    case 'cube':
      ctx.beginPath();
      ctx.moveTo(cx, cy - 28);
      ctx.lineTo(cx + 25, cy - 14);
      ctx.lineTo(cx + 25, cy + 14);
      ctx.lineTo(cx, cy + 28);
      ctx.lineTo(cx - 25, cy + 14);
      ctx.lineTo(cx - 25, cy - 14);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + 28);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 25, cy - 14);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 25, cy - 14);
      ctx.stroke();
      break;
    case 'wave':
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy - 6);
      ctx.bezierCurveTo(cx - 12, cy - 24, cx + 6, cy + 12, cx + 28, cy - 8);
      ctx.moveTo(cx - 28, cy + 12);
      ctx.bezierCurveTo(cx - 12, cy - 6, cx + 6, cy + 30, cx + 28, cy + 10);
      ctx.stroke();
      break;
    case 'bolt':
      ctx.beginPath();
      ctx.moveTo(cx + 6, cy - 28);
      ctx.lineTo(cx - 16, cy + 2);
      ctx.lineTo(cx + 2, cy + 2);
      ctx.lineTo(cx - 8, cy + 28);
      ctx.lineTo(cx + 18, cy - 4);
      ctx.lineTo(cx + 1, cy - 4);
      ctx.closePath();
      ctx.fill();
      break;
    case 'branch':
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 22);
      ctx.lineTo(cx - 14, cy + 22);
      ctx.moveTo(cx - 14, cy + 8);
      ctx.quadraticCurveTo(cx - 14, cy - 8, cx + 14, cy - 14);
      ctx.stroke();
      [
        [cx - 14, cy - 22],
        [cx - 14, cy + 22],
        [cx + 14, cy - 14],
      ].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    case 'db':
      ctx.beginPath();
      ctx.ellipse(cx, cy - 18, 24, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 18);
      ctx.lineTo(cx - 24, cy + 16);
      ctx.ellipse(cx, cy + 16, 24, 9, 0, Math.PI, 0, true);
      ctx.lineTo(cx + 24, cy - 18);
      ctx.stroke();
      break;
    case 'cloud':
      ctx.beginPath();
      ctx.arc(cx - 14, cy + 6, 14, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cx + 2, cy - 6, 17, Math.PI, Math.PI * 2);
      ctx.arc(cx + 18, cy + 6, 12, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'terminal':
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy - 14);
      ctx.lineTo(cx - 6, cy);
      ctx.lineTo(cx - 22, cy + 14);
      ctx.moveTo(cx + 2, cy + 14);
      ctx.lineTo(cx + 24, cy + 14);
      ctx.stroke();
      break;
    case 'spark':
      ctx.beginPath();
      ctx.moveTo(cx, cy - 26);
      ctx.quadraticCurveTo(cx + 4, cy - 4, cx + 26, cy);
      ctx.quadraticCurveTo(cx + 4, cy + 4, cx, cy + 26);
      ctx.quadraticCurveTo(cx - 4, cy + 4, cx - 26, cy);
      ctx.quadraticCurveTo(cx - 4, cy - 4, cx, cy - 26);
      ctx.fill();
      break;
  }

  ctx.restore();
}

/**
 * Generates a rich, high-saturation procedural speedcube sticker texture for one skill tile.
 */
export function createStickerTexture(skill: CubeSkill): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Rich saturated base fill
  ctx.fillStyle = skill.color;
  ctx.fillRect(0, 0, size, size);

  // Subtle depth shading (deepen bottom-right without washing out color)
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle inner rim highlight
  drawRoundedRect(ctx, 14, 14, size - 28, size - 28, 30);
  ctx.strokeStyle =
    skill.ink === '#ffffff' ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.18)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center tile marker dot
  if (skill.slot === 4) {
    ctx.beginPath();
    ctx.arc(size - 38, 38, 7, 0, Math.PI * 2);
    ctx.fillStyle =
      skill.ink === '#ffffff' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.4)';
    ctx.fill();
  }

  drawSymbolWatermark(ctx, skill.symbol, skill.ink);

  // Crisp embossed monogram
  const shortLen = skill.short.length;
  const fontSize =
    shortLen <= 2 ? 96 : shortLen === 3 ? 76 : shortLen === 4 ? 64 : 54;
  ctx.font = `800 ${fontSize}px "Space Grotesk", "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const labelY = skill.symbol ? 168 : 132;

  ctx.fillStyle =
    skill.ink === '#ffffff' ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.35)';
  ctx.fillText(skill.short, size / 2, labelY + 4);

  ctx.fillStyle = skill.ink;
  ctx.fillText(skill.short, size / 2, labelY);

  if (!skill.symbol) {
    ctx.font = `700 18px "JetBrains Mono", monospace`;
    ctx.fillStyle =
      skill.ink === '#ffffff' ? 'rgba(255,255,255,0.72)' : 'rgba(15,23,42,0.58)';
    ctx.fillText(skill.face, size / 2, 214);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
