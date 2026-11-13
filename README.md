# Smart Service Booking Platform — Smart All-in-One Service Providing Platform

> *"Every Service, One Smart Platform."*

Smart Service Booking Platform is a modern, responsive web application that connects customers with verified service professionals for home appliances, vehicles, and everyday maintenance needs. It features AI-powered symptom diagnostics, algorithmic pro matching, transparent price estimation, digital service passports for equipment tracking, live GPS-style tracking with route lines, emergency dispatch modes, and multilingual support (English and Tamil).

---

## 🚀 Key Highlights & 10 Smart Features

| # | Feature | Capability Description |
|---|---|---|
| **A** | **AI Smart Service Assistant** | Conversational diagnostic tool where users describe symptoms (e.g., *"My AC is running but not cooling"*). Analyzes probable causes, asks diagnostic follow-ups, recommends the exact catalog service, and provides upfront price ranges with 1-click booking. |
| **B** | **Smart Technician Matching** | Algorithmic scoring evaluating distance, required skills, live availability, customer ratings, and arrival times. Explains why each pro is recommended with human-readable badges (*"Nearest Pro (2.1 km)"*, *"Top Customer Rating (4.9★)"*). |
| **C** | **Transparent Price Estimator & Revised Quotes** | Clear itemized breakdown: Visiting fee + Base labor + Estimated spare parts + 18% GST - Discounts. If additional parts/labor are discovered on-site, the technician must submit a revised quote which requires customer digital approval before extra paid work can begin. |
| **D** | **Digital Service Passport** | Customer vault for registering appliances and vehicles (brand, model, purchase date, serial/plate, warranty expiry). Maintains a lifelong service ledger and calculates automated maintenance reminders based on configurable service intervals. |
| **E** | **Emergency Service SOS Mode** | Urgent priority toggle that dispatches online, available professionals with 25-minute ETA without fabricated guarantees or fake coordinates. |
| **F** | **Service Trust Score Breakdown** | Transparent 0–100 index based on Aadhaar/Govt identity verification (30 pts), job completion ratio (30 pts), customer rating (25 pts), and zero active complaints (15 pts). An explainable audit modal breaks down all factors. |
| **G** | **Before-and-After Service Proof** | Technicians upload dual photos (Before vs After) and notes; customers inspect visual evidence of work before confirming job completion. |
| **H** | **Smart Maintenance Cost Insights** | Annual expense tracking by equipment category and predictive 6-month budget forecasting based on recorded history. |
| **I** | **Rebooking & Subscription Plans** | 1-click rebooking from history + Annual Maintenance Contracts (AMC) for AC deep cleaning, RO purifier filter renewals, and two-wheeler quarterly care. |
| **J** | **Multilingual Support (English & Tamil)** | Complete bilingual experience (English & தமிழ்) for navigation, service categories, booking instructions, and support alerts. |
| **K** | **Customer Loyalty, Bonus & Rewards System** | Automated milestone rewards (Bronze: 5 bookings → ₹100, Silver: 10 → ₹250, Gold: 20 → ₹500, Platinum: 30 → ₹1,000), bonus wallet with checkout redemption, confetti unlock celebrations, and an audited admin control desk. |

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with TypeScript
  - Tailwind CSS (Navy Blue `#0a192f` / `#0f172a`, Crisp Slate Surfaces, Emerald/Teal `#0d9488` / `#14b8a6` accents)
  - Lucide React icons
  - Leaflet Map with interactive technician route polyline and ETA telemetry
  - Canvas Confetti for completion celebrations
- **Backend**:
  - Node.js & Express.js REST API
  - MongoDB with Mongoose (with built-in resilient in-memory fallback for seamless zero-setup demo execution)
  - JWT Authentication with bcrypt password hashing
  - Role-based authorization (`customer`, `technician`, `admin`)

---

## 📁 Project Structure

```text
e:/Design thinking/
├── package.json               # Root launcher with concurrently
├── README.md                  # Complete documentation
├── .env.example               # Environment variables template
├── server/                    # Node.js + Express backend
│   ├── package.json
│   ├── .env
│   ├── server.js              # Server entry point
│   ├── config/db.js           # Database connector
│   ├── middleware/auth.js     # JWT & role authorization
│   ├── models/                # 13 Mongoose Schemas (User, Tech, Service, Booking, Passport, etc.)
│   ├── controllers/           # Auth, Services, Techs, Bookings, AI, Passport, Admin
│   ├── routes/                # Express API routes
│   └── seed/                  # Seed dataset & runner
└── client/                    # React 18 + TypeScript frontend
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── src/
    │   ├── App.tsx            # Main router
    │   ├── context/           # AuthContext (with 1-click Demo Logins), LanguageContext (EN/TA)
    │   ├── components/        # Navbar, Footer, InteractiveMap, TrustBadgeModal
    │   ├── pages/             # All 17 Core Pages:
    │   │   ├── LandingPage.tsx
    │   │   ├── AuthPage.tsx
    │   │   ├── CustomerDashboard.tsx
    │   │   ├── CategoriesPage.tsx
    │   │   ├── ServiceDetailsPage.tsx
    │   │   ├── TechnicianSearchPage.tsx
    │   │   ├── BookingCheckoutPage.tsx
    │   │   ├── LiveTrackingPage.tsx
    │   │   ├── AIAssistantPage.tsx
    │   │   ├── ServicePassportPage.tsx
    │   │   ├── ServiceHistoryInvoicesPage.tsx
    │   │   ├── CustomerProfilePage.tsx
│   │   ├── CustomerRewardsPage.tsx
    │   │   ├── TechnicianDashboard.tsx
    │   │   ├── TechnicianBookingManagement.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── NotificationsPage.tsx
    │   │   └── ReviewsDisputesPage.tsx
    │   ├── services/api.ts    # Axios client with JWT headers
    │   └── utils/translations.ts # English and Tamil dictionary
```

---

## ⚡ Quick Start & Execution

### 1. Install Dependencies
```bash
# In project root
npm run install-all
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Launch Development Server
```bash
# Runs backend on port 5000 and frontend on port 5173 concurrently:
npm run dev
```

Visit **http://localhost:5173** in your browser!

---

## 🔑 Demo Accounts & 1-Click Role Switcher

For instant testing and grading, **1-Click Quick Demo Login** buttons are embedded at the top of the navigation bar and on the Sign In page:

| Role | Demo Email | Password | Pre-seeded Features Available |
|---|---|---|---|
| **Customer** | `customer@servease.ai` | `password123` | Active In-Progress AC booking, completed Bike service, 3 Digital Passport assets, maintenance alerts |
| **Technician** | `arun.tech@servease.ai` | `password123` | Active job dispatch, revised quote submission, before/after proof upload, availability toggles |
| **Admin** | `admin@servease.ai` | `password123` | Analytics dashboard, technician KYC verification queue, dispute resolution desk |

---

## 🏷️ Demo Promo Codes

During checkout, test our promo code system:
- `SERVE50` — ₹50 flat discount
- `SMARTAI` — 15% discount (up to ₹200)
- `WELCOME100` — ₹100 flat discount on orders ₹499+

---

## 🎁 Customer Loyalty, Bonus, and Rewards System

The platform features an enterprise-grade customer loyalty and rewards architecture designed to foster customer retention and encourage repeat bookings.

### 1. Loyalty Tiers & Automated Milestones
Customers automatically progress through tiers as verified completed bookings (`status === 'Completed'`) accumulate:
- **Bronze Member**: **5 completed bookings** → **₹100 bonus**
- **Silver Member**: **10 completed bookings** → **₹250 bonus**
- **Gold Member**: **20 completed bookings** → **₹500 bonus**
- **Platinum Member**: **30 completed bookings** → **₹1,000 bonus**

#### Strict Integrity Rules:
- Only verified, completed bookings with customer OTP signoff count toward milestones. Cancelled, rejected, or refunded bookings do not count.
- Milestone rewards are strictly non-duplicate and idempotent.
- An interactive celebratory modal featuring multi-burst confetti fires when a customer unlocks a new tier.

### 2. Rewards Bonus Wallet & Checkout Redemption
- Dedicated Customer Rewards Dashboard at `/rewards` with tier status, available balance, lifetime earned bonuses, and an immutable transaction audit ledger.
- Seamless redemption at checkout (`BookingCheckoutPage.tsx`):
  - Customers can apply their available wallet bonus directly against service totals.
  - Transparent itemized breakdown displays the loyalty discount line item.
  - Balance debits atomically upon booking creation; cancellations automatically restore the redeemed bonus.

### 3. Admin Loyalty Control Center
Accessible under the **Customer Loyalty & Rewards** tab in `AdminDashboard.tsx`:
- **Real-Time KPIs**: Total Loyalty Members, Platform Lifetime Bonuses Issued, Total Redeemed at Checkout, and Outstanding Wallet Liability.
- **Configurable Tiers**: Live thresholds and bonus reward values can be edited and toggled on/off dynamically.
- **Customer Loyalty Directory**: Search customers by name, email, or phone; inspect completed booking counts, tier badges, and balances.
- **Audited Manual Adjustments**: Admins can issue audited bonus credits or debits with mandatory notes.
- **Transaction Audit Ledger**: Filterable by type (`credit` / `debit`) and category (`milestone_reward`, `booking_redemption`, `admin_adjustment`, `booking_refund`).

### 4. Loyalty REST API Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/loyalty/wallet` | Customer | Get customer wallet, current tier, balance, and next milestone progress |
| `GET` | `/api/loyalty/transactions` | Customer | Get customer reward transaction audit history |
| `POST` | `/api/loyalty/celebrate/acknowledge` | Customer | Dismiss and acknowledge milestone unlock celebration |
| `GET` | `/api/loyalty/admin/summary` | Admin | Get platform loyalty analytics, liabilities, and tier distribution |
| `GET` | `/api/loyalty/admin/customers` | Admin | List all customer loyalty profiles and balances |
| `GET` | `/api/loyalty/admin/transactions` | Admin | Full audit transaction ledger with filters |
| `PUT` | `/api/loyalty/admin/config` | Admin | Configure tier milestones, reward amounts, and program status |
| `POST` | `/api/loyalty/admin/adjust-balance` | Admin | Issue audited manual balance adjustment (+/-) |

---

## 📱 Phone Number OTP Authentication & SMS Gateway Setup

The platform features a secure, carrier-integrated Phone Number OTP authentication system with native Indian mobile (+91) format validation, anti-abuse rate limiting, HMAC-SHA256 hashed token storage, and support for real telecom gateways.

### 1. Supported SMS Gateways

| Provider | Best For | Required `.env` Variables |
|---|---|---|
| **Fast2SMS** (Recommended for India) | Indian 10-digit mobile numbers (+91) without international calling fees | `SMS_PROVIDER=fast2sms`<br>`FAST2SMS_API_KEY=your_key` |
| **Twilio** | International E.164 SMS delivery | `SMS_PROVIDER=twilio`<br>`TWILIO_ACCOUNT_SID=your_sid`<br>`TWILIO_AUTH_TOKEN=your_token`<br>`TWILIO_PHONE_NUMBER=+1xxx` |
| **MSG91** | Enterprise Indian DLT-compliant routing | `SMS_PROVIDER=msg91`<br>`MSG91_AUTH_KEY=your_key`<br>`MSG91_TEMPLATE_ID=your_id` |
| **Development Mode** | Local evaluation without telecom accounts | `SMS_PROVIDER=development` *(Default)* |

### 2. How to Set Up Live SMS Delivery

#### Option A: Fast2SMS (India)
1. Sign up for a free account at [Fast2SMS](https://www.fast2sms.com/).
2. Navigate to **Dev API** in the sidebar and copy your Authorization API Key.
3. In `server/.env`, configure:
   ```ini
   SMS_PROVIDER=fast2sms
   FAST2SMS_API_KEY=your_copied_api_key
   ```
4. Restart the backend server (`npm run dev`). OTPs will now be sent as real SMS to your Indian mobile phone!

#### Option B: Twilio
1. Sign up at [Twilio](https://www.twilio.com/) and acquire a phone number with SMS capability.
2. If using a Twilio Trial account, add your personal phone number to **Verified Caller IDs** in the Twilio Console (trial accounts restrict delivery to verified numbers only).
3. In `server/.env`, configure:
   ```ini
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### 3. Security & Anti-Abuse Controls
- **Cryptographic Generation**: 6-digit random code generated via Node.js `crypto.randomInt(100000, 1000000)`.
- **Hashed Storage**: OTPs are hashed using HMAC-SHA256 with a server salt; plain-text OTPs are never stored in the database.
- **Expiry Window**: 5-minute validity with MongoDB TTL auto-cleanup.
- **Cooldown & Rate Limiting**: 60-second cooldown between resend requests per phone number, and a maximum of 5 requests per hour.
- **Attempt Lockout**: Maximum 5 attempts per OTP; automatically invalidated upon exceeding.
- **Replay Protection**: OTP tokens are deleted immediately upon successful verification so they can never be reused.

### 4. OTP REST API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/send-otp` | Validate 10-digit Indian phone, enforce 60s cooldown, dispatch SMS |
| `POST` | `/api/auth/verify-otp` | Verify OTP against hash, invalidate token, issue JWT authentication |

---

## 🛡️ Security & Reliability

- Secure password hashing using `bcryptjs`.
- Signed JSON Web Tokens (`jwt`) with expiration.
- Role-based middleware prevents unauthorized access to customer, technician, or admin endpoints.
- Server validates all inputs and isolates payment simulation tokens without storing card data.
