import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useEffect } from 'react';
import { useParallax } from './useParallax';
import type { UseParallaxOptions } from './useParallax';

// ─── Helper component ─────────────────────────────────────────────────────────
interface TestResult {
  transform: string;
}

function TestComponent({
  options,
  onResult,
}: {
  options?: UseParallaxOptions;
  onResult: (r: TestResult) => void;
}) {
  const { ref, transform } = useParallax(options);
  useEffect(() => { onResult({ transform }); });
  return React.createElement('div', { ref });
}

function renderTestComponent(options?: UseParallaxOptions) {
  const result: TestResult = { transform: '' };
  const onResult = (r: TestResult) => { Object.assign(result, r); };

  const { unmount } = render(
    React.createElement(TestComponent, { options, onResult })
  );

  const fireScroll = () => {
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  };

  return { result, unmount, fireScroll };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('useParallax', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect so element appears centered in viewport
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 400,
      height: 200,
      bottom: 600,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 400,
      toJSON: () => ({}),
    });
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a transform string on mount', () => {
    const { result } = renderTestComponent();
    expect(typeof result.transform).toBe('string');
    expect(result.transform).toMatch(/translate\(/);
  });

  it('produces vertical transform by default', () => {
    const { result } = renderTestComponent();
    // vertical: translate(0px, Xpx)
    expect(result.transform).toMatch(/^translate\(0px,\s*-?\d+(\.\d+)?px\)$/);
  });

  it('produces horizontal transform when direction is horizontal', () => {
    const { result } = renderTestComponent({ direction: 'horizontal' });
    // horizontal: translate(Xpx, 0px)
    expect(result.transform).toMatch(/^translate\(-?\d+(\.\d+)?px,\s*0px\)$/);
  });

  it('updates transform on scroll event', () => {
    const { result, fireScroll } = renderTestComponent();
    const initial = result.transform;
    // Change element position to simulate scroll
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      height: 200,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });
    fireScroll();
    // Transform should have changed since element position changed
    expect(result.transform).not.toBe(initial);
  });

  it('scales offset by speed option', () => {
    // Element center = 400 + 100 = 500, viewport center = 500 → offset = 0
    // Move element so offset is non-zero: top=0, height=200 → center=100, offset=(100-500)*speed
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      height: 200,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const { result: r1 } = renderTestComponent({ speed: 0.5 });
    const offset1 = parseFloat(r1.transform.match(/-?\d+(\.\d+)?/g)?.[1] ?? '0');

    const { result: r2 } = renderTestComponent({ speed: 1.0 });
    const offset2 = parseFloat(r2.transform.match(/-?\d+(\.\d+)?/g)?.[1] ?? '0');

    // Higher speed should produce larger offset magnitude
    expect(Math.abs(offset2)).toBeGreaterThan(Math.abs(offset1));
  });

  it('accepts undefined options without throwing', () => {
    expect(() => renderTestComponent(undefined)).not.toThrow();
  });
});
