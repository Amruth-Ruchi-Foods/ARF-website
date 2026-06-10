import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  test('renders the ARF logo', () => {
    render(<Navbar />);
    expect(screen.getByText('ARF')).toBeInTheDocument();
  });

  test('renders all navigation links on desktop', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('mobile menu button is present', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle mobile menu');
    expect(menuButton).toBeInTheDocument();
  });

  test('mobile menu opens when hamburger button is clicked', async () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Initially, mobile menu should not be visible
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('mobile menu closes when a link is clicked', async () => {
    render(<Navbar />);
    
    // Create a mock element for scrollIntoView
    const mockElement = document.createElement('div');
    mockElement.id = 'home';
    document.body.appendChild(mockElement);
    
    const menuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Open menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Click a navigation link
    const homeLinks = screen.getAllByText('Home');
    fireEvent.click(homeLinks[0]);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('smooth scroll is triggered when navigation link is clicked', () => {
    render(<Navbar />);
    
    // Create a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'products';
    document.body.appendChild(mockElement);
    
    const scrollIntoViewMock = vi.fn();
    mockElement.scrollIntoView = scrollIntoViewMock;
    
    // Click the Products link
    const productsLink = screen.getByText('Products');
    fireEvent.click(productsLink);
    
    // Verify scrollIntoView was called with smooth behavior
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('navbar background changes on scroll', async () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    
    // Initially should be transparent
    expect(nav?.className).toContain('bg-transparent');
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(nav?.className).toContain('bg-neutral-dark-bg/95');
    });
  });

  test('logo link scrolls to home section', () => {
    render(<Navbar />);
    
    // Create a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'home';
    document.body.appendChild(mockElement);
    
    const scrollIntoViewMock = vi.fn();
    mockElement.scrollIntoView = scrollIntoViewMock;
    
    // Click the logo
    const logo = screen.getByText('ARF');
    fireEvent.click(logo);
    
    // Verify scrollIntoView was called
    expect(scrollIntoViewMock).toHaveBeenCalled();
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('navbar has fixed positioning', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    
    expect(nav?.className).toContain('fixed');
    expect(nav?.className).toContain('top-0');
  });
});
