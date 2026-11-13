# Smart Service Booking Platform — REST API Documentation

> Complete API reference for Smart Service Booking Platform backend REST services.

---

## Base URL
```text
http://localhost:5000/api
```

## Authentication Header
All protected endpoints require a standard Bearer token in the HTTP Authorization header:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123",
  "role": "customer",
  "phone": "+91 98765 43210"
}
```
- **Success Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65123abc456def789",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "phone": "+91 98765 43210"
  }
}
```

### 1.2 Login User
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "customer@servease.ai",
  "password": "password123"
}
```
- **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65123abc456def789",
    "name": "Suresh Kumar",
    "email": "customer@servease.ai",
    "role": "customer"
  }
}
```

### 1.3 Get Current Profile
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Access**: Authenticated

---

## 2. AI Diagnostics Endpoints (`/api/ai`)

### 2.1 Symptom Analysis & Service Recommendation
- **Method**: `POST`
- **Route**: `/api/ai/diagnose`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "symptoms": "My split AC turns on but doesn't cool the room, and there's a weird hissing sound",
  "category": "Home Appliances"
}
```
- **Success Response (200 OK)**:
```json
{
  "diagnosis": {
    "probableCause": "Refrigerant Gas Leakage / Blocked Air Filters",
    "severity": "Medium",
    "recommendedServiceId": "srv_ac_gas_deep_clean",
    "recommendedServiceName": "AC Deep Jet Cleaning & Gas Top-up",
    "estimatedPriceRange": {
      "min": 799,
      "max": 1499
    },
    "followUpQuestions": [
      "Is ice forming on the outer copper tubing?",
      "When was the last time the indoor filters were cleaned?"
    ]
  }
}
```

---

## 3. Technician Endpoints (`/api/technicians`)

### 3.1 Smart Match Technicians
- **Method**: `GET`
- **Route**: `/api/technicians/match?serviceId=srv_123&lat=13.0827&lng=80.2707`
- **Access**: Authenticated
- **Success Response (200 OK)**:
```json
[
  {
    "technicianId": "tech_01",
    "name": "Arun Kumar",
    "rating": 4.9,
    "reviewCount": 142,
    "distanceKm": 2.1,
    "etaMinutes": 18,
    "trustScore": 96,
    "badges": ["Nearest Pro (2.1 km)", "Top Rated (4.9★)"],
    "isAvailable": true
  }
]
```

### 3.2 Get Technician Public Profile & Trust Breakdown
- **Method**: `GET`
- **Route**: `/api/technicians/:id/trust-breakdown`
- **Access**: Public / Authenticated
- **Response**:
```json
{
  "totalTrustScore": 96,
  "factors": {
    "identityVerification": 30,
    "jobCompletionRate": 28,
    "customerRatingBayesian": 24,
    "cleanDisputeRecord": 14
  },
  "verifiedBadges": ["Govt Aadhaar Verified", "Zero Active Disputes"]
}
```

---

## 4. Bookings Endpoints (`/api/bookings`)

### 4.1 Create Booking
- **Method**: `POST`
- **Route**: `/api/bookings`
- **Access**: Customer
- **Request Body**:
```json
{
  "serviceId": "srv_ac_deep_clean",
  "technicianId": "tech_01",
  "address": "Flat 4B, Ocean Crest Apartments, Chennai",
  "scheduledDate": "2026-10-15T10:00:00Z",
  "promoCode": "SMARTAI",
  "isEmergencySOS": false
}
```

### 4.2 Submit Revised Quote (Technician Only)
- **Method**: `POST`
- **Route**: `/api/bookings/:id/revised-quote`
- **Access**: Technician
- **Request Body**:
```json
{
  "additionalPartsCost": 450,
  "additionalLaborCost": 150,
  "reason": "Capacitor 45uF blown; requires replacement"
}
```

### 4.3 Approve / Reject Revised Quote (Customer Only)
- **Method**: `PATCH`
- **Route**: `/api/bookings/:id/revised-quote-approval`
- **Access**: Customer
- **Request Body**:
```json
{
  "approved": true
}
```

---

## 5. Digital Service Passport Endpoints (`/api/passport`)

### 5.1 List User's Registered Assets
- **Method**: `GET`
- **Route**: `/api/passport/assets`
- **Access**: Customer

### 5.2 Register New Asset
- **Method**: `POST`
- **Route**: `/api/passport/assets`
- **Access**: Customer
- **Request Body**:
```json
{
  "assetType": "appliance",
  "category": "Air Conditioner",
  "brand": "Daikin",
  "model": "FTKP50TV16U",
  "serialNumber": "DKN-2023-89912",
  "purchaseDate": "2023-04-12",
  "warrantyExpiry": "2028-04-12",
  "maintenanceIntervalDays": 120
}
```

---

## 6. Service Proof Endpoints (`/api/proof`)

### 6.1 Upload Before/After Evidence
- **Method**: `POST`
- **Route**: `/api/proof/:bookingId/upload`
- **Access**: Technician
- **Request Body**:
```json
{
  "beforePhotoUrl": "https://storage.servease.ai/proofs/b_123_before.jpg",
  "afterPhotoUrl": "https://storage.servease.ai/proofs/b_123_after.jpg",
  "technicianNotes": "Burned compressor terminal replaced; system pulling 6.2A normally."
}
```

---

## 7. Admin Endpoints (`/api/admin`)

### 7.1 Platform Overview Analytics
- **Method**: `GET`
- **Route**: `/api/admin/analytics`
- **Access**: Admin

### 7.2 Technician KYC Approval
- **Method**: `PATCH`
- **Route**: `/api/admin/technicians/:id/verify`
- **Access**: Admin
- **Request Body**:
```json
{
  "verified": true,
  "verifiedBy": "Admin Operations"
}
```
