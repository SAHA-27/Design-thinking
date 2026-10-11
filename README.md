run# ServEase AI — Smart All-in-One Service Providing Platform

> *"Every Service, One Smart Platform."*

ServEase AI is a modern, responsive web application that connects customers with verified service professionals for home appliances, vehicles, and everyday maintenance needs. It features AI-powered symptom diagnostics, algorithmic pro matching, transparent price estimation, digital service passports for equipment tracking, live GPS-style tracking with route lines, emergency dispatch modes, and multilingual support (English and Tamil).

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

## 🛡️ Security & Reliability

- Secure password hashing using `bcryptjs`.
- Signed JSON Web Tokens (`jwt`) with expiration.
- Role-based middleware prevents unauthorized access to customer, technician, or admin endpoints.
- Server validates all inputs and isolates payment simulation tokens without storing card data.
