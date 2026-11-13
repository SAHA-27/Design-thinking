# Smart Service Booking Platform — System Architecture & Technical Specifications

> Architectural blueprints, technical flow diagrams, data models, and security infrastructure for Smart Service Booking Platform.

---

## 1. High-Level Architecture Overview

Smart Service Booking Platform is architected as a modular, decoupled full-stack platform consisting of a responsive Single Page Application (SPA) frontend and an asynchronous Express.js REST API service layer with persistent data storage.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|               React 18 + TypeScript + Vite + Tailwind CSS + Leaflet               |
|                                                                                   |
|  [ AuthContext ]    [ LanguageContext (EN/TA) ]    [ Axios API Interceptor ]      |
+-----------------------------------------+-----------------------------------------+
                                          |
                                    HTTPS / REST JSON
                                          |
+-----------------------------------------v-----------------------------------------+
|                                  BACKEND LAYER                                    |
|                         Node.js (v18+) & Express.js REST API                      |
|                                                                                   |
|  [ JWT Auth Middleware ]   [ Role Guard (Customer / Tech / Admin) ]  [ Rate Limiter ]|
+-----------------------------------------+-----------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| Controllers & API |           | Matching Engine & |           | Diagnostic Engine |
| - Bookings        |           | Trust Scoring     |           | - NLP Classifier  |
| - Passport        |           | - Distance/Rating |           | - Decision Matrix |
| - ProofCare       |           | - Audit Calculator|           | - Auto-Estimator  |
+---------+---------+           +---------+---------+           +---------+---------+
          |                               |                               |
          +-------------------------------+-------------------------------+
                                          |
                                    Mongoose ORM
                                          |
+-----------------------------------------v-----------------------------------------+
|                               PERSISTENCE LAYER                                   |
|                MongoDB (Primary) with Built-in Resilient Fallback                  |
|                                                                                   |
|  [Users] [Technicians] [Services] [Bookings] [RegisteredAssets] [Reviews] [Notifs]|
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture (React 18 + TypeScript)

### Directory Breakdown
```text
client/src/
├── App.tsx                     # Top-level Routing (React Router v6)
├── context/
│   ├── AuthContext.tsx         # User session, JWT tokens, 1-Click Demo accounts
│   └── LanguageContext.tsx     # Internationalization state (English & Tamil)
├── components/
│   ├── Navbar.tsx              # Universal navigation, language switcher, role indicator
│   ├── Footer.tsx              # Platform links, regulatory notes, trust credentials
│   ├── InteractiveMap.tsx      # Leaflet live route polyline & telemetry simulation
│   └── TrustBadgeModal.tsx     # Transparent 100-point trust score audit modal
├── pages/                      # 18 Modular Views
│   ├── LandingPage.tsx         # Marketing hero, feature showcases, testimonials
│   ├── AuthPage.tsx            # Login, registration, 1-click quick demo buttons
│   ├── CustomerDashboard.tsx   # Active bookings, recommended services, quick actions
│   ├── CategoriesPage.tsx      # Filterable service catalog
│   ├── ServiceDetailsPage.tsx  # Pricing breakdown, checklist, customer reviews
│   ├── TechnicianSearchPage.tsx# Smart matching algorithm results & filter badges
│   ├── BookingCheckoutPage.tsx # Address selection, promo codes, price calculations
│   ├── LiveTrackingPage.tsx    # Leaflet map tracking, ETA countdown, call technician
│   ├── AIAssistantPage.tsx     # Conversational symptom diagnostics & quote generator
│   ├── ServicePassportPage.tsx # Asset ledger, maintenance schedules, warranty tracking
│   ├── ServiceHistoryInvoicesPage.tsx # Historical receipts and itemized invoices
│   ├── CustomerEvidenceReviewPage.tsx # Before/After proof inspection & approval gate
│   ├── CustomerProfilePage.tsx # User settings, addresses, security preferences
│   ├── TechnicianDashboard.tsx # Active jobs, availability toggle, earnings snapshot
│   ├── TechnicianBookingManagement.tsx # Dispatch status, revised quotes, proof uploads
│   ├── AdminDashboard.tsx      # Platform analytics, technician KYC verification, disputes
│   ├── NotificationsPage.tsx   # Real-time event notifications and alerts
│   └── ReviewsDisputesPage.tsx # Customer feedback portal and conflict resolution
├── services/
│   └── api.ts                  # Axios client configured with JWT interceptors
└── utils/
    └── translations.ts         # English and Tamil localized strings dictionary
```

### State Management Strategy
- **Context API**: Handles global authorization state and active locale (`EN`/`TA`).
- **Local State**: Managed with React hooks (`useState`, `useEffect`, `useMemo`) for component-scoped operations to ensure fast rendering and zero boilerplate.
- **Interceptors**: Axios instance in `client/src/services/api.ts` automatically extracts JWT credentials from `localStorage` and injects `Authorization: Bearer <token>` into outgoing HTTP requests.

---

## 3. Backend Architecture (Node.js & Express)

### Core Modules & API Routes
```text
server/
├── config/
│   └── db.js                  # Resilient database connection logic
├── middleware/
│   └── auth.js                # JWT validation & role-based access control (RBAC)
├── models/
│   ├── User.js                # Base accounts (Customer, Technician, Admin)
│   ├── TechnicianProfile.js   # Skills, coordinates, verification status, rating stats
│   ├── ServiceCategory.js     # Top-level categorizations (HVAC, Auto, Plumbing, etc.)
│   ├── Service.js             # Base price, turnaround times, inclusions
│   ├── Booking.js             # State machine (pending, accepted, in-progress, completed)
│   ├── RegisteredAsset.js     # Digital Passport equipment vault records
│   ├── Review.js              # Customer ratings, trust feedback
│   ├── Complaint.js           # Dispute tickets and resolution workflow
│   └── Notification.js        # User push/inbox alerts
├── controllers/               # Business logic handlers
└── routes/
    ├── authRoutes.js          # /api/auth (register, login, me)
    ├── serviceRoutes.js       # /api/services (list, detail, category filter)
    ├── technicianRoutes.js    # /api/technicians (matching algorithm, profile)
    ├── bookingRoutes.js       # /api/bookings (create, track, status, revise-quote)
    ├── aiRoutes.js            # /api/ai (symptom diagnosis & service mapping)
    ├── passportRoutes.js      # /api/passport (asset CRUD, maintenance scheduler)
    ├── proofCareRoutes.js     # /api/proof (before/after photo uploads & approvals)
    ├── reviewRoutes.js        # /api/reviews (review creation & dispute filing)
    ├── adminRoutes.js         # /api/admin (analytics, KYC approvals)
    └── notificationRoutes.js  # /api/notifications (alert queue)
```

---

## 4. Database Schema Relationships

```
+---------------+           1:1           +-----------------------+
|     User      | ----------------------< |   TechnicianProfile   |
| (Credentials) |                         |  (Skills, GPS, Trust) |
+-------+-------+                         +-----------+-----------+
        |                                             |
        | 1:N                                         | 1:N
        v                                             v
+-------+-------+          Assigned To            +---+---+
|    Booking    | >-----------------------------< | Tech  |
+-------+-------+
        |
        +-- 1:1 --> [ RegisteredAsset (Service Passport) ]
        |
        +-- 1:N --> [ Review & Dispute Ticket ]
        |
        +-- 1:1 --> [ Before & After Proof Evidence ]
```

---

## 5. Security & Reliability Model

1. **Authentication**: Passwords salted and hashed with `bcryptjs` (salt rounds: 10). Authentication tokens minted via `jsonwebtoken` with HMAC-SHA256 signature and configurable lifespan.
2. **Role-Based Authorization (RBAC)**:
   - `auth`: Ensures token validity.
   - `authorize('technician')`: Blocks non-technicians from job controls and quote revisions.
   - `authorize('admin')`: Blocks non-administrators from KYC verification queues and analytics.
3. **Resilient In-Memory Database Fallback**: Built-in automated fallback mechanism allows zero-setup demo environments to operate seamlessly without requiring a local MongoDB instance.
4. **Data Validation**: Strict input validation prevents parameter pollution and injection attacks.
