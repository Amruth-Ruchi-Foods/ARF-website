/**
 * Property-Based Tests for useScrollAnimation
 *
 * Property 6: Scroll-triggered animations
 * For any element with scroll animation configuration, when that element enters
 * the viewport, the animation should be triggered exactly once (or repeatedly
 * if configured).
 *
 * Validates: Requirements 4.2, 4.10
 */

import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import React, { useEffect } from 'react';
import { useScrollAnimation } from './useScrollAnimation';
import type { UseScrollAnimationOptions } from './useScrollAnimation';

// ─── IntersectionObserver mock ────────────────────────────────────────────────
type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

let latestCallback: IntersectionCallback | null = null;
let latestTarget: Element | null = null;
const mockUnobserve = vi.fn();
const mockObserve = vi.fn((el: Element) => { latestTarget = el; });

class MockIntersectionObserver {
  constructor(cb: IntersectionCallback) { latestCallback = cb; }
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = vi.fn();
}

beforeEach(() => {
  latestCallback = null;
  latestTarget = null;
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => { vi.unstubAllGlobals(); });

// ─── Helper ───────────────────────────────────────────────────────────────────
interface TestResult { isVisible: boolean }

function TestComponent({
  options,
  onResult,
}: {
  options?: UseScrollAnimationOptions;
  onResult: (r: TestResult) => void;
}) {
  const { ref, isVisible } = useScrollAnimation(options);
  useEffect(() => { onResult({ isVisible }); });
  return React.createElement('div', { ref });
}

function setup(options?: UseScrollAnimationOptions) {
  const result: TestResult = { isVisible: false };
  const { unmount } = render(
    React.createElement(TestComponent, { options, onResult: (r) => Object.assign(result, r) })
  );
  const trigger = (isIntersecting: boolean) =>
    act(() => {
      latestCallback?.([
        { isIntersecting, target: latestTarget ?? document.createElement('div') } as IntersectionObserverEntry,
      ]);
    });
  return { result, unmount, trigger };
}

// ─── Property Tests ───────────────────────────────────────────────────────────
describe('Property 6: Scroll-triggered animations (Validates: Requirements 4.2, 4.10)', () => {

  it('animation triggers exactly once on first viewport entry when triggerOnce=true', () => {
    // For any threshold value, entering the viewport sets isVisible=true exactly once
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (threshold) => {
          const { result, trigger, unmount } = setup({ threshold, triggerOnce: true });

          expect(result.isVisible).toBe(false);
          trigger(true);
          expect(result.isVisible).toBe(true);

          // Leaving and re-entering should NOT reset visibility (triggered once)
          trigger(false);
          expect(result.isVisible).toBe(true);
          trigger(true);
          expect(result.isVisible).toBe(true);

          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('animation re-triggers on every viewport entry when triggerOnce=false', () => {
    // For any threshold, visibility tracks intersection state when triggerOnce=false
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (threshold) => {
          const { result, trigger, unmount } = setup({ threshold, triggerOnce: false });

          expect(result.isVisible).toBe(false);
          trigger(true);
          expect(result.isVisible).toBe(true);

          trigger(false);
          expect(result.isVisible).toBe(false);

          trigger(true);
          expect(result.isVisible).toBe(true);

          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('animation starts hidden regardless of threshold configuration', () => {
    // For any valid threshold, initial state is always not visible
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.boolean(),
        (threshold, triggerOnce) => {
          const { result, unmount } = setup({ threshold, triggerOnce });
          const initiallyHidden = result.isVisible === false;
          unmount();
          return initiallyHidden;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('unobserve is called after first intersection when triggerOnce=true', () => {
    // For any threshold, the observer stops watching after first trigger
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (threshold) => {
          mockUnobserve.mockClear();
          const { trigger, unmount } = setup({ threshold, triggerOnce: true });

          trigger(true);
          const calledAfterTrigger = mockUnobserve.mock.calls.length > 0;
          unmount();
          return calledAfterTrigger;
        }
      ),
      { numRuns: 10 }
    );
  });
});
