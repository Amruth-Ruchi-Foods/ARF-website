import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthBenefits } from './HealthBenefits';

function renderSection() {
  return render(<HealthBenefits />);
}

describe('HealthBenefits', () => {
  it('renders a section with id="benefits"', () => {
    renderSection();
    expect(document.getElementById('benefits')).toBeInTheDocument();
  });

  it('renders the "Why Choose ARF?" heading', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { name: /why choose arf\?/i })
    ).toBeInTheDocument();
  });

  it('renders all four benefit cards', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /heart health/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /immunity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /digestive health/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /natural energy/i })).toBeInTheDocument();
  });

  it('renders an icon for each benefit (requirement 10.6)', () => {
    renderSection();
    // Each icon span has role="img" with aria-label matching the benefit title
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(4);
  });

  it('renders Heart Health icon ❤️', () => {
    renderSection();
    expect(screen.getByText('❤️')).toBeInTheDocument();
  });

  it('renders Immunity icon 🛡️', () => {
    renderSection();
    expect(screen.getByText('🛡️')).toBeInTheDocument();
  });

  it('renders Digestive Health icon 🌿', () => {
    renderSection();
    expect(screen.getByText('🌿')).toBeInTheDocument();
  });

  it('renders Natural Energy icon ⚡', () => {
    renderSection();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('renders Heart Health description', () => {
    renderSection();
    expect(
      screen.getByText(/omega-3 rich ingredients support cardiovascular health/i)
    ).toBeInTheDocument();
  });

  it('renders Immunity description', () => {
    renderSection();
    expect(
      screen.getByText(/natural antioxidants and vitamins strengthen your immune system/i)
    ).toBeInTheDocument();
  });

  it('renders Digestive Health description', () => {
    renderSection();
    expect(
      screen.getByText(/probiotic-rich foods and digestive spices for gut wellness/i)
    ).toBeInTheDocument();
  });

  it('renders Natural Energy description', () => {
    renderSection();
    expect(
      screen.getByText(/sustained energy from whole foods without artificial stimulants/i)
    ).toBeInTheDocument();
  });

  it('renders the "Wellness First" label', () => {
    renderSection();
    expect(screen.getByText(/wellness first/i)).toBeInTheDocument();
  });

  it('each benefit card has an accessible aria-label', () => {
    renderSection();
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(4);
    articles.forEach((article) => {
      expect(article).toHaveAttribute('aria-label');
    });
  });
});
