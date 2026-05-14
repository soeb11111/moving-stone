import React from 'react';

export const HeroSection = () => {
  return (
    <section className="full-section" style={{ background: '#1a1a1a' }}>
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none', background: '#000' }}>
        <iframe 
          src="https://player.vimeo.com/video/902204578?background=1&title=0&byline=0&portrait=0&muted=1&autoplay=1&autopause=0&controls=0&dnt=1&loop=1&app_id=122963" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </div>
      
      <div className="relative z-10 flex justify-between items-end w-full">
        <div>
          <img src="/images/logo.png" alt="Moving Stone" style={{ height: '250px', width: 'auto' }} />
        </div>
        <div style={{ maxWidth: '300px', textAlign: 'right' }}>
          <p className="text-sm mb-4">an entire collection of items that fit into your life.</p>
          <button className="btn btn-outline">Explore</button>
        </div>
      </div>
    </section>
  );
};
