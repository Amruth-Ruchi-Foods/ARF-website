import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedProducts } from './FeaturedProducts';
import { getFeaturedProducts } from '../../data/products';

function renderSection() {
  return render(
    <MemoryRouter>
      <FeaturedProducts />
    </MemoryRouter>
  );
}

describe('FeaturedProducts', () => {
  it('renders a section with id="products"', () => {
    renderSection();
    expect(document.getElementById('products')).toBeInTheDocument();
  });

  it('renders the "Featured Products" heading', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { name: /featured products/i })
    ).toBeInTheDocument();
  });

  it('renders a card for each featured product', () => {
    renderSection();
    const featured = getFeaturedProducts();
    featured.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('renders product prices', () => {
    renderSection();
    const featured = getFeaturedProducts();
    featured.forEach((product) => {
      expect(screen.getByText(`₹${product.price}`)).toBeInTheDocument();
    });
  });

  it('renders product images with alt text', () => {
    renderSection();
    const featured = getFeaturedProducts();
    featured.forEach((product) => {
      expect(screen.getByRole('img', { name: product.name })).toBeInTheDocument();
    });
  });

  it('each product card links to the product detail page', () => {
    renderSection();
    const featured = getFeaturedProducts();
    const links = screen.getAllByRole('link');
    featured.forEach((product) => {
      const link = links.find((l) => l.getAttribute('href') === `/products/${product.slug}`);
      expect(link).toBeDefined();
    });
  });

  it('renders the "Our Products" label', () => {
    renderSection();
    expect(screen.getByText(/our products/i)).toBeInTheDocument();
  });
});
