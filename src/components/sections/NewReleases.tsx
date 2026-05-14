import React from 'react';

export const NewReleases = () => {
  return (
    <section style={{ padding: '0 var(--gutter) 6rem', background: '#111' }}>
      <h2 className="text-sm uppercase tracking-widest mb-8">New Releases</h2>
      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="cursor-pointer group">
          <div style={{ height: '500px', background: 'linear-gradient(180deg, #d4c2a5, #8c7f6b)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Mockup visual for "The Bezier 2024 Collection" */}
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff', textAlign: 'center' }}>
              <h3 className="display-sm mb-2 font-bold uppercase tracking-tighter" style={{ lineHeight: 1 }}>THE BÉZIER<br/>2024<br/>COLLECTION</h3>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm uppercase mb-1">The Bézier 2024 Collection</h3>
            <p className="text-xs text-muted max-w-md">a highly anticipated release featuring new forms and an entirely new shape language tailored to the modern lifestyle.</p>
          </div>
        </div>

        <div className="cursor-pointer group">
          <div style={{ height: '500px', background: '#222', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Mockup visual for "Introducing Plasma Celestial" */}
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#ff5500', boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}>
              <img src="/images/logo.png" alt="Moving Stone" style={{ height: '50px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm uppercase mb-1">Introducing Plasma Celestial</h3>
            <p className="text-xs text-muted max-w-md">a totally new material finish, designed to bring a warm touch to your home office setup.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
