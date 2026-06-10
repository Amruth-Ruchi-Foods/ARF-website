import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('defaults to glass variant', () => {
    render(<Card>Glass</Card>);
    expect(screen.getByText('Glass').parentElement ?? screen.getByText('Glass'))
      .toBeInTheDocument();
    const card = screen.getByText('Glass').closest('div')!;
    expect(card.className).toContain('glassmorphism');
  });

  it.each(['glass', 'solid', 'outlined'] as const)(
    'renders %s variant without error',
    (variant) => {
      render(<Card variant={variant}>Content</Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    }
  );

  it('glass variant applies glassmorphism class', () => {
    render(<Card variant="glass">Glass</Card>);
    const card = screen.getByText('Glass').closest('div')!;
    expect(card.className).toContain('glassmorphism');
  });

  it('solid variant applies dark background', () => {
    render(<Card variant="solid">Solid</Card>);
    const card = screen.getByText('Solid').closest('div')!;
    expect(card.className).toContain('bg-neutral-darkBg');
  });

  it('outlined variant applies border styling', () => {
    render(<Card variant="outlined">Outlined</Card>);
    const card = screen.getByText('Outlined').closest('div')!;
    expect(card.className).toContain('border-2');
    expect(card.className).toContain('border-[#2E7D32]');
  });

  it('merges custom className', () => {
    render(<Card className="my-custom">Content</Card>);
    const card = screen.getByText('Content').closest('div')!;
    expect(card.className).toContain('my-custom');
  });

  it('has rounded corners', () => {
    render(<Card>Rounded</Card>);
    const card = screen.getByText('Rounded').closest('div')!;
    expect(card.className).toContain('rounded-xl');
  });

  it('passes through HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
