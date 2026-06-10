# Design Document: ARF Website

## Overview

The ARF (Amruth Ruchi Foods) website is a modern, React-based web application that combines natural aesthetics with futuristic design elements to showcase healthy food products. The architecture follows a component-based approach using React for UI composition, Tailwind CSS for styling, Framer Motion for animations, and optionally Three.js for 3D product visualizations.

The design emphasizes performance, accessibility, and user engagement through smooth animations, responsive layouts, and interactive product displays. The website will be deployed as a static site on Netlify or Vercel, leveraging CDN capabilities for optimal performance.

### Design Philosophy

The design balances three core principles:
1. **Natural Aesthetics**: Organic colors, flowing animations, and nature-inspired visual elements
2. **Modern Technology**: Cutting-edge web technologies, smooth interactions, and 3D visualizations
3. **Performance First**: Fast load times, optimized assets, and progressive enhancement

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Pages      │  │  Components  │  │   Hooks     │ │  │
│  │  │  - Landing   │  │  - Hero      │  │  - useScroll│ │  │
│  │  │  - Product   │  │  - ProductCard│  │  - use3D   │ │  │
│  │  │    Detail    │  │  - Navbar    │  │  - useAnim  │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Context    │  │   Utils      │  │   Assets    │ │  │
│  │  │  - Theme     │  │  - Analytics │  │  - Images   │ │  │
│  │  │  - Cart      │  │  - SEO       │  │  - Fonts    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN (Netlify/Vercel)                      │
│  - Static Assets (Images, Fonts, JS bundles)                │
│  - Edge Caching                                              │
│  - Automatic Compression                                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ (with hooks and functional components)
- **Styling**: Tailwind CSS 3+ (utility-first CSS framework)
- **Animation**: Framer Motion (declarative animations and gestures)
- **3D Graphics**: Three.js + React Three Fiber (optional, for 3D product views)
- **Routing**: React Router v6 (client-side routing)
- **Build Tool**: Vite (fast development and optimized production builds)
- **Deployment**: Netlify or Vercel (static site hosting with CDN)
- **Analytics**: Google Analytics 4 or Plausible (privacy-focused alternative)

### Folder Structure

```
arf-website/
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── icons/
│   │   └── backgrounds/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── BrandStory.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── BenefitsSection.jsx
│   │   │   ├── ProductCategories.jsx
│   │   │   ├── HealthBenefits.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── InstagramFeed.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Product3DView.jsx
│   │   │   ├── IngredientsShowcase.jsx
│   │   │   └── NutritionTable.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Carousel.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ProductDetailPage.jsx
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   ├── useParallax.js
│   │   ├── use3DRotation.js
│   │   └── useAnalytics.js
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   └── CartContext.jsx
│   ├── utils/
│   │   ├── analytics.js
│   │   ├── seo.js
│   │   └── imageOptimization.js
│   ├── data/
│   │   ├── products.js
│   │   └── testimonials.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Components and Interfaces

### Core Components

#### 1. Layout Components

**Navbar Component**
```typescript
interface NavbarProps {
  transparent?: boolean;
  sticky?: boolean;
}

// Features:
// - Sticky positioning with scroll detection
// - Smooth scroll to sections
// - Mobile hamburger menu
// - Logo and navigation links
// - Transparent background that becomes solid on scroll
```

**Footer Component**
```typescript
interface FooterProps {
  showNewsletter?: boolean;
}

// Features:
// - Logo and brand tagline
// - Quick links to sections
// - Social media icons
// - Newsletter signup form
// - Copyright information
```

#### 2. Section Components

**HeroSection Component**
```typescript
interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

// Features:
// - Full viewport height
// - 3D floating products (using Three.js)
// - Animated leaves/seeds background
// - Parallax scrolling effect
// - Call-to-action button
```

**ProductCard Component**
```typescript
interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  benefits: string[];
  onHover?: () => void;
  onClick?: () => void;
}

// Features:
// - Glassmorphism styling
// - Hover zoom effect (scale 1.1)
// - Glow effect on hover
// - Smooth transitions
// - Lazy-loaded images
```

**Product3DView Component**
```typescript
interface Product3DViewProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableControls?: boolean;
}

// Features:
// - Three.js canvas integration
// - Orbital controls for user interaction
// - Auto-rotation option
// - Lighting setup for realistic rendering
// - Fallback to 2D image on error
```

**IngredientsShowcase Component**
```typescript
interface Ingredient {
  name: string;
  description: string;
  icon: string;
  benefits: string[];
}

interface IngredientsShowcaseProps {
  ingredients: Ingredient[];
  layout: 'circular' | 'grid';
}

// Features:
// - Circular card layout
// - Floating animation on mount
// - Expand on hover to show details
// - Staggered animation timing
```

**Testimonials Component**
```typescript
interface Testimonial {
  id: string;
  author: string;
  photo?: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
}

// Features:
// - Carousel with smooth transitions
// - Auto-advance every 5 seconds
// - Manual navigation (arrows and dots)
// - Pause on hover
// - Swipe gestures on mobile
```

#### 3. Page Components

**LandingPage Component**
```typescript
// Composition of all section components
// Features:
// - Scroll progress indicator
// - Intersection observer for section animations
// - Smooth scrolling between sections
// - SEO meta tags
```

**ProductDetailPage Component**
```typescript
interface ProductDetailPageProps {
  productId: string;
}

// Features:
// - Split layout (image left, details right)
// - 3D product view
// - Ingredients showcase
// - Nutrition table
// - Usage instructions
// - Add to cart functionality
// - Related products section
// - Breadcrumb navigation
```

### Custom Hooks

**useScrollAnimation Hook**
```typescript
interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

function useScrollAnimation(options?: UseScrollAnimationOptions): {
  ref: RefObject<HTMLElement>;
  isVisible: boolean;
}

// Purpose: Trigger animations when elements enter viewport
// Uses Intersection Observer API
```

**useParallax Hook**
```typescript
interface UseParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

function useParallax(options?: UseParallaxOptions): {
  ref: RefObject<HTMLElement>;
  transform: string;
}

// Purpose: Create parallax scrolling effects
// Calculates transform based on scroll position
```

**use3DRotation Hook**
```typescript
interface Use3DRotationOptions {
  autoRotate?: boolean;
  speed?: number;
}

function use3DRotation(options?: Use3DRotationOptions): {
  rotation: [number, number, number];
  onPointerMove: (event: PointerEvent) => void;
}

// Purpose: Handle 3D model rotation
// Supports both auto-rotation and user interaction
```

**useAnalytics Hook**
```typescript
function useAnalytics(): {
  trackPageView: (pageName: string) => void;
  trackEvent: (eventName: string, properties?: object) => void;
  trackClick: (elementName: string) => void;
  trackScrollDepth: (depth: number) => void;
}

// Purpose: Centralized analytics tracking
// Integrates with Google Analytics or alternative
```

## Data Models

### Product Model

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  category: ProductCategory;
  images: {
    thumbnail: string;
    main: string;
    gallery: string[];
    model3D?: string;
  };
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  benefits: HealthBenefit[];
  usage: UsageInstruction[];
  inStock: boolean;
  featured: boolean;
  seo: SEOMetadata;
}

type ProductCategory = 
  | 'superfoods' 
  | 'energy-mixes' 
  | 'herbal-drinks' 
  | 'healthy-snacks';

interface Ingredient {
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  percentage?: number;
}

interface NutritionInfo {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  nutrients: {
    name: string;
    amount: string;
    dailyValue?: string;
  }[];
}

interface HealthBenefit {
  title: string;
  description: string;
  icon: string;
  category: 'heart' | 'immunity' | 'digestive' | 'energy';
}

interface UsageInstruction {
  step: number;
  instruction: string;
  image?: string;
}

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  structuredData: object;
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: {
      green: '#2E7D32';
      lightGreen: '#8BC34A';
      orange: '#FF9800';
    };
    neutral: {
      cream: '#F5F5F5';
      darkBg: '#0F172A';
    };
    accent: {
      glow: '#7CFFB2';
    };
  };
  fonts: {
    heading: 'Poppins, Montserrat, sans-serif';
    body: 'Inter, sans-serif';
    natural: 'Playfair Display, serif';
  };
  breakpoints: {
    mobile: '320px';
    tablet: '768px';
    desktop: '1024px';
    wide: '1440px';
  };
  animations: {
    duration: {
      fast: '200ms';
      normal: '300ms';
      slow: '500ms';
    };
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)';
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    };
  };
}
```

### Animation Configuration

```typescript
interface AnimationConfig {
  fadeIn: {
    initial: { opacity: 0, y: 20 };
    animate: { opacity: 1, y: 0 };
    transition: { duration: 0.5 };
  };
  slideIn: {
    initial: { opacity: 0, x: -50 };
    animate: { opacity: 1, x: 0 };
    transition: { duration: 0.5 };
  };
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 };
    animate: { opacity: 1, scale: 1 };
    transition: { duration: 0.5 };
  };
  float: {
    animate: {
      y: [-10, 10, -10];
    };
    transition: {
      duration: 3;
      repeat: Infinity;
      ease: 'easeInOut';
    };
  };
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(124, 255, 178, 0.6)';
      scale: 1.05;
    };
    transition: { duration: 0.3 };
  };
}
```

## Performance Optimization Strategy

### Image Optimization

1. **Format Selection**
   - Use WebP format with JPEG/PNG fallbacks
   - Implement AVIF for modern browsers
   - SVG for icons and simple graphics

2. **Responsive Images**
   ```typescript
   interface ResponsiveImageProps {
     src: string;
     alt: string;
     sizes: {
       mobile: string;
       tablet: string;
       desktop: string;
     };
     loading?: 'lazy' | 'eager';
   }
   ```

3. **Lazy Loading**
   - Images below fold: `loading="lazy"`
   - Hero images: `loading="eager"`
   - Intersection Observer for custom lazy loading

4. **Image Compression**
   - Target: 80-85% quality for photos
   - Lossless compression for graphics
   - Maximum file size: 200KB per image

### Code Splitting

```typescript
// Route-based code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

// Component-based code splitting
const Product3DView = lazy(() => import('./components/product/Product3DView'));
```

### Bundle Optimization

1. **Tree Shaking**: Remove unused code
2. **Minification**: Compress JavaScript and CSS
3. **Chunk Strategy**:
   - Vendor chunk: React, React DOM, React Router
   - Common chunk: Shared components
   - Route chunks: Page-specific code

### CDN Strategy

1. **Static Assets**: Serve from CDN edge locations
2. **Cache Headers**:
   - Images: `Cache-Control: public, max-age=31536000, immutable`
   - HTML: `Cache-Control: public, max-age=0, must-revalidate`
   - JS/CSS: `Cache-Control: public, max-age=31536000, immutable` (with hash in filename)

### Performance Budget

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Time to Interactive (TTI)**: < 3.0s
- **Total Bundle Size**: < 300KB (gzipped)
- **Lighthouse Score**: > 90

## SEO Implementation

### Meta Tags Structure

```typescript
interface SEOTags {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    type: 'website' | 'product';
    title: string;
    description: string;
    image: string;
    url: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };
}
```

### Structured Data (Schema.org)

**Product Schema**
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "image": ["image1.jpg", "image2.jpg"],
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "ARF - Amruth Ruchi Foods"
  },
  "offers": {
    "@type": "Offer",
    "price": "299",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

**Organization Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ARF - Amruth Ruchi Foods",
  "url": "https://arffoods.com",
  "logo": "https://arffoods.com/logo.png",
  "sameAs": [
    "https://www.instagram.com/arffoods",
    "https://www.facebook.com/arffoods"
  ]
}
```

### Sitemap Generation

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://arffoods.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://arffoods.com/products/buttermilk-mix</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Responsive Design Strategy

### Breakpoint System

```typescript
const breakpoints = {
  mobile: '320px',   // Small phones
  tablet: '768px',   // Tablets and large phones
  desktop: '1024px', // Laptops and desktops
  wide: '1440px'     // Large desktops
};
```

### Layout Adaptations

**Grid Layouts**
- Mobile (< 768px): 1 column
- Tablet (768px - 1023px): 2 columns
- Desktop (≥ 1024px): 3-4 columns

**Typography Scale**
- Mobile: Base 16px, Headings 24-32px
- Tablet: Base 16px, Headings 28-40px
- Desktop: Base 18px, Headings 32-56px

**Touch Targets**
- Minimum size: 44x44px
- Spacing between targets: 8px minimum

### Mobile-Specific Features

1. **Swipe Gestures**: Product galleries and testimonials
2. **Hamburger Menu**: Collapsible navigation
3. **Simplified Animations**: Reduce motion on mobile
4. **Optimized Images**: Smaller sizes for mobile viewports

## Accessibility Implementation

### Keyboard Navigation

- All interactive elements accessible via Tab key
- Focus indicators visible (2px solid outline)
- Skip to main content link
- Escape key closes modals and menus

### ARIA Labels

```typescript
// Example: Product Card
<article 
  role="article" 
  aria-labelledby="product-name-123"
  aria-describedby="product-desc-123"
>
  <h3 id="product-name-123">Buttermilk Mix</h3>
  <p id="product-desc-123">Natural probiotic drink mix</p>
  <button aria-label="Add Buttermilk Mix to cart">
    Add to Cart
  </button>
</article>
```

### Color Contrast

- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### Animation Controls

```typescript
// Respect prefers-reduced-motion
const shouldReduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationVariants = shouldReduceMotion 
  ? { initial: {}, animate: {} } 
  : { initial: { opacity: 0 }, animate: { opacity: 1 } };
```

## Error Handling

### Image Loading Errors

```typescript
interface ImageWithFallbackProps {
  src: string;
  fallback: string;
  alt: string;
}

function ImageWithFallback({ src, fallback, alt }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc(fallback);
  };
  
  return <img src={imgSrc} alt={alt} onError={handleError} />;
}
```

### 3D Rendering Errors

```typescript
function Product3DView({ modelPath, fallbackImage }: Props) {
  const [use3D, setUse3D] = useState(true);
  
  const handleError = (error: Error) => {
    console.error('3D rendering failed:', error);
    setUse3D(false);
  };
  
  if (!use3D) {
    return <img src={fallbackImage} alt="Product" />;
  }
  
  return (
    <ErrorBoundary onError={handleError}>
      <Canvas>
        <Model path={modelPath} />
      </Canvas>
    </ErrorBoundary>
  );
}
```

### Network Request Errors

```typescript
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries: number = 3
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

### Error Boundary Component

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Hover effects (4.3, 4.4, 4.5, 11.1, 11.4)** - Multiple properties test hover interactions. These can be consolidated into comprehensive hover behavior properties.

2. **Scroll animations (4.2, 4.10)** - These are duplicate properties testing the same behavior.

3. **Meta tags (8.1, 8.6, 8.7)** - All test presence of different meta tags, can be combined into one comprehensive SEO meta tags property.

4. **Responsive grid layouts (6.5, 6.6)** - Both test grid column counts at different breakpoints, can be combined.

5. **Product display properties (2.5, 2.6, 2.7, 10.1)** - Multiple properties test that product data is displayed, can be consolidated.

6. **Accessibility properties (14.4, 14.5, 14.6)** - All test presence of accessibility attributes, can be combined.

The following properties represent the unique, non-redundant correctness properties after reflection:

### Core Structural Properties

**Property 1: Product categorization**
*For any* product in the system, it should belong to exactly one of the four categories: Superfoods, Energy Mixes, Herbal Drinks, or Healthy Snacks.
**Validates: Requirements 1.6**

**Property 2: Product detail page existence**
*For any* product in the system, there should exist a corresponding product detail page accessible via a valid route.
**Validates: Requirements 2.1**

**Property 3: Product detail page layout**
*For any* product detail page, the layout should display product image on the left and product details on the right on desktop viewports (≥1024px).
**Validates: Requirements 2.2**

**Property 4: Navigation bar presence**
*For any* page in the website, a navigation bar should be present at the top of the page.
**Validates: Requirements 5.1**

**Property 5: Navigation bar sticky positioning**
*For any* scroll position on any page, the navigation bar should remain fixed at the top of the viewport.
**Validates: Requirements 5.2**

### Animation and Interaction Properties

**Property 6: Scroll-triggered animations**
*For any* element with scroll animation configuration, when that element enters the viewport, the animation should be triggered exactly once (or repeatedly if configured).
**Validates: Requirements 4.2, 4.10**

**Property 7: Product card hover effects**
*For any* product card, when a user hovers over it, the card should display both zoom effect (scale 1.05-1.2) and glow effect (box-shadow with accent color).
**Validates: Requirements 4.3, 4.4, 11.1**

**Property 8: Ingredient card expansion**
*For any* ingredient card, when a user hovers over it, the card should expand to reveal detailed information about that ingredient.
**Validates: Requirements 4.5, 11.4**

**Property 9: 3D product rotation**
*For any* 3D product view with auto-rotate enabled, the product should continuously rotate at a consistent speed until user interaction occurs.
**Validates: Requirements 4.9**

**Property 10: Interactive element transitions**
*For any* interactive element (buttons, cards, links), state changes should include CSS transitions with duration between 200ms and 500ms.
**Validates: Requirements 11.6**

**Property 11: Navigation smooth scrolling**
*For any* navigation link that points to a section on the same page, clicking the link should trigger smooth scrolling to that section rather than instant jump.
**Validates: Requirements 5.5**

**Property 12: 3D view user control**
*For any* 3D product view, user drag interactions or control inputs should modify the rotation angles of the 3D model.
**Validates: Requirements 2.3, 11.3**

### Responsive Design Properties

**Property 13: Responsive layout adaptation**
*For any* screen width between 320px and 2560px, the website layout should render without horizontal scrolling or broken layouts.
**Validates: Requirements 6.1**

**Property 14: Touch target sizing**
*For any* interactive element on mobile viewports (<768px), the touch target should be at least 44x44 pixels.
**Validates: Requirements 6.2**

**Property 15: Mobile swipe gestures**
*For any* product gallery or carousel on mobile viewports (<768px), swipe gestures (left/right) should navigate between items.
**Validates: Requirements 6.3**

**Property 16: Responsive layout stacking**
*For any* split layout component on mobile viewports (<768px), the layout should stack vertically rather than display side-by-side.
**Validates: Requirements 6.4**

**Property 17: Responsive grid columns**
*For any* grid layout, the number of columns should be: 1 column on mobile (<768px), 2 columns on tablet (768-1023px), and 3-4 columns on desktop (≥1024px).
**Validates: Requirements 6.5, 6.6**

**Property 18: Text readability**
*For any* text element at any screen size, the font size should be at least 14px and line height should be at least 1.4 times the font size.
**Validates: Requirements 6.7**

### Performance Properties

**Property 19: Image lazy loading**
*For any* image element that is initially below the viewport fold, the image should have the `loading="lazy"` attribute or use Intersection Observer for lazy loading.
**Validates: Requirements 7.2**

### SEO Properties

**Property 20: Page meta tags**
*For any* page in the website, the page should include meta title, meta description, canonical URL, and Open Graph tags in the document head.
**Validates: Requirements 8.1, 8.6, 8.7**

**Property 21: Product structured data**
*For any* product detail page, the page should include valid Schema.org Product structured data in JSON-LD format.
**Validates: Requirements 8.2**

**Property 22: Image alt text**
*For any* image element in the website, the image should have a non-empty alt attribute that describes the image content.
**Validates: Requirements 8.3**

**Property 23: Semantic HTML usage**
*For any* page section, appropriate semantic HTML5 elements (header, nav, main, section, article, footer) should be used instead of generic div elements.
**Validates: Requirements 8.5**

**Property 24: Search engine crawlability**
*For any* page in the website, the page should not include meta robots noindex directive or disallow directives that prevent search engine crawling.
**Validates: Requirements 8.8**

### Content Display Properties

**Property 25: Product card consistency**
*For any* product card component, it should display product name, description, price, and image in a consistent format and order.
**Validates: Requirements 10.1**

**Property 26: Product image dimensions**
*For any* product main image, the image source should have a minimum width of 1200 pixels for high-quality display.
**Validates: Requirements 10.2**

**Property 27: Product data display completeness**
*For any* product detail page, if the product has ingredients, nutrition information, usage instructions, or health benefits in its data model, all available data should be displayed on the page.
**Validates: Requirements 2.5, 2.6, 2.7, 10.3, 10.4, 10.5**

**Property 28: Health benefit iconography**
*For any* health benefit displayed on the website, the benefit should be accompanied by an icon representation.
**Validates: Requirements 10.6**

**Property 29: Add to cart button presence**
*For any* product detail page, an "Add to Cart" button should be present and visible.
**Validates: Requirements 2.8**

### Interactive Showcase Properties

**Property 30: Product image modal**
*For any* product image, clicking on the image should open a larger view (modal or expanded state) of the image.
**Validates: Requirements 11.2**

**Property 31: Health benefit detail expansion**
*For any* health benefit icon, clicking on the icon should display or expand to show detailed explanation of that benefit.
**Validates: Requirements 11.5**

### Social Proof Properties

**Property 32: Testimonial carousel transitions**
*For any* testimonial carousel interaction (next, previous, dot navigation), the transition between testimonials should be smooth with animation duration of 300-500ms.
**Validates: Requirements 12.2**

**Property 33: Instagram post links**
*For any* Instagram post displayed in the community section, the post should be clickable and link to the original Instagram post URL.
**Validates: Requirements 12.5**

**Property 34: Testimonial author display**
*For any* testimonial, the testimonial author's name should be displayed, and if a photo is provided in the data, the photo should also be displayed.
**Validates: Requirements 12.6**

### Analytics Properties

**Property 35: Click tracking**
*For any* product card, "Add to Cart" button, or navigation link, clicking the element should trigger an analytics tracking event with appropriate event name and properties.
**Validates: Requirements 13.2, 13.4**

### Accessibility Properties

**Property 36: Keyboard navigation support**
*For any* interactive element (buttons, links, form inputs), the element should be focusable and operable using only keyboard (Tab, Enter, Space keys).
**Validates: Requirements 14.1**

**Property 37: Focus indicator visibility**
*For any* interactive element when focused via keyboard, a visible focus indicator (outline or border) should be displayed with minimum 2px width.
**Validates: Requirements 14.2**

**Property 38: Color contrast compliance**
*For any* text element, the color contrast ratio between text and background should be at least 4.5:1 for normal text or 3:1 for large text (18px+).
**Validates: Requirements 14.3**

**Property 39: Accessibility attributes**
*For any* icon-only button, the button should have an aria-label attribute; for any form input, the input should have an associated label element; for any non-text content, appropriate alt text or ARIA labels should be present.
**Validates: Requirements 14.4, 14.5, 14.6**

**Property 40: Heading hierarchy**
*For any* page, heading elements should follow logical hierarchy (h1 → h2 → h3) without skipping levels.
**Validates: Requirements 14.8**

### Error Handling Properties

**Property 41: Image loading fallback**
*For any* image that fails to load, a placeholder image or fallback UI should be displayed instead of a broken image icon.
**Validates: Requirements 15.1**

**Property 42: 3D rendering fallback**
*For any* 3D product view that fails to render (due to WebGL unavailability or loading errors), a static 2D product image should be displayed as fallback.
**Validates: Requirements 15.2**

**Property 43: Animation graceful degradation**
*For any* animated element, if animations are not supported or user has prefers-reduced-motion enabled, the element should display in its final state without animation, maintaining layout integrity.
**Validates: Requirements 15.3**

**Property 44: Error message display**
*For any* content loading error (network failure, API error), a user-friendly error message should be displayed to the user instead of technical error details.
**Validates: Requirements 15.5**

**Property 45: Network request retry**
*For any* network request that fails, the system should automatically retry the request up to 3 times with exponential backoff before displaying an error to the user.
**Validates: Requirements 15.7**

**Property 46: Error boundary protection**
*For any* React component that throws an error during rendering, the error should be caught by an error boundary, preventing the entire application from crashing.
**Validates: Requirements 9.7**

## Testing Strategy

### Dual Testing Approach

The ARF website will employ both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples and concrete scenarios (e.g., "Hero section displays correct headline")
- Edge cases (e.g., empty product lists, missing images)
- Integration points between components
- Error conditions and fallback behaviors
- Specific UI interactions (e.g., clicking a button opens a modal)

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs (e.g., "all product cards display consistently")
- Randomized input generation to test behavior across many scenarios
- Invariants that should never be violated (e.g., "touch targets are always ≥44px on mobile")
- Comprehensive coverage through automated test case generation

Both testing approaches are complementary and necessary. Unit tests catch specific bugs and validate concrete examples, while property-based tests verify that general rules hold across all possible inputs.

### Testing Technology Stack

**Unit Testing:**
- **Framework**: Vitest (fast, Vite-native test runner)
- **React Testing**: React Testing Library (user-centric testing)
- **Assertions**: Vitest's built-in assertions + Testing Library matchers
- **Mocking**: Vitest's mocking capabilities

**Property-Based Testing:**
- **Library**: fast-check (JavaScript/TypeScript property-based testing)
- **Integration**: Works seamlessly with Vitest
- **Configuration**: Minimum 100 iterations per property test

**Additional Testing Tools:**
- **Accessibility**: axe-core (automated accessibility testing)
- **Visual Regression**: Playwright (screenshot comparison)
- **E2E Testing**: Playwright (end-to-end user flows)

### Property-Based Test Configuration

Each property-based test must:
1. Run a minimum of 100 iterations (due to randomization)
2. Include a comment tag referencing the design property
3. Use fast-check generators appropriate to the property being tested

**Tag Format:**
```javascript
// Feature: arf-website, Property 7: Product card hover effects
test('product cards display hover effects', () => {
  fc.assert(
    fc.property(fc.productCard(), (productCard) => {
      // Test implementation
    }),
    { numRuns: 100 }
  );
});
```

### Test Organization

```
src/
├── components/
│   ├── __tests__/
│   │   ├── ProductCard.test.jsx          # Unit tests
│   │   ├── ProductCard.property.test.jsx # Property tests
│   │   ├── Navbar.test.jsx
│   │   └── Navbar.property.test.jsx
├── pages/
│   ├── __tests__/
│   │   ├── LandingPage.test.jsx
│   │   └── ProductDetailPage.test.jsx
├── hooks/
│   ├── __tests__/
│   │   ├── useScrollAnimation.test.js
│   │   └── useParallax.test.js
└── utils/
    ├── __tests__/
    │   ├── analytics.test.js
    │   └── seo.test.js
```

### Example Test Implementations

**Unit Test Example:**
```javascript
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  test('displays the correct headline', () => {
    render(<HeroSection />);
    expect(screen.getByText('Pure Nutrition from Nature')).toBeInTheDocument();
  });
  
  test('displays CTA button', () => {
    render(<HeroSection />);
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
  });
});
```

**Property-Based Test Example:**
```javascript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

// Feature: arf-website, Property 25: Product card consistency
describe('ProductCard properties', () => {
  test('all product cards display required fields consistently', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 10, maxLength: 500 }),
          price: fc.float({ min: 1, max: 10000 }),
          image: fc.webUrl(),
          category: fc.constantFrom('superfoods', 'energy-mixes', 'herbal-drinks', 'healthy-snacks'),
        }),
        (product) => {
          const { container } = render(<ProductCard {...product} />);
          
          // Verify all required fields are present
          expect(container.textContent).toContain(product.name);
          expect(container.textContent).toContain(product.description);
          expect(container.textContent).toContain(product.price.toString());
          expect(container.querySelector('img')).toHaveAttribute('src', product.image);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Accessibility Property Test Example:**
```javascript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

// Feature: arf-website, Property 38: Color contrast compliance
describe('Accessibility properties', () => {
  test('all text elements meet color contrast requirements', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('ProductCard', 'Navbar', 'Footer', 'HeroSection'),
        async (componentName) => {
          const Component = await import(`../${componentName}`);
          const { container } = render(<Component.default />);
          
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true }
            }
          });
          
          expect(results.violations).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 46 correctness properties implemented
- **Accessibility Coverage**: All WCAG 2.1 Level AA criteria tested
- **Visual Regression**: Key pages and components covered
- **E2E Coverage**: Critical user flows (browse products, view details, add to cart)

### Continuous Integration

Tests will run automatically on:
- Every pull request
- Every commit to main branch
- Nightly builds (full test suite including visual regression)

**CI Pipeline:**
1. Lint and type checking
2. Unit tests (fast feedback)
3. Property-based tests (comprehensive coverage)
4. Accessibility tests
5. Build verification
6. E2E tests (critical paths)
7. Visual regression tests (on main branch only)

### Performance Testing

While not part of unit/property tests, performance will be monitored through:
- Lighthouse CI (automated performance audits)
- Bundle size tracking (fail if bundle exceeds 300KB gzipped)
- Core Web Vitals monitoring in production

