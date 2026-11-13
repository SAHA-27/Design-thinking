# Smart Service Booking Platform — Feature Specifications & Technical Deep Dive

> An in-depth functional and technical breakdown of the 10 smart capabilities powering the Smart Service Booking Platform.

---

## Table of Contents

1. [Feature A: AI Smart Service Assistant](#feature-a-ai-smart-service-assistant)
2. [Feature B: Smart Technician Matching](#feature-b-smart-technician-matching)
3. [Feature C: Transparent Price Estimator & Revised Quotes](#feature-c-transparent-price-estimator--revised-quotes)
4. [Feature D: Digital Service Passport](#feature-d-digital-service-passport)
5. [Feature E: Emergency Service SOS Mode](#feature-e-emergency-service-sos-mode)
6. [Feature F: Service Trust Score Breakdown](#feature-f-service-trust-score-breakdown)
7. [Feature G: Before-and-After Service Proof](#feature-g-before-and-after-service-proof)
8. [Feature H: Smart Maintenance Cost Insights](#feature-h-smart-maintenance-cost-insights)
9. [Feature I: Rebooking & Subscription Plans (AMC)](#feature-i-rebooking--subscription-plans-amc)
10. [Feature J: Multilingual Support (English & Tamil)](#feature-j-multilingual-support-english--tamil)

---

## Feature A: AI Smart Service Assistant

### Overview
Users often struggle to diagnose household equipment failures or describe technical problems accurately. The **AI Smart Service Assistant** is a conversational diagnostic engine that bridges the terminology gap between non-technical consumers and service catalogs.

```
+-----------------------------------------------------------+
|                    Customer Chat Input                    |
|           "My AC is running but blowing warm air"         |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|               AI Symptom Classifier & NLP                 |
| - Extracts Keywords: [AC, running, warm air, no cooling]  |
| - Matches Fault Patterns: Low Refrigerant / Dirty Coils   |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|               Interactive Diagnostic Dialogue             |
| 1. "Is the outdoor unit fan spinning?"                    |
| 2. "Any unusual ice formation on the copper pipes?"       |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                 Precise Service Recommendation            |
| -> "AC Deep Jet Cleaning & Gas Top-up"                   |
| -> Upfront Price Bracket: ₹799 - ₹1,499                   |
| -> 1-Click "Proceed to Booking" CTA                      |
+-----------------------------------------------------------+
```

### Key Technical Attributes
- **Symptom Taxonomy**: Maps fuzzy consumer descriptions to root-cause fault trees across categories (HVAC, Refrigeration, Plumbing, Two-Wheeler mechanics, Electricals).
- **Proactive Follow-ups**: Formulates multi-choice diagnostic questions to narrow down whether the issue requires basic servicing vs. component replacement.
- **Dynamic Catalog Linking**: Automatically links identified issues directly to available inventory services with estimated price bands.

---

## Feature B: Smart Technician Matching

### Algorithmic Scoring Engine
Technician assignment avoids naive round-robin or raw proximity dispatch. Smart Service Booking Platform computes a composite **Match Score (0-100)**:

$$\text{Match Score} = (W_{\text{dist}} \times S_{\text{dist}}) + (W_{\text{skill}} \times S_{\text{skill}}) + (W_{\text{rating}} \times S_{\text{rating}}) + (W_{\text{avail}} \times S_{\text{avail}})$$

| Metric Factor | Weight | Scoring Logic |
|---|---|---|
| **Distance Proximity** | 35% | Exponential decay based on Haversine distance from customer coordinates |
| **Skill & Experience** | 25% | Direct match with required service specialization + years in trade |
| **Customer Rating** | 25% | Verified reviews Bayesian average ($R \in [1.0, 5.0]$ normalized to 100) |
| **Live Availability & Queue** | 15% | Real-time status (Online / Active Jobs / Estimated Current Job Completion) |

### Transparent Explanatory Badges
Every recommended professional displays human-readable justification badges:
- `Nearest Pro (2.1 km away)`
- `Top Rated (4.9★ / 140+ jobs)`
- `Certified Master Technician (8+ yrs exp)`
- `Quick Response (< 15 mins)`

---

## Feature C: Transparent Price Estimator & Revised Quotes

### Pricing Model
Hidden charges and surprise bills degrade user trust. Smart Service Booking Platform enforces an itemized pricing breakdown upfront:

```
+-------------------------------------------------------+
|  Itemized Cost Breakdown                              |
+-------------------------------------------------------+
|  Visiting & Inspection Fee          : ₹149.00         |
|  Standard Labor Charge              : ₹350.00         |
|  Estimated Spare Parts & Consumables: ₹200.00         |
|  Applicable GST (18%)               : ₹125.82         |
|  Applied Coupon Discount            : -₹50.00         |
| ----------------------------------------------------- |
|  TOTAL ESTIMATED AMOUNT             : ₹774.82         |
+-------------------------------------------------------+
```

### On-Site Revised Quote Digital Approval Gate
If on-site inspection uncovers additional damaged parts:
1. Technician cannot arbitrarily charge the customer.
2. Technician submits a **Digital Revised Quote** via the Technician Dashboard detailing:
   - Specific part name and serial requirement
   - Additional labor hours
   - Itemized delta price
3. Customer receives a real-time push prompt on their dashboard.
4. **Hard Gate**: Technician app remains blocked until the customer approves the revised quote digitally with a single click.

---

## Feature D: Digital Service Passport

The **Digital Service Passport** functions as an immutable, centralized digital logbook for appliances and motor vehicles.

### Capabilities
- **Asset Registration**: Customers register items with Brand, Model, Serial/Chassis Number, Purchase Date, and Warranty Expiration.
- **Service Ledger**: Every completed booking automatically appends a tamper-proof maintenance log entry (date, technician name, odometer/hours, parts replaced, invoice link).
- **Predictive Maintenance Alerts**: Calculates future service intervals (e.g., RO filter replacement every 6 months, bike oil change every 3,000 km or 90 days) and triggers proactive notifications.

---

## Feature E: Emergency Service SOS Mode

For urgent scenarios (water pipe burst, electrical short circuit, flat tire on transit):
- **Priority Dispatch**: Bypasses scheduled booking queues and pings all active, verified professionals within a 5 km radius.
- **Real-Time Telemetry**: Guarantees sub-25-minute ETA without fabricated coordinates or static mock timers.
- **Instant SMS/Push Alerting**: Priority alerts pushed to technician devices with one-tap accept.

---

## Feature F: Service Trust Score Breakdown

To protect consumers against fake ratings and fraudulent operators, Smart Service Booking Platform calculates an audited **Trust Score (0–100)**:

```
+-----------------------------------------------------------+
|              Trust Score Distribution (100 Max)           |
+-----------------------------------------------------------+
| [30 pts] Government ID & Police/Aadhaar Verification      |
| [30 pts] Historical Job Completion Rate (> 95%)           |
| [25 pts] Verified Customer Reviews Bayesian Average        |
| [15 pts] Zero Active / Unresolved Customer Grievances      |
+-----------------------------------------------------------+
```

An interactive **Trust Badge Modal** is accessible on every technician card, allowing customers to inspect each factor before booking.

---

## Feature G: Before-and-After Service Proof

To prevent disputes and ensure quality workmanship:
1. **Initial Inspection**: Technician photographs the faulty component or equipment state before initiating repairs and uploads it as **Before Proof**.
2. **Completion Inspection**: Upon repair, technician captures the restored equipment operating correctly as **After Proof**.
3. **Customer Inspection Gate**: Customer reviews side-by-side photos in the Customer Evidence Review Page prior to OTP confirmation and payment release.

---

## Feature H: Smart Maintenance Cost Insights

- **Expense Categorization**: Visual breakdown of household upkeep costs segmented by category (HVAC, Vehicle, Plumbing, Electronics).
- **6-Month Predictive Forecasting**: Machine-learning projection forecasting anticipated maintenance costs based on equipment age, historical failure cycles, and seasonal demands (e.g., pre-summer AC tune-up).

---

## Feature I: Rebooking & Subscription Plans (AMC)

- **1-Click Rapid Rebooking**: Re-dispatch the same preferred technician for recurring chores.
- **Annual Maintenance Contracts (AMC)**:
  - *AC Summer Chill Plan*: 3 scheduled jet cleanings + free gas top-up insurance.
  - *PureWater RO Care*: Semi-annual sediment, carbon, and RO membrane renewals.
  - *Two-Wheeler Commuter Guard*: 4 seasonal oil and brake inspections per year.

---

## Feature J: Multilingual Support (English & Tamil)

Smart Service Booking Platform provides first-class internationalization for English and தமிழ் (`Tamil`):
- Dynamic UI toggle in the navbar.
- Context-aware localized terminology across services (e.g., *"ஏசி சர்வீஸ்"*, *"பிளம்பிங்"*, *"மின்சார பழுது"*).
- Localized booking statuses, invoice details, and customer notification messages.
