'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

function SnapHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ velocity }: { velocity: number }) => {
      // If velocity is low, it means the user has released or is slowing down
      if (Math.abs(velocity) < 0.5 && Math.abs(velocity) > 0) {
        const sections = document.querySelectorAll('.full-section');
        const viewportHeight = window.innerHeight;

        let closestSection = null;
        let minDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top);

          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });

        // Instant magnetic pull if within range
        if (closestSection && minDistance < viewportHeight * 0.4 && minDistance > 5) {
          lenis.scrollTo(closestSection, {
            lerp: 0.15,
            duration: 0.5,
            force: true
          });
        }
      }
    };

    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{
      lerp: 0.12,
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
      infinite: false,
    }}>
      <SnapHandler />
      {children}
    </ReactLenis>
  );
}
