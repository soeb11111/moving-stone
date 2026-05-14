'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const caseStudies = [
  {
    client: "FinTech Innovators",
    category: "AI Automation & SEO",
    title: "Scaling organic acquisition by 400% with programmatic content.",
    metrics: "+400% Traffic | 3x Lead Volume"
  },
  {
    client: "EcoRetail",
    category: "Paid Media & CRO",
    title: "Decreasing CPA while expanding into 3 new global markets.",
    metrics: "-42% CPA | +150% Revenue"
  }
];

export const CaseStudies = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16" style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
          <span className="tag mb-4" style={{ marginBottom: '1rem' }}>Success Stories</span>
          <h2 className="display-sm mb-6" style={{ marginBottom: '1.5rem' }}>Proven Results Across Industries</h2>
          <p className="text-muted text-lg">See how we've helped leading brands leverage AI marketing to achieve unprecedented growth and efficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {caseStudies.map((study, idx) => (
            <motion.div 
              key={idx}
              className="group relative overflow-hidden bg-bg-alt border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              {/* Placeholder image area */}
              <div className="w-full h-64 bg-gray-200 relative overflow-hidden" style={{ height: '300px', background: '#eee' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-xs text-accent-gold uppercase tracking-wider mb-2 block">{study.category}</span>
                  <h3 className="text-light font-serif text-2xl">{study.client}</h3>
                </div>
              </div>
              
              <div className="p-8" style={{ padding: '2rem' }}>
                <p className="text-lg font-medium mb-6" style={{ marginBottom: '1.5rem', lineHeight: 1.4 }}>{study.title}</p>
                <div className="flex justify-between items-center border-t border-border pt-6 mt-auto" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                  <span className="text-sm font-semibold text-accent">{study.metrics}</span>
                  <Button variant="ghost" href={`/case-studies/${study.client.toLowerCase().replace(/ /g, '-')}`}>Read Case Study</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
