import { useEffect } from 'react';
import { generateMetaTags, setPageTitle, updateMetaTag, type SEOData } from '../../utils/seo';

interface SEOHeadProps extends SEOData {
  structuredData?: string;
}

/**
 * SEOHead component for managing page meta tags and structured data
 * 
 * Features:
 * - Sets page title
 * - Updates Open Graph and Twitter Card meta tags
 * - Injects Schema.org structured data
 * 
 * Validates: Requirements 8.1, 8.6
 */
export function SEOHead({
  title,
  description,
  canonical,
  image,
  type,
  keywords,
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    setPageTitle(title);

    // Generate and update meta tags
    const metaTags = generateMetaTags({
      title,
      description,
      canonical,
      image,
      type,
      keywords,
    });

    // Update description meta tag
    let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', description);

    // Update canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Update all meta tags
    Object.entries(metaTags).forEach(([property, content]) => {
      updateMetaTag(property, content);
    });

    // Inject structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = structuredData;
    }

    // Cleanup function
    return () => {
      // Optional: Remove structured data on unmount
      if (structuredData) {
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
          script.textContent = '';
        }
      }
    };
  }, [title, description, canonical, image, type, keywords, structuredData]);

  return null; // This component doesn't render anything
}

export default SEOHead;
