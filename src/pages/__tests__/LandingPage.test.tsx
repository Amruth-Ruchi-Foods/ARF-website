import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  it('renders the hero headline', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: /pure nutrition from nature/i })
    ).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#home')).toBeInTheDocument();
  });

  it('renders the brand story section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('renders the featured products section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#products')).toBeInTheDocument();
  });

  it('renders the product categories section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#categories')).toBeInTheDocument();
  });

  it('renders the health benefits section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#benefits')).toBeInTheDocument();
  });

  it('renders featured product cards', () => {
    renderPage();
    expect(screen.getByText(/featured products/i)).toBeInTheDocument();
  });

  it('renders the testimonials section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#testimonials')).toBeInTheDocument();
  });

  it('renders the instagram/community section', () => {
    const { container } = renderPage();
    expect(container.querySelector('#community')).toBeInTheDocument();
  });

  it('renders sections in correct order per requirement 1.2', () => {
    const { container } = renderPage();
    const sections = container.querySelectorAll('section[id]');
    const ids = Array.from(sections).map((s) => s.getAttribute('id'));
    // Required order: hero, brand-story, products, categories, benefits, testimonials, community
    expect(ids.indexOf('home')).toBeLessThan(ids.indexOf('about'));
    expect(ids.indexOf('about')).toBeLessThan(ids.indexOf('products'));
    expect(ids.indexOf('products')).toBeLessThan(ids.indexOf('categories'));
    expect(ids.indexOf('categories')).toBeLessThan(ids.indexOf('benefits'));
    expect(ids.indexOf('benefits')).toBeLessThan(ids.indexOf('testimonials'));
    expect(ids.indexOf('testimonials')).toBeLessThan(ids.indexOf('community'));
  });
});
