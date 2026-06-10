import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    // Verify the Layout component renders with main element
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render the landing page by default', () => {
    render(<App />);
    // Verify landing page content is displayed
    expect(screen.getByText('ARF - Amruth Ruchi Foods')).toBeInTheDocument();
    expect(screen.getByText('Pure Nutrition from Nature')).toBeInTheDocument();
  });
});
