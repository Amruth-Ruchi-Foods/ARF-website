import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout Component', () => {
  it('should render children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render main element for page content', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );
    
    // Verify main element exists (requirement 5.1 - navigation bar presence on all pages)
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent('Page Content');
  });

  it('should have minimum height of full viewport', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass('min-h-screen');
  });
});
