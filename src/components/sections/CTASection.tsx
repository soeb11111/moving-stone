'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const CTASection = () => {
  return (
    <section className="section bg-dark text-light relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      {/* Abstract Background Element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[800px] h-[800px] border border-white/20 rounded-full absolute mix-blend-overlay" style={{ animation: 'rotateSlow 40s linear infinite' }}></div>
        <div className="w-[600px] h-[600px] border border-white/30 rounded-full absolute mix-blend-overlay" style={{ animation: 'rotateSlow 30s linear infinite reverse' }}></div>
      </div>

      <div className="container relative z-10 text-center max-w-3xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="tag tag-gold mb-6 inline-block" style={{ marginBottom: '1.5rem' }}>Ready to Scale?</span>
          <h2 className="display-md font-serif mb-6" style={{ marginBottom: '1.5rem' }}>Get a Free AI Marketing Audit</h2>
          <p className="text-xl text-muted mb-10 mx-auto max-w-2xl" style={{ marginBottom: '2.5rem', color: 'rgba(255,255,255,0.7)' }}>
            Discover untapped growth opportunities. Our experts will analyze your current performance and provide an actionable AI-driven strategy.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button href="/contact" variant="primary">Request Free Audit</Button>
            <Button href="/services" variant="outline-light">Explore Services</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
