import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface UseParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export function useParallax(options?: UseParallaxOptions): {
  ref: RefObject<HTMLElement | null>;
  transform: string;
} {
  const { speed = 0.5, direction = 'vertical' } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState('translate(0px, 0px)');

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Distance from center of viewport to center of element
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const offset = (elementCenter - viewportCenter) * speed;

      if (direction === 'horizontal') {
        setTransform(`translate(${offset}px, 0px)`);
      } else {
        setTransform(`translate(0px, ${offset}px)`);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, transform };
}
