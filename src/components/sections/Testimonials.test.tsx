import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Testimonials } from './Testimonials';
import { testimonials } from '../../data/testimonials';

describe('Testimonials', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the section with id="testimonials"', () => {
    render(<Testimonials />);
    expect(document.getElementById('testimonials')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(<Testimonials />);
    expect(screen.getByRole('heading', { name: /customer testimonials/i })).toBeInTheDocument();
  });

  it('displays the first testimonial text on mount', () => {
    render(<Testimonials />);
    expect(screen.getByText(testimonials[0].text)).toBeInTheDocument();
  });

  it('displays the first testimonial author', () => {
    render(<Testimonials />);
    expect(screen.getByText(testimonials[0].author)).toBeInTheDocument();
  });

  it('renders navigation arrows', () => {
    render(<Testimonials />);
    expect(screen.getByRole('button', { name: /previous testimonial/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next testimonial/i })).toBeInTheDocument();
  });

  it('renders dot indicators for each testimonial', () => {
    render(<Testimonials />);
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(testimonials.length);
  });

  it('advances to next testimonial when next button is clicked', async () => {
    render(<Testimonials />);
    const nextBtn = screen.getByRole('button', { name: /next testimonial/i });
    await act(async () => { fireEvent.click(nextBtn); });
    // Dot 2 should now be selected (index 1)
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('goes to previous testimonial when prev button is clicked', async () => {
    render(<Testimonials />);
    // Go to second first
    const nextBtn = screen.getByRole('button', { name: /next testimonial/i });
    await act(async () => { fireEvent.click(nextBtn); });
    const prevBtn = screen.getByRole('button', { name: /previous testimonial/i });
    await act(async () => { fireEvent.click(prevBtn); });
    // Should be back to first dot
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('auto-advances after 5 seconds', async () => {
    render(<Testimonials />);
    const dotsBefore = screen.getAllByRole('tab');
    expect(dotsBefore[0]).toHaveAttribute('aria-selected', 'true');
    await act(async () => { vi.advanceTimersByTime(5000); });
    const dotsAfter = screen.getAllByRole('tab');
    expect(dotsAfter[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('first dot is selected on mount', () => {
    render(<Testimonials />);
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates via dot click', async () => {
    render(<Testimonials />);
    const dots = screen.getAllByRole('tab');
    await act(async () => { fireEvent.click(dots[2]); });
    const updatedDots = screen.getAllByRole('tab');
    expect(updatedDots[2]).toHaveAttribute('aria-selected', 'true');
  });
});
