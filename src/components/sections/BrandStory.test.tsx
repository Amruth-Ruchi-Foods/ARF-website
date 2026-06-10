import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandStory } from './BrandStory';

describe('BrandStory', () => {
  it('renders the section with id="about"', () => {
    render(<BrandStory />);
    const section = document.getElementById('about');
    expect(section).toBeInTheDocument();
  });

  it('renders the section heading', () => {
    render(<BrandStory />);
    expect(
      screen.getByRole('heading', { name: /the arf story/i })
    ).toBeInTheDocument();
  });

  it('renders the brand mission text', () => {
    render(<BrandStory />);
    expect(screen.getByText(/amruth ruchi foods/i)).toBeInTheDocument();
    expect(screen.getByText(/pure, wholesome nutrition/i)).toBeInTheDocument();
  });

  it('renders all five timeline milestones', () => {
    render(<BrandStory />);
    expect(screen.getAllByText('2018').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2019').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2021').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2024').length).toBeGreaterThan(0);
  });

  it('renders all milestone titles', () => {
    render(<BrandStory />);
    expect(screen.getByText(/founded with a vision/i)).toBeInTheDocument();
    expect(screen.getByText(/first product launch/i)).toBeInTheDocument();
    expect(screen.getByText(/growing community/i)).toBeInTheDocument();
    expect(screen.getByText(/expanding range/i)).toBeInTheDocument();
    expect(screen.getByText(/pure nutrition mission/i)).toBeInTheDocument();
  });

  it('renders milestone descriptions', () => {
    render(<BrandStory />);
    expect(
      screen.getByText(/bring pure, natural foods to indian households/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/buttermilk mix/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000\+ happy customers/i)).toBeInTheDocument();
    expect(screen.getByText(/energy mixes and healthy snacks/i)).toBeInTheDocument();
    expect(screen.getByText(/zero artificial additives/i)).toBeInTheDocument();
  });

  it('renders the "Our Journey" label', () => {
    render(<BrandStory />);
    expect(screen.getByText(/our journey/i)).toBeInTheDocument();
  });
});
