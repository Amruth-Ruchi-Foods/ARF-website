# Razorpay Payment Integration

## Overview
Razorpay Standard Web Checkout has been successfully integrated into the ARF website for processing online payments (UPI, Card, Netbanking).

## Architecture

### Backend (Node.js/Express)
- **Location**: `backend/src/routes/payment.ts`
- **Endpoints**:
  - `POST /api/payment/create-order` - Creates a Razorpay order
  - `POST /api/payment/verify` - Verifies payment signature
  - `GET /api/payment/key` - Returns public Razorpay key

### Frontend (React/Vite)
- **Service**: `src/services/razorpay.ts`
- **Integration**: `src/pages/CheckoutPage.tsx`
- **Types**: `src/types/razorpay.d.ts`

## Configuration

### Backend Environment Variables
Located in `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
RAZORPAY_KEY_SECRET=iGd0WMKuR0R0v4hRiIB3Fx4U
```

### Frontend Environment Variables
Located in `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
VITE_API_URL=http://localhost:3001
```

**⚠️ SECURITY NOTE**: Never expose `RAZORPAY_KEY_SECRET` to the frontend!

## Payment Flow

1. **User initiates checkout** with UPI/Card/Netbanking payment method
2. **Order is created** in the database
3. **Frontend calls** `/api/payment/create-order` with amount in paise
4. **Backend creates** Razorpay order via Razorpay API
5. **Razorpay Checkout modal** opens with order details
6. **User completes payment** in Razorpay modal
7. **Razorpay returns** payment_id, order_id, and signature
8. **Frontend calls** `/api/payment/verify` to verify signature
9. **Backend verifies** signature using HMAC-SHA256
10. **Order status updated** to "paid" and "confirmed"
11. **User redirected** to order confirmation page

## Files Created/Modified

### Created
1. `backend/src/routes/payment.ts` - Payment endpoints
2. `src/services/razorpay.ts` - Razorpay service
3. `src/types/razorpay.d.ts` - TypeScript declarations
4. `.env` - Frontend environment variables
5. `RAZORPAY_INTEGRATION.md` - This documentation

### Modified
1. `backend/.env` - Added Razorpay credentials
2. `backend/src/types/index.ts` - Added payment fields to Order type
3. `backend/src/db/store.ts` - Added payment status update function
4. `src/pages/CheckoutPage.tsx` - Integrated Razorpay payment
5. `src/services/api.ts` - Added axios instance for API calls
6. `package.json` - Added axios dependency

## Testing

### Prerequisites
1. Both servers must be running:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. Razorpay test credentials are already configured

### Test Payment Flow

1. **Add products to cart** on the website
2. **Go to checkout** page
3. **Fill in delivery details**:
   - Name: Test User
   - Phone: 9999999999
   - Email: test@example.com
   - Address, City, State, Pincode
4. **Select payment method**: UPI, Card, or Netbanking
5. **Click "Place Order & Pay"**
6. **Razorpay modal opens** with order details
7. **Use Razorpay test cards**:
   - **Success**: Card: 4111 1111 1111 1111, CVV: any 3 digits, Expiry: any future date
   - **Failure**: Card: 4111 1111 1111 1112

### Test Cases

#### ✅ Successful Payment
- Select Card payment
- Use test card: 4111 1111 1111 1111
- Payment should succeed
- Order status: "confirmed"
- Redirect to order confirmation page

#### ❌ Failed Payment
- Select Card payment
- Use test card: 4111 1111 1111 1112
- Payment should fail
- User sees error message
- Order remains pending

#### 🚫 Cancelled Payment
- Select any online payment
- Click "X" on Razorpay modal
- Payment cancelled
- User remains on checkout page
- Can retry payment

#### 💵 Cash on Delivery
- Select COD
- No Razorpay modal
- Order created directly
- Status: "pending"

## Error Handling

### Backend
- Amount validation (minimum 100 paise)
- Razorpay API errors (500 status)
- Authentication failures (401 status)
- Signature mismatch (400 status)

### Frontend
- Script loading failures
- Order creation failures
- Payment modal dismissal
- Payment failures
- Verification failures

## Security Features

1. **Signature verification** using HMAC-SHA256
2. **Environment variables** for credentials
3. **Server-side order creation** (amount cannot be tampered)
4. **Server-side verification** before order confirmation
5. **Key secret** never exposed to frontend

## Production Checklist

Before going live:

1. ✅ Replace test credentials with live credentials:
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
   RAZORPAY_KEY_SECRET=live_secret_XXXXXXXXX
   ```

2. ✅ Update `.env` files on production server

3. ✅ Enable webhook for payment notifications:
   - URL: `https://yourdomain.com/api/payment/webhook`
   - Events: `payment.captured`, `payment.failed`

4. ✅ Test with live credentials in test mode first

5. ✅ Add `.env` to `.gitignore` (already done)

6. ✅ Set up proper error logging and monitoring

7. ✅ Configure proper CORS for production domain

## Troubleshooting

### Payment modal doesn't open
- Check browser console for errors
- Verify Razorpay script loaded: `window.Razorpay`
- Check `VITE_RAZORPAY_KEY_ID` in `.env`

### "Invalid key_id" error
- Verify `RAZORPAY_KEY_ID` matches in backend and frontend
- Check environment variables are loaded

### Signature verification fails
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check signature algorithm (HMAC-SHA256)
- Ensure order_id and payment_id are correct

### Backend not receiving requests
- Check backend is running on correct port (3001)
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS configuration

## API Reference

### Create Order
```typescript
POST /api/payment/create-order
Content-Type: application/json

{
  "amount": 99900,        // in paise (₹999)
  "currency": "INR",
  "receipt": "order_123",
  "notes": {
    "orderId": "order_123"
  }
}

Response:
{
  "success": true,
  "order": {
    "id": "order_MNqwertyABC",
    "amount": 99900,
    "currency": "INR",
    "receipt": "order_123"
  }
}
```

### Verify Payment
```typescript
POST /api/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_MNqwertyABC",
  "razorpay_payment_id": "pay_MNqwertyXYZ",
  "razorpay_signature": "abc123def456...",
  "orderId": "order_123"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "payment_id": "pay_MNqwertyXYZ",
  "order_id": "order_MNqwertyABC"
}
```

## Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For integration issues:
- Check logs in browser console (frontend)
- Check logs in terminal (backend)
- Review this documentation
