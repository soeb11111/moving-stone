'use client';

import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  "Acme Corp", "GlobalTech", "Nexus", "Stark Ind", "Wayne Ent", "Cyberdyne"
];

export const LogoCloud = () => {
  return (
    <section className="py-12 border-b border-gray-200" style={{ padding: '3rem 0', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <p className="text-center text-xs text-muted uppercase tracking-widest mb-8" style={{ marginBottom: '2rem' }}>
          Trusted by Innovative Teams Worldwide
        </p>
        <div className="overflow-hidden relative">
          <div className="flex gap-12 items-center w-max" style={{ animation: 'marquee 30s linear infinite' }}>
            {/* Double the logos for seamless marquee effect */}
            {[...logos, ...logos, ...logos].map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <span className="font-serif text-xl font-bold text-gray-800" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
