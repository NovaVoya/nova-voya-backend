/**
 * Seed script for the ProviderReviews collection.
 * Run with: npx ts-node seed-provider-reviews.ts
 *
 * Set MONGODB_URI in your env or edit the default below.
 */

import mongoose, { Schema, Types } from 'mongoose';
import { PROVIDERS, MONGODB_URI } from './CONSTANTS';

/* =========================
   TS Interface & Schema
   ========================= */
type Gender = 'male' | 'female';

interface ProviderReviews {
  name: string;
  displayInWebsite: boolean;
  gender: Gender;
  description: string;
  provider: Types.ObjectId;
  rate: number;
}

const ProviderReviewsSchema = new Schema<ProviderReviews>(
  {
    name: { type: String, required: true },
    displayInWebsite: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: ['male', 'female'], required: true },
    description: { type: String, required: true },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    rate: { type: Number, required: true },
  },
  { timestamps: true },
);

const ProviderReviewsModel =
  (mongoose.models.ProviderReviews as mongoose.Model<ProviderReviews>) ||
  mongoose.model<ProviderReviews>('ProviderReviews', ProviderReviewsSchema);

/* =========================
   Seed Data (12 reviews)
   ========================= */
const PROVIDER_REVIEWS: ProviderReviews[] = [
  // Provider 1
  {
    name: 'Daniel R.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'Super professional and attentive. The consultation was clear and I felt heard throughout. Daniel explained each step carefully and even followed up afterward to check on my progress, which made me feel truly supported.',
    provider: PROVIDERS[0],
    rate: 5,
  },
  {
    name: 'Sara L.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'Efficient appointment, friendly staff, and great follow-up instructions. I never felt rushed, and Sara’s detailed advice helped me feel confident moving forward with my treatment plan.',
    provider: PROVIDERS[0],
    rate: 4,
  },
  {
    name: 'John P.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'From booking to follow-up, the process was smooth and stress-free. The provider took extra time to explain my options in detail, and I appreciated the respectful, patient-centered approach.',
    provider: PROVIDERS[0],
    rate: 5,
  },

  // Provider 2
  {
    name: 'Arman K.',
    gender: 'male',
    displayInWebsite: false,
    description:
      'Timely diagnosis and a practical care plan. Booking was seamless, and I felt reassured knowing that each recommendation was evidence-based and carefully explained.',
    provider: PROVIDERS[1],
    rate: 5,
  },
  {
    name: 'Mina P.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'The clinic was spotless and the doctor explained everything clearly. I left with a clear understanding of my treatment options and felt very comfortable throughout the process.',
    provider: PROVIDERS[1],
    rate: 4,
  },
  {
    name: 'Samira H.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'Excellent communication and a warm demeanor. I was impressed with how much time was dedicated to addressing my questions and ensuring I understood every detail of my care plan.',
    provider: PROVIDERS[1],
    rate: 5,
  },

  // Provider 3
  {
    name: 'Hassan D.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'Great bedside manner and thorough exam. I appreciated the detailed summary that was easy to follow and included practical next steps that made me feel confident moving forward.',
    provider: PROVIDERS[2],
    rate: 5,
  },
  {
    name: 'Leyla N.',
    gender: 'female',
    displayInWebsite: false,
    description:
      'Quick visit with minimal waiting. Clear next steps and helpful resources were provided, which made the experience smooth and reassuring.',
    provider: PROVIDERS[2],
    rate: 4,
  },
  {
    name: 'Ali F.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'I appreciated the care and empathy shown. The doctor went above and beyond to make sure I understood everything and even gave me reading materials to take home.',
    provider: PROVIDERS[2],
    rate: 5,
  },

  // Provider 4
  {
    name: 'Omid S.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'Felt very comfortable during the entire session. The provider made sure I was relaxed, explained the procedure thoroughly, and ensured I had no unanswered questions. Highly recommend.',
    provider: PROVIDERS[3],
    rate: 5,
  },
  {
    name: 'Nika T.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'Courteous staff and modern equipment. Results arrived sooner than expected, and I was impressed with the follow-up call to make sure I understood them correctly.',
    provider: PROVIDERS[3],
    rate: 4,
  },
  {
    name: 'David K.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'Professional from start to finish. The staff was welcoming, and the doctor made me feel at ease while thoroughly addressing my concerns.',
    provider: PROVIDERS[3],
    rate: 5,
  },

  // Provider 5
  {
    name: 'Reza M.',
    gender: 'male',
    displayInWebsite: false,
    description:
      'Clear communication and thoughtful advice. The follow-up was prompt and detailed, leaving me feeling well cared for and confident about my recovery.',
    provider: PROVIDERS[4],
    rate: 5,
  },
  {
    name: 'Parisa J.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'Smooth experience end-to-end. I appreciated the personalized guidance and the clear, easy-to-understand instructions that I could follow afterward.',
    provider: PROVIDERS[4],
    rate: 4,
  },
  {
    name: 'Elham Z.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'From check-in to check-out, the team was incredibly supportive. The provider answered all my questions patiently and gave me actionable next steps.',
    provider: PROVIDERS[4],
    rate: 5,
  },

  // Provider 6
  {
    name: 'Kaveh A.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'Very knowledgeable team. The care plan felt tailored to my needs and I truly appreciated the time spent explaining both short-term and long-term strategies for my condition.',
    provider: PROVIDERS[5],
    rate: 5,
  },
  {
    name: 'Mahsa G.',
    gender: 'female',
    displayInWebsite: true,
    description:
      'Warm approach, minimal wait time, and clear post-visit instructions. The provider even checked in afterward to ensure I was adjusting well, which made me feel cared for.',
    provider: PROVIDERS[5],
    rate: 4,
  },
  {
    name: 'Navid Y.',
    gender: 'male',
    displayInWebsite: true,
    description:
      'The professionalism and empathy shown during my visit exceeded my expectations. Every step felt personalized, and I left feeling confident and reassured.',
    provider: PROVIDERS[5],
    rate: 5,
  },
];

/* =========================
   Main
   ========================= */
async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;
  console.log('Connected to', db.name);

  await ProviderReviewsModel.deleteMany({});
  console.log('Cleared existing provider reviews');

  const inserted = await ProviderReviewsModel.insertMany(PROVIDER_REVIEWS);
  console.log(`Inserted ${inserted.length} provider reviews`);

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
