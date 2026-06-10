/**
 * Script to generate sitemap.xml for SEO
 * Run with: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Import products to generate dynamic routes
const products = [
  { slug: 'buttermilk-mix', modified: '2024-01-15' },
  { slug: 'flax-mix-seeds', modified: '2024-01-15' },
  { slug: 'ghee-roasted-seeds', modified: '2024-01-15' },
  { slug: 'jumbo-kajur', modified: '2024-01-15' },
  { slug: 'khajur-seed-powder', modified: '2024-01-15' },
  { slug: 'pailwan-khajur', modified: '2024-01-15' },
];

const baseUrl = 'https://amruthruchi.com'; // Update with your actual domain

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const urls: SitemapUrl[] = [
  {
    loc: `${baseUrl}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
  },
];

// Add product pages
products.forEach((product) => {
  urls.push({
    loc: `${baseUrl}/products/${product.slug}`,
    lastmod: product.modified,
    changefreq: 'monthly',
    priority: 0.8,
  });
});

// Add other static pages if needed
const staticPages = [
  { path: '/checkout', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/track-order', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/admin', priority: 0.3, changefreq: 'yearly' as const },
];

staticPages.forEach((page) => {
  urls.push({
    loc: `${baseUrl}${page.path}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: page.changefreq,
    priority: page.priority,
  });
});

// Generate XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

// Write to public directory
const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`✓ Sitemap generated successfully at ${outputPath}`);
console.log(`  Total URLs: ${urls.length}`);
