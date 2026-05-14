import React from 'react';

export const DiscoverLines = () => {
  return (
    <section style={{ padding: '6rem var(--gutter)', background: '#111' }}>
      <h2 className="text-sm uppercase tracking-widest mb-8">Discover our lines</h2>
      <div className="grid grid-cols-1 grid-cols-sm-2 md:grid-cols-4 gap-4">
        <div style={{ aspectRatio: '1', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-opacity-80 transition-all">
          <span className="text-xs text-muted uppercase">Object</span>
        </div>
        <div style={{ aspectRatio: '1', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-opacity-80 transition-all">
          <span className="text-xs text-muted uppercase">Space</span>
        </div>
        <div style={{ aspectRatio: '1', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-opacity-80 transition-all">
          <span className="text-xs text-muted uppercase">Void</span>
        </div>
        <div style={{ aspectRatio: '1', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-opacity-80 transition-all">
          <span className="text-xs text-muted uppercase">Display</span>
        </div>
      </div>
    </section>
  );
};
