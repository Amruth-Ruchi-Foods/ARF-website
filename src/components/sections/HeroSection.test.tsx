import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Framer Motion is mocked in the test setup; no router needed for this component.

describe('HeroSection', () => {
  it('renders the default headline', () => {
    render(<HeroSection />);
    expect(
      screen.getByRole('heading', { name: /pure nutrition from nature/i })
    ).toBeInTheDocument();
  });

  it('renders a custom headline when provided', () => {
    render(<HeroSection headline="Custom Headline" />);
    expect(
      screen.getByRole('heading', { name: /custom headline/i })
    ).toBeInTheDocument();
  });

  it('renders the CTA button with default text', () => {
    render(<HeroSection />);
    expect(
      screen.getByRole('button', { name: /explore products/i })
    ).toBeInTheDocument();
  });

  it('renders the CTA button with custom text', () => {
    render(<HeroSection ctaText="Shop Now" />);
    expect(
      screen.getByRole('button', { name: /shop now/i })
    ).toBeInTheDocument();
  });

  it('CTA link points to #products by default', () => {
    render(<HeroSection />);
    const link = screen.getByRole('link', { name: /explore products/i });
    expect(link).toHaveAttribute('href', '#products');
  });

  it('CTA link uses the provided ctaLink prop', () => {
    render(<HeroSection ctaLink="#shop" ctaText="Shop" />);
    const link = screen.getByRole('link', { name: /shop/i });
    expect(link).toHaveAttribute('href', '#shop');
  });

  it('renders the sub-headline text', () => {
    render(<HeroSection subheadline="Healthy food for everyone" />);
    expect(screen.getByText(/healthy food for everyone/i)).toBeInTheDocument();
  });
});
