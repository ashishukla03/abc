import * as lucide from 'lucide';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const needed = [
  'Flame', 'FlaskConical', 'Ruler', 'Bot', 'Hourglass', 'Zap', 'Sprout',
  'School', 'BookOpen', 'Star', 'Target', 'Trophy', 'Sparkles', 'Clock',
  'Calendar', 'CheckCircle2', 'Check', 'RotateCcw', 'Volume2', 'VolumeX',
  'User', 'GraduationCap', 'FileText', 'Compass', 'Lightbulb', 'ArrowRight',
  'ArrowLeft', 'Play', 'Square', 'Trash2', 'Plus', 'Settings', 'Lock',
  'WifiOff', 'Search', 'Sliders', 'ShieldCheck', 'Award', 'HelpCircle',
  'Atom', 'Layers', 'Activity', 'BarChart3'
];

const dict = {};
for (const name of needed) {
  if (lucide[name]) {
    dict[name] = lucide[name];
  } else {
    console.warn('Missing icon in lucide:', name);
  }
}

const fileContent = `/**
 * Gramin PocketLab — Official Lucide SVG Icon Engine
 * Pure ES Module, zero-dependency, 100% offline-ready.
 */

export const ICONS = ${JSON.stringify(dict, null, 2)};

export function renderIcon(name, { size = 18, color = 'currentColor', strokeWidth = 2, className = '', fill = 'none' } = {}) {
  const iconDef = ICONS[name];
  if (!iconDef) {
    return '<span class="icon-fallback ' + className + '" style="width:' + size + 'px;height:' + size + 'px;display:inline-block;"></span>';
  }
  const innerHtml = iconDef.map(([tag, attrs]) => {
    const attrStr = Object.entries(attrs).map(([k, v]) => k + '="' + v + '"').join(' ');
    return '<' + tag + ' ' + attrStr + ' />';
  }).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + fill + '" stroke="' + color + '" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide-' + name.toLowerCase() + ' ' + className + '" aria-hidden="true">' + innerHtml + '</svg>';
}

export function badgeIcon(name, { variant = 'primary', size = 16, iconSize = 16, glow = true, className = '' } = {}) {
  const variantStyles = {
    flame: { bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.4)', color: '#D97706', glow: '0 0 12px rgba(245, 158, 11, 0.35)' },
    chem: { bg: 'rgba(147, 51, 234, 0.16)', border: 'rgba(147, 51, 234, 0.4)', color: '#9333EA', glow: '0 0 12px rgba(147, 51, 234, 0.35)' },
    math: { bg: 'rgba(37, 99, 235, 0.16)', border: 'rgba(37, 99, 235, 0.4)', color: '#2563EB', glow: '0 0 12px rgba(37, 99, 235, 0.35)' },
    phys: { bg: 'rgba(13, 148, 136, 0.16)', border: 'rgba(13, 148, 136, 0.4)', color: '#0D9488', glow: '0 0 12px rgba(13, 148, 136, 0.35)' },
    bio: { bg: 'rgba(16, 185, 129, 0.16)', border: 'rgba(16, 185, 129, 0.4)', color: '#059669', glow: '0 0 12px rgba(16, 185, 129, 0.35)' },
    bot: { bg: 'rgba(99, 102, 241, 0.16)', border: 'rgba(99, 102, 241, 0.4)', color: '#4F46E5', glow: '0 0 12px rgba(99, 102, 241, 0.35)' },
    gold: { bg: 'rgba(234, 179, 8, 0.18)', border: 'rgba(234, 179, 8, 0.45)', color: '#B45309', glow: '0 0 14px rgba(234, 179, 8, 0.4)' },
    neutral: { bg: 'rgba(255, 255, 255, 0.75)', border: 'rgba(226, 232, 240, 0.9)', color: '#475569', glow: '0 2px 6px rgba(0, 0, 0, 0.04)' }
  };
  const v = variantStyles[variant] || variantStyles.neutral;
  const shadow = glow ? 'box-shadow: ' + v.glow + ';' : '';
  const svg = renderIcon(name, { size: iconSize, color: v.color });
  return '<span class="lucide-badge ' + className + '" style="display: inline-flex; align-items: center; justify-content: center; width: ' + (size + 14) + 'px; height: ' + (size + 14) + 'px; border-radius: 12px; background: ' + v.bg + '; border: 1px solid ' + v.border + '; color: ' + v.color + '; ' + shadow + ' backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); flex-shrink: 0;">' + svg + '</span>';
}
`;

fs.writeFileSync(path.join(ROOT_DIR, 'app', 'js', 'icons.js'), fileContent, 'utf-8');
console.log('app/js/icons.js created successfully with', Object.keys(dict).length, 'icons');

