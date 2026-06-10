# ARF - Amruth Ruchi Foods Website

![ARF Logo](public/images/logo/ARF%20logo.png)

A modern, full-stack e-commerce website for Amruth Ruchi Foods, featuring organic superfoods, energy mixes, herbal drinks, and healthy snacks.

## 🌟 Features

### Frontend
- ⚛️ **React 19** with TypeScript
- 🎨 **Tailwind CSS 4** for modern styling
- 🎭 **Framer Motion** for smooth animations
- 🛒 **Shopping Cart** with persistent state
- 👤 **User Authentication** and profiles
- 💳 **Razorpay Payment Gateway** integration
- 📱 **Fully Responsive** design
- ♿ **Accessible** components
- 🔍 **SEO Optimized** with meta tags and structured data

### Backend
- 🚀 **Node.js/Express** REST API
- 🗄️ **MySQL** database
- 🔐 **JWT Authentication**
- 💰 **Razorpay Payment Processing**
- 📦 **Order Management**
- 🛡️ **Secure** payment verification

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Amruth-Ruchi-Foods/ARF-website.git
cd ARF-website
```

2. **Install dependencies:**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Setup Database:**
```bash
# Create MySQL database
mysql -u root -p < backend/src/db/schema.sql

# Or follow MYSQL_SETUP.md for detailed instructions
```

4. **Configure Environment Variables:**

**Frontend** (`.env`):
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

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

5. **Start Development Servers:**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

6. **Open your browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
ARF-website/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── db/             # Database schemas & queries
│   │   ├── middleware/     # Auth middleware
│   │   └── types/          # TypeScript types
│   └── .env                # Backend config
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── layout/        # Navbar, Footer
│   │   ├── product/       # Product cards, details
│   │   ├── sections/      # Homepage sections
│   │   └── ui/            # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API & Razorpay services
│   ├── context/           # React context
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── public/                # Static assets
│   ├── images/           # Product & logo images
│   └── sitemap.xml       # SEO sitemap
└── .env                  # Frontend config
```

## 💳 Payment Integration

Razorpay Standard Checkout is integrated for processing payments.

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4111 1111 1111 1112`
- CVV: Any 3 digits
- Expiry: Any future date

For detailed integration guide, see [RAZORPAY_INTEGRATION.md](RAZORPAY_INTEGRATION.md)

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
```

## 🌐 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in platform dashboard

### Backend (Any Node.js hosting)
1. Build: `cd backend && npm run build`
2. Set environment variables
3. Start: `npm start`
4. Ensure MySQL is accessible

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Razorpay Integration](RAZORPAY_INTEGRATION.md) - Payment gateway setup
- [Razorpay Quick Start](RAZORPAY_QUICK_START.md) - Quick testing guide
- [MySQL Setup](MYSQL_SETUP.md) - Database configuration
- [Backend Setup](BACKEND_SETUP.md) - API server setup
- [Project Setup](PROJECT_SETUP.md) - Initial project setup

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ JWT authentication for user sessions
- ✅ Payment signature verification
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Input validation

**⚠️ Never commit `.env` files to git!**

## 🧪 Testing

Run tests:
```bash
npm run test
```

Test payment flow:
1. Add products to cart
2. Go to checkout
3. Use test card: 4111 1111 1111 1111
4. Complete payment

## 📦 Built With

### Frontend
- [React](https://react.dev/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Router](https://reactrouter.com/) - Routing
- [Axios](https://axios-http.com/) - HTTP Client

### Backend
- [Node.js](https://nodejs.org/) - Runtime
- [Express](https://expressjs.com/) - Web Framework
- [MySQL](https://www.mysql.com/) - Database
- [Razorpay](https://razorpay.com/) - Payment Gateway
- [JWT](https://jwt.io/) - Authentication

## 🎨 Design

- Custom color palette with ARF green theme
- Glassmorphism effects
- Smooth scroll animations
- Responsive layouts
- Accessibility-first components

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

Developed by the ARF Development Team

## 📞 Support

For support, email: contact@amruthruchi.com

## 🎯 Roadmap

- [ ] WhatsApp order notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Loyalty points system
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 🙏 Acknowledgments

- Product images and branding by ARF team
- Icons from various open-source projects
- Inspiration from modern e-commerce platforms

---

**Made with ❤️ for healthy living**
