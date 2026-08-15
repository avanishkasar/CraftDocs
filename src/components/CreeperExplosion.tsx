import React, { useState, useEffect } from 'react';

interface CreeperExplosionProps {
  active: boolean;
  onExploded: () => void;
  onCancel?: () => void;
}

export const CreeperExplosion: React.FC<CreeperExplosionProps> = ({
  active,
  onExploded,
}) => {
  const [phase, setPhase] = useState<'walk' | 'fuse' | 'boom' | 'done'>('walk');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!active) {
      setPhase('walk');
      setShake(false);
      return;
    }

    // Timeline:
    // 0s: Walk in from right
    // 1.2s: Stop & Fuse ("Sssssss..."), flash white/green
    // 2.8s: BOOM! Screen shake, particle explosion
    // 3.5s: Trigger callback to clear content, remove Creeper
    const timer1 = setTimeout(() => {
      setPhase('fuse');
    }, 1200);

    const timer2 = setTimeout(() => {
      setPhase('boom');
      setShake(true);
    }, 2800);

    const timer3 = setTimeout(() => {
      setShake(false);
      onExploded();
      setPhase('done');
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [active, onExploded]);

  if (!active || phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden transition-all ${
        shake ? 'animate-bounce ring-8 ring-red-600' : ''
      }`}
    >
      {/* Screen flash during explosion */}
      {phase === 'boom' && (
        <div className="absolute inset-0 bg-white/90 animate-ping z-40" />
      )}

      {/* Creeper Visual */}
      <div className="relative flex flex-col items-center">
        {/* Fuse Sound effect visual banner */}
        {phase === 'fuse' && (
          <div className="mb-2 bg-[#111] text-[#55FF55] border-2 border-[#55FF55] px-4 py-1 text-xs font-pixel animate-pulse shadow-[0_0_12px_#55FF55]">
            💥 Ssssssssssss... !
          </div>
        )}

        {/* Creeper Sprite */}
        <div
          className={`w-32 h-64 bg-[#3a963e] border-4 border-[#123e15] relative transition-transform duration-700 ${
            phase === 'walk' ? 'translate-y-0 animate-pulse' : ''
          } ${
            phase === 'fuse'
              ? 'scale-125 bg-white border-green-500 animate-ping'
              : ''
          } ${phase === 'boom' ? 'scale-150 opacity-0' : ''}`}
        >
          {/* Creeper Head */}
          <div className="w-full h-32 bg-[#43a047] relative border-b-4 border-[#123e15]">
            {/* Eyes */}
            <div className="absolute top-8 left-4 w-6 h-6 bg-[#0c1f0d]" />
            <div className="absolute top-8 right-4 w-6 h-6 bg-[#0c1f0d]" />
            {/* Mouth */}
            <div className="absolute top-14 left-10 w-12 h-10 bg-[#0c1f0d] flex flex-col items-center">
              <div className="w-6 h-4 bg-[#43a047] mt-3" />
            </div>
          </div>

          {/* Creeper Feet */}
          <div className="absolute bottom-0 w-full flex justify-between px-2">
            <div className="w-10 h-12 bg-[#2d7330] border-t-2 border-[#0c1f0d]" />
            <div className="w-10 h-12 bg-[#2d7330] border-t-2 border-[#0c1f0d]" />
          </div>
        </div>

        {/* Explosion Dust Cloud */}
        {phase === 'boom' && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="text-6xl font-pixel text-[#FF5555] tracking-widest animate-bounce drop-shadow-[0_0_20px_#000]">
              💥 BOOM!! 💥
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
