const { getStore } = require('../services/dataStore');

// Built-in intelligent diagnostic knowledge base
const diagnosticRules = [
  {
    category: 'AC Installation, Repair & Maintenance',
    slug: 'ac-service',
    keywords: ['ac', 'air conditioner', 'cooling', 'ice', 'gas', 'leaking water', 'compressor', 'split ac', 'window ac', 'blower'],
    diagnose: (prompt) => {
      const p = prompt.toLowerCase();
      if (p.includes('not cooling') || p.includes('cooling dropped') || p.includes('hot air')) {
        return {
          identifiedCategory: 'AC Installation, Repair & Maintenance',
          serviceSlug: 'ac-service',
          serviceTitle: 'AC Gas Leak Check & Refrigerant Top-up',
          recommendedServiceId: '662000000000000000000004',
          possibleCauses: [
            'Low refrigerant (gas) level due to hairline copper vibration micro-leak',
            'Severe dust or grime clogging on the outdoor condenser or indoor evaporator coil',
            'Faulty compressor capacitor or thermistor sensor reading mismatch'
          ],
          followUpQuestions: [
            'Is the outdoor compressor unit turning on and humming, or does only the indoor blower fan blow normal air?',
            'Have you noticed any ice or frost accumulating on the thin copper pipe near the outdoor unit?'
          ],
          priceRange: {
            visitingCharge: 199,
            laborMin: 1299,
            laborMax: 1599,
            estimatedPartsMin: 1500,
            estimatedPartsMax: 2800,
            estimatedTotalMin: 1498,
            estimatedTotalMax: 4598
          },
          disclaimer: 'Note: These are preliminary diagnostics based on symptom telemetry. Confirmed cause requires technician manifold pressure gauge testing at site.'
        };
      }
      return {
        identifiedCategory: 'AC Installation, Repair & Maintenance',
        serviceSlug: 'ac-service',
        serviceTitle: 'AC Power Jet Foam Deep Cleaning',
        recommendedServiceId: '662000000000000000000003',
        possibleCauses: [
          'Choked antibacterial filters restricting cubic airflow',
          'Algae or dirt buildup inside the indoor drain tray causing condensate overflow',
          'Restricted heat dissipation across condenser aluminium fins'
        ],
        followUpQuestions: [
          'When was the last time the AC unit underwent high-pressure jet pump cleaning?',
          'Is water dripping from the indoor wall casing inside the room?'
        ],
        priceRange: {
          visitingCharge: 149,
          laborMin: 599,
          laborMax: 799,
          estimatedPartsMin: 0,
          estimatedPartsMax: 200,
          estimatedTotalMin: 748,
          estimatedTotalMax: 999
        },
        disclaimer: 'Note: Technicians conduct a 10-point cooling delta audit during service.'
      };
    }
  },
  {
    category: 'RO Water Purifier Service',
    slug: 'ro-water-purifier',
    keywords: ['ro', 'purifier', 'water', 'tds', 'filter', 'taste', 'slow flow', 'membrane', 'kent', 'aquaguard'],
    diagnose: (prompt) => {
      const p = prompt.toLowerCase();
      return {
        identifiedCategory: 'RO Water Purifier Service',
        serviceSlug: 'ro-water-purifier',
        serviceTitle: 'RO Water Purifier Comprehensive Service',
        recommendedServiceId: '662000000000000000000001',
        possibleCauses: [
          'Pre-filter sediment candle clogged with dissolved silt and rust particles',
          'RO membrane pores scaled with heavy minerals, increasing back-pressure',
          'Exhausted activated carbon block leading to slight odor or altered taste'
        ],
        followUpQuestions: [
          'Is the pure water tank filling up at very slow drip rate, or is excess wastewater flowing continuously into the sink?',
          'What is your approximate municipal/borewell input TDS level?'
        ],
        priceRange: {
          visitingCharge: 149,
          laborMin: 499,
          laborMax: 799,
          estimatedPartsMin: 350,
          estimatedPartsMax: 1200,
          estimatedTotalMin: 998,
          estimatedTotalMax: 2148
        },
        disclaimer: 'Note: Free digital TDS calibration test is included before and after filter replacement.'
      };
    }
  },
  {
    category: 'Bike & Scooter Service',
    slug: 'bike-service',
    keywords: ['bike', 'scooter', 'activa', 'motorcycle', 'starting trouble', 'engine', 'brake', 'mileage', 'oil'],
    diagnose: (prompt) => {
      return {
        identifiedCategory: 'Bike & Scooter Service',
        serviceSlug: 'bike-service',
        serviceTitle: 'Doorstep Bike / Scooter General Service',
        recommendedServiceId: '662000000000000000000005',
        possibleCauses: [
          'Degraded engine oil viscosity causing cylinder friction and thermal drag',
          'Carbon fouling on the spark plug electrode or clogged air filter element',
          'Worn brake shoe liners or slack clutch cable tension'
        ],
        followUpQuestions: [
          'Does the vehicle struggle with self-start or make a clicking noise from the starter solenoid?',
          'How many kilometers has the vehicle run since the last oil change?'
        ],
        priceRange: {
          visitingCharge: 99,
          laborMin: 499,
          laborMax: 650,
          estimatedPartsMin: 400,
          estimatedPartsMax: 1000,
          estimatedTotalMin: 998,
          estimatedTotalMax: 1749
        },
        disclaimer: 'Note: Doorstep technicians carry genuine OEM oil and battery jump packs.'
      };
    }
  },
  {
    category: 'Car Service & Detailing',
    slug: 'car-service',
    keywords: ['car', 'vehicle', 'engine oil', 'brake noise', 'clutch', 'suspension', 'mileage car'],
    diagnose: (prompt) => {
      return {
        identifiedCategory: 'Car Service & Detailing',
        serviceSlug: 'car-service',
        serviceTitle: 'Standard Car Periodic Maintenance',
        recommendedServiceId: '662000000000000000000006',
        possibleCauses: [
          'Exhausted engine synthetic oil and saturated oil filter',
          'Glazed brake pads causing squealing noise upon light pedal engagement',
          'Low coolant reservoir level or dirty throttle body assembly'
        ],
        followUpQuestions: [
          'Are there any warning lights illuminated on the dashboard cluster (Check Engine, Oil, ABS)?',
          'Are you experiencing vibrations during braking at high speeds?'
        ],
        priceRange: {
          visitingCharge: 199,
          laborMin: 1499,
          laborMax: 1899,
          estimatedPartsMin: 1800,
          estimatedPartsMax: 4500,
          estimatedTotalMin: 3498,
          estimatedTotalMax: 6598
        },
        disclaimer: 'Note: Complete 40-point OBD scanner report provided with service.'
      };
    }
  },
  {
    category: 'Washing Machine Repair',
    slug: 'washing-machine-repair',
    keywords: ['washing machine', 'spin', 'drum', 'vibrate', 'drain', 'water not draining', 'front load', 'top load'],
    diagnose: (prompt) => {
      return {
        identifiedCategory: 'Washing Machine Repair',
        serviceSlug: 'washing-machine-repair',
        serviceTitle: 'Washing Machine Diagnostic & Drum Repair',
        recommendedServiceId: '662000000000000000000007',
        possibleCauses: [
          'Foreign objects (coins/pins) blocking the drain pump impeller',
          'Worn suspension damper rods causing violent thumping during spin cycle',
          'Defective lid switch or motor run capacitor'
        ],
        followUpQuestions: [
          'Does the machine show an error code on the digital display (e.g. OE, 5E, dE, UE)?',
          'Does the drum rotate smoothly by hand when the machine is turned off?'
        ],
        priceRange: {
          visitingCharge: 149,
          laborMin: 399,
          laborMax: 599,
          estimatedPartsMin: 300,
          estimatedPartsMax: 1500,
          estimatedTotalMin: 848,
          estimatedTotalMax: 2248
        },
        disclaimer: 'Note: 45-day warranty covers all replaced moving parts.'
      };
    }
  },
  {
    category: 'Electrician Services',
    slug: 'electrician',
    keywords: ['electrician', 'mcb', 'tripping', 'power cut', 'spark', 'short circuit', 'switch', 'inverter', 'wiring'],
    diagnose: (prompt) => {
      return {
        identifiedCategory: 'Electrician Services',
        serviceSlug: 'electrician',
        serviceTitle: 'Emergency Electrical Repair & Wiring Diagnostic',
        recommendedServiceId: '662000000000000000000009',
        possibleCauses: [
          'Overloaded miniature circuit breaker (MCB) or neutral earthing leakage',
          'Loose terminal screw causing arcing and thermal oxidation inside switchboard',
          'Faulty heavy appliance (geyser, iron box, induction) tripping safety ELCB/RCCB'
        ],
        followUpQuestions: [
          'Does the MCB trip immediately when flipped back up, or only when a specific appliance is plugged in?',
          'Is there any burnt plastic smell near the main distribution board?'
        ],
        priceRange: {
          visitingCharge: 99,
          laborMin: 299,
          laborMax: 499,
          estimatedPartsMin: 100,
          estimatedPartsMax: 800,
          estimatedTotalMin: 498,
          estimatedTotalMax: 1398
        },
        disclaimer: 'Note: Technicians use calibrated digital insulation testers for zero shock hazard.'
      };
    }
  },
  {
    category: 'Plumbing Services',
    slug: 'plumbing',
    keywords: ['plumbing', 'plumber', 'leak', 'tap', 'pipe', 'flush', 'sink', 'drain', 'water block', 'bathroom'],
    diagnose: (prompt) => {
      return {
        identifiedCategory: 'Plumbing Services',
        serviceSlug: 'plumbing',
        serviceTitle: 'Plumbing Leak Detection & Fixture Replacement',
        recommendedServiceId: '662000000000000000000010',
        possibleCauses: [
          'Perished ceramic disc spindle washer causing continuous tap drip',
          'Concealed pipe joint hairline fracture under bathroom tiles',
          'Hair and soap grease obstruction in floor drain or bottle trap'
        ],
        followUpQuestions: [
          'Is the leak coming from an exposed faucet or from inside the wall drywall/masonry?',
          'Is there any dampness or wall paint peeling in adjacent rooms?'
        ],
        priceRange: {
          visitingCharge: 99,
          laborMin: 349,
          laborMax: 500,
          estimatedPartsMin: 150,
          estimatedPartsMax: 900,
          estimatedTotalMin: 598,
          estimatedTotalMax: 1499
        },
        disclaimer: 'Note: Pressure tests prevent secondary ceiling or floor seepage.'
      };
    }
  }
];

// Fallback general diagnostic
function defaultDiagnosis(prompt) {
  return {
    identifiedCategory: 'General Home Maintenance',
    serviceSlug: 'ac-service',
    serviceTitle: 'Comprehensive On-Site Inspection & Diagnostic',
    recommendedServiceId: '662000000000000000000003',
    possibleCauses: [
      'Normal wear-and-tear of mechanical/electrical components',
      'Need for preventive periodic inspection and servicing'
    ],
    followUpQuestions: [
      'Could you specify the exact brand, model, and how long the issue has persisted?',
      'Is this an emergency situation requiring immediate technician dispatch?'
    ],
    priceRange: {
      visitingCharge: 149,
      laborMin: 399,
      laborMax: 699,
      estimatedPartsMin: 0,
      estimatedPartsMax: 800,
      estimatedTotalMin: 548,
      estimatedTotalMax: 1648
    },
    disclaimer: 'Note: Detailed technician quote provided prior to beginning any repair.'
  };
}

exports.diagnoseProblem = async (req, res) => {
  try {
    const { message, previousMessages = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please enter a description of your issue.' });
    }

    const query = message.toLowerCase();

    // Match rule
    let matchedRule = diagnosticRules.find(r => 
      r.keywords.some(k => query.includes(k))
    );

    let result;
    if (matchedRule) {
      result = matchedRule.diagnose(query);
    } else {
      result = defaultDiagnosis(query);
    }

    // Build natural conversational response text
    const responseMessage = `I've analyzed your problem: "${message}".

🔍 **Identified Service Category**: ${result.identifiedCategory}
🔧 **Recommended Service**: ${result.serviceTitle}

📋 **Possible Causes**:
${result.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

💬 **Diagnostic Follow-ups**:
${result.followUpQuestions.map(q => `• ${q}`).join('\n')}

💰 **Estimated Price Breakdown**:
• Inspection / Visiting Charge: ₹${result.priceRange.visitingCharge}
• Labor Charge: ₹${result.priceRange.laborMin} - ₹${result.priceRange.laborMax}
• Estimated Spare Parts: ₹${result.priceRange.estimatedPartsMin} - ₹${result.priceRange.estimatedPartsMax}
• Estimated Total Range: **₹${result.priceRange.estimatedTotalMin} - ₹${result.priceRange.estimatedTotalMax}**

_${result.disclaimer}_`;

    res.json({
      success: true,
      message: responseMessage,
      data: result
    });
  } catch (error) {
    console.error('AI diagnosis error:', error);
    res.status(500).json({ success: false, message: 'AI Diagnostic assistant unavailable.' });
  }
};
