import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from './ProductCard';
import type { ProductCardProps } from './ProductCard';

const mockProps: ProductCardProps = {
  id: 'buttermilk-mix-001',
  name: 'Buttermilk Mix',
  description: 'A refreshing herbal buttermilk blend with digestive spices.',
  price: 249,
  image: '/images/products/buttermilk-mix.jpg',
  slug: 'buttermilk-mix',
  category: 'herbal-drinks',
  benefits: [
    {
      title: 'Digestive Health',
      description: 'Supports digestion.',
      icon: '🫁',
      category: 'digestive',
    },
  ],
};

function renderCard(props: Partial<ProductCardProps> = {}) {
  return render(
    <MemoryRouter>
      <ProductCard {...mockProps} {...props} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('renders product name', () => {
    renderCard();
    expect(screen.getByText('Buttermilk Mix')).toBeInTheDocument();
  });

  it('renders product description', () => {
    renderCard();
    expect(
      screen.getByText('A refreshing herbal buttermilk blend with digestive spices.')
    ).toBeInTheDocument();
  });

  it('renders price formatted as ₹XXX', () => {
    renderCard();
    expect(screen.getByText('₹249')).toBeInTheDocument();
  });

  it('renders product image with correct src and alt', () => {
    renderCard();
    const img = screen.getByRole('img', { name: 'Buttermilk Mix' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/products/buttermilk-mix.jpg');
    expect(img).toHaveAttribute('alt', 'Buttermilk Mix');
  });

  it('image has loading="lazy" attribute', () => {
    renderCard();
    const img = screen.getByRole('img', { name: 'Buttermilk Mix' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('links to the product detail page /products/:slug', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/buttermilk-mix');
  });

  it('clicking the card navigates to product detail page', async () => {
    const onClick = vi.fn();
    renderCard({ onClick });
    await userEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onHover when mouse enters the card', async () => {
    const onHover = vi.fn();
    renderCard({ onHover });
    const card = screen.getByRole('link').querySelector('div')!;
    await userEvent.hover(card);
    expect(onHover).toHaveBeenCalledTimes(1);
  });

  it('displays different prices correctly', () => {
    renderCard({ price: 399 });
    expect(screen.getByText('₹399')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderCard();
    expect(screen.getByText('herbal drinks')).toBeInTheDocument();
  });
});
