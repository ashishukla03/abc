import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, Dna, Box, Waves, Sparkles, Eye, RotateCw } from 'lucide-react';

export type HoloMode = 'atom' | 'helix' | 'lattice' | 'wave';

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
}

interface Edge3D {
  p1: number;
  p2: number;
  color?: string;
}

export const QuantumHoloCore3D: React.FC<{ height?: number; className?: string }> = ({
  height = 360,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<HoloMode>('atom');
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, lastX: 0, lastY: 0 });
  const rotRef = useRef({ rx: 0.2, ry: 0.3, rz: 0.05, autoSpeed: 0.015 });

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

    // Mouse Tracking for 3D Camera Tilt
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;

      if (mouseRef.current.isDown) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        rotRef.current.ry += dx * 0.008;
        rotRef.current.rx += dy * 0.008;
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, canvasHeight);

      // Smooth inertia rotation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (!mouseRef.current.isDown) {
        rotRef.current.ry += rotRef.current.autoSpeed;
        rotRef.current.rx = 0.2 + mouseRef.current.y * 0.35;
        rotRef.current.rz = mouseRef.current.x * 0.25;
      }

      const cx = width / 2;
      const cy = canvasHeight / 2;
      const fov = 320;
      const cameraDist = 480;

      // 3D rotation projection helper
      const project = (p: Point3D) => {
        // Rotate around Y
        const cosY = Math.cos(rotRef.current.ry);
        const sinY = Math.sin(rotRef.current.ry);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X
        const cosX = Math.cos(rotRef.current.rx);
        const sinX = Math.sin(rotRef.current.rx);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Rotate around Z
        const cosZ = Math.cos(rotRef.current.rz);
        const sinZ = Math.sin(rotRef.current.rz);
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = x1 * sinZ + y2 * cosZ;

        const depth = z2 + cameraDist;
        const scale = depth > 10 ? fov / depth : 1;
        return {
          sx: cx + x3 * scale,
          sy: cy + y3 * scale,
          depth,
          scale,
          color: p.color || '#38BDF8',
          size: (p.size || 3) * scale,
        };
      };

      // Background subtle volumetric glow
      const radialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
      radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      radialGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      radialGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, canvasHeight);

      // Build Geometry based on active Mode
      const points: Point3D[] = [];
      const edges: Edge3D[] = [];

      if (mode === 'atom') {
        // Nucleus nodes
        for (let i = 0; i < 9; i++) {
          const a = (i * Math.PI * 2) / 9 + time;
          const r = 16 + Math.sin(time * 2 + i) * 4;
          points.push({
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            z: Math.cos(a * 2) * 12,
            color: i % 2 === 0 ? '#F43F5E' : '#38BDF8',
            size: 6,
          });
        }

        // 3 Elliptical 3D Quantum Orbiting Rings
        const ringConfigs = [
          { tiltX: 0.9, tiltZ: 0.2, color: '#818CF8', speed: 1.8, electronColor: '#67E8F9' },
          { tiltX: -0.8, tiltZ: 0.9, color: '#A855F7', speed: -2.2, electronColor: '#F472B6' },
          { tiltX: 0.1, tiltZ: -0.9, color: '#34D399', speed: 2.0, electronColor: '#FDE047' },
        ];

        ringConfigs.forEach((ring, rIdx) => {
          const ringPointsCount = 48;
          const radiusA = 130;
          const radiusB = 60;
          const startIndex = points.length;

          for (let i = 0; i < ringPointsCount; i++) {
            const theta = (i * Math.PI * 2) / ringPointsCount;
            // Ellipse in 2D
            let x = Math.cos(theta) * radiusA;
            let y = Math.sin(theta) * radiusB;
            let z = 0;

            // Tilt in 3D
            const yRot = y * Math.cos(ring.tiltX) - z * Math.sin(ring.tiltX);
            const zRot = y * Math.sin(ring.tiltX) + z * Math.cos(ring.tiltX);
            const xRot = x * Math.cos(ring.tiltZ) - yRot * Math.sin(ring.tiltZ);
            const yFinal = x * Math.sin(ring.tiltZ) + yRot * Math.cos(ring.tiltZ);

            points.push({
              x: xRot,
              y: yFinal,
              z: zRot,
              color: ring.color,
              size: 1.5,
            });

            if (i > 0) {
              edges.push({ p1: startIndex + i - 1, p2: startIndex + i, color: ring.color });
            }
          }
          edges.push({ p1: startIndex + ringPointsCount - 1, p2: startIndex, color: ring.color });

          // Fast orbiting electron with light tracer
          const eTheta = time * ring.speed;
          let ex = Math.cos(eTheta) * radiusA;
          let ey = Math.sin(eTheta) * radiusB;
          let ez = 0;
          const eyRot = ey * Math.cos(ring.tiltX) - ez * Math.sin(ring.tiltX);
          const ezRot = ey * Math.sin(ring.tiltX) + ez * Math.cos(ring.tiltX);
          const exRot = ex * Math.cos(ring.tiltZ) - eyRot * Math.sin(ring.tiltZ);
          const eyFinal = ex * Math.sin(ring.tiltZ) + eyRot * Math.cos(ring.tiltZ);

          points.push({
            x: exRot,
            y: eyFinal,
            z: ezRot,
            color: ring.electronColor,
            size: 8,
          });
        });
      } else if (mode === 'helix') {
        // DNA Double Helix
        const numRungs = 24;
        const helixRadius = 55;
        const totalHeight = 220;

        for (let i = 0; i < numRungs; i++) {
          const tNorm = i / numRungs;
          const y = (tNorm - 0.5) * totalHeight;
          const angle = tNorm * Math.PI * 4 + time;

          const x1 = Math.cos(angle) * helixRadius;
          const z1 = Math.sin(angle) * helixRadius;

          const x2 = Math.cos(angle + Math.PI) * helixRadius;
          const z2 = Math.sin(angle + Math.PI) * helixRadius;

          const p1Idx = points.length;
          points.push({ x: x1, y, z: z1, color: '#38BDF8', size: 5 });
          const p2Idx = points.length;
          points.push({ x: x2, y, z: z2, color: '#F43F5E', size: 5 });

          // Base pair connecting rung
          edges.push({ p1: p1Idx, p2: p2Idx, color: i % 2 === 0 ? '#A855F7' : '#34D399' });

          // Backbone longitudinal edges
          if (i > 0) {
            edges.push({ p1: p1Idx - 2, p2: p1Idx, color: '#38BDF8' });
            edges.push({ p1: p2Idx - 2, p2: p2Idx, color: '#F43F5E' });
          }
        }
      } else if (mode === 'lattice') {
        // 3D Icosahedron Crystal Lattice
        const phi = (1 + Math.sqrt(5)) / 2;
        const s = 65;
        const baseVerts = [
          [-1, phi, 0],
          [1, phi, 0],
          [-1, -phi, 0],
          [1, -phi, 0],
          [0, -1, phi],
          [0, 1, phi],
          [0, -1, -phi],
          [0, 1, -phi],
          [phi, 0, -1],
          [phi, 0, 1],
          [-phi, 0, -1],
          [-phi, 0, 1],
        ];

        baseVerts.forEach((v, idx) => {
          points.push({
            x: v[0] * s,
            y: v[1] * s,
            z: v[2] * s,
            color: idx % 3 === 0 ? '#38BDF8' : idx % 3 === 1 ? '#818CF8' : '#34D399',
            size: 6,
          });
        });

        // Compute edges for nearest neighbors
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dz = points[i].z - points[j].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < s * 2.2) {
              edges.push({ p1: i, p2: j, color: 'rgba(129, 140, 248, 0.45)' });
            }
          }
        }
      } else if (mode === 'wave') {
        // Resonant Quantum Wave Torus
        const numRings = 10;
        const ptsPerRing = 18;
        const R = 75; // major radius
        const r = 32; // minor radius

        for (let i = 0; i < numRings; i++) {
          const u = (i * Math.PI * 2) / numRings;
          for (let j = 0; j < ptsPerRing; j++) {
            const v = (j * Math.PI * 2) / ptsPerRing;
            // Harmonic wave modulation
            const waveAmp = Math.sin(u * 3 + v * 2 + time * 3) * 8;
            const x = (R + (r + waveAmp) * Math.cos(v)) * Math.cos(u);
            const y = (R + (r + waveAmp) * Math.cos(v)) * Math.sin(u);
            const z = (r + waveAmp) * Math.sin(v);

            points.push({
              x,
              y,
              z,
              color: `hsl(${(u * 180) / Math.PI + time * 40}, 85%, 65%)`,
              size: 3,
            });
          }
        }
      }

      // Project 3D points to 2D screen
      const projected = points.map((p) => project(p));

      // Draw Edges with depth sorting and glowing stroke
      ctx.lineWidth = 1.6;
      edges.forEach((edge) => {
        const pr1 = projected[edge.p1];
        const pr2 = projected[edge.p2];
        if (!pr1 || !pr2) return;

        const avgDepth = (pr1.depth + pr2.depth) / 2;
        const alpha = Math.max(0.15, Math.min(0.9, 1 - avgDepth / (cameraDist * 2.2)));

        ctx.strokeStyle = edge.color || `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(pr1.sx, pr1.sy);
        ctx.lineTo(pr2.sx, pr2.sy);
        ctx.stroke();
      });

      // Sort points from back to front for proper 3D rendering
      const sortedIndices = projected
        .map((p, idx) => ({ idx, depth: p.depth }))
        .sort((a, b) => b.depth - a.depth);

      // Render 3D Spheres with specular highlight
      sortedIndices.forEach(({ idx }) => {
        const pr = projected[idx];
        const alpha = Math.max(0.2, Math.min(1, 1 - pr.depth / (cameraDist * 2.2)));

        ctx.save();
        ctx.beginPath();
        ctx.arc(pr.sx, pr.sy, Math.max(1, pr.size), 0, Math.PI * 2);
        ctx.fillStyle = pr.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = pr.color;
        ctx.shadowBlur = 10 * pr.scale;
        ctx.fill();

        // Specular highlight gleam on front-facing nodes
        if (pr.size > 3) {
          ctx.beginPath();
          ctx.arc(pr.sx - pr.size * 0.3, pr.sy - pr.size * 0.3, pr.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = alpha * 0.8;
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [mode, height]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950/70 backdrop-blur-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),inset_0_1.5px_1px_rgba(255,255,255,0.15)] ${className}`}
    >
      {/* Real-time 3D Canvas */}
      <canvas ref={canvasRef} className="w-full cursor-grab active:cursor-grabbing block" />

      {/* Hologram HUD Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 text-cyan-400 text-xs font-black shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>3D Quantum Holo-Core • Interactive Spatial Geometry</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 text-[10px] font-mono text-slate-300">
          <Eye className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Drag to orbit • 60 FPS</span>
        </div>
      </div>

      {/* Bottom Mode Switcher with Smooth Framer Motion pills */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/20 shadow-xl">
          <button
            onClick={() => setMode('atom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'atom'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Quantum Atom</span>
          </button>

          <button
            onClick={() => setMode('helix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'helix'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>DNA Helix</span>
          </button>

          <button
            onClick={() => setMode('lattice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'lattice'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Crystal Lattice</span>
          </button>

          <button
            onClick={() => setMode('wave')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'wave'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Wave Torus</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-cyan-300/80 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 hidden sm:block">
          Euler Matrix Projector
        </div>
      </div>
    </div>
  );
};

