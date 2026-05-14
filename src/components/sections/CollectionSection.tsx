'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const CollectionSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress within this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect: Start slightly lower and move up to center to avoid hard seams
  const yPos = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="full-section overflow-hidden relative" style={{ background: '#7e6ba8' }}>
      
      {/* 3D Anamorphic Image Container */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        <motion.div 
          style={{ 
            y: yPos, 
            scale: scale,
            opacity: opacity,
            width: '100%', 
            height: '130%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <img 
            src="/images/spectra.png" 
            alt="Spectra Device" 
            style={{ 
              width: '100%',
              height: '100%', 
              objectFit: 'cover'
            }} 
          />
        </motion.div>
      </div>
      
      <div className="relative z-10 flex justify-between items-end w-full">
        <div>
          <h2 className="text-sm uppercase tracking-widest mb-2 text-white">2024 Collection</h2>
          <h2 className="text-sm uppercase tracking-widest text-white/50">2024 Collection</h2>
        </div>
        <div style={{ maxWidth: '300px', textAlign: 'right' }}>
          <p className="text-sm mb-4 text-white">an entire collection of items that fit into your life.</p>
          <button className="btn btn-light">Explore</button>
        </div>
      </div>
    </section>
  );
};
