export interface TechnicianReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface TechnicianItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  specialization: string;
  category: string;
  bio: string;
  skills: string[];
  serviceAreas: string[];
  experienceYears: number;
  visitingFee: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  verificationStatus: 'verified' | 'pending';
  idType: string;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  completedJobsCount: number;
  trustScore: number;
  trustFactors: {
    idVerified: boolean;
    completionRate: number;
    punctualityRate: number;
    rehireRate: number;
    zeroComplaintBadge: boolean;
  };
  currentLocation: {
    lat: number;
    lng: number;
    addressText: string;
  };
  distanceKm: number;
  estimatedArrivalMins: number;
  recommendationReasons: string[];
  availableSlots?: string[];
  reviews?: TechnicianReview[];
}

export const mockTechnicians: TechnicianItem[] = [
  {
    _id: 'tech_prof_01',
    userId: {
      _id: 'user_tech_01',
      name: 'Arjun Kumar',
      email: 'arjun.tech@smartservice.ai',
      phone: '+91 98401 12345',
      avatar: '/avatars/tech_arjun_kumar.jpg'
    },
    specialization: 'AC Repair Specialist',
    category: 'Air Conditioners',
    bio: 'Certified HVAC master technician with 8+ years experience in inverter split ACs, deep jet pressure cleaning, and eco-friendly gas recharging.',
    skills: ['AC Deep Jet Cleaning', 'Gas Leakage Diagnostics', 'Inverter PCB Repair', 'Split & Window AC Install'],
    serviceAreas: ['Anna Nagar', 'Kilpauk', 'Shenoy Nagar', 'Aminjikarai', 'Koyambedu'],
    experienceYears: 8,
    visitingFee: 149,
    hourlyRate: 350,
    rating: 4.92,
    reviewCount: 138,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Govt. Skill Certified & Aadhaar Cleared',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 164,
    trustScore: 98,
    trustFactors: {
      idVerified: true,
      completionRate: 99,
      punctualityRate: 98,
      rehireRate: 92,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0850,
      lng: 80.2150,
      addressText: 'Anna Nagar Roundtana, Chennai'
    },
    distanceKm: 1.8,
    estimatedArrivalMins: 15,
    recommendationReasons: ['Nearest Pro (1.8 km)', 'Elite Trust Score (98/100)', 'Top Customer Rating (4.92★)', 'Express 25-min Dispatch Ready'],
    availableSlots: ['09:00 AM - 11:00 AM', '11:30 AM - 01:30 PM', '02:30 PM - 04:30 PM', '05:00 PM - 07:00 PM'],
    reviews: [
      { id: 'rev-101', customerName: 'Rajesh V.', rating: 5, date: '2026-10-04', comment: 'Fixed our master bedroom AC cooling issue in 40 minutes. Clean jet wash with zero mess.' },
      { id: 'rev-102', customerName: 'Deepa S.', rating: 5, date: '2026-09-28', comment: 'Very polite and knowledgeable. Explained the capacitor failure clearly and gave an exact upfront quote.' }
    ]
  },
  {
    _id: 'tech_prof_02',
    userId: {
      _id: 'user_tech_02',
      name: 'Karthik Raj',
      email: 'karthik.tech@smartservice.ai',
      phone: '+91 97892 23456',
      avatar: '/avatars/tech_karthik_raj.jpg'
    },
    specialization: 'Electrician',
    category: 'Electrical Services',
    bio: 'Govt. Licensed Class-A Wireman. Specializes in residential electrical safety audits, MCB upgrades, earthing checks, and prompt short circuit detection.',
    skills: ['MCB & Distribution Box', 'Concealed Wiring Repair', 'Ceiling Fan & Chandelier', 'Safety Earthing Audits'],
    serviceAreas: ['T. Nagar', 'Kodambakkam', 'Nungambakkam', 'West Mambalam'],
    experienceYears: 6,
    visitingFee: 119,
    hourlyRate: 280,
    rating: 4.85,
    reviewCount: 112,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Class-A Electrical Wireman License',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 135,
    trustScore: 95,
    trustFactors: {
      idVerified: true,
      completionRate: 98,
      punctualityRate: 95,
      rehireRate: 88,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0418,
      lng: 80.2341,
      addressText: 'Pondy Bazaar, T. Nagar'
    },
    distanceKm: 2.4,
    estimatedArrivalMins: 18,
    recommendationReasons: ['Prompt Arrival (< 20m)', 'Govt Wireman Licensed', 'Budget Friendly (₹119 Visit)'],
    availableSlots: ['08:30 AM - 10:30 AM', '11:00 AM - 01:00 PM', '03:00 PM - 05:00 PM', '06:00 PM - 08:00 PM'],
    reviews: [
      { id: 'rev-201', customerName: 'Anand R.', rating: 5, date: '2026-10-09', comment: 'Diagnosed a tripping MCB problem that two other electricians could not locate. Outstanding job.' }
    ]
  },
  {
    _id: 'tech_prof_03',
    userId: {
      _id: 'user_tech_03',
      name: 'Praveen Kumar',
      email: 'praveen.tech@smartservice.ai',
      phone: '+91 94441 34567',
      avatar: '/avatars/tech_praveen_kumar.jpg'
    },
    specialization: 'RO Water Purifier Technician',
    category: 'RO Water Purifiers',
    bio: 'Certified water purification engineer with calibrated digital TDS meters. Expert in Kent, Aquaguard, Pureit, and Livpure multi-stage filtration.',
    skills: ['RO Membrane Replacement', 'Sediment & Carbon Filter Care', 'TDS Calibration', 'Booster Pump Overhaul'],
    serviceAreas: ['Velachery', 'Madipakkam', 'Adambakkam', 'Guindy'],
    experienceYears: 7,
    visitingFee: 129,
    hourlyRate: 300,
    rating: 4.93,
    reviewCount: 164,
    verified: true,
    verificationStatus: 'verified',
    idType: 'WQA Water Quality Specialist Verified',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 198,
    trustScore: 97,
    trustFactors: {
      idVerified: true,
      completionRate: 99,
      punctualityRate: 97,
      rehireRate: 94,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9815,
      lng: 80.2180,
      addressText: 'Velachery Main Road, Chennai'
    },
    distanceKm: 3.1,
    estimatedArrivalMins: 20,
    recommendationReasons: ['Top Customer Rating (4.93★)', 'Genuine Spare Parts Guarantee', '99% Job Completion'],
    availableSlots: ['09:00 AM - 11:00 AM', '01:00 PM - 03:00 PM', '04:00 PM - 06:00 PM'],
    reviews: [
      { id: 'rev-301', customerName: 'Priya Sundaram', rating: 5, date: '2026-10-02', comment: 'Very professional! Calibrated TDS down to 82 ppm from 340. Zero hidden charges.' }
    ]
  },
  {
    _id: 'tech_prof_04',
    userId: {
      _id: 'user_tech_04',
      name: 'Sanjay Kumar',
      email: 'sanjay.tech@smartservice.ai',
      phone: '+91 99623 45678',
      avatar: '/avatars/tech_sanjay_kumar.jpg'
    },
    specialization: 'Plumber',
    category: 'Plumbing Services',
    bio: 'Veteran plumbing contractor with 9 years handling concealed pipeline leaks, high-pressure jet drain clearing, and premium sanitary fittings.',
    skills: ['Concealed Leak Detection', 'Drain & Trap Jet Unblocking', 'Water Motor & Overhead Tank', 'Jaquar / Kohler Fittings'],
    serviceAreas: ['Adyar', 'Besant Nagar', 'Thiruvanmiyur', 'Kotturpuram'],
    experienceYears: 9,
    visitingFee: 139,
    hourlyRate: 310,
    rating: 4.82,
    reviewCount: 94,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Aadhaar Verified & Trade Licensed',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 147,
    trustScore: 94,
    trustFactors: {
      idVerified: true,
      completionRate: 96,
      punctualityRate: 94,
      rehireRate: 87,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0012,
      lng: 80.2565,
      addressText: 'Adyar Signal, Chennai'
    },
    distanceKm: 2.9,
    estimatedArrivalMins: 22,
    recommendationReasons: ['Emergency Pipeline Dispatch', '9+ Years Trade Experience', 'High Pressure Jet Equipped'],
    availableSlots: ['09:30 AM - 11:30 AM', '12:00 PM - 02:00 PM', '03:30 PM - 05:30 PM', '06:00 PM - 08:00 PM'],
    reviews: [
      { id: 'rev-401', customerName: 'Siddharth M.', rating: 5, date: '2026-09-19', comment: 'Repaired our bursting garden tap and concealed pipe within 30 minutes of emergency call.' }
    ]
  },
  {
    _id: 'tech_prof_05',
    userId: {
      _id: 'user_tech_05',
      name: 'Naveen Raj',
      email: 'naveen.tech@smartservice.ai',
      phone: '+91 98842 56789',
      avatar: '/avatars/tech_naveen_raj.jpg'
    },
    specialization: 'Washing Machine Repair',
    category: 'Home Appliances',
    bio: 'Factory-trained technician for IFB, Bosch, Whirlpool, LG, and Samsung fully automatic front-load and top-load washing machines.',
    skills: ['Front Load Drum Bearing Fix', 'Inverter Drive Motor', 'Drain Pump & Solenoid Valve', 'Vibration & Error Code Diagnostics'],
    serviceAreas: ['Porur', 'Ramapuram', 'Valasaravakkam', 'Alwarthirunagar'],
    experienceYears: 5,
    visitingFee: 149,
    hourlyRate: 320,
    rating: 4.79,
    reviewCount: 78,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Brand Certified Appliance Technician',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 110,
    trustScore: 92,
    trustFactors: {
      idVerified: true,
      completionRate: 95,
      punctualityRate: 93,
      rehireRate: 86,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0382,
      lng: 80.1565,
      addressText: 'Mount Poonamallee Road, Porur'
    },
    distanceKm: 3.6,
    estimatedArrivalMins: 24,
    recommendationReasons: ['IFB & Bosch Specialist', 'Genuine OEM Bearings', '92/100 Trust Score'],
    availableSlots: ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'],
    reviews: [
      { id: 'rev-501', customerName: 'Lakshmi N.', rating: 5, date: '2026-10-01', comment: 'Our Bosch front loader was vibrating violently. Naveen replaced the shock absorbers and now it is whisper quiet.' }
    ]
  },
  {
    _id: 'tech_prof_06',
    userId: {
      _id: 'user_tech_06',
      name: 'Vignesh S',
      email: 'vignesh.tech@smartservice.ai',
      phone: '+91 97910 67890',
      avatar: '/avatars/tech_vignesh_s.jpg'
    },
    specialization: 'Refrigerator Repair',
    category: 'Home Appliances',
    bio: 'Refrigeration mechanics specialist covering frost-free, inverter, side-by-side, and double door models. Instant on-site cooling diagnosis.',
    skills: ['Compressor Replacement', 'Gas Charging & Cooling Coil', 'Digital Inverter Inverter Board', 'Defrost Heater & Thermostat'],
    serviceAreas: ['Mylapore', 'Mandaveli', 'Royapettah', 'Alwarpet'],
    experienceYears: 6,
    visitingFee: 149,
    hourlyRate: 340,
    rating: 4.88,
    reviewCount: 106,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Aadhaar Verified & Refrigeration Certified',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 152,
    trustScore: 96,
    trustFactors: {
      idVerified: true,
      completionRate: 98,
      punctualityRate: 96,
      rehireRate: 90,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0336,
      lng: 80.2676,
      addressText: 'Luz Corner, Mylapore'
    },
    distanceKm: 2.1,
    estimatedArrivalMins: 16,
    recommendationReasons: ['Proximity Match (2.1 km)', 'High Customer Rating (4.88★)', 'Emergency Fridge Rescue Available'],
    availableSlots: ['09:00 AM - 11:00 AM', '11:30 AM - 01:30 PM', '03:00 PM - 05:00 PM', '06:00 PM - 08:00 PM'],
    reviews: [
      { id: 'rev-601', customerName: 'Kavitha R.', rating: 5, date: '2026-10-07', comment: 'Saved a fridge full of festival groceries! Arrived in 20 minutes and replaced the relay switch.' }
    ]
  },
  {
    _id: 'tech_prof_07',
    userId: {
      _id: 'user_tech_07',
      name: 'Hari Prasad',
      email: 'hari.tech@smartservice.ai',
      phone: '+91 96001 78901',
      avatar: '/avatars/tech_hari_prasad.jpg'
    },
    specialization: 'Home Appliance Technician',
    category: 'Home Appliances',
    bio: 'Multi-brand technician for kitchen and bathroom appliances. Specialized in microwave ovens, induction stoves, water heaters (geysers), and chimneys.',
    skills: ['Water Geyser Heating Coil', 'Microwave Magnetron & Diode', 'Kitchen Chimney Deep Clean', 'Induction Cooktop Motherboard'],
    serviceAreas: ['Sholinganallur', 'Karapakkam', 'Navalur', 'Perungudi'],
    experienceYears: 8,
    visitingFee: 129,
    hourlyRate: 300,
    rating: 4.86,
    reviewCount: 120,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Consumer Electronics Council Certified',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 168,
    trustScore: 95,
    trustFactors: {
      idVerified: true,
      completionRate: 97,
      punctualityRate: 95,
      rehireRate: 89,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9010,
      lng: 80.2279,
      addressText: 'OMR Tech Corridor, Sholinganallur'
    },
    distanceKm: 4.2,
    estimatedArrivalMins: 28,
    recommendationReasons: ['Appliance All-Rounder', '8+ Years Trade Mastery', 'Zero Complaint Badge Holder'],
    availableSlots: ['09:00 AM - 11:00 AM', '01:00 PM - 03:00 PM', '04:00 PM - 06:00 PM'],
    reviews: [
      { id: 'rev-701', customerName: 'Venkatesh B.', rating: 5, date: '2026-09-24', comment: 'Replaced our AO Smith geyser heating element with 1-year replacement warranty. Very tidy worker.' }
    ]
  },
  {
    _id: 'tech_prof_08',
    userId: {
      _id: 'user_tech_08',
      name: 'Dinesh Kumar',
      email: 'dinesh.tech@smartservice.ai',
      phone: '+91 98410 89012',
      avatar: '/avatars/tech_dinesh_kumar.jpg'
    },
    specialization: 'CCTV Installation Specialist',
    category: 'Smart Home & Security',
    bio: 'Electronic surveillance specialist. Provides setup, cabling, remote mobile viewing, DVR/NVR configuration, and night-vision color IP camera installs.',
    skills: ['4K IP & Analog Camera Setup', 'DVR / NVR Cloud Setup', 'Smart Mobile App Sync', 'Concealed Optical Fiber Cabling'],
    serviceAreas: ['Tambaram', 'Chromepet', 'Pallavaram', 'Sanatorium'],
    experienceYears: 6,
    visitingFee: 199,
    hourlyRate: 380,
    rating: 4.91,
    reviewCount: 88,
    verified: true,
    verificationStatus: 'verified',
    idType: 'CP Plus & Hikvision Certified Installer',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 124,
    trustScore: 97,
    trustFactors: {
      idVerified: true,
      completionRate: 99,
      punctualityRate: 97,
      rehireRate: 91,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9249,
      lng: 80.1000,
      addressText: 'GST Road, Tambaram'
    },
    distanceKm: 4.5,
    estimatedArrivalMins: 30,
    recommendationReasons: ['Hikvision/CP Plus Certified', 'Clean Cabling Guarantee', '99% Completion Record'],
    availableSlots: ['09:30 AM - 12:30 PM', '02:00 PM - 05:00 PM'],
    reviews: [
      { id: 'rev-801', customerName: 'Arunmozhi G.', rating: 5, date: '2026-10-06', comment: 'Installed 4 outdoor IP cameras with phone app notifications. Extremely clean cabling work.' }
    ]
  },
  {
    _id: 'tech_prof_09',
    userId: {
      _id: 'user_tech_09',
      name: 'Rahul M',
      email: 'rahul.tech@smartservice.ai',
      phone: '+91 94450 90123',
      avatar: '/avatars/tech_rahul_m.jpg'
    },
    specialization: 'Bike Service Technician',
    category: 'Vehicle Maintenance',
    bio: 'Doorstep two-wheeler technician with mobile hydraulic toolkit. Covers Activa, Jupiter, Royal Enfield, Yamaha, and KTM periodic servicing.',
    skills: ['Doorstep Oil & Filter Change', 'Brake Pad & Shoe Tuning', 'Spark Plug & Carburetor Clean', 'Battery Load Testing & Jumpstart'],
    serviceAreas: ['T. Nagar', 'Kodambakkam', 'Ashok Nagar', 'Vadapalani'],
    experienceYears: 7,
    visitingFee: 149,
    hourlyRate: 310,
    rating: 4.89,
    reviewCount: 145,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Automotive Skill Development Council (ASDC)',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 176,
    trustScore: 96,
    trustFactors: {
      idVerified: true,
      completionRate: 98,
      punctualityRate: 96,
      rehireRate: 91,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0489,
      lng: 80.2088,
      addressText: 'Vadapalani Junction, Chennai'
    },
    distanceKm: 2.0,
    estimatedArrivalMins: 15,
    recommendationReasons: ['Nearest Bike Pro (2.0 km)', 'Genuine Motul/Castrol Oils', '15-min Emergency Breakdown Service'],
    availableSlots: ['08:00 AM - 10:00 AM', '10:30 AM - 12:30 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'],
    reviews: [
      { id: 'rev-901', customerName: 'Karthik Raman', rating: 5, date: '2026-09-25', comment: 'Manoj and Rahul are top pros! Scooter feels super smooth after the engine oil and brake service.' }
    ]
  },
  {
    _id: 'tech_prof_10',
    userId: {
      _id: 'user_tech_10',
      name: 'Suresh Babu',
      email: 'suresh.tech@smartservice.ai',
      phone: '+91 99620 11223',
      avatar: '/avatars/tech_suresh_babu.jpg'
    },
    specialization: 'Carpenter',
    category: 'Carpentry & Woodwork',
    bio: 'Master craftsman with 10 years experience in modular kitchens, custom wardrobes, door lock replacements, and flat-pack furniture assembly.',
    skills: ['Modular Furniture Assembly', 'Door Lock & Hinges Alignment', 'Custom Cabinet Repair', 'Termite Proofing & Mesh Fit'],
    serviceAreas: ['Kilpauk', 'Egmore', 'Purasawalkam', 'Vepery'],
    experienceYears: 10,
    visitingFee: 149,
    hourlyRate: 300,
    rating: 4.84,
    reviewCount: 72,
    verified: true,
    verificationStatus: 'verified',
    idType: 'National Skill Development Corporation (NSDC)',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 115,
    trustScore: 93,
    trustFactors: {
      idVerified: true,
      completionRate: 95,
      punctualityRate: 94,
      rehireRate: 88,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0827,
      lng: 80.2450,
      addressText: 'Kilpauk Garden Road, Chennai'
    },
    distanceKm: 3.8,
    estimatedArrivalMins: 25,
    recommendationReasons: ['10+ Years Woodworking', 'Precision Assembly', '93/100 Trust Score'],
    availableSlots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'],
    reviews: [
      { id: 'rev-1001', customerName: 'Divya M.', rating: 5, date: '2026-09-15', comment: 'Assembled our 6-door wardrobe effortlessly. Replaced loose sliding hinges and aligned everything perfectly.' }
    ]
  },
  {
    _id: 'tech_prof_11',
    userId: {
      _id: 'user_tech_11',
      name: 'Ajay Kumar',
      email: 'ajay.tech@smartservice.ai',
      phone: '+91 98409 01234',
      avatar: '/avatars/tech_ajay_kumar.jpg'
    },
    specialization: 'Painter',
    category: 'Painting & Waterproofing',
    bio: 'Residential painting professional trained in Asian Paints Royale, damp-proof treatments, dustless wall sanding, and anti-fungal waterproofing.',
    skills: ['Waterproofing & Primer Seal', 'Wall Crack Patchwork', 'Interior Acrylic Emulsion', 'Texture & Accent Walls'],
    serviceAreas: ['Thiruvanmiyur', 'ECR', 'Palavakkam', 'Neelankarai'],
    experienceYears: 8,
    visitingFee: 149,
    hourlyRate: 290,
    rating: 4.81,
    reviewCount: 68,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Asian Paints Certified Master Painter',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 96,
    trustScore: 91,
    trustFactors: {
      idVerified: true,
      completionRate: 94,
      punctualityRate: 92,
      rehireRate: 86,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9830,
      lng: 80.2594,
      addressText: 'Thiruvanmiyur Beach Road, Chennai'
    },
    distanceKm: 5.2,
    estimatedArrivalMins: 32,
    recommendationReasons: ['Dustless Wall Sanding', 'Damp Proofing Specialist', 'Genuine Asian Paints Materials'],
    availableSlots: ['09:00 AM - 01:00 PM', '02:00 PM - 06:00 PM'],
    reviews: [
      { id: 'rev-1101', customerName: 'Ganesh K.', rating: 5, date: '2026-08-30', comment: 'Waterproofed our balcony seepage issue and repainted the feature wall. Excellent finish.' }
    ]
  },
  {
    _id: 'tech_prof_12',
    userId: {
      _id: 'user_tech_12',
      name: 'Manoj Kumar',
      email: 'manojk.tech@smartservice.ai',
      phone: '+91 97899 12340',
      avatar: '/avatars/tech_manoj_kumar.jpg'
    },
    specialization: 'Laptop Repair Specialist',
    category: 'Electronics & Computers',
    bio: 'Hardware engineer with ESD-safe mobile testing workstation. Chip-level motherboard repairs, cracked screen replacement, SSD upgrades, and heat sink cleaning.',
    skills: ['MacBook & Windows Chip-Level Repair', 'Cracked Display Replacement', 'Thermal Paste & Fan Overhaul', 'SSD Upgrade & Data Recovery'],
    serviceAreas: ['Nungambakkam', 'Gopalapuram', 'Royapettah', 'Thousand Lights'],
    experienceYears: 7,
    visitingFee: 199,
    hourlyRate: 400,
    rating: 4.93,
    reviewCount: 152,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Apple & CompTIA A+ Certified Engineer',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 184,
    trustScore: 98,
    trustFactors: {
      idVerified: true,
      completionRate: 99,
      punctualityRate: 98,
      rehireRate: 93,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0604,
      lng: 80.2496,
      addressText: 'Nungambakkam High Road, Chennai'
    },
    distanceKm: 2.7,
    estimatedArrivalMins: 19,
    recommendationReasons: ['Apple & Windows Certified', 'Chip-Level Repair On-Site', '98/100 Elite Trust Score'],
    availableSlots: ['10:00 AM - 12:00 PM', '01:30 PM - 03:30 PM', '04:00 PM - 06:00 PM', '06:30 PM - 08:30 PM'],
    reviews: [
      { id: 'rev-1201', customerName: 'Swetha P.', rating: 5, date: '2026-10-10', comment: 'Replaced my Dell XPS screen right in front of me at home within 35 minutes! 10/10 service.' }
    ]
  },
  {
    _id: 'tech_prof_13',
    userId: {
      _id: 'user_tech_13',
      name: 'Gokul Raj',
      email: 'gokul.tech@smartservice.ai',
      phone: '+91 94449 23451',
      avatar: '/avatars/tech_gokul_raj.jpg'
    },
    specialization: 'Inverter and Battery Technician',
    category: 'Electrical Services',
    bio: 'Power backup engineer for Luminous, Microtek, and Exide home inverters. Tubular battery electrolyte check, solar inverter conversions, and changeover repairs.',
    skills: ['Inverter Circuit Board Repair', 'Tubular Battery Acid & Water Top-Up', 'Automatic Changeover Fix', 'Solar Hybrid Inverter Setup'],
    serviceAreas: ['Guindy', 'Saidapet', 'Ekkatuthangal', 'Jafferkhanpet'],
    experienceYears: 6,
    visitingFee: 139,
    hourlyRate: 300,
    rating: 4.87,
    reviewCount: 82,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Exide & Luminous Certified Battery Pro',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 128,
    trustScore: 94,
    trustFactors: {
      idVerified: true,
      completionRate: 97,
      punctualityRate: 95,
      rehireRate: 89,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0067,
      lng: 80.2025,
      addressText: 'Guindy Industrial Estate, Chennai'
    },
    distanceKm: 3.4,
    estimatedArrivalMins: 22,
    recommendationReasons: ['Emergency Power Backup Dispatch', 'Certified Battery Tester', '94/100 Trust Score'],
    availableSlots: ['09:00 AM - 11:00 AM', '12:00 PM - 02:00 PM', '03:30 PM - 05:30 PM'],
    reviews: [
      { id: 'rev-1301', customerName: 'Ramesh T.', rating: 5, date: '2026-09-18', comment: 'Diagnosed a blown changeover switch during an evening power cut. Replaced it in 20 minutes.' }
    ]
  },
  {
    _id: 'tech_prof_14',
    userId: {
      _id: 'user_tech_14',
      name: 'Surya Prakash',
      email: 'surya.tech@smartservice.ai',
      phone: '+91 99401 34562',
      avatar: '/avatars/tech_surya_prakash.jpg'
    },
    specialization: 'General Home Maintenance',
    category: 'General Maintenance',
    bio: 'All-around home handyman for precision masonry drilling, TV wall mounts, curtain rod fittings, mirror hangings, and minor electrical fixes.',
    skills: ['TV Wall Mount & Drilling', 'Curtain Rods & Wall Art', 'Door Stoppers & Latches', 'False Ceiling Inspection'],
    serviceAreas: ['Anna Nagar', 'Mogappair', 'Nolambur', 'Ambattur'],
    experienceYears: 5,
    visitingFee: 99,
    hourlyRate: 250,
    rating: 4.77,
    reviewCount: 64,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Aadhaar Verified & Police Cleared Handyman',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 98,
    trustScore: 90,
    trustFactors: {
      idVerified: true,
      completionRate: 93,
      punctualityRate: 92,
      rehireRate: 85,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0890,
      lng: 80.1750,
      addressText: 'Mogappair East, Chennai'
    },
    distanceKm: 1.5,
    estimatedArrivalMins: 12,
    recommendationReasons: ['Lowest Visiting Fee (₹99)', 'Nearest Handyman (1.5 km)', 'Precision Bosch Drill Tools'],
    availableSlots: ['08:30 AM - 10:30 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:30 PM - 06:30 PM'],
    reviews: [
      { id: 'rev-1401', customerName: 'Meenakshi K.', rating: 5, date: '2026-10-05', comment: 'Mounted our 65-inch TV and hung 8 photo frames with laser level precision. Super clean work.' }
    ]
  },
  {
    _id: 'tech_prof_15',
    userId: {
      _id: 'user_tech_15',
      name: 'Balaji R',
      email: 'balaji.tech@smartservice.ai',
      phone: '+91 98405 45673',
      avatar: '/avatars/tech_balaji_r.jpg'
    },
    specialization: 'Smart Home Installation Specialist',
    category: 'Smart Home & Security',
    bio: 'Smart home and IoT automation architect. Installs smart digital locks, video doorbells, automated curtain motors, voice-controlled lighting, and mesh WiFi networks.',
    skills: ['Smart Fingerprint Locks', 'Video Doorbell Intercom', 'WiFi Smart Switch Touch Panels', 'Mesh WiFi & Smart Hub Setup'],
    serviceAreas: ['OMR', 'Thoraipakkam', 'Perungudi', 'Sholinganallur', 'Velachery'],
    experienceYears: 6,
    visitingFee: 249,
    hourlyRate: 450,
    rating: 4.95,
    reviewCount: 96,
    verified: true,
    verificationStatus: 'verified',
    idType: 'Zigbee & Tuya Certified Smart Home Pro',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 132,
    trustScore: 99,
    trustFactors: {
      idVerified: true,
      completionRate: 100,
      punctualityRate: 99,
      rehireRate: 95,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9340,
      lng: 80.2310,
      addressText: 'Perungudi Toll Plaza, OMR'
    },
    distanceKm: 4.1,
    estimatedArrivalMins: 26,
    recommendationReasons: ['Top Overall Trust (99/100)', '100% Job Completion Record', 'Highest Rated Pro (4.95★)'],
    availableSlots: ['10:00 AM - 12:30 PM', '02:00 PM - 04:30 PM', '05:00 PM - 07:30 PM'],
    reviews: [
      { id: 'rev-1501', customerName: 'Dr. Ashok V.', rating: 5, date: '2026-10-08', comment: 'Installed Yale smart lock and touch panel switches with Alexa voice sync throughout our apartment. Brilliant execution.' }
    ]
  }
];
