# Brevo Email Automation System

Complete email automation for Customise Me UK using Brevo (formerly Sendinblue).

## Architecture

- **Express Backend** (`backend/`): Standalone API for email flows when deployed
- **Firebase Functions** (`functions/`): Uses Brevo for transactional emails (order, welcome, shipping, account)
- **Frontend** (`src/`): NewsletterForm component, EmailApiService for API calls

## Setup

### 1. Brevo Account

1. Sign up at [brevo.com](https://www.brevo.com)
2. Create an API key: **SMTP & API** → **API Keys** → Generate
3. Create lists: **Contacts** → **Lists** → "Newsletter" (ID 2), "Customers" (ID 3)
4. Verify sender domain and add SPF/DKIM records
5. Verify sender email (e.g. noreply@customisemeuk.com)

### 2. Firebase Functions (Primary for this app)

```bash
cd functions
firebase functions:secrets:set BREVO_API_KEY
firebase functions:secrets:set EMAIL_FROM   # e.g. noreply@customisemeuk.com
firebase deploy --only functions
```

The app uses Firebase Functions by default. Order confirmation, welcome, shipping, and account emails are sent via Brevo when `BREVO_API_KEY` is set.

### 3. Express Backend (Optional)

Deploy the Express API to Railway, Render, or similar for:

- Newsletter subscription with Brevo list management
- Standalone email API
- Rate limiting and validation

```bash
cd backend
cp .env.example .env
# Edit .env with your Brevo credentials
npm install
npm start
```

Set `VITE_EMAIL_API_URL` in the frontend `.env` to point to your deployed API (e.g. `https://your-api.railway.app`).

## Email Flows

| Flow | Trigger | Provider |
|------|---------|----------|
| Newsletter | Footer form submit | Express API or Firebase |
| Order Confirmation | Stripe webhook (checkout complete) | Firebase → Brevo |
| Shipping Notification | Admin marks order shipped | Firebase → Brevo |
| Account Welcome | User registration | Firebase → Brevo |
| Password Reset | User requests reset | Express API (custom flow) |

## API Endpoints (Express)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/email/subscribe` | Newsletter signup + welcome email |
| POST | `/api/email/order-confirmation` | Order confirmation email |
| POST | `/api/email/shipping-notification` | Shipping notification |
| POST | `/api/email/account-welcome` | Account creation welcome |
| POST | `/api/email/password-reset` | Password reset email |

### Request Examples

**POST /api/email/subscribe**
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST /api/email/order-confirmation**
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "orderNumber": "CMUK_001",
  "orderDate": "14/02/2026",
  "orderTotal": "£50.00",
  "items": [
    { "name": "T-Shirt", "quantity": 2, "price": 25.00 }
  ],
  "shippingAddress": "123 Test St, London, UK"
}
```

## Environment Variables

### Backend (Express)

| Variable | Required | Description |
|----------|----------|-------------|
| BREVO_API_KEY | Yes | Brevo API key |
| BREVO_SENDER_EMAIL | No | Default: noreply@customisemeuk.com |
| BREVO_SENDER_NAME | No | Default: Customise Me UK |
| BREVO_NEWSLETTER_LIST_ID | No | Default: 2 |
| BREVO_CUSTOMERS_LIST_ID | No | Default: 3 |
| BASE_URL | No | Default: https://customisemeuk.com |
| PORT | No | Default: 3001 |

### Firebase Functions

| Secret | Required | Description |
|--------|----------|-------------|
| BREVO_API_KEY | Yes (for Brevo) | Brevo API key. Set to "disabled" for Gmail fallback only |
| EMAIL_FROM | Yes | Sender email address |
| EMAIL_USER, EMAIL_PASS | For Gmail fallback | Gmail credentials when Brevo not used |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_EMAIL_API_URL | No | Express API URL. If set, newsletter uses API; else Firebase |

## Security

- API keys only in backend / secrets
- Rate limiting: 5/hour newsletter, 20/hour other endpoints
- Email validation and disposable-domain blocklist
- CORS restricted to customisemeuk.com and localhost

## Testing

1. **Newsletter**: Submit footer form → check Brevo dashboard for contact + email
2. **Order**: Complete Stripe checkout → confirm email within 30 seconds
3. **Account**: Register new user → welcome email
4. **Shipping**: Use admin to mark order shipped → notification email
