import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('defaults to primary variant and md size', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-[#2E7D32]');
    expect(btn.className).toContain('min-h-[44px]');
  });

  it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
    'renders %s variant without error',
    (variant) => {
      render(<Button variant={variant}>Btn</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    }
  );

  it.each(['sm', 'md', 'lg'] as const)('renders %s size without error', (size) => {
    render(<Button size={size}>Btn</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('sm size has min-h-[36px]', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('min-h-[36px]');
  });

  it('lg size has min-h-[52px]', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toContain('min-h-[52px]');
  });

  it('md size meets 44px touch target requirement', () => {
    render(<Button size="md">Touch</Button>);
    expect(screen.getByRole('button').className).toContain('min-h-[44px]');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Btn</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('outline variant has border styling', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button').className).toContain('border-2');
  });

  it('ghost variant uses transparent background', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('bg-transparent');
  });
});
