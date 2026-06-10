import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '../ProductDetailPage';
import { products } from '../../data/products';
import { CartProvider } from '../../context/CartContext';

function renderWithSlug(slug: string) {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[`/products/${slug}`]}>
        <Routes>
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
}

function renderNotFound() {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={['/products/nonexistent-product']}>
        <Routes>
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
}

describe('ProductDetailPage', () => {
  const product = products[0]; // Buttermilk Mix

  it('renders product name as heading', () => {
    renderWithSlug(product.slug);
    expect(
      screen.getByRole('heading', { name: product.name })
    ).toBeInTheDocument();
  });

  it('renders product description', () => {
    renderWithSlug(product.slug);
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderWithSlug(product.slug);
    expect(screen.getByText(`₹${product.price}`)).toBeInTheDocument();
  });

  it('renders product image with alt text', () => {
    renderWithSlug(product.slug);
    expect(screen.getByRole('img', { name: product.name })).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', () => {
    renderWithSlug(product.slug);
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    // product name appears in both breadcrumb and h1
    expect(screen.getAllByText(product.name).length).toBeGreaterThanOrEqual(1);
  });

  it('renders Add to Cart button', () => {
    renderWithSlug(product.slug);
    expect(
      screen.getByRole('button', { name: new RegExp(`add ${product.name} to cart`, 'i') })
    ).toBeInTheDocument();
  });

  it('Add to Cart button shows confirmation on click', () => {
    renderWithSlug(product.slug);
    const btn = screen.getByRole('button', { name: new RegExp(`add ${product.name} to cart`, 'i') });
    fireEvent.click(btn);
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });

  it('renders 404 state for unknown product', () => {
    renderNotFound();
    expect(
      screen.getByRole('heading', { name: /product not found/i })
    ).toBeInTheDocument();
  });

  it('renders for each product in the data', () => {
    products.forEach((p) => {
      const { unmount } = renderWithSlug(p.slug);
      expect(screen.getByRole('heading', { name: p.name })).toBeInTheDocument();
      unmount();
    });
  });
});
