import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for jsdom (used by Framer Motion's useInView)
if (typeof IntersectionObserver === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).IntersectionObserver = class IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '0px';
    readonly thresholds: ReadonlyArray<number> = [0];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  };
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
