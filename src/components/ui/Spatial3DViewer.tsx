import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Sun,
  Compass,
  Sparkles,
  RotateCw,
  Eye,
  Layers,
  Dna,
  Zap,
  Box,
  Maximize2,
} from 'lucide-react';

export type Spatial3DModel = 'molecule-h2o' | 'prism-rainbow' | 'solar-system' | 'magnetic-dipole' | 'dna-helix';

interface Node3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  label?: string;
  glow?: string;
}

interface Bond3D {
  from: number;
  to: number;
  color?: string;
  width?: number;
}

export interface Spatial3DViewerProps {
  initialModel?: Spatial3DModel;
  height?: number;
  className?: string;
  showControls?: boolean;
}

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({
  initialModel = 'prism-rainbow',
  height = 360,
  className = '',
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<Spatial3DModel>(initialModel);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);

  const rotRef = useRef({ x: 0.25, y: 0.4, z: 0 });
  const mouseRef = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    targetRotX: 0.25,
    targetRotY: 0.4,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let canvasHeight = (canvas.height = height);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      canvasHeight = canvas.height = height;
    };
    window.addEventListener('resize', onResize);

    // Mouse & Touch Controls
    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isDown) return;
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;
      mouseRef.current.targetRotY += dx * 0.008;
      mouseRef.current.targetRotX += dy * 0.008;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    // Touch event handlers for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDown = true;
        mouseRef.current.lastX = e.touches[0].clientX;
        mouseRef.current.lastY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!mouseRef.current.isDown || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - mouseRef.current.lastX;
      const dy = e.touches[0].clientY - mouseRef.current.lastY;
      mouseRef.current.targetRotY += dx * 0.008;
      mouseRef.current.targetRotX += dy * 0.008;
      mouseRef.current.lastX = e.touches[0].clientX;
      mouseRef.current.lastY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, canvasHeight);

      // Smooth inertia
      if (autoRotate && !mouseRef.current.isDown) {
        mouseRef.current.targetRotY += 0.008;
      }

      rotRef.current.x += (mouseRef.current.targetRotX - rotRef.current.x) * 0.08;
      rotRef.current.y += (mouseRef.current.targetRotY - rotRef.current.y) * 0.08;

      const cx = width / 2;
      const cy = canvasHeight / 2;
      const fov = 340 * zoom;
      const cameraDist = 480;

      // Project 3D Point to 2D Screen
      const project = (p: Node3D) => {
        // Rotate Y
        const cosY = Math.cos(rotRef.current.y);
        const sinY = Math.sin(rotRef.current.y);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const cosX = Math.cos(rotRef.current.x);
        const sinX = Math.sin(rotRef.current.x);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const depth = z2 + cameraDist;
        const scale = depth > 10 ? fov / depth : 1;

        return {
          sx: cx + x1 * scale,
          sy: cy + y2 * scale,
          depth,
          scale,
          radius: Math.max(1, p.radius * scale),
          color: p.color,
          label: p.label,
          glow: p.glow,
        };
      };

      // Subtle Radial Aura
      const radialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
      radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.16)');
      radialGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.06)');
      radialGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, canvasHeight);

      // -------------------------------------------------------------
      // BUILD 3D GEOMETRY ACCORDING TO MODEL
      // -------------------------------------------------------------
      const nodes: Node3D[] = [];
      const bonds: Bond3D[] = [];

      if (model === 'molecule-h2o') {
        // Water Molecule (H2O) + Covalent Vibration
        const vib = Math.sin(time * 6) * 3;
        // Oxygen central atom (Red)
        nodes.push({ x: 0, y: -20, z: 0, radius: 24, color: '#EF4444', label: 'O (Oxygen)', glow: '#F87171' });

        // Hydrogen 1 (104.5 degree bond angle)
        const angle1 = (104.5 / 2) * (Math.PI / 180);
        const bondLen = 75 + vib;
        nodes.push({
          x: -Math.sin(angle1) * bondLen,
          y: Math.cos(angle1) * bondLen - 20,
          z: Math.sin(time * 3) * 6,
          radius: 14,
          color: '#F8FAFC',
          label: 'H (1)',
          glow: '#38BDF8',
        });

        // Hydrogen 2
        nodes.push({
          x: Math.sin(angle1) * bondLen,
          y: Math.cos(angle1) * bondLen - 20,
          z: -Math.sin(time * 3) * 6,
          radius: 14,
          color: '#F8FAFC',
          label: 'H (2)',
          glow: '#38BDF8',
        });

        bonds.push({ from: 0, to: 1, color: '#94A3B8', width: 6 });
        bonds.push({ from: 0, to: 2, color: '#94A3B8', width: 6 });

        // Electron density cloud particles
        for (let i = 0; i < 18; i++) {
          const a = (i * Math.PI * 2) / 18 + time * 1.5;
          nodes.push({
            x: Math.cos(a) * 36,
            y: Math.sin(a) * 36 - 20,
            z: Math.sin(a * 2) * 12,
            radius: 2,
            color: '#67E8F9',
            glow: '#06B6D4',
          });
        }
      } else if (model === 'prism-rainbow') {
        // 3D Glass Triangular Prism with Refracted Rainbow Spectrum
        const prismHeight = 85;
        const prismR = 75;

        // Base triangle vertices (top & bottom)
        const topVerts: number[] = [];
        const botVerts: number[] = [];

        for (let i = 0; i < 3; i++) {
          const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
          const px = Math.cos(a) * prismR;
          const pz = Math.sin(a) * prismR;

          topVerts.push(nodes.length);
          nodes.push({ x: px, y: -prismHeight, z: pz, radius: 4, color: '#38BDF8', glow: '#38BDF8' });

          botVerts.push(nodes.length);
          nodes.push({ x: px, y: prismHeight, z: pz, radius: 4, color: '#38BDF8', glow: '#38BDF8' });
        }

        // Connect prism edges
        for (let i = 0; i < 3; i++) {
          const next = (i + 1) % 3;
          bonds.push({ from: topVerts[i], to: topVerts[next], color: 'rgba(56, 189, 248, 0.7)', width: 3 });
          bonds.push({ from: botVerts[i], to: botVerts[next], color: 'rgba(56, 189, 248, 0.7)', width: 3 });
          bonds.push({ from: topVerts[i], to: botVerts[i], color: 'rgba(56, 189, 248, 0.8)', width: 3 });
        }

        // Incident White Light Beam Nodes
        const beamStartX = -160;
        const beamStartY = 0;
        const beamStartZ = -20;
        nodes.push({ x: beamStartX, y: beamStartY, z: beamStartZ, radius: 5, color: '#FFFFFF', label: 'Incident Ray' });
        nodes.push({ x: -35, y: 0, z: -10, radius: 3, color: '#FFFFFF' });
        bonds.push({ from: nodes.length - 2, to: nodes.length - 1, color: 'rgba(255, 255, 255, 0.95)', width: 4 });

        // Dispersed Rainbow Spectrum Beams
        const rainbowColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#6366F1', '#A855F7'];
        rainbowColors.forEach((color, idx) => {
          const spreadY = (idx - 3) * 12;
          const targetX = 160;
          const targetY = spreadY;
          const targetZ = 30 + idx * 5;

          const pIdx = nodes.length;
          nodes.push({ x: targetX, y: targetY, z: targetZ, radius: 3, color, glow: color });
          bonds.push({ from: nodes.length - 2, to: pIdx, color, width: 2.5 });
        });
      } else if (model === 'solar-system') {
        // 3D Gravitational Orbit & Celestial Mechanics
        // Sun at center
        nodes.push({ x: 0, y: 0, z: 0, radius: 28, color: '#F59E0B', label: 'Sun', glow: '#FBBF24' });

        // Planetary Orbits with Keplerian speeds
        const planets = [
          { name: 'Mercury', r: 55, speed: 2.8, size: 5, color: '#94A3B8' },
          { name: 'Venus', r: 85, speed: 1.9, size: 7, color: '#FCD34D' },
          { name: 'Earth', r: 120, speed: 1.4, size: 8, color: '#38BDF8', hasMoon: true },
          { name: 'Mars', r: 160, speed: 1.0, size: 6, color: '#EF4444' },
        ];

        planets.forEach((pl) => {
          const orbAngle = time * pl.speed;
          const px = Math.cos(orbAngle) * pl.r;
          const pz = Math.sin(orbAngle) * pl.r;

          const plIdx = nodes.length;
          nodes.push({ x: px, y: Math.sin(orbAngle * 2) * 6, z: pz, radius: pl.size, color: pl.color, label: pl.name });

          // Earth's Orbiting Moon
          if (pl.hasMoon) {
            const moonAngle = time * 8;
            nodes.push({
              x: px + Math.cos(moonAngle) * 16,
              y: Math.sin(moonAngle) * 6,
              z: pz + Math.sin(moonAngle) * 16,
              radius: 2.5,
              color: '#FFFFFF',
              label: 'Moon',
            });
            bonds.push({ from: plIdx, to: nodes.length - 1, color: 'rgba(255, 255, 255, 0.4)', width: 1.2 });
          }

          // Elliptical orbital trace ring
          const ringPointsCount = 32;
          const ringStart = nodes.length;
          for (let i = 0; i < ringPointsCount; i++) {
            const theta = (i * Math.PI * 2) / ringPointsCount;
            nodes.push({
              x: Math.cos(theta) * pl.r,
              y: 0,
              z: Math.sin(theta) * pl.r,
              radius: 0.8,
              color: 'rgba(148, 163, 184, 0.3)',
            });
            if (i > 0) {
              bonds.push({ from: ringStart + i - 1, to: ringStart + i, color: 'rgba(148, 163, 184, 0.2)', width: 1 });
            }
          }
          bonds.push({ from: ringStart + ringPointsCount - 1, to: ringStart, color: 'rgba(148, 163, 184, 0.2)', width: 1 });
        });
      } else if (model === 'magnetic-dipole') {
        // 3D Magnetic Field & Dipole Lines
        // North Pole (Red)
        nodes.push({ x: 0, y: -50, z: 0, radius: 18, color: '#EF4444', label: 'N (North)', glow: '#F87171' });
        // South Pole (Blue)
        nodes.push({ x: 0, y: 50, z: 0, radius: 18, color: '#3B82F6', label: 'S (South)', glow: '#60A5FA' });
        bonds.push({ from: 0, to: 1, color: '#64748B', width: 14 });

        // Magnetic flux loops (Euler field loops)
        const numLoops = 8;
        for (let l = 0; l < numLoops; l++) {
          const loopAngle = (l * Math.PI * 2) / numLoops;
          const loopRadius = 80;
          const ptsCount = 20;
          const loopStart = nodes.length;

          for (let i = 0; i < ptsCount; i++) {
            const tNorm = (i / ptsCount) * Math.PI;
            const y = Math.cos(tNorm) * 65;
            const rOffset = Math.sin(tNorm) * loopRadius;
            const x = Math.cos(loopAngle) * rOffset;
            const z = Math.sin(loopAngle) * rOffset;

            nodes.push({
              x,
              y,
              z,
              radius: 1.8,
              color: `hsl(${190 + (l * 15)}, 90%, 65%)`,
            });

            if (i > 0) {
              bonds.push({
                from: loopStart + i - 1,
                to: loopStart + i,
                color: 'rgba(56, 189, 248, 0.35)',
                width: 1.5,
              });
            }
          }
        }
      } else if (model === 'dna-helix') {
        // High-Fidelity DNA Double Helix with Base Pairs
        const rungs = 20;
        const helixRadius = 50;
        const totalHeight = 220;

        for (let i = 0; i < rungs; i++) {
          const tNorm = i / rungs;
          const y = (tNorm - 0.5) * totalHeight;
          const angle = tNorm * Math.PI * 4 + time * 1.2;

          const x1 = Math.cos(angle) * helixRadius;
          const z1 = Math.sin(angle) * helixRadius;
          const x2 = Math.cos(angle + Math.PI) * helixRadius;
          const z2 = Math.sin(angle + Math.PI) * helixRadius;

          const p1 = nodes.length;
          nodes.push({ x: x1, y, z: z1, radius: 6, color: '#38BDF8', glow: '#38BDF8' });
          const p2 = nodes.length;
          nodes.push({ x: x2, y, z: z2, radius: 6, color: '#F43F5E', glow: '#F43F5E' });

          bonds.push({ from: p1, to: p2, color: i % 2 === 0 ? '#A855F7' : '#34D399', width: 3 });

          if (i > 0) {
            bonds.push({ from: p1 - 2, to: p1, color: '#38BDF8', width: 3 });
            bonds.push({ from: p2 - 2, to: p2, color: '#F43F5E', width: 3 });
          }
        }
      }

      // Project all nodes
      const projected = nodes.map((n) => project(n));

      // Draw Bonds / Edges with depth-based opacity
      bonds.forEach((b) => {
        const pr1 = projected[b.from];
        const pr2 = projected[b.to];
        if (!pr1 || !pr2) return;

        const avgDepth = (pr1.depth + pr2.depth) / 2;
        const alpha = Math.max(0.15, Math.min(0.9, 1 - avgDepth / (cameraDist * 2.2)));

        ctx.strokeStyle = b.color || `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = Math.max(1, (b.width || 2) * ((pr1.scale + pr2.scale) / 2));
        ctx.beginPath();
        ctx.moveTo(pr1.sx, pr1.sy);
        ctx.lineTo(pr2.sx, pr2.sy);
        ctx.stroke();
      });

      // Sort nodes from back to front
      const sorted = projected
        .map((p, idx) => ({ p, idx }))
        .sort((a, b) => b.p.depth - a.p.depth);

      // Render 3D Spheres with specular highlight gleam
      sorted.forEach(({ p }) => {
        const alpha = Math.max(0.2, Math.min(1, 1 - p.depth / (cameraDist * 2.2)));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.glow || p.color;
        ctx.shadowBlur = p.glow ? 12 * p.scale : 0;
        ctx.fill();

        // 3D Specular Highlight on front-facing hemisphere
        if (p.radius > 4) {
          ctx.beginPath();
          ctx.arc(p.sx - p.radius * 0.3, p.sy - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = alpha * 0.85;
          ctx.fill();
        }

        // Optional Node Label
        if (p.label && p.scale > 0.7) {
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillText(p.label, p.sx + p.radius + 6, p.sy + 3);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [model, height, autoRotate, zoom]);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-white/20 bg-slate-950/80 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1.5px_1px_rgba(255,255,255,0.18)] ${className}`}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full cursor-grab active:cursor-grabbing block" />

      {/* Top HUD Badge Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-xl border border-white/20 text-cyan-400 text-xs font-black shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive 3D Spatial Laboratory</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="pointer-events-auto px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-[10px] font-bold border border-white/15 text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCw className={`w-3 h-3 text-cyan-400 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <span>{autoRotate ? 'Auto Orbit' : 'Free Cam'}</span>
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-xl border border-white/20 text-[10px] font-mono text-slate-300 hidden sm:flex">
            <Eye className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Drag to rotate • 60 FPS</span>
          </div>
        </div>
      </div>

      {/* Bottom Model Switcher Pills */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/20 shadow-xl overflow-x-auto scrollbar-none max-w-full">
            {[
              { id: 'prism-rainbow', label: 'Prism & Rainbow', icon: Sun },
              { id: 'molecule-h2o', label: 'H₂O Water Molecule', icon: Atom },
              { id: 'solar-system', label: 'Planetary Orbits', icon: Compass },
              { id: 'magnetic-dipole', label: 'Magnetic Dipole', icon: Zap },
              { id: 'dna-helix', label: 'DNA Double Helix', icon: Dna },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = model === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setModel(item.id as Spatial3DModel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300/80 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-white/15 hidden md:flex">
            <span>Euler 3D Projection Engine</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spatial3DViewer;
