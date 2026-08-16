import { useEffect } from 'react';
import Hero from '../components/Hero';
import {
  Contact,
  Manifesto,
  Process,
  Services,
  Stats,
  Studio,
  Testimonials,
  Work,
} from '../components/Sections';

export default function Home() {
  useEffect(() => {
    document.title = "Moving Stone — Design agency for brands that won't budge";
  }, []);

  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Work />
      <Process />
      <Stats />
      <Testimonials />
      <Studio />
      <Contact />
    </>
  );
}
