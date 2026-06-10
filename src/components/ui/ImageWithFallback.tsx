import { useState, useEffect, useRef } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  webpSrc?: string;
  style?: React.CSSProperties;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

/**
 * ImageWithFallback component with WebP support, lazy loading, and error handling
 * 
 * Features:
 * - WebP format with fallback to JPEG/PNG
 * - Lazy loading support with Intersection Observer
 * - Error handling with placeholder image
 * - Smooth fade-in animation
 * 
 * Validates: Requirements 7.2, 7.3, 15.1
 */
export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.png',
  lazy = true,
  webpSrc,
  style,
  onError,
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(lazy ? '' : webpSrc || src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const img = imgRef.current;
    if (!img) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(webpSrc || src);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Load images 50px before they enter viewport
      }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [lazy, webpSrc, src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      
      // Try fallback to regular format if WebP fails
      if (webpSrc && currentSrc === webpSrc) {
        setCurrentSrc(src);
      } else {
        // Use fallback placeholder
        setCurrentSrc(fallbackSrc);
        onError?.();
      }
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
    />
  );
}

export default ImageWithFallback;
