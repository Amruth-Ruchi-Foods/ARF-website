import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstagramFeed } from './InstagramFeed';
import { instagramPosts } from '../../data/instagram';

describe('InstagramFeed', () => {
  it('renders the section with id="community"', () => {
    render(<InstagramFeed />);
    expect(document.getElementById('community')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(<InstagramFeed />);
    expect(
      screen.getByRole('heading', { name: /follow us on instagram/i })
    ).toBeInTheDocument();
  });

  it('renders a link for each Instagram post', () => {
    render(<InstagramFeed />);
    instagramPosts.forEach((post) => {
      const link = screen.getByRole('link', {
        name: new RegExp(post.caption.slice(0, 20), 'i'),
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', post.url);
    });
  });

  it('all post links open in a new tab', () => {
    render(<InstagramFeed />);
    instagramPosts.forEach((post) => {
      const link = screen.getByRole('link', {
        name: new RegExp(post.caption.slice(0, 20), 'i'),
      });
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('renders images with alt text for each post', () => {
    render(<InstagramFeed />);
    instagramPosts.forEach((post) => {
      expect(screen.getByAltText(post.caption)).toBeInTheDocument();
    });
  });

  it('renders the Instagram profile CTA link', () => {
    render(<InstagramFeed />);
    const profileLink = screen.getByRole('link', {
      name: /visit arf foods on instagram/i,
    });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', 'https://www.instagram.com/arffoods/');
  });

  it('renders 6 post items', () => {
    render(<InstagramFeed />);
    expect(instagramPosts).toHaveLength(6);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
  });
});
