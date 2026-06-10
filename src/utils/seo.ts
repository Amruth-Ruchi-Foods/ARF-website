/**
 * SEO utility functions for generating meta tags and structured data
 * Validates: Requirements 8.1, 8.2
 */

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
}

export interface ProductStructuredData {
  name: string;
  description: string;
  image: string;
  brand: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(data: SEOData): Record<string, string> {
  const baseUrl = window.location.origin;
  const canonical = data.canonical || window.location.href;
  const image = data.image || `${baseUrl}/images/logo/ARF logo.png`;
  
  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:type': data.type || 'website',
    'og:url': canonical,
    'og:image': image,
    'og:site_name': 'ARF - Amruth Ruchi Foods',
    'twitter:card': 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': image,
    ...(data.keywords && { keywords: data.keywords.join(', ') }),
  };
}

/**
 * Generate Schema.org structured data for products
 */
export function generateProductStructuredData(product: ProductStructuredData): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: `https://schema.org/${product.offers.availability}`,
    },
    ...(product.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
      },
    }),
  };

  return JSON.stringify(structuredData);
}

/**
 * Generate Schema.org structured data for organization
 */
export function generateOrganizationStructuredData(): string {
  const baseUrl = window.location.origin;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ARF - Amruth Ruchi Foods',
    url: baseUrl,
    logo: `${baseUrl}/images/logo/ARF logo.png`,
    description: 'Pure, natural health food products including superfoods, energy mixes, herbal drinks, and healthy snacks',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@amruthruchi.com',
    },
    sameAs: [
      'https://instagram.com/amruthruchi',
      'https://facebook.com/amruthruchi',
    ],
  };

  return JSON.stringify(structuredData);
}

/**
 * Set page title with site name
 */
export function setPageTitle(title: string): void {
  document.title = `${title} | ARF - Amruth Ruchi Foods`;
}

/**
 * Update meta tag in document head
 */
export function updateMetaTag(property: string, content: string): void {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}
