# Razorpay Integration - Quick Start

## ✅ Integration Complete!

Razorpay Standard Web Checkout has been successfully integrated into your ARF website.

## 🚀 How to Test

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:3001

### 2. Start Frontend Server
```bash
# In root directory
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Test Payment Flow

1. **Add products to cart**
2. **Go to checkout**: http://localhost:5173/checkout
3. **Fill delivery details**:
   - Name: Test User
   - Phone: 9999999999
   - Email: test@example.com
   - Complete address
4. **Select payment method**: UPI / Card / Netbanking
5. **Click "Place Order & Pay"**
6. **Razorpay modal opens**
7. **Use test card**:
   - Card Number: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
   - Name: Any name
8. **Click Pay** ✅

## 📁 Files Created

### Backend
- `backend/src/routes/payment.ts` - Payment API endpoints
- `backend/.env` - Updated with Razorpay credentials

### Frontend
- `src/services/razorpay.ts` - Razorpay integration
- `src/types/razorpay.d.ts` - TypeScript types
- `.env` - Razorpay public key

### Documentation
- `RAZORPAY_INTEGRATION.md` - Complete integration guide
- `RAZORPAY_QUICK_START.md` - This file

## 🔑 Credentials (Test Mode)

**Backend** (`backend/.env`):
```
RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
RAZORPAY_KEY_SECRET=iGd0WMKuR0R0v4hRiIB3Fx4U
```

**Frontend** (`.env`):
```
VITE_RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
```

## 🧪 Test Cards

| Scenario | Card Number | Result |
|----------|-------------|--------|
| Success | 4111 1111 1111 1111 | ✅ Payment successful |
| Failure | 4111 1111 1111 1112 | ❌ Payment failed |

More test cards: https://razorpay.com/docs/payments/payments/test-card-details/

## 💰 Payment Methods Supported

- ✅ UPI (GPay, PhonePe, Paytm, etc.)
- ✅ Credit/Debit Cards (Visa, Mastercard, RuPay)
- ✅ Net Banking (All major banks)
- ✅ Cash on Delivery (Direct order, no Razorpay)

## 🔒 Security Features

- ✅ Server-side order creation
- ✅ Payment signature verification (HMAC-SHA256)
- ✅ Key secret never exposed to frontend
- ✅ Environment variables for credentials

## 📊 What Happens Behind the Scenes

1. User selects online payment → Order created in DB
2. Frontend calls backend → Backend creates Razorpay order
3. Razorpay modal opens → User pays
4. Razorpay returns signature → Frontend sends to backend
5. Backend verifies signature → Order marked as "paid"
6. User redirected to confirmation page

## 🐛 Troubleshooting

### Razorpay modal doesn't open
- Check browser console for errors
- Ensure both servers are running
- Verify `.env` file exists in root directory

### "Invalid key_id" error
- Check `VITE_RAZORPAY_KEY_ID` in `.env`
- Restart frontend dev server after changing `.env`

### Backend errors
- Check `backend/.env` has correct credentials
- Ensure `razorpay` package is installed: `cd backend && npm install`

## 📚 Full Documentation

See `RAZORPAY_INTEGRATION.md` for complete details including:
- Architecture overview
- API reference
- Production checklist
- Advanced troubleshooting

## 🎉 Next Steps

1. ✅ Test the payment flow
2. ✅ Verify order confirmation page
3. ✅ Check admin panel for order details
4. 🔄 Before production: Replace test credentials with live credentials

---

**Need Help?**
- Integration Guide: `RAZORPAY_INTEGRATION.md`
- Razorpay Docs: https://razorpay.com/docs/
