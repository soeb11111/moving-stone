'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Moving Stone didn't just bring us traffic; they brought us a scalable revenue engine powered by AI. Their approach to data-driven marketing is unparalleled.",
    author: "Sarah Jenkins",
    role: "CMO, GlobalTech",
    company: "GlobalTech"
  },
  {
    quote: "The predictive bidding algorithms deployed by their paid media team reduced our customer acquisition cost by nearly half in just one quarter.",
    author: "David Chen",
    role: "VP of Growth, FinTech Innovators",
    company: "FinTech Innovators"
  }
];

export const Testimonials = () => {
  return (
    <section className="section bg-bg-alt border-y border-border">
      <div className="container">
        <div className="text-center mb-16">
          <span className="tag mb-4" style={{ marginBottom: '1rem' }}>Client Feedback</span>
          <h2 className="display-sm font-serif">What Industry Leaders Say</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              className="p-10 bg-white border border-border shadow-sm relative"
              style={{ padding: '2.5rem', background: 'white' }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="text-6xl text-accent-gold font-serif absolute top-6 left-6 opacity-20" style={{ fontSize: '4rem', color: 'var(--accent-gold)', position: 'absolute', top: '1rem', left: '1rem', opacity: 0.2, lineHeight: 1 }}>
                &ldquo;
              </div>
              <p className="text-lg italic font-serif mb-8 relative z-10" style={{ marginBottom: '2rem', fontSize: '1.25rem', lineHeight: 1.6 }}>
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-serif text-lg text-gray-500" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eee' }}>
                  {test.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-wider">{test.author}</div>
                  <div className="text-xs text-muted mt-1">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
