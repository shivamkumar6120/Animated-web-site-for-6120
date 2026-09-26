import React, { useState, useEffect, useCallback } from 'react';
import { CONFIG } from './config';
import CosmicCanvas from './components/CosmicCanvas';
import TapToBeginModal from './components/TapToBeginModal';
import HeroSection from './components/HeroSection';
import InteractiveHeart from './components/InteractiveHeart';
import RomanticMessages from './components/RomanticMessages';
import ConstellationTimeline from './components/ConstellationTimeline';
import LoveReasons from './components/LoveReasons';
import FinalScene from './components/FinalScene';
import FloatingControls from './components/FloatingControls';

export default function App() {
  const [herName, setHerName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      if (nameParam && nameParam.trim()) {
        return nameParam.trim();
      }
    }
    return CONFIG.herName;
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [burstFn, setBurstFn] = useState(null);
  const [vortexFn, setVortexFn] = useState(null);

  const handleBurstReady = useCallback((fn) => {
    setBurstFn(() => fn);
  }, []);

  const handleVortexReady = useCallback((fn) => {
    setVortexFn(() => fn);
  }, []);

  const triggerBurst = useCallback(
    (x, y, count, isGrand) => {
      if (burstFn) {
        burstFn(x, y, count, isGrand);
      }
    },
    [burstFn]
  );

  const triggerVortex = useCallback(
    (x, y) => {
      if (vortexFn) {
        vortexFn(x, y);
      }
    },
    [vortexFn]
  );

  useEffect(() => {
    document.title = `${herName}'s Romantic Universe ✨`;
  }, [herName]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#06020c' }}>
      {/* 60fps Cosmic Particle & Aurora Canvas Engine */}
      <CosmicCanvas onBurstReady={handleBurstReady} onVortexReady={handleVortexReady} />

      {/* Opening "Tap to Begin" Screen */}
      {!hasEntered && (
        <TapToBeginModal
          herName={herName}
          onEnter={() => setHasEntered(true)}
        />
      )}

      {/* Main Cinematic Universe */}
      {hasEntered && (
        <>
          {/* Floating Audio Control */}
          <FloatingControls />

          <main style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            {/* 1. Dramatic Particle Name Reveal & Hero Entrance */}
            <HeroSection herName={herName} triggerBurst={triggerBurst} />

            {/* 2. Interactive Core Pulsing Heart */}
            <InteractiveHeart herName={herName} triggerBurst={triggerBurst} />

            {/* 3. Cinematic Romantic Messages */}
            <RomanticMessages triggerBurst={triggerBurst} />

            {/* 4. Heart-Shaped Constellation & Memory Timeline */}
            <ConstellationTimeline triggerBurst={triggerBurst} />

            {/* 5. Reasons Why She Is My Universe */}
            <LoveReasons herName={herName} triggerBurst={triggerBurst} />

            {/* 6. Grand Climax Finale with Cosmic Vortex */}
            <FinalScene herName={herName} triggerBurst={triggerBurst} triggerVortex={triggerVortex} />
          </main>
        </>
      )}
    </div>
  );
}
