# ARF (Amruth Ruchi Foods) — Complete Code Analysis

## Project Overview
ARF is a full-stack e-commerce platform for Amruth Ruchi Foods, selling organic superfoods, energy mixes, herbal drinks, and healthy snacks with Ayurvedic roots. It features a modern React frontend with a Node.js/Express backend powered by MySQL.

---

## 🏗️ Architecture

### Monorepo Structure
```
ARF-website/
├── src/                    # Frontend (React + TypeScript)
├── backend/                # Backend (Node.js + Express)
├── public/                 # Static assets
├── dist/                   # Production build
├── scripts/                # Utility scripts
└── arf-website/            # Separate demo/test app
```

---

## 🎨 Frontend Technology Stack

### Core Framework
- **React 19.2.0** - Latest React with TypeScript
- **TypeScript 5.9.3** - Type safety
- **Vite 8.0.0-beta** - Lightning-fast build tool

### UI & Styling
- **Tailwind CSS 4.2.1** - Modern utility-first CSS
- **Framer Motion 12.35.2** - Smooth animations
- **@react-three/fiber + drei** - 3D product visualization
- **Three.js 0.183.2** - WebGL rendering

### Routing & State Management
- **React Router DOM 7.13.1** - Client-side routing
- **React Context API** - Global state (Cart, Auth)

### HTTP & API
- **Axios 1.16.1** - API requests

### Testing
- **Vitest 4.0.18** - Unit & integration testing
- **@testing-library/react 16.3.2** - Component testing
- **jsdom 28.1.0** - DOM simulation
- **fast-check 4.6.0** - Property-based testing

### Code Quality
- **ESLint 9.39.1** - Linting
- **Prettier 3.8.1** - Code formatting
- **TypeScript ESLint** - TS linting

---

## 🔧 Backend Technology Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **TypeScript 5.3.3** - Type safety
- **tsx 4.7.0** - TS execution

### Database
- **MySQL2 3.6.5** - Database driver
- **MySQL 8+** - Relational database

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** - Token-based auth
- **bcrypt 5.1.1** - Password hashing
- **cors 2.8.5** - CORS middleware

### Payment Gateway
- **Razorpay 2.9.6** - Payment processing

### Environment
- **dotenv 16.3.1** - Environment variables

---

## 📂 Frontend Structure

### Component Organization

```
src/
├── components/
│   ├── layout/           # Navbar, Footer, Layout
│   ├── product/          # Product cards, 3D views, details
│   ├── sections/         # Homepage sections
│   └── ui/               # Reusable UI components
├── pages/                # Route pages
├── context/              # React contexts
├── services/             # API clients
├── hooks/                # Custom hooks
├── utils/                # Helper functions
├── types/                # TypeScript types
├── data/                 # Static data
└── styles/               # Global styles
```

### Key Components

#### Layout Components
- `Navbar.tsx` - Navigation with cart, auth
- `Footer.tsx` - Site footer
- `Layout.tsx` - Page wrapper

#### Product Components
- `ProductCard.tsx` - Product preview cards
- `Product3DView.tsx` - Three.js 3D product view
- `IngredientsShowcase.tsx` - Ingredient breakdown
- `NutritionTable.tsx` - Nutrition facts
- `ProductHealthBenefits.tsx` - Health benefits display
- `UsageInstructions.tsx` - How to use

#### Section Components
- `HeroSection.tsx` - Landing hero with animations
- `FeaturedProducts.tsx` - Product carousel
- `ProductCategories.tsx` - Category showcase
- `BrandStory.tsx` - About section
- `HealthBenefits.tsx` - Benefits overview
- `Testimonials.tsx` - Customer reviews
- `InstagramFeed.tsx` - Social feed
- `ContactSection.tsx` - Contact form

#### UI Components
- `Button.tsx` - Styled buttons
- `Card.tsx` - Reusable card
- `CartDrawer.tsx` - Shopping cart sidebar
- `AuthModal.tsx` - Login/signup modal
- `ProfileModal.tsx` - User profile editor
- `FloatingSeeds.tsx` - Animated background
- `ImageWithFallback.tsx` - Image with fallback
- `SEOHead.tsx` - Meta tags component
- `ErrorBoundary.tsx` - Error handling

### Pages

```typescript
- LandingPage.tsx          # Homepage
- ProductDetailPage.tsx    # Product details
- CheckoutPage.tsx         # Checkout flow
- OrderConfirmedPage.tsx   # Order success
- AdminPage.tsx            # Admin dashboard
- MyOrdersPage.tsx         # User order history
- TrackOrderPage.tsx       # Order tracking
```

### Context Providers

#### CartContext.tsx - Shopping cart state
```typescript
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart(): void;
  closeCart(): void;
  addToCart(item: Omit<CartItem, 'quantity'>): void;
  removeFromCart(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  clearCart(): void;
  totalItems: number;
  totalPrice: number;
}
```

#### UserAuthContext.tsx - User authentication
```typescript
interface UserAuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  authModal: 'login' | 'signup' | 'profile' | null;
  openLogin(): void;
  openSignup(): void;
  openProfile(): void;
  closeModal(): void;
  login(email: string, password: string): string | null;
  signup(name: string, email: string, phone: string, password: string): string | null;
  updateProfile(name: string, phone: string, currentPassword: string, newPassword?: string): string | null;
  logout(): void;
}
```

### Services

#### api.ts - API client
```typescript
// Cart API
cartApi: {
  getCart(userId: string): Promise<Cart>
  addItem(userId: string, productId: string, quantity: number, variantId?: string): Promise<Cart>
  updateItem(userId: string, productId: string, quantity: number, variantId?: string): Promise<Cart>
  removeItem(userId: string, productId: string, variantId?: string): Promise<Cart>
  clearCart(userId: string): Promise<void>
}

// Favorites API
favoritesApi: {
  getFavorites(userId: string): Promise<Favorite>
  addFavorite(userId: string, productId: string): Promise<Favorite>
  removeFavorite(userId: string, productId: string): Promise<Favorite>
  clearFavorites(userId: string): Promise<void>
}

// Orders API
ordersApi: {
  createOrder(orderData): Promise<Order>
  getOrder(orderId: string): Promise<Order>
  getUserOrders(userEmail: string): Promise<Order[]>
  updateOrderStatus(orderId: string, status: string): Promise<Order>
  cancelOrder(orderId: string): Promise<Order>
  getAllOrders(): Promise<Order[]>
}
```

#### razorpay.ts - Payment integration
```typescript
- initializeRazorpay(): Promise<boolean>
- createRazorpayOrder(amount: number): Promise<RazorpayOrder>
- verifyPayment(paymentData): Promise<boolean>
```

---

## 🔙 Backend Structure

```
backend/src/
├── db/
│   ├── connection.ts       # MySQL connection pool
│   ├── store.ts            # Database queries
│   ├── migrate.ts          # Migration script
│   ├── schema.sql          # Database schema
│   └── schema-hostinger.sql
├── routes/
│   ├── auth.js             # Auth endpoints
│   ├── cart-mysql.js       # Cart operations
│   ├── favorites-mysql.js  # Favorites
│   ├── orders-mysql.js     # Order management
│   └── payment.js          # Payment processing
├── middleware/
│   └── auth.ts             # JWT verification
├── types/
│   └── index.ts            # Type definitions
└── server.ts               # Express app
```

### API Endpoints

```
Health
------
GET  /health                # Health check

Authentication
--------------
POST /api/auth/register     # User signup
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get profile
PUT  /api/auth/profile      # Update profile

Cart
----
GET    /api/cart/:userId              # Get cart
POST   /api/cart/:userId/items        # Add item
PUT    /api/cart/:userId/items/:id    # Update item
DELETE /api/cart/:userId/items/:id    # Remove item
DELETE /api/cart/:userId              # Clear cart

Favorites
---------
GET    /api/favorites/:userId         # Get favorites
POST   /api/favorites/:userId         # Add favorite
DELETE /api/favorites/:userId/:id     # Remove favorite

Orders
------
POST  /api/orders                     # Create order
GET   /api/orders/:orderId            # Get order
GET   /api/orders/user/:email         # User orders
PATCH /api/orders/:orderId/status     # Update status
POST  /api/orders/:orderId/cancel     # Cancel order
GET   /api/orders                     # All orders (admin)

Payment
-------
POST /api/payment/create-order        # Create Razorpay order
POST /api/payment/verify              # Verify payment
```

---

## 🗄️ Database Schema

### Tables

#### users
```sql
id               INT PRIMARY KEY AUTO_INCREMENT
name             VARCHAR(255) NOT NULL
email            VARCHAR(255) NOT NULL UNIQUE
phone            VARCHAR(15) NOT NULL
password_hash    VARCHAR(255) NOT NULL
created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### products
```sql
id               VARCHAR(50) PRIMARY KEY
name             VARCHAR(255) NOT NULL
slug             VARCHAR(255) NOT NULL UNIQUE
description      TEXT
long_description TEXT
price            DECIMAL(10, 2) NOT NULL
currency         VARCHAR(3) DEFAULT 'INR'
category         VARCHAR(50)
in_stock         BOOLEAN DEFAULT TRUE
featured         BOOLEAN DEFAULT FALSE
images           JSON
variants         JSON
created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### orders
```sql
id                 VARCHAR(50) PRIMARY KEY
user_id            INT
user_email         VARCHAR(255)
delivery_name      VARCHAR(255) NOT NULL
delivery_phone     VARCHAR(15) NOT NULL
delivery_email     VARCHAR(255) NOT NULL
delivery_address   TEXT NOT NULL
delivery_city      VARCHAR(100) NOT NULL
delivery_state     VARCHAR(100) NOT NULL
delivery_pincode   VARCHAR(10) NOT NULL
payment_method     ENUM('cod', 'upi', 'card', 'netbanking') NOT NULL
total_price        DECIMAL(10, 2) NOT NULL
status             ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'
razorpay_order_id  VARCHAR(255)
razorpay_payment_id VARCHAR(255)
created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### order_items
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
order_id    VARCHAR(50) NOT NULL
product_id  VARCHAR(50) NOT NULL
name        VARCHAR(255) NOT NULL
price       DECIMAL(10, 2) NOT NULL
quantity    INT NOT NULL
image       VARCHAR(500)
variant_id  VARCHAR(50)
```

#### carts
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
user_id     VARCHAR(255) NOT NULL
product_id  VARCHAR(50) NOT NULL
quantity    INT NOT NULL DEFAULT 1
variant_id  VARCHAR(50)
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### favorites
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
user_id     VARCHAR(255) NOT NULL
product_id  VARCHAR(50) NOT NULL
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### payments
```sql
id                   INT PRIMARY KEY AUTO_INCREMENT
order_id             VARCHAR(50) NOT NULL
razorpay_order_id    VARCHAR(255)
razorpay_payment_id  VARCHAR(255)
razorpay_signature   VARCHAR(255)
amount               DECIMAL(10, 2) NOT NULL
currency             VARCHAR(3) DEFAULT 'INR'
status               ENUM('created', 'authorized', 'captured', 'refunded', 'failed') DEFAULT 'created'
payment_method       VARCHAR(50)
created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### contact_messages
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
name        VARCHAR(255) NOT NULL
email       VARCHAR(255) NOT NULL
phone       VARCHAR(15)
message     TEXT NOT NULL
is_read     BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### newsletter_subscribers
```sql
id             INT PRIMARY KEY AUTO_INCREMENT
email          VARCHAR(255) NOT NULL UNIQUE
subscribed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## 💳 Payment Integration

### Razorpay Standard Checkout
- Test/Live mode support
- Payment verification with signature
- Order creation → payment → verification flow
- Webhook support ready

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4111 1111 1111 1112`
- CVV: Any 3 digits
- Expiry: Any future date

**Environment Variables:**
```env
# Frontend
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key

# Backend
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🎨 Design System

### Colors
```typescript
primary: {
  green: '#2E7D32',
  lightGreen: '#8BC34A',
  orange: '#FF9800'
}
neutral: {
  cream: '#F5F5F5',
  darkBg: '#0F172A'
}
accent: {
  glow: '#7CFFB2'
}
```

### Fonts
```typescript
heading: 'Poppins', 'Montserrat', sans-serif
body: 'Inter', sans-serif
natural: 'Playfair Display', serif
```

### Breakpoints
```typescript
mobile: 320px
tablet: 768px
desktop: 1024px
wide: 1440px
```

### Animations
```typescript
float: 'float 3s ease-in-out infinite'
```

---

## 📦 Products

### Product Catalog

1. **Flax Seed Buttermilk Powder** (`buttermilk-mix-001`)
   - Category: Nutrition Drink
   - Price: ₹249
   - Tags: Refreshing Drink, Drink of the Heart, Gut-Friendly Health Drink Powder
   - Variants: 5g×25, 20g×5, 200g, 500g, 1kg

2. **Flax Mix Seeds** (`flax-mix-seeds-002`)
   - Category: Seeds Mixes
   - Price: ₹199
   - Subtitle: Jeevan Pasand — Mouth Freshener
   - Variants: 5g×25

3. **Ghee Roasted Seeds** (`ghee-roasted-seeds-003`)
   - Category: Healthy Snacks
   - Price: ₹299
   - Variants: 100g (20g×5), 200g, 500g, 1kg

4. **Jumbo Kajur** (`jumbo-kajur-004`)
   - Category: Dates
   - Price: ₹449
   - Variants: Pack of 10, Pack of 25

5. **Khajur Seed Powder** (`khajur-seed-powder-005`)
   - Category: Superfoods
   - Price: ₹179
   - Variants: Pack of 25, Pack of 50, 250g, 500g

6. **Pailwan Khajur** (`pailwan-khajur-006`)
   - Category: Dates
   - Price: ₹549
   - Variants: Pack of 10 (2pc each), Pack of 25 (2pc each)

### Product Data Structure
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  tags?: string[];
  subtitle?: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  category: string;
  images: {
    thumbnail: string;
    main: string;
    gallery: string[];
  };
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  benefits: HealthBenefit[];
  usage: UsageStep[];
  inStock: boolean;
  featured: boolean;
  variants: ProductVariant[];
  seo: SEOData;
}
```

Each product includes:
- Detailed ingredients with percentages and benefits
- Lab-certified nutrition facts (SLN Testing Laboratory)
- Health benefits by category (digestive, immunity, energy, wellness, heart)
- Usage instructions
- Multiple variants (sizes/packs)
- SEO metadata + structured data

---

## 🚀 Deployment

### Frontend (Netlify)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist/
```

**Environment Variables:**
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_API_URL=https://api.amruthruchi.com
```

**Configuration:** `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend (Hostinger)

**Build Command:**
```bash
cd backend
npm run build
```

**Start Command:**
```bash
node dist/server.js
```

**Environment Variables:**
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://amruthruchi.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=amruthruchi

# Auth
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Admin
ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=your_admin_password
```

**Apache Configuration:** `.htaccess`
- Proxy configuration for Node.js
- SSL redirect
- CORS headers

---

## 🔐 Security Features

✅ JWT authentication with HTTP-only cookies  
✅ bcrypt password hashing (cost factor: 10)  
✅ CORS configuration with whitelist  
✅ Payment signature verification (HMAC SHA256)  
✅ SQL injection prevention (parameterized queries)  
✅ Input validation and sanitization  
✅ Environment variables for secrets  
✅ Rate limiting ready  
✅ XSS protection  
✅ HTTPS enforcement  

---

## 📱 Features

### User Features
- 🛒 Shopping cart with persistent state
- 👤 User registration & login (localStorage-based)
- 💳 Razorpay payment gateway integration
- 📦 Order tracking with status updates
- ⭐ Favorites/wishlist
- 📱 Fully responsive design (mobile-first)
- 🎭 Smooth scroll animations
- 🌐 3D product visualization

### Admin Features
- 📊 Admin dashboard
- 📦 Order management
- 📝 Order status updates
- 📈 Analytics overview

### Technical Features
- ♿ WCAG 2.1 AA accessibility compliance
- 🔍 SEO optimized with meta tags
- 🗺️ Automatic sitemap generation
- 📊 Structured data (Schema.org)
- 🚀 Code splitting & lazy loading
- 💾 Connection pooling (MySQL)
- ⚡ Optimistic UI updates
- 🎨 Glassmorphism effects
- 🧪 Lab-certified nutrition data

---

## 🧪 Testing

### Test Framework
- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **fast-check** - Property-based testing
- **jsdom** - DOM simulation

### Test Coverage
- Component unit tests
- Hook tests
- Property-based tests
- Integration tests

**Commands:**
```bash
npm run test              # Run tests in watch mode
npm run test:ui           # Open Vitest UI
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report
```

**Test Files:**
```
src/
├── components/
│   ├── ui/Button.test.tsx
│   ├── ui/Card.test.tsx
│   ├── product/ProductCard.test.tsx
│   └── sections/*.test.tsx
├── hooks/
│   ├── useParallax.test.ts
│   └── useScrollAnimation.test.ts
├── pages/__tests__/
│   ├── LandingPage.test.tsx
│   └── ProductDetailPage.test.tsx
└── test/
    ├── setup.ts
    ├── setup.test.ts
    └── property.test.ts
```

---

## 📝 Scripts

### Frontend Scripts
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # TypeScript compile + Vite build
npm run prebuild         # Generate sitemap before build
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format
npm test                 # Run Vitest
npm run test:ui          # Vitest UI mode
npm run test:run         # Single test run
npm run test:coverage    # Coverage report
```

### Backend Scripts
```bash
npm run dev              # tsx watch mode (hot reload)
npm run build            # TypeScript build + copy SQL files
npm start                # Start production server
npm run migrate          # Run database migrations
```

### Utility Scripts
```typescript
scripts/
├── generate-sitemap.ts     # Generate sitemap.xml
├── remove_bg.py            # Remove image backgrounds
└── remove_bg_products.py   # Process product images
```

---

## 🌐 Browser Support

✅ Chrome (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile browsers (iOS Safari 12+, Chrome Mobile)  
✅ Progressive Web App ready  

---

## 📊 Performance Optimizations

### Frontend
- ⚡ Vite for instant HMR
- 📦 Code splitting with React.lazy()
- 🖼️ Image optimization (WebP fallback)
- 🎨 CSS purging with Tailwind
- 🚀 Route-based code splitting
- 💾 React Context memoization
- 🎭 Framer Motion layout animations
- ⚙️ Tree shaking

### Backend
- 🔄 MySQL connection pooling (10 connections)
- 📊 Database indexing on frequently queried fields
- ⚡ Express.json() parsing optimization
- 🔐 JWT token caching
- 📦 Gzip compression ready

---

## 🎯 Key Integrations

### Razorpay Payment Gateway
- Standard Checkout flow
- Order creation API
- Payment verification
- Webhook support (ready)
- Test/Live mode switching

### MySQL Database
- Connection pooling
- Prepared statements
- Transaction support
- Foreign key constraints
- Automatic timestamp management

### Email (Ready for integration)
- Order confirmation emails
- OTP verification
- Newsletter subscriptions
- Contact form notifications

---

## 📚 Documentation Files

```
Root Documentation:
├── README.md                          # Project overview
├── PROJECT_SETUP.md                   # Initial setup guide
├── DEPLOYMENT.md                      # General deployment
├── BACKEND_SETUP.md                   # Backend configuration
├── MYSQL_SETUP.md                     # Database setup
├── RAZORPAY_INTEGRATION.md           # Payment integration
├── RAZORPAY_QUICK_START.md           # Quick payment testing
├── HOSTINGER_DEPLOYMENT.md           # Hostinger-specific
├── HOSTINGER_DATABASE_SETUP.md       # Hostinger DB setup
├── NETLIFY_ENV_FIX.md                # Netlify configuration
└── GITHUB_PUSH_INSTRUCTIONS.md       # Git workflow

Backend Documentation:
└── backend/README.md                  # Backend API docs
```

---

## 🔄 Development Workflow

### Local Development
1. Start MySQL database
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `npm run dev`
4. Access:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Testing Workflow
1. Write tests alongside features
2. Run tests: `npm test`
3. Check coverage: `npm run test:coverage`
4. Fix linting: `npm run lint:fix`

### Deployment Workflow
1. Commit changes to git
2. Push to GitHub
3. Frontend auto-deploys via Netlify
4. Backend manual deploy to Hostinger
5. Run migrations if schema changed

---

## 🐛 Known Issues & Limitations

- Frontend auth uses localStorage (not backend-verified)
- Admin authentication needs enhancement
- No email notifications yet
- No WhatsApp integration yet
- No product reviews/ratings yet
- No wishlist sync with backend yet

---

## 🚀 Future Roadmap

- [ ] WhatsApp order notifications
- [ ] Product reviews and ratings
- [ ] Backend-verified authentication
- [ ] Wishlist backend sync
- [ ] Loyalty points system
- [ ] Multi-language support (Hindi)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Coupon/discount system
- [ ] Subscription orders
- [ ] Blog/content section

---

## 📞 Contact & Support

**Website:** https://amruthruchi.com  
**Email:** contact@amruthruchi.com  
**Support:** For issues and bugs, check the documentation files first.

---

## 📄 License

This project is proprietary and confidential.  
© 2024-2026 Amruth Ruchi Foods. All rights reserved.

---

## 🙏 Acknowledgments

- Product images and branding by ARF team
- Lab testing by SLN Testing Laboratory
- FSSAI certified products
- Inspired by traditional Ayurvedic recipes
- Built with modern web technologies

---

**Made with ❤️ for healthy living**
