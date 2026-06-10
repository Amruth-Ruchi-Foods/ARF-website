import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCategories } from './ProductCategories';

function renderSection() {
  return render(<ProductCategories />);
}

describe('ProductCategories', () => {
  it('renders a section with id="categories"', () => {
    renderSection();
    expect(document.getElementById('categories')).toBeInTheDocument();
  });

  it('renders the "Our Categories" heading', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { name: /our categories/i })
    ).toBeInTheDocument();
  });

  it('renders all four category cards', () => {
    renderSection();
    expect(screen.getByText('Superfoods')).toBeInTheDocument();
    expect(screen.getByText('Energy Mixes')).toBeInTheDocument();
    expect(screen.getByText('Herbal Drinks')).toBeInTheDocument();
    expect(screen.getByText('Healthy Snacks')).toBeInTheDocument();
  });

  it('renders category icons', () => {
    renderSection();
    expect(screen.getByText('🌿')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🍵')).toBeInTheDocument();
    expect(screen.getByText('🥜')).toBeInTheDocument();
  });

  it('renders category descriptions', () => {
    renderSection();
    expect(screen.getByText(/nutrient-dense natural foods/i)).toBeInTheDocument();
    expect(screen.getByText(/natural fuel for your day/i)).toBeInTheDocument();
    expect(screen.getByText(/traditional ayurvedic blends/i)).toBeInTheDocument();
    expect(screen.getByText(/guilt-free wholesome bites/i)).toBeInTheDocument();
  });

  it('renders four clickable buttons', () => {
    renderSection();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('clicking a category card scrolls to #products section', () => {
    const scrollIntoViewMock = vi.fn();
    const productsEl = document.createElement('section');
    productsEl.id = 'products';
    productsEl.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(productsEl);

    renderSection();
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(productsEl);
  });

  it('each button has an accessible aria-label', () => {
    renderSection();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  it('renders the "Browse by Type" label', () => {
    renderSection();
    expect(screen.getByText(/browse by type/i)).toBeInTheDocument();
  });
});
