'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "+312%", label: "Average Organic Traffic Growth" },
  { value: "-42%", label: "Reduction in Cost Per Acquisition (CPA)" },
  { value: "5.8x", label: "Average Return on Ad Spend (ROAS)" },
];

export const StatsSection = () => {
  return (
    <section className="section bg-dark text-light border-y border-border-dark">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="flex flex-col items-center justify-center p-6 border border-border-dark rounded-sm hover:border-accent-gold transition-colors duration-300"
            >
              <div className="display-md text-accent-gold font-serif mb-4" style={{ color: 'var(--accent-gold)' }}>
                {stat.value}
              </div>
              <p className="text-sm tracking-wider uppercase text-muted max-w-xs mx-auto" style={{ maxWidth: '200px' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
