import React from 'react';

export const TrendingSection = () => {
  return (
    <section className="full-section" style={{ background: '#3a3a3a' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Placeholder for the orange Plasma Celestial box */}
        <div style={{ width: '300px', height: '400px', background: 'linear-gradient(135deg, #ff5500, #ffaa00)', borderRadius: '10px', transform: 'rotate(-10deg)', boxShadow: '20px 20px 60px rgba(0,0,0,0.5)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div className="text-xs uppercase bg-white text-black inline-block px-2 py-1 mb-2 self-start" style={{ padding: '2px 8px' }}>Plasma Celestial</div>
          <h3 className="text-4xl font-bold text-white mb-auto" style={{ fontSize: '2.5rem', lineHeight: 1 }}>Plasma<br/>Celestial</h3>
        </div>
      </div>
      
      <div className="relative z-10 flex justify-between items-end w-full">
        <div>
          <h2 className="text-sm uppercase tracking-widest mb-2">Trending</h2>
        </div>
        <div style={{ maxWidth: '300px', textAlign: 'right' }}>
          <p className="text-sm mb-4">an entire series of items with a unique super-hitting softer sound good for basics.</p>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-outline">Learn More</button>
            <button className="btn btn-light">Explore</button>
          </div>
        </div>
      </div>
    </section>
  );
};
