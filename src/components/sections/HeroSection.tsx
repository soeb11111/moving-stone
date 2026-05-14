'use client';

import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';

export const HeroSection = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      
      player.ready().then(() => {
        player.setPlaybackRate(1.5).catch(() => {});
      });

      // Trigger dissolve transition when video actually starts playing
      player.on('play', () => {
        setIsLoaded(true);
      });
    }
  }, []);

  return (
    <section className="full-section overflow-hidden" style={{ background: '#000' }}>
      {/* Dissolve Transition Layer */}
      <div 
        className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out" 
        style={{ 
          pointerEvents: 'none', 
          background: '#000',
          opacity: isLoaded ? 1 : 0 
        }}
      >
        <iframe 
          ref={iframeRef}
          src="https://player.vimeo.com/video/902204578?background=1&title=0&byline=0&portrait=0&muted=1&autoplay=1&autopause=0&controls=0&dnt=1&loop=1&app_id=122963" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          style={{ 
            width: '100vw', 
            height: '56.25vw', 
            minHeight: '100vh', 
            minWidth: '177.77vh', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>

      {/* Static fallback/loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black z-0 flex items-center justify-center">
           {/* Subtle loading indicator or just black */}
        </div>
      )}
      
      <div className="relative z-10 w-full h-full">
        {/* Logo - Bottom Left */}
        <div className="absolute bottom-12 left-8 md:bottom-20 md:left-20">
          <img src="/images/logo.png" alt="Moving Stone" className="logo-hero" />
        </div>
      </div>
    </section>
  );
};
