const bcrypt = require('bcryptjs');

const categoriesData = [
  {
    _id: '661000000000000000000001',
    name: 'RO Water Purifier Service',
    nameTa: 'ஆர்.ஓ குடிநீர் சுத்திகரிப்பான் சேவை',
    slug: 'ro-water-purifier',
    icon: 'Droplets',
    description: 'Filter replacement, membrane cleaning, TDS check & complete overhaul.',
    descriptionTa: 'வடிகட்டி மாற்றுதல், சவ்வு சுத்தம், TDS சோதனை மற்றும் முழுமையான பழுதுபார்ப்பு.',
    bannerImage: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    _id: '661000000000000000000002',
    name: 'AC Installation, Repair & Maintenance',
    nameTa: 'ஏசி பொருத்துதல், பழுது மற்றும் பராமரிப்பு',
    slug: 'ac-service',
    icon: 'Wind',
    description: 'Deep foam jet cleaning, gas charging, copper piping, PCB diagnostic & repair.',
    descriptionTa: 'ஆழமான ஜெட் சுத்தம், எரிவாயு நிரப்புதல், பிசிபி பழுது மற்றும் பராமரிப்பு.',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    _id: '661000000000000000000003',
    name: 'Bike & Scooter Service',
    nameTa: 'பைக் மற்றும் ஸ்கூட்டர் சர்வீஸ்',
    slug: 'bike-service',
    icon: 'Bike',
    description: 'Doorstep two-wheeler general service, engine oil flush, brake tuning & chain care.',
    descriptionTa: 'வீட்டு வாசலில் பைக் சர்வீஸ், எஞ்சின் ஆயில் மாற்றுதல், பிரேக் டியூனிங்.',
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    _id: '661000000000000000000004',
    name: 'Car Service & Detailing',
    nameTa: 'கார் சர்வீஸ் மற்றும் பராமரிப்பு',
    slug: 'car-service',
    icon: 'Car',
    description: 'Comprehensive car inspection, synthetic oil change, battery health & cabin disinfection.',
    descriptionTa: 'முழுமையான கார் ஆய்வு, ஆயில் மாற்றம், பேட்டரி சோதனை மற்றும் கேபின் சுத்திகரிப்பு.',
    bannerImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    _id: '661000000000000000000005',
    name: 'Washing Machine Repair',
    nameTa: 'துணி துவைக்கும் இயந்திரம் பழுது',
    slug: 'washing-machine-repair',
    icon: 'Disc',
    description: 'Front & top load motor repair, drain pump fix, drum vibration balancing & PCB repairs.',
    descriptionTa: 'மோட்டார் பழுது, டிரைன் பம்ப் சரிசெய்தல், அதிர்வு சமநிலை மற்றும் பிசிபி வேலைகள்.',
    bannerImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000006',
    name: 'Refrigerator Repair',
    nameTa: 'குளிர்சாதன பெட்டி பழுதுபார்ப்பு',
    slug: 'refrigerator-repair',
    icon: 'Refrigerator',
    description: 'Compressor troubleshooting, defrost timer, thermostat replacement & gas filling.',
    descriptionTa: 'கம்ப்ரசர் சோதனை, டிஃப்ராஸ்ட் டைமர், தெர்மோஸ்டாட் மாற்றுதல் மற்றும் கேஸ் நிரப்புதல்.',
    bannerImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000007',
    name: 'Electrician Services',
    nameTa: 'மின்சார நிபுணர் சேவைகள்',
    slug: 'electrician',
    icon: 'Zap',
    description: 'MCB trippings, short circuit diagnostics, lighting installation, inverter & switchboard setup.',
    descriptionTa: 'எம்சிபி பிரச்சனைகள், வயரிங் சரிபார்ப்பு, இன்வெர்ட்டர் மற்றும் சுவிட்ச்போர்டு அமைத்தல்.',
    bannerImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000008',
    name: 'Plumbing Services',
    nameTa: 'குழாய் பழுது மற்றும் பிளம்பிங்',
    slug: 'plumbing',
    icon: 'Wrench',
    description: 'Water leak detection, bathroom fitting, pipe unblocking, motor & overhead tank maintenance.',
    descriptionTa: 'கசிவு கண்டறிதல், பாத்ரூம் பொருத்துதல்கள், மோட்டார் மற்றும் தண்ணீர் தொட்டி பராமரிப்பு.',
    bannerImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000009',
    name: 'Home Deep Cleaning',
    nameTa: 'வீடு முழுமையான சுத்திகரிப்பு',
    slug: 'home-cleaning',
    icon: 'Sparkles',
    description: 'Kitchen degreasing, bathroom scrub, mechanized floor polishing & sofa shampooing.',
    descriptionTa: 'சமையலறை மற்றும் கழிப்பறை சுத்தம், சோபா ஷாம்பு மற்றும் தரை மெருகூட்டல்.',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    _id: '661000000000000000000010',
    name: 'Painting Services',
    nameTa: 'வர்ணம் பூசுதல் சேவைகள்',
    slug: 'painting',
    icon: 'Paintbrush',
    description: 'Interior & exterior emulsion painting, moisture damp proofing & aesthetic accent walls.',
    descriptionTa: 'உள் மற்றும் வெளி வர்ணம் பூசுதல், ஈரப்பதம் தடுப்பு மற்றும் அலங்கார சுவர்கள்.',
    bannerImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000011',
    name: 'Laptop & Computer Repair',
    nameTa: 'மடிக்கணினி மற்றும் கணினி பழுது',
    slug: 'laptop-repair',
    icon: 'Laptop',
    description: 'Display screen replacement, OS reinstallation, SSD upgrade, thermal paste & motherboard service.',
    descriptionTa: 'திரை மாற்றுதல், ஓஎஸ் மறுநிறுவல், எஸ்எஸ்டி மேம்படுத்தல் மற்றும் மதர்போர்டு பழுது.',
    bannerImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    _id: '661000000000000000000012',
    name: 'Carpenter Services',
    nameTa: 'தச்சர் சேவைகள்',
    slug: 'carpenter',
    icon: 'Hammer',
    description: 'Furniture assembly, hinge replacement, modular kitchen adjustments & lock fittings.',
    descriptionTa: 'தளபாடங்கள் அசெம்பிளி, கதவு பூட்டு பொருத்துதல் மற்றும் மட்டு சமையலறை வேலைகள்.',
    bannerImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const servicesData = [
  // RO Water Purifier
  {
    _id: '662000000000000000000001',
    categoryId: '661000000000000000000001',
    title: 'RO Water Purifier Comprehensive Service',
    titleTa: 'ஆர்.ஓ வாட்டர் ப்யூரிஃபையர் முழுமையான சர்வீஸ்',
    description: 'Complete inspection, sediment & carbon filter replacement, TDS calibration and sanitized flush.',
    descriptionTa: 'முழு ஆய்வு, வண்டல் மற்றும் கார்பன் வடிகட்டி மாற்றம், டிடிஎஸ் அளவு சரிபார்ப்பு.',
    basePrice: 499,
    visitingCharge: 149,
    sparePartsEstimateMin: 350,
    sparePartsEstimateMax: 1200,
    estimatedDurationMins: 60,
    warrantyDays: 60,
    includedFeatures: ['Sediment filter cleansing', 'TDS water quality check', 'Membrane pressure test', 'Leakage prevention check'],
    includedFeaturesTa: ['வடிகட்டி சுத்தம்', 'குடிநீர் தர சோதனை', 'சவ்வு அழுத்த சோதனை', 'கசிவு தடுப்பு சோதனை'],
    recommendedIntervalMonths: 6,
    rating: 4.9,
    bookingCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '662000000000000000000002',
    categoryId: '661000000000000000000001',
    title: 'RO Membrane & Booster Pump Replacement',
    titleTa: 'ஆர்.ஓ மெம்பிரேன் மற்றும் பூஸ்டர் பம்ப் மாற்றுதல்',
    description: 'High-rejection RO membrane installation, booster pump motor diagnostic and flow regulator replacement.',
    descriptionTa: 'உயர் தர மெம்பிரேன் பொருத்துதல் மற்றும் பூஸ்டர் பம்ப் மோட்டார் பழுது.',
    basePrice: 799,
    visitingCharge: 149,
    sparePartsEstimateMin: 1200,
    sparePartsEstimateMax: 2600,
    estimatedDurationMins: 90,
    warrantyDays: 90,
    includedFeatures: ['Genuine OEM membrane installation', 'Booster pump current draw test', 'Wastewater ratio tuning'],
    includedFeaturesTa: ['அசல் பாகங்கள் பொருத்துதல்', 'பம்ப் சோதனை', 'கழிவு நீர் விகித சீரமைப்பு'],
    recommendedIntervalMonths: 18,
    rating: 4.8,
    bookingCount: 190,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80'
  },
  // AC Service
  {
    _id: '662000000000000000000003',
    categoryId: '661000000000000000000002',
    title: 'AC Power Jet Foam Deep Cleaning',
    titleTa: 'ஏசி ஜெட் ஃபோக் ஆழமான சுத்தம்',
    description: 'Indoor coil pressurized jet wash with antibacterial foam, outdoor condenser cleaning, and drain tray clearance.',
    descriptionTa: 'உட்புற மற்றும் வெளிப்புற காயில் ஜெட் வாஷ், ஆன்டிபாக்டீரியல் நுரை மற்றும் வடிகால் சுத்தம்.',
    basePrice: 599,
    visitingCharge: 149,
    sparePartsEstimateMin: 0,
    sparePartsEstimateMax: 200,
    estimatedDurationMins: 75,
    warrantyDays: 30,
    includedFeatures: ['Jet pump pressurized wash', 'Antibacterial foam application', 'Air filter deep scrub', 'Drain pipe unblocking'],
    includedFeaturesTa: ['ஜெட் பம்ப் வாஷ்', 'ஆன்டிபாக்டீரியல் ஸ்ப்ரே', 'ஏர் பில்டர் சுத்தம்', 'டிரைன் பைப் அடைப்பு நீக்குதல்'],
    recommendedIntervalMonths: 4,
    rating: 4.95,
    bookingCount: 820,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '662000000000000000000004',
    categoryId: '661000000000000000000002',
    title: 'AC Gas Leak Check & Refrigerant Top-up',
    titleTa: 'ஏசி கேஸ் கசிவு சோதனை மற்றும் நிரப்புதல்',
    description: 'Nitrogen pressure leak detection, copper braze repair, and pure R32/R410A refrigerant charge.',
    descriptionTa: 'நைட்ரஜன் கசிவு கண்டறிதல் மற்றும் சுத்தமான குளிரூட்டி வாயு நிரப்புதல்.',
    basePrice: 1299,
    visitingCharge: 199,
    sparePartsEstimateMin: 1500,
    sparePartsEstimateMax: 2800,
    estimatedDurationMins: 90,
    warrantyDays: 60,
    includedFeatures: ['Digital manifold gauge testing', 'Copper joint brazing', 'Pure factory refrigerant refill', 'Cooling temperature verification'],
    includedFeaturesTa: ['டிஜிட்டல் கேஜ் சோதனை', 'தாமிர இணைப்பு பழுது', 'கேஸ் நிரப்புதல்', 'குளிர்ச்சி சரிபார்ப்பு'],
    recommendedIntervalMonths: 12,
    rating: 4.85,
    bookingCount: 450,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  // Bike Service
  {
    _id: '662000000000000000000005',
    categoryId: '661000000000000000000003',
    title: 'Doorstep Bike / Scooter General Service',
    titleTa: 'வீட்டு வாசலில் பைக் / ஸ்கூட்டர் பொது சேவை',
    description: '18-point safety audit, engine oil change, spark plug cleaning, carburetor/throttle tune, and brake pad adjustment.',
    descriptionTa: '18 புள்ளி பாதுகாப்பு ஆய்வு, ஆயில் மாற்றம், பிரேக் அட்ஜஸ்ட்மென்ட் மற்றும் கிளட்ச் செட்டிங்.',
    basePrice: 499,
    visitingCharge: 99,
    sparePartsEstimateMin: 400,
    sparePartsEstimateMax: 1000,
    estimatedDurationMins: 90,
    warrantyDays: 30,
    includedFeatures: ['Engine oil change (oil extra/supplied)', 'Spark plug & air filter clean', 'Brake shoe check & adjustment', 'Chain lubrication & tightening'],
    includedFeaturesTa: ['எஞ்சின் ஆயில் மாற்றுதல்', 'ஸ்பார்க் பிளக் சுத்தம்', 'பிரேக் ட்யூனிங்', 'செயின் லூப்ரிகேஷன்'],
    recommendedIntervalMonths: 3,
    rating: 4.8,
    bookingCount: 610,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
  },
  // Car Service
  {
    _id: '662000000000000000000006',
    categoryId: '661000000000000000000004',
    title: 'Standard Car Periodic Maintenance',
    titleTa: 'கார் வழக்கமான பராமரிப்பு சேவை',
    description: 'Comprehensive 40-point vehicle inspection, engine oil & filter change, coolant top-up, battery health check, tyre pressure check.',
    descriptionTa: '40 புள்ளி கார் ஆய்வு, ஆயில் பில்டர் மாற்றம், கூலன்ட் டாப் அப் மற்றும் பேட்டரி சோதனை.',
    basePrice: 1499,
    visitingCharge: 199,
    sparePartsEstimateMin: 1800,
    sparePartsEstimateMax: 4500,
    estimatedDurationMins: 150,
    warrantyDays: 60,
    includedFeatures: ['40-point computer scan & diagnostic', 'Engine oil & filter change', 'Brake pad clean & caliper check', 'Underbody inspection'],
    includedFeaturesTa: ['ஸ்கேன் சோதனை', 'ஆயில் மாற்றம்', 'பிரேக் ஆய்வு', 'அடிபாகம் சோதனை'],
    recommendedIntervalMonths: 6,
    rating: 4.9,
    bookingCount: 380,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
  },
  // Washing Machine
  {
    _id: '662000000000000000000007',
    categoryId: '661000000000000000000005',
    title: 'Washing Machine Diagnostic & Drum Repair',
    titleTa: 'துணி துவைக்கும் இயந்திர ஆய்வு மற்றும் பழுது',
    description: 'Diagnose spinning issues, strange vibrations, drain pump blockage, and inlet valve fault.',
    descriptionTa: 'டிரம் சுழற்சி கோளாறு, நீர் வெளியேற்றும் பம்ப் மற்றும் விப்ரேஷன் சரிபார்த்தல்.',
    basePrice: 399,
    visitingCharge: 149,
    sparePartsEstimateMin: 300,
    sparePartsEstimateMax: 1500,
    estimatedDurationMins: 60,
    warrantyDays: 45,
    includedFeatures: ['Motor capacitor check', 'Drain pump clearance', 'Suspension rod balance', 'Water inlet filter scrub'],
    includedFeaturesTa: ['மோட்டார் சோதனை', 'பம்ப் அடைப்பு நீக்கம்', 'பேலன்சிங் ஆய்வு'],
    recommendedIntervalMonths: 12,
    rating: 4.75,
    bookingCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80'
  },
  // Refrigerator
  {
    _id: '662000000000000000000008',
    categoryId: '661000000000000000000006',
    title: 'Refrigerator Cooling & Compressor Diagnostics',
    titleTa: 'பிரிட்ஜ் கூலிங் மற்றும் கம்ப்ரசர் ஆய்வு',
    description: 'Fix single & double door cooling loss, excessive icing, clicking compressor relay, or water pooling.',
    descriptionTa: 'குளிர்ச்சி இழப்பு, பனிக்கட்டி அதிகம் சேருதல், ரிலே மாற்றம் மற்றும் கம்ப்ரசர் சோதனை.',
    basePrice: 449,
    visitingCharge: 149,
    sparePartsEstimateMin: 400,
    sparePartsEstimateMax: 2200,
    estimatedDurationMins: 60,
    warrantyDays: 60,
    includedFeatures: ['Defrost heater & sensor check', 'Relay / overload protector check', 'Door rubber seal inspection', 'Thermostat calibration'],
    includedFeaturesTa: ['ஹீட்டர் சோதனை', 'ரிலே ஆய்வு', 'டோர் கேஸ்கெட் சோதனை', 'தெர்மோஸ்டாட் சரிபார்ப்பு'],
    recommendedIntervalMonths: 12,
    rating: 4.8,
    bookingCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
  },
  // Electrician
  {
    _id: '662000000000000000000009',
    categoryId: '661000000000000000000007',
    title: 'Emergency Electrical Repair & Wiring Diagnostic',
    titleTa: 'அவசர மின்சார பழுது மற்றும் வயரிங் ஆய்வு',
    description: 'Diagnose frequent breaker tripping, switch spark, socket burnout, and whole-house earthing tests.',
    descriptionTa: 'பிரேக்கர் ட்ரிப்பிங், சுவிட்ச் தீப்பொறி, எர்த்திங் சோதனை மற்றும் வயரிங் பழுது.',
    basePrice: 299,
    visitingCharge: 99,
    sparePartsEstimateMin: 100,
    sparePartsEstimateMax: 800,
    estimatedDurationMins: 45,
    warrantyDays: 30,
    includedFeatures: ['Multimeter insulation test', 'MCB load balancing', 'Ground earthing potential check', 'Short circuit path isolation'],
    includedFeaturesTa: ['மல்டிமீட்டர் சோதனை', 'சுமை சமநிலை', 'எர்த்திங் ஆய்வு'],
    recommendedIntervalMonths: 12,
    rating: 4.9,
    bookingCount: 740,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80'
  },
  // Plumbing
  {
    _id: '662000000000000000000010',
    categoryId: '661000000000000000000008',
    title: 'Plumbing Leak Detection & Fixture Replacement',
    titleTa: 'பிளம்பிங் கசிவு கண்டறிதல் மற்றும் பாகங்கள் மாற்றுதல்',
    description: 'Fix dripping faucets, concealed pipeline leakage, flush tank repair, and washbasin trap unblocking.',
    descriptionTa: 'சொட்டும் குழாய்கள், மறைக்கப்பட்ட குழாய் கசிவு, ஃப்ளஷ் டேங்க் சரிசெய்தல்.',
    basePrice: 349,
    visitingCharge: 99,
    sparePartsEstimateMin: 150,
    sparePartsEstimateMax: 900,
    estimatedDurationMins: 60,
    warrantyDays: 30,
    includedFeatures: ['Pressure leak check', 'Concealed diverter fix', 'Angle valve & aerator scrub', 'Drain snake clearing'],
    includedFeaturesTa: ['அழுத்த கசிவு சோதனை', 'வால்வு சரிசெய்தல்', 'வடிகால் அடைப்பு நீக்குதல்'],
    recommendedIntervalMonths: 6,
    rating: 4.85,
    bookingCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'
  },
  // Home Cleaning
  {
    _id: '662000000000000000000011',
    categoryId: '661000000000000000000009',
    title: 'Full Home Deep Cleaning & Sanitization',
    titleTa: 'முழு வீடு டீப் கிளீனிங் மற்றும் கிருமி நீக்கம்',
    description: 'Intense single-day mechanized scrubbing of floors, kitchen chimney degreasing, bathroom descaling, balcony wash.',
    descriptionTa: 'தரை மெருகூட்டல், சிம்னி எண்ணெய் நீக்கம், குளியலறை டைல்ஸ் சுத்தம்.',
    basePrice: 2499,
    visitingCharge: 0,
    sparePartsEstimateMin: 0,
    sparePartsEstimateMax: 0,
    estimatedDurationMins: 240,
    warrantyDays: 7,
    includedFeatures: ['Industrial single-disc floor scrub', 'Bathroom hard water stain removal', 'Kitchen oil/grease decontam', 'Window glass polish'],
    includedFeaturesTa: ['இயந்திர தரை ஸ்க்ரப்பிங்', 'கறை நீக்குதல்', 'சமையலறை கிரீஸ் நீக்கம்', 'ஜன்னல் பாலிஷ்'],
    recommendedIntervalMonths: 6,
    rating: 4.9,
    bookingCount: 410,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },
  // Laptop Repair
  {
    _id: '662000000000000000000012',
    categoryId: '661000000000000000000011',
    title: 'Laptop Hardware Diagnostics & Thermal Overhaul',
    titleTa: 'லேப்டாப் ஹார்டுவேர் ஆய்வு மற்றும் கூலிங் சர்வீஸ்',
    description: 'Overheating resolution, Arctic MX-4 thermal paste renewal, fan dust extraction, SSD/RAM upgrade.',
    descriptionTa: 'அதிக வெப்பமாதல் தீர்வு, தெர்மல் பேஸ்ட் மாற்றுதல், ஃபேன் சுத்தம், ரேம் மற்றும் எஸ்எஸ்டி மேம்படுத்தல்.',
    basePrice: 599,
    visitingCharge: 149,
    sparePartsEstimateMin: 500,
    sparePartsEstimateMax: 3500,
    estimatedDurationMins: 75,
    warrantyDays: 60,
    includedFeatures: ['SMART disk diagnostic', 'Thermal paste repasting', 'Cooling heatsink clearing', 'RAM/CPU stress test'],
    includedFeaturesTa: ['டிஸ்க் ஆய்வு', 'தெர்மல் பேஸ்ட் புதுப்பித்தல்', 'ஹீட்சிங்க் சுத்தம்'],
    recommendedIntervalMonths: 12,
    rating: 4.9,
    bookingCount: 390,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
  }
];

const usersData = [
  // 1. Customer
  {
    _id: '660000000000000000000001',
    name: 'Karthik Raman',
    email: 'customer@servease.ai',
    password: '', // will be hashed
    phone: '+91 98401 23456',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    language: 'en',
    savedAddresses: [
      {
        title: 'Home',
        street: 'Flat 4B, Emerald Towers, 4th Main Road',
        area: 'Anna Nagar',
        city: 'Chennai',
        pincode: '600040',
        isDefault: true
      },
      {
        title: 'Office',
        street: 'Level 3, Tek Meadows, OMR',
        area: 'Sholinganallur',
        city: 'Chennai',
        pincode: '600119',
        isDefault: false
      }
    ]
  },
  // 2. Verified Technician 1 (RO & AC Specialist)
  {
    _id: '660000000000000000000002',
    name: 'Arun Kumar',
    email: 'arun.tech@servease.ai',
    password: '',
    phone: '+91 97890 54321',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    language: 'en'
  },
  // 3. Verified Technician 2 (Auto & Bike Specialist)
  {
    _id: '660000000000000000000003',
    name: 'Manoj Velu',
    email: 'manoj.tech@servease.ai',
    password: '',
    phone: '+91 94440 98765',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    language: 'ta'
  },
  // 4. Verified Technician 3 (Electrical & Appliances)
  {
    _id: '660000000000000000000004',
    name: 'Suresh Babu',
    email: 'suresh.tech@servease.ai',
    password: '',
    phone: '+91 99620 11223',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    language: 'en'
  },
  // 5. Admin
  {
    _id: '660000000000000000000009',
    name: 'ServEase Admin Operations',
    email: 'admin@servease.ai',
    password: '',
    phone: '+91 90000 00001',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    language: 'en'
  }
];

const technicianProfilesData = [
  {
    _id: '660500000000000000000002',
    userId: '660000000000000000000002',
    bio: 'Certified HVAC & Water Treatment Specialist with 7+ years of experience across Daikin, Kent, and Blue Star systems.',
    skills: ['RO Water Purifier Service', 'AC Installation, Repair & Maintenance', 'Plumbing Services'],
    serviceAreas: ['Anna Nagar', 'Kilpauk', 'Shenoy Nagar', 'Aminjikarai', 'Koyambedu'],
    experienceYears: 7,
    visitingFee: 149,
    hourlyRate: 350,
    rating: 4.9,
    reviewCount: 84,
    verified: true,
    verificationStatus: 'verified',
    kycDocumentUrl: 'https://servease.ai/docs/kyc_arun_kumar_aadhaar.pdf',
    idType: 'Aadhaar Verified & Police Cleared',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 142,
    totalEarnings: 82500,
    trustScore: 96,
    trustFactors: {
      idVerified: true,
      completionRate: 99,
      punctualityRate: 97,
      rehireRate: 91,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0850,
      lng: 80.2150,
      addressText: 'Anna Nagar Roundtana, Chennai'
    }
  },
  {
    _id: '660500000000000000000003',
    userId: '660000000000000000000003',
    bio: 'Master Two-Wheeler and Four-Wheeler mechanic. Specialized in fuel injection, OBD-II diagnostic and engine tuning.',
    skills: ['Bike & Scooter Service', 'Car Service & Detailing'],
    serviceAreas: ['T. Nagar', 'Mylapore', 'Alwarpet', 'Adyar', 'Guindy'],
    experienceYears: 6,
    visitingFee: 149,
    hourlyRate: 320,
    rating: 4.85,
    reviewCount: 65,
    verified: true,
    verificationStatus: 'verified',
    kycDocumentUrl: 'https://servease.ai/docs/kyc_manoj_velu_license.pdf',
    idType: 'Driving License & Skill Certificate',
    isAvailable: true,
    emergencyAvailable: true,
    completedJobsCount: 118,
    totalEarnings: 74200,
    trustScore: 93,
    trustFactors: {
      idVerified: true,
      completionRate: 97,
      punctualityRate: 94,
      rehireRate: 89,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 13.0418,
      lng: 80.2341,
      addressText: 'Pondy Bazaar, T. Nagar'
    }
  },
  {
    _id: '660500000000000000000004',
    userId: '660000000000000000000004',
    bio: 'Govt. Licensed Class-A Wireman & Appliance Technician. Specializes in washing machines, refrigerators, and circuit safety.',
    skills: ['Electrician Services', 'Washing Machine Repair', 'Refrigerator Repair'],
    serviceAreas: ['Velachery', 'Perungudi', 'Thoraipakkam', 'Madipakkam'],
    experienceYears: 5,
    visitingFee: 120,
    hourlyRate: 280,
    rating: 4.78,
    reviewCount: 52,
    verified: true,
    verificationStatus: 'verified',
    kycDocumentUrl: 'https://servease.ai/docs/kyc_suresh_babu_license.pdf',
    idType: 'Govt Electrical Wireman License',
    isAvailable: true,
    emergencyAvailable: false,
    completedJobsCount: 94,
    totalEarnings: 59300,
    trustScore: 90,
    trustFactors: {
      idVerified: true,
      completionRate: 95,
      punctualityRate: 92,
      rehireRate: 85,
      zeroComplaintBadge: true
    },
    currentLocation: {
      lat: 12.9815,
      lng: 80.2180,
      addressText: 'Velachery Main Road, Chennai'
    }
  }
];

const registeredAssetsData = [
  {
    _id: '664000000000000000000001',
    customerId: '660000000000000000000001',
    name: 'Living Room Daikin 1.5T Inverter AC',
    category: 'AC',
    brand: 'Daikin',
    model: 'FTKP50TV16U (5-Star)',
    purchaseDate: '2024-03-15',
    serialOrPlateNumber: 'DK-2024-884920',
    warrantyExpiryDate: '2029-03-15',
    lastServiceDate: '2026-05-10',
    nextMaintenanceDate: '2026-11-10',
    maintenanceIntervalMonths: 6,
    healthStatus: 'Good',
    totalSpentOnMaintenance: 1798,
    serviceHistory: [
      {
        serviceDate: new Date('2026-05-10'),
        serviceType: 'AC Power Jet Foam Deep Cleaning',
        technicianName: 'Arun Kumar',
        replacedParts: ['Antibacterial Blower Filter'],
        totalCost: 799,
        notes: 'Coil washed with anti-fungal foam, blower balanced. Temperature drop 12.4°C.',
        invoiceNumber: 'INV-2026-0510'
      }
    ]
  },
  {
    _id: '664000000000000000000002',
    customerId: '660000000000000000000001',
    name: 'Kitchen Kent Grand Plus RO Purifier',
    category: 'RO Water Purifier',
    brand: 'Kent',
    model: 'Grand Plus Mineral RO 9L',
    purchaseDate: '2023-08-20',
    serialOrPlateNumber: 'KT-991823-RO',
    warrantyExpiryDate: '2025-08-20',
    lastServiceDate: '2026-04-12',
    nextMaintenanceDate: '2026-10-12',
    maintenanceIntervalMonths: 6,
    healthStatus: 'Service Due',
    totalSpentOnMaintenance: 1850,
    serviceHistory: [
      {
        serviceDate: new Date('2026-04-12'),
        serviceType: 'RO Comprehensive Filter Replacement',
        technicianName: 'Arun Kumar',
        replacedParts: ['Spun Sediment Filter 10 inch', 'Activated Carbon Block'],
        totalCost: 1100,
        notes: 'Pre-filters replaced. Output TDS stabilized at 82 ppm.',
        invoiceNumber: 'INV-2026-0412'
      }
    ]
  },
  {
    _id: '664000000000000000000003',
    customerId: '660000000000000000000001',
    name: 'Honda Activa 6G Scooter',
    category: 'Bike',
    brand: 'Honda',
    model: 'Activa 6G Deluxe (Matte Axis Grey)',
    purchaseDate: '2022-11-05',
    serialOrPlateNumber: 'TN-09-CB-4821',
    warrantyExpiryDate: '2025-11-05',
    lastServiceDate: '2026-07-02',
    nextMaintenanceDate: '2026-10-25',
    maintenanceIntervalMonths: 3,
    healthStatus: 'Good',
    totalSpentOnMaintenance: 2850,
    serviceHistory: [
      {
        serviceDate: new Date('2026-07-02'),
        serviceType: 'Doorstep General Periodic Service',
        technicianName: 'Manoj Velu',
        replacedParts: ['Castrol 10W30 Synthetic Oil', 'Air Filter Element'],
        totalCost: 950,
        notes: 'Carburetor tuned, brakes cleaned, tyre pressure set to 32 psi.',
        invoiceNumber: 'INV-2026-0702'
      }
    ]
  }
];

const bookingsData = [
  // 1. Live Active Booking (Technician on the Way / In Progress for demonstration)
  {
    _id: '663000000000000000000001',
    bookingNumber: 'SEB-2026-1001',
    customerId: '660000000000000000000001',
    technicianId: '660000000000000000000002',
    serviceId: '662000000000000000000003', // AC jet cleaning
    categoryId: '661000000000000000000002',
    status: 'In Progress',
    scheduledDate: '2026-10-11',
    scheduledTime: '11:30 AM - 01:00 PM',
    serviceAddress: {
      street: 'Flat 4B, Emerald Towers, 4th Main Road',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600040',
      phone: '+91 98401 23456'
    },
    problemDescription: 'AC cooling has dropped significantly over the past 3 days and water drops are leaking from indoor drain vent.',
    emergencyMode: false,
    pricing: {
      visitingCharge: 149,
      baseLabor: 450,
      estimatedParts: 0,
      taxGst: 108,
      discount: 50,
      total: 657
    },
    revisedQuote: {
      status: 'pending',
      extraLaborCharge: 250,
      sparePartsList: [
        { name: 'Copper Drain Pipe Replacement (3m)', cost: 350 },
        { name: 'Anti-Vibration Rubber Pad Dampeners', cost: 150 }
      ],
      reason: 'Existing drain pipe has a hairline crack causing water to drip down the bedroom wall. Recommend replacing pipe and adding motor dampeners.',
      revisedTotal: 1407,
      submittedAt: new Date()
    },
    serviceProof: {
      beforePhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      technicianNotes: 'Inspection complete. Internal evaporator coil contains heavy dust buildup and cracked secondary drain outlet.',
      partsReplaced: ['Copper Drain Line (3m)'],
      customerApproved: false,
      uploadedAt: new Date()
    },
    proofCare: {
      currentStage: 'otp_pending',
      checkIn: {
        checkedInAt: new Date(Date.now() - 3600000 * 2),
        gpsVerified: true,
        technicianLat: 13.0845,
        technicianLng: 80.2165,
        accuracyMeters: 8,
        notes: 'GPS verified with technician device consent (8m accuracy).'
      },
      beforePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
          uploadedAt: new Date(Date.now() - 3600000 * 1.8),
          caption: 'Pre-service condition: Evaporator coil heavily clogged with micro-dust'
        }
      ],
      checklist: [
        {
          itemKey: 'ac_cooling_split',
          label: 'Indoor Air Supply vs Return Cooling Temperature Split',
          required: true,
          checked: true,
          measuredValue: 'Inlet: 30.5°C -> Outlet: 24.2°C (Split Delta: 6.3°C - Deficient)',
          notes: 'Cooling delta severely depressed due to clogged blower filter.'
        },
        {
          itemKey: 'ac_filter_blower',
          label: 'Air Filter Scrub & Cross-Flow Blower Fan Balancing',
          required: true,
          checked: true,
          measuredValue: 'Air Velocity: 210 CFM (Target: 380 CFM)',
          notes: 'High-pressure foam jet cleaning applied to blower barrel.'
        },
        {
          itemKey: 'ac_gas_pressure',
          label: 'Refrigerant Manifold Suction Gauge Pressure',
          required: true,
          checked: true,
          measuredValue: 'Standing Pressure: 130 PSI (Normal)',
          notes: 'Digital manifold gauge confirmed zero freon pressure loss.'
        },
        {
          itemKey: 'ac_drain_tray',
          label: 'Condensate Drain Tray Slope & Overflow Pipe Flush',
          required: true,
          checked: true,
          measuredValue: 'Drain Tray: Hairline crack isolated',
          notes: 'Replaced cracked secondary drain line with 3m copper-shielded tubing.'
        }
      ],
      diagnosis: {
        preliminaryCause: 'Restricted airflow across evaporator fins combined with split drain hose',
        technicalDetails: 'Thermal drop impeded by 4mm dust crusting. Secondary drain sleeve cracked from UV aging.',
        diagnosticTime: new Date(Date.now() - 3600000 * 1.5)
      },
      workSummary: {
        tasksCompleted: ['Power jet chemical foam coil cleanse', 'Blower cross-flow fan wash', 'Replacement of cracked 3m drain pipe'],
        technicianNotes: 'All evaporator fins sanitized. Pressure tested drain outlet under 2L flood test.',
        safetyCheckPassed: true
      },
      replacedParts: [
        {
          name: 'Copper Drain Pipe Replacement (3m)',
          partNumber: 'AC-DP-3M-OEM',
          cost: 350,
          warrantyDays: 90,
          approvedByCustomer: true
        }
      ],
      afterPhotos: [
        {
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
          uploadedAt: new Date(Date.now() - 1800000),
          caption: 'Post-service verification: Deep cleaned cooling fins & fresh drain assembly'
        }
      ],
      completionOtp: {
        code: '849201',
        expiresAt: new Date(Date.now() + 1800000),
        isVerified: false,
        attempts: 0
      },
      customerReview: {
        approved: false,
        remarks: ''
      },
      evidenceReport: {
        reportId: 'PCR-SEB-2026-1001-PENDING',
        generatedAt: new Date(),
        signatureHash: 'PROOFCARE_DIGITALLY_SEALED',
        isImmutable: false
      },
      dispute: {
        isDisputed: false,
        status: 'none'
      }
    },
    tracking: {
      technicianLat: 13.0845,
      technicianLng: 80.2165,
      customerLat: 13.0850,
      customerLng: 80.2185,
      estimatedArrivalMins: 8,
      currentStepIndex: 3,
      statusUpdates: [
        { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Booking received and verified.' },
        { status: 'Accepted', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Technician Arun Kumar accepted your booking.' },
        { status: 'Technician on the Way', timestamp: new Date(Date.now() - 3600000), note: 'Technician has dispatched from Anna Nagar Depot.' },
        { status: 'In Progress', timestamp: new Date(Date.now() - 1800000), note: 'Diagnostic inspection started at your premise.' }
      ]
    },
    payment: {
      method: 'UPI / Online Card',
      status: 'Pending',
      transactionId: ''
    },
    registeredAssetId: '664000000000000000000001',
    createdAt: new Date(Date.now() - 3600000 * 4)
  },
  // 2. Completed Booking with review and invoice
  {
    _id: '663000000000000000000002',
    bookingNumber: 'SEB-2026-0925',
    customerId: '660000000000000000000001',
    technicianId: '660000000000000000000003',
    serviceId: '662000000000000000000005', // Bike general service
    categoryId: '661000000000000000000003',
    status: 'Completed',
    scheduledDate: '2026-09-25',
    scheduledTime: '02:00 PM - 03:30 PM',
    serviceAddress: {
      street: 'Flat 4B, Emerald Towers, 4th Main Road',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600040',
      phone: '+91 98401 23456'
    },
    problemDescription: 'Routine 3-month periodic service for Honda Activa 6G. Rear brake lever feels loose.',
    emergencyMode: false,
    pricing: {
      visitingCharge: 99,
      baseLabor: 400,
      estimatedParts: 450,
      taxGst: 170,
      discount: 0,
      total: 1119
    },
    revisedQuote: {
      status: 'approved',
      extraLaborCharge: 0,
      sparePartsList: [{ name: 'Castrol Active 10W30 Engine Oil', cost: 450 }],
      reason: 'Synthetic engine oil replaced as scheduled.',
      revisedTotal: 1119,
      submittedAt: new Date('2026-09-25T14:30:00Z')
    },
    serviceProof: {
      beforePhotoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      technicianNotes: 'Fresh synthetic oil filled. Rear brake tightened to standard clearance. Air filter pressure cleaned.',
      partsReplaced: ['Engine Oil 800ml'],
      customerApproved: true,
      uploadedAt: new Date('2026-09-25T15:20:00Z')
    },
    tracking: {
      technicianLat: 13.0850,
      technicianLng: 80.2185,
      customerLat: 13.0850,
      customerLng: 80.2185,
      estimatedArrivalMins: 0,
      currentStepIndex: 4,
      statusUpdates: [
        { status: 'Completed', timestamp: new Date('2026-09-25T15:30:00Z'), note: 'Job completed and verified by customer.' }
      ]
    },
    payment: {
      method: 'UPI / Online Card',
      status: 'Paid',
      transactionId: 'UPI-20260925-9921783',
      paidAt: new Date('2026-09-25T15:35:00Z')
    },
    registeredAssetId: '664000000000000000000003',
    createdAt: new Date('2026-09-25T08:00:00Z')
  }
];

const reviewsData = [
  {
    _id: '665000000000000000000001',
    bookingId: '663000000000000000000002',
    customerId: '660000000000000000000001',
    technicianId: '660000000000000000000003',
    serviceId: '662000000000000000000005',
    rating: 5,
    comment: 'Exceptional service! Manoj arrived exactly on time with all proper tools. My Activa feels super smooth after the engine oil replacement and brake adjustment.',
    aspects: {
      punctuality: 5,
      workQuality: 5,
      cleanliness: 5,
      pricingTransparency: 5
    },
    photos: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80'],
    technicianReply: 'Thank you Mr. Karthik! Glad you loved the ride quality. Next service reminder is scheduled in 3 months on your ServEase Passport.',
    createdAt: new Date('2026-09-25T16:00:00Z')
  }
];

const notificationsData = [
  {
    _id: '666000000000000000000001',
    recipientId: '660000000000000000000001',
    title: 'Technician Revised Quote Requires Approval',
    titleTa: 'தொழில்நுட்ப வல்லுநரின் திருத்தப்பட்ட மேற்கோளுக்கு ஒப்புதல் தேவை',
    message: 'Arun Kumar submitted a revised quote of ₹1,407 for replacement of cracked drain pipe on Booking #SEB-2026-1001.',
    messageTa: 'புகார் எண் #SEB-2026-1001 க்கான மாற்று பைப் மேற்கோளுக்கு ஒப்புதல் தேவை.',
    type: 'quote_received',
    referenceId: '663000000000000000000001',
    isRead: false,
    createdAt: new Date()
  },
  {
    _id: '666000000000000000000002',
    recipientId: '660000000000000000000001',
    title: 'Maintenance Due: Kitchen Kent RO Purifier',
    titleTa: 'பராமரிப்பு நிலுவையில் உள்ளது: கிச்சன் கென்ட் ஆர்.ஓ',
    message: 'Your RO purifier is due for its 6-month sediment filter renewal to maintain pure 80 ppm TDS output.',
    messageTa: 'உங்கள் ஆர்.ஓ பியூரிஃபையருக்கு 6 மாத வடிகட்டி மாற்று நேரம் வந்துவிட்டது.',
    type: 'maintenance_reminder',
    referenceId: '664000000000000000000002',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000)
  }
];

const subscriptionsData = [
  {
    id: 'sub-ac-annual',
    title: 'AC 365 Super Cool AMC',
    titleTa: 'ஏசி 365 சூப்பர் கூல் வருடாந்திர திட்டம்',
    category: 'AC Installation, Repair & Maintenance',
    price: 1499,
    period: 'Yearly (3 Jet Washes + Free Gas Leak Check)',
    features: ['3 Free Jet Foam Services per year', 'Zero visiting charges on emergency calls', '10% flat discount on spare parts', 'Priority 30-min technician dispatch'],
    featuresTa: ['வருடத்திற்கு 3 இலவச ஜெட் வாஷ்', 'அவசர அழைப்புகளில் கட்டணம் இல்லை', 'பாகங்களில் 10% தள்ளுபடி'],
    recommended: true
  },
  {
    id: 'sub-ro-pure',
    title: 'PureFlow RO Annual Filter Care',
    titleTa: 'பியூர்ஃப்ளோ ஆர்.ஓ வருடாந்திர வடிகட்டி திட்டம்',
    category: 'RO Water Purifier Service',
    price: 1899,
    period: 'Yearly (All Filter Replacements Included)',
    features: ['2 Complete Filter Replacements (Spun + Carbon)', '1 RO Membrane health check', 'Quarterly water TDS & pH lab check', 'Free unexpected breakdown visits'],
    featuresTa: ['2 முழுமையான பில்டர் மாற்றங்கள்', 'டிடிஎஸ் மற்றும் பிஹெச் சோதனை', 'இலவச பழுதுபார்ப்பு'],
    recommended: false
  },
  {
    id: 'sub-two-wheeler',
    title: 'MotoCare 4-Season Two Wheeler Pass',
    titleTa: 'மோட்டோகேர் இரு சக்கர வாகன பாஸ்',
    category: 'Bike & Scooter Service',
    price: 1299,
    period: 'Yearly (4 Doorstep Periodic Services)',
    features: ['4 Periodic Doorstep Services', 'Free Teflon polish & wash', 'Complimentary 2 emergency puncture assists', 'Brake shoe and spark plug tuning included'],
    featuresTa: ['4 வழக்கமான சர்வீஸ்கள்', 'இலவச டெஃப்லான் பாலிஷ்', 'அவசர உதவி'],
    recommended: false
  }
];

// Helper to seed in MongoDB or supply to in-memory store
async function seedAll(User, TechnicianProfile, ServiceCategory, Service, Booking, RegisteredAsset, Review, Notification) {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Hash passwords for users
    for (const u of usersData) {
      u.password = passwordHash;
    }

    if (User && ServiceCategory) {
      // Clear collections
      await User.deleteMany({});
      await TechnicianProfile.deleteMany({});
      await ServiceCategory.deleteMany({});
      await Service.deleteMany({});
      await Booking.deleteMany({});
      await RegisteredAsset.deleteMany({});
      await Review.deleteMany({});
      await Notification.deleteMany({});

      // Insert seeds
      await User.insertMany(usersData);
      await TechnicianProfile.insertMany(technicianProfilesData);
      await ServiceCategory.insertMany(categoriesData);
      await Service.insertMany(servicesData);
      await RegisteredAsset.insertMany(registeredAssetsData);
      await Booking.insertMany(bookingsData);
      await Review.insertMany(reviewsData);
      await Notification.insertMany(notificationsData);

      console.log('✅ Database successfully seeded with rich mock data!');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = {
  categoriesData,
  servicesData,
  usersData,
  technicianProfilesData,
  registeredAssetsData,
  bookingsData,
  reviewsData,
  notificationsData,
  subscriptionsData,
  seedAll
};
