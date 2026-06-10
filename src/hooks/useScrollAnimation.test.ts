import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  constructor(cb: IntersectionCallback) {
    latestCallback = cb;
  }
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

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── Helper component ─────────────────────────────────────────────────────────
interface TestResult {
  isVisible: boolean;
}

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

function renderTestComponent(options?: UseScrollAnimationOptions) {
  const result: TestResult = { isVisible: false };
  const onResult = (r: TestResult) => { Object.assign(result, r); };

  const { unmount } = render(
    React.createElement(TestComponent, { options, onResult })
  );

  const triggerIntersection = (isIntersecting: boolean) => {
    act(() => {
      latestCallback?.([
        { isIntersecting, target: latestTarget ?? document.createElement('div') } as IntersectionObserverEntry,
      ]);
    });
  };

  return { result, unmount, triggerIntersection };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('useScrollAnimation', () => {
  it('starts with isVisible=false', () => {
    const { result } = renderTestComponent();
    expect(result.isVisible).toBe(false);
  });

  it('creates IntersectionObserver with default threshold 0.1', () => {
    // Spy on the constructor to capture options
    const constructorSpy = vi.fn();
    class SpyObserver extends MockIntersectionObserver {
      constructor(cb: IntersectionCallback, options?: IntersectionObserverInit) {
        super(cb);
        constructorSpy(options);
      }
    }
    vi.stubGlobal('IntersectionObserver', SpyObserver);

    renderTestComponent();
    expect(constructorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ threshold: 0.1 })
    );
  });

  it('creates IntersectionObserver with custom threshold', () => {
    const constructorSpy = vi.fn();
    class SpyObserver extends MockIntersectionObserver {
      constructor(cb: IntersectionCallback, options?: IntersectionObserverInit) {
        super(cb);
        constructorSpy(options);
      }
    }
    vi.stubGlobal('IntersectionObserver', SpyObserver);

    renderTestComponent({ threshold: 0.5 });
    expect(constructorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ threshold: 0.5 })
    );
  });

  it('sets isVisible=true when element enters viewport', () => {
    const { result, triggerIntersection } = renderTestComponent();
    triggerIntersection(true);
    expect(result.isVisible).toBe(true);
  });

  it('stays visible after leaving viewport when triggerOnce=true (default)', () => {
    const { result, triggerIntersection } = renderTestComponent({ triggerOnce: true });

    triggerIntersection(true);
    expect(result.isVisible).toBe(true);

    triggerIntersection(false);
    expect(result.isVisible).toBe(true);
  });

  it('resets to invisible when element leaves viewport with triggerOnce=false', () => {
    const { result, triggerIntersection } = renderTestComponent({ triggerOnce: false });

    triggerIntersection(true);
    expect(result.isVisible).toBe(true);

    triggerIntersection(false);
    expect(result.isVisible).toBe(false);
  });

  it('calls unobserve after first intersection when triggerOnce=true', () => {
    const { triggerIntersection } = renderTestComponent({ triggerOnce: true });
    triggerIntersection(true);
    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('does not call unobserve on intersection when triggerOnce=false', () => {
    const { triggerIntersection } = renderTestComponent({ triggerOnce: false });
    triggerIntersection(true);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it('accepts undefined options without throwing', () => {
    expect(() => renderTestComponent(undefined)).not.toThrow();
  });

  it('does not set isVisible when isIntersecting=false fires initially', () => {
    const { result, triggerIntersection } = renderTestComponent();
    triggerIntersection(false);
    expect(result.isVisible).toBe(false);
  });
});
