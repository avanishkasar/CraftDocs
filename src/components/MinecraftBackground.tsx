import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types/editor';

interface MinecraftBackgroundProps {
  theme: ThemeMode;
}

export const MinecraftBackground: React.FC<MinecraftBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system (drifting voxel particles / stars / embers)
    const particleCount = theme === 'night' ? 65 : 40;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.floor(Math.random() * 4) + 2,
      speedX: (Math.random() - 0.5) * 0.4 + (theme === 'night' ? -0.1 : 0.2),
      speedY: Math.random() * -0.5 - 0.2,
      color:
        theme === 'night'
          ? Math.random() > 0.4
            ? '#c042da'
            : '#00ffff'
          : Math.random() > 0.5
          ? '#ffffff'
          : '#FFD700',
      opacity: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Cloud layers for pixel voxel parallax
    let cloudOffset1 = 0;
    let cloudOffset2 = 120;
    let cloudOffset3 = 300;

    let tick = 0;

    const render = () => {
      tick++;
      cloudOffset1 = (cloudOffset1 + 0.3) % (width + 400);
      cloudOffset2 = (cloudOffset2 + 0.18) % (width + 500);
      cloudOffset3 = (cloudOffset3 + 0.08) % (width + 600);

      // Sky Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (theme === 'night') {
        skyGradient.addColorStop(0, '#0a0a1a');
        skyGradient.addColorStop(0.5, '#12122b');
        skyGradient.addColorStop(1, '#1b1233');
      } else {
        skyGradient.addColorStop(0, '#4a90e2');
        skyGradient.addColorStop(0.4, '#70a8e8');
        skyGradient.addColorStop(0.8, '#a6c8e0');
        skyGradient.addColorStop(1, '#c2e0bb');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Sun / Moon (Pixel Square)
      const celestialSize = 56;
      const celestialX = width * 0.78;
      const celestialY = height * 0.16 + Math.sin(tick * 0.01) * 6;

      ctx.save();
      if (theme === 'night') {
        // Pixel Moon
        ctx.fillStyle = '#f5f5f5';
        ctx.shadowColor = '#c042da';
        ctx.shadowBlur = 18;
        ctx.fillRect(celestialX, celestialY, celestialSize, celestialSize);

        // Moon Craters (Minecraft blocky pattern)
        ctx.fillStyle = '#d0d0d8';
        ctx.shadowBlur = 0;
        ctx.fillRect(celestialX + 8, celestialY + 8, 12, 12);
        ctx.fillRect(celestialX + 28, celestialY + 16, 16, 16);
        ctx.fillRect(celestialX + 12, celestialY + 32, 14, 14);
      } else {
        // Pixel Sun
        ctx.fillStyle = '#FFF275';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 24;
        ctx.fillRect(celestialX, celestialY, celestialSize, celestialSize);

        // Sun Core
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        ctx.fillRect(celestialX + 10, celestialY + 10, 36, 36);
      }
      ctx.restore();

      // Draw Voxel Clouds (3 distinct parallax layers with pixel steps)
      const drawVoxelCloud = (
        x: number,
        y: number,
        w: number,
        h: number,
        fillColor: string,
        shadowColor: string
      ) => {
        ctx.fillStyle = shadowColor;
        ctx.fillRect(x, y + 4, w, h);
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, w, h - 4);
      };

      const cloudFill = theme === 'night' ? 'rgba(45, 40, 75, 0.45)' : 'rgba(255, 255, 255, 0.75)';
      const cloudShadow = theme === 'night' ? 'rgba(20, 15, 45, 0.5)' : 'rgba(215, 225, 235, 0.8)';

      // Far clouds
      for (let i = -1; i < 3; i++) {
        const cx = i * 420 + (width - cloudOffset3);
        drawVoxelCloud(cx, height * 0.12, 280, 48, cloudFill, cloudShadow);
        drawVoxelCloud(cx + 60, height * 0.12 - 16, 160, 24, cloudFill, cloudShadow);
      }

      // Mid clouds
      for (let i = -1; i < 3; i++) {
        const cx = i * 380 + (width - cloudOffset2);
        drawVoxelCloud(cx, height * 0.24, 220, 40, cloudFill, cloudShadow);
        drawVoxelCloud(cx + 40, height * 0.24 - 12, 120, 20, cloudFill, cloudShadow);
      }

      // Near clouds
      for (let i = -1; i < 3; i++) {
        const cx = i * 340 + (width - cloudOffset1);
        drawVoxelCloud(cx, height * 0.38, 200, 36, cloudFill, cloudShadow);
      }

      // Floating particles & embers / stars
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.05;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // Distant Voxel Mountains (Silhouette)
      const mountainColor = theme === 'night' ? '#14142a' : '#5b7e56';
      ctx.fillStyle = mountainColor;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.72);

      const step = 48;
      for (let x = 0; x <= width + step; x += step) {
        const noise = Math.sin(x * 0.003 + 1.2) * 60 + Math.cos(x * 0.008) * 30;
        const my = height * 0.78 + noise;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Foreground Voxel Grass / Dirt Hill
      const hillGrassColor = theme === 'night' ? '#201a35' : '#4d7c2a';
      const hillDirtColor = theme === 'night' ? '#110f1e' : '#3d2817';

      ctx.fillStyle = hillDirtColor;
      ctx.fillRect(0, height * 0.88, width, height * 0.12);

      ctx.fillStyle = hillGrassColor;
      for (let x = 0; x < width; x += 16) {
        const blockHeight = 16 + (Math.floor(Math.sin(x * 0.02) * 2) * 8);
        ctx.fillRect(x, height * 0.88 - blockHeight, 16, blockHeight);
        // Grass top highlight
        ctx.fillStyle = theme === 'night' ? '#382e5c' : '#68a339';
        ctx.fillRect(x, height * 0.88 - blockHeight, 16, 4);
        ctx.fillStyle = hillGrassColor;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle vignette scanlines overlay for retro Minecraft atmosphere */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/40 pointer-events-none" />
    </div>
  );
};
