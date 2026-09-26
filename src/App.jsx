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
    // Check URL parameters for custom name: ?name=HerName
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

  // Register the cosmic burst callback
  const handleBurstReady = useCallback((fn) => {
    setBurstFn(() => fn);
  }, []);

  // Central trigger function passed down to child components
  const triggerBurst = useCallback(
    (x, y, count, isGrand) => {
      if (burstFn) {
        burstFn(x, y, count, isGrand);
      }
    },
    [burstFn]
  );

  const handleUpdateName = (newName) => {
    setHerName(newName);
    // Update document title dynamically
    document.title = `${newName}'s Romantic Universe ✨`;
  };

  useEffect(() => {
    document.title = `${herName}'s Romantic Universe ✨`;
  }, [herName]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#06020c' }}>
      {/* 60fps Cosmic Particle & Canvas Engine */}
      <CosmicCanvas onBurstReady={handleBurstReady} />

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
          {/* Floating Music & Customizer Hub */}
          <FloatingControls herName={herName} onUpdateName={handleUpdateName} />

          <main style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            {/* 1. Dramatic Name Reveal & Hero Entrance */}
            <HeroSection herName={herName} triggerBurst={triggerBurst} />

            {/* 2. Interactive Core Pulsing Heart */}
            <InteractiveHeart herName={herName} triggerBurst={triggerBurst} />

            {/* 3. Cinematic Romantic Messages */}
            <RomanticMessages triggerBurst={triggerBurst} />

            {/* 4. Constellation Memory Timeline (Without Photos) */}
            <ConstellationTimeline triggerBurst={triggerBurst} />

            {/* 5. Reasons Why She Is My Universe */}
            <LoveReasons herName={herName} triggerBurst={triggerBurst} />

            {/* 6. Grand Climax Finale */}
            <FinalScene herName={herName} triggerBurst={triggerBurst} />
          </main>
        </>
      )}
    </div>
  );
}
