import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options?: UseScrollAnimationOptions): {
  ref: RefObject<HTMLElement | null>;
  isVisible: boolean;
} {
  const { threshold = 0.1, triggerOnce = true } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce]);

  return { ref, isVisible };
}
