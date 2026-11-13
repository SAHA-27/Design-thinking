# Smart Service Booking Platform — Local Setup, Seeding & Execution Guide

> Complete onboarding manual for launching and testing the Smart Service Booking Platform locally.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher (check via `node -v`)
- **npm**: `v9.x` or higher (check via `npm -v`)
- **Git**: For version control
- *(Optional)* **MongoDB**: Local MongoDB instance running on port 27017 or a MongoDB Atlas URI. *(Note: If MongoDB is absent, Smart Service Booking Platform automatically activates its resilient in-memory fallback for a zero-setup experience).*

---

## 1. Quick Launch (3-Step Fast Track)

From the project root directory (`e:\Design thinking`):

### Step 1: Install All Dependencies
Installs dependencies across root, server, and client directories:
```bash
npm run install-all
```

### Step 2: Seed the Database
Populates database collections with initial services, categories, demo users, sample equipment passports, and mock bookings:
```bash
npm run seed
```

### Step 3: Run Development Server
Spawns both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

---

## 2. Environment Variables Configuration

The repository includes a template file `.env.example` at the project root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/servease
JWT_SECRET=servease_super_secret_jwt_key_2026
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

To customize your backend environment, create `server/.env` with your preferred values:
```bash
# Windows PowerShell
Copy-Item .env.example server/.env
```

---

## 3. Demo Roles & Instant Testing Switchers

The application features **1-Click Quick Demo Login** buttons accessible directly from the top navigation bar and on the Sign In page (`/auth`):

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Customer** | `customer@servease.ai` | `password123` | - Active in-progress AC booking<br>- Live GPS tracking page<br>- Digital Passport asset management<br>- AI Symptom Assistant diagnostic chat |
| **Technician** | `arun.tech@servease.ai` | `password123` | - Active dispatched jobs<br>- Submit revised quotes for extra parts<br>- Upload Before & After photographic evidence<br>- Toggle online/offline status |
| **Admin** | `admin@servease.ai` | `password123` | - Platform KPI analytics<br>- Technician KYC & Aadhaar verification queue<br>- Customer grievance and dispute resolution |

---

## 4. Testing Core Platform Flows

### Flow 1: AI Symptom Diagnostics
1. Click **"AI Assistant"** in the navigation bar.
2. Type: *"My AC is leaking water and not cooling."*
3. Observe the AI diagnostic analysis, follow-up clarification questions, and immediate service catalog recommendation with price estimate.
4. Click **"Book Recommended Service"** to initiate checkout.

### Flow 2: Live Tracking & GPS Telemetry
1. Log in as **Customer**.
2. Visit **"Live Tracking"** from the dashboard for the active booking.
3. Observe the Leaflet interactive map with route polyline, live driver telemetry, and dynamic ETA updates.

### Flow 3: Revised Quote Approval
1. In one browser window/incognito session, log in as **Technician** (`arun.tech@servease.ai`).
2. Go to **Technician Dashboard** -> Click active job -> Submit Revised Quote (e.g., *₹450 for replacement capacitor*).
3. In your customer session, refresh or navigate to the booking view.
4. Review the revised quote alert and click **"Approve Extra Charges"**.

---

## 5. Troubleshooting Common Issues

### Issue: Port 5000 or 5173 Already in Use
- **Resolution**:
  - For port 5000: Stop any running Node processes or adjust `PORT=5001` in `server/.env` and update `VITE_API_BASE_URL` in `client/.env`.
  - For port 5173: Vite will automatically offer the next available port (e.g., 5174).

### Issue: MongoDB Connection Refused
- Smart Service Booking Platform contains a built-in memory fallback mechanism. If no MongoDB server is active, it will automatically launch and populate an in-memory data store for uninterrupted testing.

### Issue: npm install Errors on Windows
- Ensure PowerShell execution policy allows local scripts:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
