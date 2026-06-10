import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  test('renders ARF logo', () => {
    render(<Footer />);
    expect(screen.getByText('ARF')).toBeInTheDocument();
  });

  test('renders brand tagline', () => {
    render(<Footer />);
    const taglineMatches = screen.getAllByText(/Amruth Ruchi Foods/i);
    expect(taglineMatches.length).toBeGreaterThan(0);
    expect(screen.getByText(/Pure Nutrition from Nature/i)).toBeInTheDocument();
  });

  test('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders social media icons with accessible labels', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Follow us on Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow us on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow us on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow us on YouTube')).toBeInTheDocument();
  });

  test('social media links open in new tab', () => {
    render(<Footer />);
    const instagramLink = screen.getByLabelText('Follow us on Instagram');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders newsletter signup form by default', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Newsletter signup')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  test('hides newsletter when showNewsletter is false', () => {
    render(<Footer showNewsletter={false} />);
    expect(screen.queryByLabelText('Newsletter signup')).not.toBeInTheDocument();
  });

  test('shows success message after valid newsletter submission', async () => {
    render(<Footer />);
    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument();
    });
  });

  test('shows error message for invalid email', async () => {
    render(<Footer />);
    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('clears email input after successful submission', async () => {
    render(<Footer />);
    const emailInput = screen.getByLabelText('Email address') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe('');
    });
  });

  test('renders copyright information', () => {
    render(<Footer />);
    expect(screen.getByText(/Amruth Ruchi Foods. All rights reserved/i)).toBeInTheDocument();
  });

  test('renders as footer element with contentinfo role', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('quick links trigger smooth scroll', () => {
    render(<Footer />);

    const mockElement = document.createElement('div');
    mockElement.id = 'products';
    document.body.appendChild(mockElement);

    const scrollIntoViewMock = vi.fn();
    mockElement.scrollIntoView = scrollIntoViewMock;

    // Find the Products link in the Quick Links section
    const productsLinks = screen.getAllByText('Products');
    fireEvent.click(productsLinks[0]);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    document.body.removeChild(mockElement);
  });
});
