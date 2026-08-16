import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

/**
 * Fades and lifts its children into view once, the first time they intersect.
 * One observer per element, disconnected as soon as it fires.
 */
export default function Reveal({ children, className = '', delay = 0, as }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = (as ?? 'div') as ElementType;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.style.transitionDelay = `${delay}ms`;
          target.classList.add('is-in');
          observer.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
