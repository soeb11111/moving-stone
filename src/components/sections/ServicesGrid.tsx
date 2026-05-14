'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const services = [
  {
    title: "SEO",
    description: "AI-driven topic clustering, semantic optimization, and programmatic SEO to dominate search results.",
    icon: "↗"
  },
  {
    title: "Paid Media",
    description: "Predictive bidding algorithms and dynamic creative optimization for maximum ROAS across ad networks.",
    icon: "⚲"
  },
  {
    title: "AI Automation",
    description: "Custom LLM integrations to automate lead scoring, outreach, and customer support workflows.",
    icon: "⚡"
  },
  {
    title: "Content Marketing",
    description: "At-scale content generation balancing AI efficiency with editorial quality and human insight.",
    icon: "✎"
  },
  {
    title: "Conversion Rate Optimization",
    description: "Multivariate testing and behavioral AI analysis to turn more visitors into qualified leads.",
    icon: "↻"
  },
  {
    title: "Analytics & Attribution",
    description: "Unified data pipelines and predictive modeling to understand your true customer journey.",
    icon: "◱"
  }
];

export const ServicesGrid = () => {
  return (
    <section className="section bg-alt relative overflow-hidden">
      {/* Decorative background image */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ background: 'url(/images/services-bg.png) no-repeat center right', backgroundSize: 'cover' }}></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" style={{ marginBottom: '4rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="tag mb-4" style={{ marginBottom: '1rem' }}>Our Capabilities</span>
            <h2 className="display-sm">Comprehensive Marketing Intelligence</h2>
          </div>
          <div>
            <Button href="/services" variant="outline">View All Services</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              className="card p-8 flex flex-col h-full"
              style={{ padding: '2.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="text-3xl mb-6 text-accent-gold" style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                {service.icon}
              </div>
              <h3 className="text-xl mb-3" style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 500 }}>
                {service.title}
              </h3>
              <p className="text-muted text-sm flex-grow" style={{ marginBottom: '2rem' }}>
                {service.description}
              </p>
              <div className="mt-auto">
                <Button href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`} variant="ghost">Learn More</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
