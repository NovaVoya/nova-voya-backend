/**
 * Seed script for the Service collection.
 * Run with: npx ts-node seed-services.ts
 *
 * Set MONGODB_URI in your env or edit the default below.
 */

import mongoose, { Schema, Types } from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ??
  'mongodb://root:example@localhost:27017/?authSource=admin';

/* =========================
   Known IDs from your data
   ========================= */
const PROVIDERS: Types.ObjectId[] = [
  '68a890bfa3ed228516130d26',
  '68a890f8a3ed228516130d28',
  '68a8910ca3ed228516130d2a',
  '68a8914ea3ed228516130d2c',
  '68a89161a3ed228516130d2e',
  '68a89179a3ed228516130d30',
].map((id) => new Types.ObjectId(id));

const CATEGORIES: Types.ObjectId[] = [
  '68a88ab32c641a7f223012d9',
  '68a88abf2c641a7f223012db',
  '68a88ac32c641a7f223012dd',
  '68a88afb2c641a7f223012e2',
  '68a88b082c641a7f223012e5',
  '68a88b112c641a7f223012e7',
  '68a88b132c641a7f223012e9',
].map((id) => new Types.ObjectId(id));

/* =========================
   TS Interface for documents
   ========================= */
interface Service {
  name: string;
  description: string;
  price: string;
  discount?: string;
  validDiscountDate?: Date;
  rate: number;
  recommended: boolean;
  cancellation: boolean;
  consultation: string;
  duration: string;
  location: string;
  packageHighlights: string[];
  clinicInformation: string;
  highlights: string[];
  howItWorks: string;
  included: string[];
  excluded: string[];
  expectedOutcome: string[];
  categories: Types.ObjectId[]; // explicit ObjectId[]
  provider: Types.ObjectId; // explicit ObjectId
  faqPackage: { title: string; description: string }[];
  faqProvider: { title: string; description: string }[];
  // Field name preserved as provided (typo included) to match schema:
  faqProcudures: { title: string; description: string }[];
  thumbnail?: string;
  gallery: string[];
}

/* =========================
   Mongoose Schema & Model
   ========================= */
// type ServiceDoc = mongoose.HydratedDocument<Service>;

const ServiceSchema = new Schema<Service>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: String },
    validDiscountDate: { type: Date },
    rate: { type: Number, required: true },
    recommended: { type: Boolean, required: true },
    cancellation: { type: Boolean, required: true },
    consultation: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    packageHighlights: { type: [String], default: [] },
    clinicInformation: { type: String, required: true },
    highlights: { type: [String], default: [] },
    howItWorks: { type: String, required: true },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    expectedOutcome: { type: [String], default: [] },

    categories: [{ type: Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },

    faqPackage: { type: [{ title: String, description: String }], default: [] },
    faqProvider: {
      type: [{ title: String, description: String }],
      default: [],
    },
    // Keep original field name
    faqProcudures: {
      type: [{ title: String, description: String }],
      default: [],
    },

    thumbnail: { type: String },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true },
);

const ServiceModel =
  (mongoose.models.Service as mongoose.Model<Service>) ||
  mongoose.model<Service>('Service', ServiceSchema);

/* =========================
   Helpers
   ========================= */
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const pickMany = <T>(arr: T[], n: number) => {
  const copy = [...arr];
  const out: T[] = [];
  while (n-- > 0 && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

const futureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

/* =========================
   Seed Data
   ========================= */
const SERVICES: Service[] = [
  {
    name: 'Comprehensive Health Checkup',
    description:
      'Full body diagnostic package including blood work, cardiac screening, and imaging as indicated.',
    price: '299',
    discount: '7',
    validDiscountDate: futureDate(30),
    rate: 4.7,
    recommended: true,
    cancellation: true,
    consultation: 'Includes 30-min physician consultation',
    duration: '2h 30m',
    location: 'On-site clinic',
    packageHighlights: [
      'Same-day results summary',
      'Diet & lifestyle guidance',
    ],
    clinicInformation:
      'ISO-certified laboratory, experienced clinicians, and modern imaging facilities.',
    highlights: ['Fasting required', 'Report in 24–48h'],
    howItWorks:
      'Book a slot, arrive fasting for 8–10 hours, complete tests, get results and consult.',
    included: [
      'CBC',
      'Lipid profile',
      'Liver & kidney function tests',
      'ECG',
      'Chest X-ray (if indicated)',
    ],
    excluded: ['Medications', 'Follow-up imaging beyond package'],
    expectedOutcome: [
      'Baseline health assessment',
      'Personalized risk stratification',
    ],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Do I need to fast?',
        description: 'Yes, 8–10 hours fasting is recommended.',
      },
    ],
    faqProvider: [
      { title: 'Is the lab accredited?', description: 'ISO 15189 accredited.' },
    ],
    faqProcudures: [
      {
        title: 'How long does it take?',
        description: 'Approximately 2.5 hours end-to-end.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/1011/800/500',
    gallery: [
      'https://picsum.photos/id/1012/800/500',
      'https://picsum.photos/id/1013/800/500',
    ],
  },
  {
    name: 'Dental Cleaning & Polishing',
    description:
      'Professional scaling and polishing to remove plaque, tartar, and surface stains.',
    price: '90',
    discount: '10',
    validDiscountDate: futureDate(14),
    rate: 4.5,
    recommended: true,
    cancellation: true,
    consultation: 'Initial oral exam included',
    duration: '45m',
    location: 'Dental suite',
    packageHighlights: ['Gentle procedure', 'Fluoride finish'],
    clinicInformation:
      'Experienced hygienists with modern ultrasonic scalers and strict infection control.',
    highlights: ['Minimal downtime', 'Immediate freshness'],
    howItWorks:
      'Assessment, ultrasonic scaling, polishing, and post-care instructions.',
    included: ['Scaling', 'Polishing', 'Fluoride varnish'],
    excluded: ['Fillings', 'Whitening', 'X-rays'],
    expectedOutcome: ['Cleaner teeth', 'Healthier gums', 'Fresher breath'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Is it painful?',
        description: 'Usually not; mild sensitivity can occur.',
      },
    ],
    faqProvider: [
      {
        title: 'What equipment is used?',
        description: 'Ultrasonic scaler with fine tips.',
      },
    ],
    faqProcudures: [
      {
        title: 'Any aftercare?',
        description: 'Avoid very cold/hot drinks for a few hours.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/1027/800/500',
    gallery: ['https://picsum.photos/id/1023/800/500'],
  },
  {
    name: 'MRI Brain (Contrast if Indicated)',
    description:
      'High-resolution MRI for brain with contrast if clinically indicated.',
    price: '450',
    rate: 4.8,
    recommended: true,
    cancellation: false,
    consultation: 'Radiology consult available on request',
    duration: '1h',
    location: 'Radiology unit',
    packageHighlights: ['3T MRI', 'Radiologist report in 24h'],
    clinicInformation:
      '3 Tesla scanner, experienced neuroradiologists, patient comfort measures.',
    highlights: ['Noise-cancelling headphones', 'Anxiolytics available'],
    howItWorks:
      'Screening, positioning, scan sequences, contrast if needed, and report delivery.',
    included: ['MRI sequences', 'Radiologist report'],
    excluded: ['Sedation', 'Follow-up consult'],
    expectedOutcome: ['Diagnostic imaging for neurological conditions'],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Is contrast safe?',
        description: 'Yes, with kidney function screening.',
      },
    ],
    faqProvider: [
      { title: 'Scanner strength?', description: '3 Tesla high-field MRI.' },
    ],
    faqProcudures: [
      {
        title: 'Can I bring someone?',
        description: 'Companions wait outside due to magnetic field.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/1040/800/500',
    gallery: ['https://picsum.photos/id/1041/800/500'],
  },
  {
    name: 'Telemedicine Primary Care Consult',
    description:
      'Video consultation for common primary care concerns and follow-up reviews.',
    price: '35',
    rate: 4.3,
    recommended: false,
    cancellation: true,
    consultation: '15–20 min video call',
    duration: '20m',
    location: 'Online',
    packageHighlights: ['Flexible slots', 'E-prescriptions'],
    clinicInformation:
      'Licensed physicians with secure telehealth platform and encrypted records.',
    highlights: ['No travel required', 'Same-day appointments'],
    howItWorks:
      'Book a time, join secure link, discuss concerns, receive plan and prescription.',
    included: ['Consultation', 'E-prescription (if suitable)'],
    excluded: ['Lab tests', 'Imaging'],
    expectedOutcome: ['Care plan and next steps'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'What do I need?',
        description: 'Stable internet and a valid ID.',
      },
    ],
    faqProvider: [
      { title: 'Are doctors licensed?', description: 'Yes, board-certified.' },
    ],
    faqProcudures: [
      { title: 'Can I reschedule?', description: 'Yes, up to 2 hours prior.' },
    ],
    thumbnail: 'https://picsum.photos/id/1062/800/500',
    gallery: ['https://picsum.photos/id/1063/800/500'],
  },
  {
    name: 'Physiotherapy Session (Musculoskeletal)',
    description:
      'Hands-on therapy and guided exercises for back, neck, and joint pain.',
    price: '60',
    discount: '6',
    validDiscountDate: futureDate(21),
    rate: 4.6,
    recommended: true,
    cancellation: true,
    consultation: 'Initial assessment included',
    duration: '1h',
    location: 'Physiotherapy room',
    packageHighlights: ['Personalized plan', 'Home exercise program'],
    clinicInformation:
      'Certified physiotherapists with manual therapy and sports rehab expertise.',
    highlights: ['Evidence-based protocols', 'Progress tracking'],
    howItWorks:
      'Assessment, goal setting, manual therapy, exercise instruction, and review.',
    included: ['Assessment', 'Therapy session', 'Exercise plan'],
    excluded: ['Bracing', 'Imaging'],
    expectedOutcome: ['Reduced pain', 'Improved mobility'],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'What to wear?',
        description: 'Comfortable, flexible clothing.',
      },
    ],
    faqProvider: [
      {
        title: 'How many sessions?',
        description: 'Typically 4–8 based on condition.',
      },
    ],
    faqProcudures: [
      { title: 'Any downtime?', description: 'Mild soreness may occur.' },
    ],
    thumbnail: 'https://picsum.photos/id/1084/800/500',
    gallery: ['https://picsum.photos/id/1080/800/500'],
  },
  {
    name: 'Prenatal Ultrasound (2D/3D)',
    description:
      'Obstetric ultrasound for fetal growth and well-being; 3D preview when feasible.',
    price: '120',
    rate: 4.9,
    recommended: true,
    cancellation: true,
    consultation: 'Ob-Gyn review available',
    duration: '40m',
    location: 'Imaging suite',
    packageHighlights: ['Printed images', 'Optional 3D snapshot'],
    clinicInformation:
      'High-frequency probes, privacy-focused rooms, and experienced sonographers.',
    highlights: ['Comfortable environment', 'Report in 24h'],
    howItWorks:
      'Standard obstetric measurements, Doppler as needed, and report review.',
    included: ['Ultrasound scan', 'Report'],
    excluded: ['NIPT', 'Genetic counseling'],
    expectedOutcome: [
      'Gestational age, growth parameters, well-being assessment',
    ],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      { title: 'Can family join?', description: 'Yes, one companion welcome.' },
    ],
    faqProvider: [
      {
        title: 'Is it safe?',
        description: 'Yes, uses sound waves (no radiation).',
      },
    ],
    faqProcudures: [
      {
        title: 'Need a full bladder?',
        description: 'Early scans may require it; staff will guide.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/109/800/500',
    gallery: ['https://picsum.photos/id/110/800/500'],
  },
  {
    name: 'Allergy Panel (Food & Aeroallergens)',
    description:
      'Comprehensive IgE panel for common food and environmental allergens.',
    price: '140',
    rate: 4.2,
    recommended: false,
    cancellation: true,
    consultation: 'Results review optional',
    duration: '20m',
    location: 'Lab draw station',
    packageHighlights: ['Quick blood draw', 'Report in 48–72h'],
    clinicInformation:
      'Automated immunoassay platform with rigorous quality control.',
    highlights: ['Wide panel coverage'],
    howItWorks:
      'Sample collection, lab analysis, and optional physician consultation.',
    included: ['IgE panel', 'Report'],
    excluded: ['Elimination diet plan'],
    expectedOutcome: ['Allergen sensitivity profile'],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      { title: 'Fasting required?', description: 'No fasting needed.' },
    ],
    faqProvider: [{ title: 'Turnaround time?', description: '48–72 hours.' }],
    faqProcudures: [
      {
        title: 'Any side effects?',
        description: 'Minor bruising at puncture site possible.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/111/800/500',
    gallery: ['https://picsum.photos/id/112/800/500'],
  },
  {
    name: 'Dermatology Skin Check',
    description:
      'Full-body skin exam for moles, lesions, acne, and dermatologic conditions.',
    price: '85',
    rate: 4.4,
    recommended: true,
    cancellation: true,
    consultation: 'Dermatology consult',
    duration: '30m',
    location: 'Dermatology room',
    packageHighlights: ['Dermatoscopy', 'Personalized regimen'],
    clinicInformation:
      'Board-certified dermatologists with dermatoscopes and biopsy support.',
    highlights: ['Early cancer detection focus'],
    howItWorks:
      'History, exam, dermatoscopy, and care plan. Biopsy if needed (extra).',
    included: ['Consultation'],
    excluded: ['Biopsy', 'Medications'],
    expectedOutcome: ['Detection and management plan for skin issues'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Can I wear makeup?',
        description: 'Preferably avoid on the day.',
      },
    ],
    faqProvider: [
      {
        title: 'Follow-up?',
        description: 'Typically yearly, or sooner if needed.',
      },
    ],
    faqProcudures: [
      {
        title: 'Photos taken?',
        description: 'If required for monitoring with consent.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/113/800/500',
    gallery: ['https://picsum.photos/id/114/800/500'],
  },
  {
    name: 'Cardiology Stress Test (Treadmill)',
    description:
      'Exercise ECG stress test to evaluate cardiac function under load.',
    price: '220',
    rate: 4.6,
    recommended: true,
    cancellation: false,
    consultation: 'Cardiologist review included',
    duration: '1h',
    location: 'Cardiology lab',
    packageHighlights: ['Immediate interpretation', 'Risk stratification'],
    clinicInformation:
      'Experienced team with emergency preparedness and resuscitation equipment.',
    highlights: ['Evidence-based protocol (Bruce)'],
    howItWorks:
      'Resting ECG, treadmill protocol, recovery, and cardiology report.',
    included: ['ECG monitoring', 'Report'],
    excluded: ['Echocardiography'],
    expectedOutcome: ['Assessment of ischemia and exercise tolerance'],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'What to wear?',
        description: 'Comfortable athletic attire and shoes.',
      },
    ],
    faqProvider: [
      { title: 'Any risks?', description: 'Low risk; supervised environment.' },
    ],
    faqProcudures: [
      {
        title: 'Medication pause?',
        description: 'Some meds may be paused—follow doctor advice.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/115/800/500',
    gallery: ['https://picsum.photos/id/116/800/500'],
  },
  {
    name: 'Nutrition Counseling (Initial)',
    description: 'One-on-one session to build a personalized nutrition plan.',
    price: '70',
    discount: '3',
    validDiscountDate: futureDate(10),
    rate: 4.1,
    recommended: false,
    cancellation: true,
    consultation: 'Dietitian consult',
    duration: '50m',
    location: 'Consultation room / Online',
    packageHighlights: ['Actionable meal plan', 'Follow-up recommendations'],
    clinicInformation:
      'Registered dietitians with clinical and sports nutrition backgrounds.',
    highlights: ['Culturally sensitive plans'],
    howItWorks: 'Dietary recall, goal setting, tailored plan, and resources.',
    included: ['Initial consult', 'Meal plan PDF'],
    excluded: ['Supplements'],
    expectedOutcome: ['Improved dietary habits and health goals support'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Bring labs?',
        description: 'Recent labs help personalize advice.',
      },
    ],
    faqProvider: [
      {
        title: 'Insurance coverage?',
        description: 'Varies; check your policy.',
      },
    ],
    faqProcudures: [
      { title: 'Follow-ups?', description: 'Typically 2–3 over 3 months.' },
    ],
    thumbnail: 'https://picsum.photos/id/117/800/500',
    gallery: ['https://picsum.photos/id/118/800/500'],
  },
  {
    name: 'Vision Screening & Refraction',
    description:
      'Comprehensive vision check including refraction and intraocular pressure.',
    price: '55',
    rate: 4.0,
    recommended: false,
    cancellation: true,
    consultation: 'Optometrist consult',
    duration: '35m',
    location: 'Eye clinic',
    packageHighlights: ['Prescription update', 'IOP screening'],
    clinicInformation:
      'Automated refractors, slit-lamp exam capability, and sterile tonometry tips.',
    highlights: ['Quick and accurate measurements'],
    howItWorks:
      'Vision charting, autorefract, subjective refraction, and IOP check.',
    included: ['Refraction', 'IOP screening'],
    excluded: ['Dilation', 'Frames/Lenses'],
    expectedOutcome: ['Updated prescription and eye health screening'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Dilation needed?',
        description: 'Not usually; add-on if indicated.',
      },
    ],
    faqProvider: [
      {
        title: 'Age limits?',
        description: 'Suitable for adults and older children.',
      },
    ],
    faqProcudures: [
      {
        title: 'Driving after?',
        description: 'Fine unless dilation is performed.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/119/800/500',
    gallery: ['https://picsum.photos/id/120/800/500'],
  },
  {
    name: 'Basic Blood Work',
    description:
      'CBC, CMP, and fasting glucose for baseline health monitoring.',
    price: '40',
    rate: 4.2,
    recommended: false,
    cancellation: true,
    consultation: 'Report review optional',
    duration: '15m',
    location: 'Lab draw station',
    packageHighlights: ['Quick visit', 'Results same-day for CBC'],
    clinicInformation:
      'Automated analyzers with multi-level controls and rapid reporting.',
    highlights: ['Reliable and affordable'],
    howItWorks: 'Blood draw, lab processing, and results via portal.',
    included: ['CBC', 'CMP', 'Fasting glucose'],
    excluded: ['HbA1c', 'Lipid profile'],
    expectedOutcome: ['Baseline metrics for primary care follow-up'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      { title: 'Fasting?', description: 'Yes, 8 hours for fasting glucose.' },
    ],
    faqProvider: [
      {
        title: 'Delivery of results?',
        description: 'Within 24–48h via portal.',
      },
    ],
    faqProcudures: [
      {
        title: 'Repeat testing?',
        description: 'As advised by your physician.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/121/800/500',
    gallery: ['https://picsum.photos/id/122/800/500'],
  },
  {
    name: 'ENT Hearing Test (Audiometry)',
    description:
      'Pure-tone audiometry to assess hearing thresholds across frequencies.',
    price: '75',
    rate: 4.3,
    recommended: false,
    cancellation: true,
    consultation: 'ENT/Audiologist review',
    duration: '30m',
    location: 'Audiology booth',
    packageHighlights: ['Sound-treated room', 'Calibrated equipment'],
    clinicInformation:
      'Experienced audiologists with ENT support for interpretation.',
    highlights: ['Quick, objective results'],
    howItWorks: 'Otoscopy, headphone fitting, threshold testing, and report.',
    included: ['Audiometry test', 'Report'],
    excluded: ['Hearing aids'],
    expectedOutcome: ['Hearing profile and recommendations'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Any prep?',
        description: 'Avoid loud noise exposure for 24h before test.',
      },
    ],
    faqProvider: [
      {
        title: 'Children tested?',
        description: 'Yes, cooperative children can be assessed.',
      },
    ],
    faqProcudures: [
      {
        title: 'Retest needed?',
        description: 'If results are borderline or symptoms change.',
      },
    ],
    thumbnail: 'https://picsum.photos/id/123/800/500',
    gallery: ['https://picsum.photos/id/124/800/500'],
  },
];

/* =========================
   Main
   ========================= */
async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;
  console.log('Connected to', db.name);

  await ServiceModel.deleteMany({});
  console.log('Cleared existing services');

  const inserted = await ServiceModel.insertMany(SERVICES);
  console.log(`Inserted ${inserted.length} services`);

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
