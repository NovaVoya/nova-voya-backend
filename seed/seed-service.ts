/**
 * Seed script for the Service collection.
 * Run with: npx ts-node seed-services.ts
 *
 * Set MONGODB_URI in your env or edit the default below.
 */

import mongoose, { Schema, Types } from 'mongoose';
import { CATEGORIES, MONGODB_URI, PROVIDERS } from './CONSTANTS';

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
      'Personalized risk scoring',
      'Doctor-reviewed report with action plan',
    ],
    clinicInformation:
      'ISO-certified laboratory, experienced clinicians, and modern imaging facilities.',
    highlights: [
      'Fasting required',
      'Report in 24–48h',
      'Free portal access to results',
      'Complimentary BP & BMI check',
    ],
    howItWorks:
      'Book a slot, arrive fasting for 8–10 hours, complete tests, get results and consult.',
    included: [
      'CBC',
      'Lipid profile',
      'Liver & kidney function tests',
      'ECG',
      'Chest X-ray (if indicated)',
      'Thyroid profile (TSH)',
    ],
    excluded: [
      'Medications',
      'Follow-up imaging beyond package',
      'Specialist referrals',
    ],
    expectedOutcome: [
      'Baseline health assessment',
      'Personalized risk stratification',
      'Preventive recommendations',
    ],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      {
        title: 'Do I need to fast?',
        description: 'Yes, 8–10 hours fasting is recommended.',
      },
      {
        title: 'Can I take my morning medications?',
        description:
          'Take essential meds with small sips of water unless told otherwise.',
      },
      {
        title: 'Will I get a hard copy?',
        description:
          'Digital report is standard; printed copy available on request.',
      },
    ],
    faqProvider: [
      { title: 'Is the lab accredited?', description: 'ISO 15189 accredited.' },
      {
        title: 'Who interprets the results?',
        description:
          'A licensed physician reviews your results and explains the plan.',
      },
    ],
    faqProcudures: [
      {
        title: 'How long does it take?',
        description: 'Approximately 2.5 hours end-to-end.',
      },
      {
        title: 'What if an abnormality is found?',
        description:
          'You’ll receive guidance and referrals for follow-up as needed.',
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
    packageHighlights: [
      'Gentle procedure',
      'Fluoride finish',
      'Personalized home-care tips',
    ],
    clinicInformation:
      'Experienced hygienists with modern ultrasonic scalers and strict infection control.',
    highlights: [
      'Minimal downtime',
      'Immediate freshness',
      'Optional desensitizing gel',
    ],
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
      {
        title: 'How often should I get cleaning?',
        description: 'Every 6 months, or more frequently if advised.',
      },
    ],
    faqProvider: [
      {
        title: 'What equipment is used?',
        description: 'Ultrasonic scaler with fine tips.',
      },
      {
        title: 'Do you follow sterilization protocols?',
        description: 'Yes, instruments are autoclaved between every patient.',
      },
    ],
    faqProcudures: [
      {
        title: 'Any aftercare?',
        description: 'Avoid very cold/hot drinks for a few hours.',
      },
      {
        title: 'Can I eat right after?',
        description: 'Yes, but skip strongly colored foods for a few hours.',
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
    packageHighlights: [
      '3T MRI',
      'Radiologist report in 24h',
      'Motion-minimizing cushions',
    ],
    clinicInformation:
      '3 Tesla scanner, experienced neuroradiologists, patient comfort measures.',
    highlights: [
      'Noise-cancelling headphones',
      'Anxiolytics available',
      'Metal safety screening',
    ],
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
      {
        title: 'I’m claustrophobic—what can I do?',
        description:
          'We provide reassurance, headphones, and mild anxiolytics if appropriate.',
      },
    ],
    faqProvider: [
      { title: 'Scanner strength?', description: '3 Tesla high-field MRI.' },
      {
        title: 'Do radiologists subspecialize?',
        description: 'Yes—neuroradiology trained.',
      },
    ],
    faqProcudures: [
      {
        title: 'Can I bring someone?',
        description: 'Companions wait outside due to magnetic field.',
      },
      {
        title: 'What about implants?',
        description:
          'Notify us of any implants; some are MRI-conditional only.',
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
    packageHighlights: [
      'Flexible slots',
      'E-prescriptions',
      'Secure messaging for 48h',
    ],
    clinicInformation:
      'Licensed physicians with secure telehealth platform and encrypted records.',
    highlights: [
      'No travel required',
      'Same-day appointments',
      'Works on mobile & desktop',
    ],
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
      {
        title: 'Can you treat emergencies?',
        description:
          'No—please use in-person urgent/emergency services for emergencies.',
      },
    ],
    faqProvider: [
      { title: 'Are doctors licensed?', description: 'Yes, board-certified.' },
      {
        title: 'Is my data private?',
        description: 'Your visit is encrypted and stored securely.',
      },
    ],
    faqProcudures: [
      { title: 'Can I reschedule?', description: 'Yes, up to 2 hours prior.' },
      {
        title: 'Will I get a sick note?',
        description:
          'Medical certificates provided when clinically appropriate.',
      },
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
    packageHighlights: [
      'Personalized plan',
      'Home exercise program',
      'Goal tracking dashboard',
    ],
    clinicInformation:
      'Certified physiotherapists with manual therapy and sports rehab expertise.',
    highlights: [
      'Evidence-based protocols',
      'Progress tracking',
      'Wear comfortable clothing',
    ],
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
      {
        title: 'How soon will I feel better?',
        description:
          'Some relief can occur after 1–2 sessions; full benefit needs consistency.',
      },
    ],
    faqProvider: [
      {
        title: 'How many sessions?',
        description: 'Typically 4–8 based on condition.',
      },
      {
        title: 'Are therapists licensed?',
        description: 'Yes, all clinicians are credentialed and insured.',
      },
    ],
    faqProcudures: [
      { title: 'Any downtime?', description: 'Mild soreness may occur.' },
      {
        title: 'Can I exercise afterward?',
        description:
          'Light activity is fine; follow your therapist’s guidance.',
      },
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
    packageHighlights: [
      'Printed images',
      'Optional 3D snapshot',
      'Partner welcome',
    ],
    clinicInformation:
      'High-frequency probes, privacy-focused rooms, and experienced sonographers.',
    highlights: ['Comfortable environment', 'Report in 24h', 'Low wait times'],
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
      {
        title: 'Best time for 3D?',
        description:
          'Often between 26–32 weeks, but depends on position and fluid.',
      },
    ],
    faqProvider: [
      {
        title: 'Is it safe?',
        description: 'Yes, uses sound waves (no radiation).',
      },
      {
        title: 'Who performs the scan?',
        description: 'Registered sonographers with Ob-Gyn oversight.',
      },
    ],
    faqProcudures: [
      {
        title: 'Need a full bladder?',
        description: 'Early scans may require it; staff will guide.',
      },
      {
        title: 'Can I record the scan?',
        description:
          'Short clips allowed where policy permits; ask your sonographer.',
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
    packageHighlights: [
      'Quick blood draw',
      'Report in 48–72h',
      'Wide allergen library',
    ],
    clinicInformation:
      'Automated immunoassay platform with rigorous quality control.',
    highlights: ['Wide panel coverage', 'Clear charts in report'],
    howItWorks:
      'Sample collection, lab analysis, and optional physician consultation.',
    included: ['IgE panel', 'Report'],
    excluded: ['Elimination diet plan'],
    expectedOutcome: ['Allergen sensitivity profile'],
    categories: pickMany(CATEGORIES, 2),
    provider: pick(PROVIDERS),
    faqPackage: [
      { title: 'Fasting required?', description: 'No fasting needed.' },
      {
        title: 'Can medications affect results?',
        description: 'Certain biologics can; disclose current treatments.',
      },
    ],
    faqProvider: [
      { title: 'Turnaround time?', description: '48–72 hours.' },
      {
        title: 'Do you test for cross-reactivity?',
        description:
          'Report flags potential cross-reactive allergens when applicable.',
      },
    ],
    faqProcudures: [
      {
        title: 'Any side effects?',
        description: 'Minor bruising at puncture site possible.',
      },
      {
        title: 'Will I need a food challenge?',
        description:
          'Sometimes; discuss with your clinician if results are borderline.',
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
    packageHighlights: [
      'Dermatoscopy',
      'Personalized regimen',
      'UV protection coaching',
    ],
    clinicInformation:
      'Board-certified dermatologists with dermatoscopes and biopsy support.',
    highlights: [
      'Early cancer detection focus',
      'Photo documentation if needed',
    ],
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
      {
        title: 'Sun exposure before visit?',
        description:
          'Avoid tanning for 1–2 weeks to improve assessment accuracy.',
      },
    ],
    faqProvider: [
      {
        title: 'Follow-up?',
        description: 'Typically yearly, or sooner if needed.',
      },
      {
        title: 'Do you perform mole mapping?',
        description: 'Available when clinically indicated.',
      },
    ],
    faqProcudures: [
      {
        title: 'Photos taken?',
        description: 'If required for monitoring with consent.',
      },
      {
        title: 'Will I get prescriptions?',
        description: 'If appropriate; many treatments start the same day.',
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
    packageHighlights: [
      'Immediate interpretation',
      'Risk stratification',
      'Emergency-ready setup',
    ],
    clinicInformation:
      'Experienced team with emergency preparedness and resuscitation equipment.',
    highlights: ['Evidence-based protocol (Bruce)', 'Real-time monitoring'],
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
      {
        title: 'Can I eat beforehand?',
        description: 'Light meal 2–3 hours prior; avoid caffeine same day.',
      },
    ],
    faqProvider: [
      { title: 'Any risks?', description: 'Low risk; supervised environment.' },
      {
        title: 'Blood pressure control required?',
        description: 'Yes—uncontrolled hypertension may postpone testing.',
      },
    ],
    faqProcudures: [
      {
        title: 'Medication pause?',
        description: 'Some meds may be paused—follow doctor advice.',
      },
      {
        title: 'How is the result delivered?',
        description:
          'A cardiologist explains findings and next steps immediately.',
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
    packageHighlights: [
      'Actionable meal plan',
      'Follow-up recommendations',
      'Shopping list tips',
    ],
    clinicInformation:
      'Registered dietitians with clinical and sports nutrition backgrounds.',
    highlights: ['Culturally sensitive plans', 'Works with your budget'],
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
      {
        title: 'Do you accommodate preferences?',
        description: 'Yes—vegan, halal, kosher, and allergies accommodated.',
      },
    ],
    faqProvider: [
      {
        title: 'Insurance coverage?',
        description: 'Varies; check your policy.',
      },
      {
        title: 'Who will I see?',
        description: 'Registered dietitians with relevant subspecialties.',
      },
    ],
    faqProcudures: [
      { title: 'Follow-ups?', description: 'Typically 2–3 over 3 months.' },
      {
        title: 'What if I miss a session?',
        description: 'Free reschedule if notified 24h in advance.',
      },
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
    packageHighlights: [
      'Prescription update',
      'IOP screening',
      'Digital copy of Rx',
    ],
    clinicInformation:
      'Automated refractors, slit-lamp exam capability, and sterile tonometry tips.',
    highlights: ['Quick and accurate measurements', 'Glasses & contact advice'],
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
      {
        title: 'Can I wear contacts to the visit?',
        description:
          'Yes, but bring your case; you may be asked to remove them.',
      },
    ],
    faqProvider: [
      {
        title: 'Age limits?',
        description: 'Suitable for adults and older children.',
      },
      {
        title: 'Contact lens fitting?',
        description: 'Available as an add-on service.',
      },
    ],
    faqProcudures: [
      {
        title: 'Driving after?',
        description: 'Fine unless dilation is performed.',
      },
      {
        title: 'Prescription validity?',
        description: 'Typically valid for 1–2 years depending on local rules.',
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
    packageHighlights: [
      'Quick visit',
      'Results same-day for CBC',
      'Digital report & trends',
    ],
    clinicInformation:
      'Automated analyzers with multi-level controls and rapid reporting.',
    highlights: ['Reliable and affordable', 'Minimal wait time'],
    howItWorks: 'Blood draw, lab processing, and results via portal.',
    included: ['CBC', 'CMP', 'Fasting glucose'],
    excluded: ['HbA1c', 'Lipid profile'],
    expectedOutcome: ['Baseline metrics for primary care follow-up'],
    categories: pickMany(CATEGORIES, 1),
    provider: pick(PROVIDERS),
    faqPackage: [
      { title: 'Fasting?', description: 'Yes, 8 hours for fasting glucose.' },
      {
        title: 'Hydration?',
        description: 'Drink water—being well-hydrated can ease the blood draw.',
      },
    ],
    faqProvider: [
      {
        title: 'Delivery of results?',
        description: 'Within 24–48h via portal.',
      },
      {
        title: 'Quality control?',
        description: 'Daily calibration and external proficiency testing.',
      },
    ],
    faqProcudures: [
      {
        title: 'Repeat testing?',
        description: 'As advised by your physician.',
      },
      {
        title: 'Bruising risk?',
        description:
          'Minor bruising can occur; apply pressure for 3–5 minutes post draw.',
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
    packageHighlights: [
      'Sound-treated room',
      'Calibrated equipment',
      'Same-day report',
    ],
    clinicInformation:
      'Experienced audiologists with ENT support for interpretation.',
    highlights: [
      'Quick, objective results',
      'Comfortable, child-friendly setting',
    ],
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
      {
        title: 'Can I test with a cold?',
        description:
          'Better to wait until congestion clears for accurate results.',
      },
    ],
    faqProvider: [
      {
        title: 'Children tested?',
        description: 'Yes, cooperative children can be assessed.',
      },
      {
        title: 'Booth safety?',
        description: 'Fully ventilated and regularly sanitized.',
      },
    ],
    faqProcudures: [
      {
        title: 'Retest needed?',
        description: 'If results are borderline or symptoms change.',
      },
      {
        title: 'Next steps if abnormal?',
        description:
          'We’ll advise ENT referral or further testing as appropriate.',
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
