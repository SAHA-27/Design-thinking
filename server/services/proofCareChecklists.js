// Service-specific digital checklist templates for ServEase ProofCare

const checklistTemplates = {
  'ro-water-purifier': [
    {
      itemKey: 'ro_pre_filter',
      label: 'Pre-Filter Candle & Sediment Bowl Inspection',
      required: true,
      measuredField: 'Physical Silt Accumulation Level (Clean/Moderate/Severe)',
      defaultNotes: 'Inspected 10-inch spun polypropylene housing for sediment fouling.'
    },
    {
      itemKey: 'ro_carbon_test',
      label: 'Activated Carbon Block Chlorine/Taste Check',
      required: true,
      measuredField: 'Chlorine Smell Residual (None/Detected)',
      defaultNotes: 'Carbon core verified for organic contaminant absorption.'
    },
    {
      itemKey: 'ro_tds_measurement',
      label: 'Calibrated Input vs Output TDS Meter Verification',
      required: true,
      measuredField: 'Input TDS: 450 ppm -> Output Target TDS: ~80 ppm',
      defaultNotes: 'Digital calibrated TDS pen reading before and after service.'
    },
    {
      itemKey: 'ro_pump_pressure',
      label: 'Booster Pump Operating Pressure & Solenoid Cutoff',
      required: true,
      measuredField: 'Pressure Gauge: 80-100 PSI',
      defaultNotes: 'Auto-cutoff valve engages properly when pure tank fills.'
    },
    {
      itemKey: 'ro_leakage_drain',
      label: 'High-Pressure Joints & Reject Wastewater Ratio Test',
      required: true,
      measuredField: 'Wastewater to Pure Water Ratio: 2.5:1',
      defaultNotes: 'Zero tube joint seepage verified under 100 PSI operating pressure.'
    }
  ],

  'ac-service': [
    {
      itemKey: 'ac_cooling_split',
      label: 'Indoor Air Supply vs Return Cooling Temperature Split',
      required: true,
      measuredField: 'Inlet: 28°C -> Outlet Grill: 14°C (Delta > 12°C)',
      defaultNotes: 'Digital infrared thermometer temperature delta confirmed.'
    },
    {
      itemKey: 'ac_filter_blower',
      label: 'Air Filter Scrub & Cross-Flow Blower Fan Balancing',
      required: true,
      measuredField: 'Air Velocity: 380 CFM',
      defaultNotes: 'Antibacterial foam wash applied to blower blades and filters.'
    },
    {
      itemKey: 'ac_gas_pressure',
      label: 'Refrigerant Manifold Suction Gauge Pressure',
      required: true,
      measuredField: 'Standing Pressure: 125-135 PSI (R32 / R410A)',
      defaultNotes: 'Manifold gauges connected; zero needle drop over 10 minutes.'
    },
    {
      itemKey: 'ac_drain_tray',
      label: 'Condensate Drain Tray Slope & Overflow Pipe Flush',
      required: true,
      measuredField: 'Drain Discharge Rate: Free Flow',
      defaultNotes: 'Flushed drain pipe with 1.5L sanitized water; zero indoor drip.'
    },
    {
      itemKey: 'ac_electrical_amp',
      label: 'Compressor Run Capacitor & Inverter Current Draw',
      required: true,
      measuredField: 'Running Current: 5.8 Amps (Rated 6.2A)',
      defaultNotes: 'Clamp multimeter amperage test within manufacturer spec.'
    }
  ],

  'bike-service': [
    {
      itemKey: 'bike_engine_oil',
      label: 'Engine Oil Quality, Level & Drain Plug Washer Check',
      required: true,
      measuredField: 'Oil Grade: 10W30 4T (Synthetic)',
      defaultNotes: 'Flushed old degraded oil and installed fresh crush washer.'
    },
    {
      itemKey: 'bike_brakes',
      label: 'Brake Liners Thickness & Lever Free-Play Clearance',
      required: true,
      measuredField: 'Front: 15mm play / Rear: 20mm play',
      defaultNotes: 'Drum cleaned of brake dust; cables lubricated with grease.'
    },
    {
      itemKey: 'bike_spark_air',
      label: 'Spark Plug Gap & Air Filter Element Replacement/Clean',
      required: true,
      measuredField: 'Electrode Gap: 0.75 mm',
      defaultNotes: 'Cleaned spark tip carbon with brass wire brush.'
    },
    {
      itemKey: 'bike_chain_tension',
      label: 'Drive Chain Slackness, Alignment & High-Tack Lube',
      required: true,
      measuredField: 'Chain Slack: 25-30 mm',
      defaultNotes: 'Degreased with kerosene; adjusted axle adjusters and lubricated.'
    },
    {
      itemKey: 'bike_electrical_battery',
      label: '12V Battery Cranking Voltage & Turn Indicator Lights',
      required: true,
      measuredField: 'Idle: 12.8V / Charging: 14.2V',
      defaultNotes: 'Electric self-starter engages on first tap without relay buzz.'
    }
  ],

  'car-service': [
    {
      itemKey: 'car_obd_scan',
      label: '40-Point OBD-II Computer Diagnostics Scan',
      required: true,
      measuredField: 'Diagnostic Trouble Codes (DTC): 0 Faults Found',
      defaultNotes: 'ECU engine scan cleared; all sensor readings nominal.'
    },
    {
      itemKey: 'car_oil_filter',
      label: 'Synthetic Engine Oil Flush & OEM Oil Filter Renewal',
      required: true,
      measuredField: 'Oil Capacity: 3.5 Liters (5W30)',
      defaultNotes: 'Oil filter torqued to OEM spec with new O-ring.'
    },
    {
      itemKey: 'car_brakes_fluid',
      label: 'Disc Brake Pads Thickness & DOT4 Fluid Moisture Test',
      required: true,
      measuredField: 'Pad Thickness: 8mm (Safe)',
      defaultNotes: 'Caliper guide pins degreased and lubed with silicone paste.'
    },
    {
      itemKey: 'car_suspension_underbody',
      label: 'Chassis Suspension Bushings & Steering Linkage Audit',
      required: true,
      measuredField: 'Control Arm Bushings: Intact',
      defaultNotes: 'Tie rod ends and anti-roll bar links checked for play.'
    },
    {
      itemKey: 'car_battery_tyres',
      label: 'Battery Cold Cranking Amps & Cold Tyre Pressures',
      required: true,
      measuredField: 'Cold Pressure: 33 PSI All 4 Wheels',
      defaultNotes: 'Battery health verified via digital load tester at 94% health.'
    }
  ],

  'plumbing': [
    {
      itemKey: 'plumb_pressure_test',
      label: 'Concealed Water Pipeline Static Pressure Test',
      required: true,
      measuredField: 'Test Pressure: 3.5 Bar (Held 15 mins)',
      defaultNotes: 'No pressure drop registered on acoustic detector.'
    },
    {
      itemKey: 'plumb_drain_flow',
      label: 'Drainage Pipe Clearance & Floor Trap Gravity Flow',
      required: true,
      measuredField: 'Discharge Velocity: Unrestricted',
      defaultNotes: 'Mechanical drain snake passed; grease blockage cleared.'
    },
    {
      itemKey: 'plumb_fixtures_valves',
      label: 'Angle Valves, Ceramic Spindles & Teflon Threading',
      required: true,
      measuredField: 'Fixtures Checked: 4 Fixtures',
      defaultNotes: 'Old eroded rubber washers replaced with ceramic discs.'
    }
  ],

  'electrician': [
    {
      itemKey: 'elec_earthing_voltage',
      label: 'Neutral-to-Ground Safety Earthing Leakage Voltage',
      required: true,
      measuredField: 'Neutral-Ground Voltage: 1.2 Volts (Must be < 2V)',
      defaultNotes: 'Verified with True-RMS digital multimeter at main board.'
    },
    {
      itemKey: 'elec_mcb_tripping',
      label: 'Miniature Circuit Breaker (MCB) & RCCB Residual Trip Test',
      required: true,
      measuredField: 'Trip Test: 30mA within 28ms',
      defaultNotes: 'Safety trip switch operational to prevent electric shocks.'
    },
    {
      itemKey: 'elec_terminals_tight',
      label: 'Distribution Board Terminal Torquing & Thermal Check',
      required: true,
      measuredField: 'Thermal Signature: Normal (<38°C)',
      defaultNotes: 'All loose screws tightened; zero copper carbonization.'
    }
  ],

  'default': [
    {
      itemKey: 'gen_pre_inspection',
      label: 'Comprehensive Pre-Service Diagnosis & Wear Assessment',
      required: true,
      measuredField: 'Condition: Recorded & Photographed',
      defaultNotes: 'Identified primary symptom and component wear.'
    },
    {
      itemKey: 'gen_safety_check',
      label: 'Operational Safety & Voltage/Leakage Audit',
      required: true,
      measuredField: 'Safety Interlocks: All Normal',
      defaultNotes: 'Appliance safety cutoffs verified before opening casing.'
    },
    {
      itemKey: 'gen_work_completion',
      label: 'Post-Service Operational Run Test',
      required: true,
      measuredField: 'Performance Test: Passed 100%',
      defaultNotes: 'Continuous 10-minute test run performed with customer present.'
    }
  ]
};

function getChecklistForCategory(categorySlug) {
  if (!categorySlug) return checklistTemplates['default'];
  const slug = categorySlug.toLowerCase();
  if (slug.includes('ro') || slug.includes('water')) return checklistTemplates['ro-water-purifier'];
  if (slug.includes('ac')) return checklistTemplates['ac-service'];
  if (slug.includes('bike')) return checklistTemplates['bike-service'];
  if (slug.includes('car')) return checklistTemplates['car-service'];
  if (slug.includes('plumb')) return checklistTemplates['plumbing'];
  if (slug.includes('elect')) return checklistTemplates['electrician'];
  return checklistTemplates['default'];
}

module.exports = {
  checklistTemplates,
  getChecklistForCategory
};
