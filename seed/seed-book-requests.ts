/**
 * Seed script for the BookRequest collection.
 * Run with: npx ts-node seed-book-requests.ts
 *
 * Set MONGODB_URI in your env or edit the default below.
 */

import mongoose, { Schema, Types } from 'mongoose';
import { MONGODB_URI } from './CONSTANTS';

/* =========================
   TS Interface, Schema, Model
   ========================= */
interface BookRequest {
  name: string;
  phoneNumber: string;
  email: string;
  description?: string;
  provider: Types.ObjectId;
  service: Types.ObjectId;
}

const BookRequestSchema = new Schema<BookRequest>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
  },
  { timestamps: true },
);

const BookRequestModel =
  (mongoose.models.BookRequest as mongoose.Model<BookRequest>) ||
  mongoose.model<BookRequest>('BookRequest', BookRequestSchema);

/* =========================
   Provided provider/service pairs
   ========================= */
const RAW_MAPPINGS = [
  {
    providerId: '68a8914ea3ed228516130d2c',
    serviceId: '68db812e1fdd9fffe61a2591',
  },
  {
    providerId: '68a890f8a3ed228516130d28',
    serviceId: '68db812e1fdd9fffe61a2599',
  },
  {
    providerId: '68a89179a3ed228516130d30',
    serviceId: '68db812e1fdd9fffe61a25a0',
  },
  {
    providerId: '68a89161a3ed228516130d2e',
    serviceId: '68db812e1fdd9fffe61a25a7',
  },
  {
    providerId: '68a8914ea3ed228516130d2c',
    serviceId: '68db812e1fdd9fffe61a25ae',
  },
  {
    providerId: '68a890bfa3ed228516130d26',
    serviceId: '68db812e1fdd9fffe61a25b5',
  },
  {
    providerId: '68a890f8a3ed228516130d28',
    serviceId: '68db812e1fdd9fffe61a25bc',
  },
  {
    providerId: '68a890f8a3ed228516130d28',
    serviceId: '68db812e1fdd9fffe61a25c3',
  },
  {
    providerId: '68a89179a3ed228516130d30',
    serviceId: '68db812e1fdd9fffe61a25ca',
  },
  {
    providerId: '68a890f8a3ed228516130d28',
    serviceId: '68db812e1fdd9fffe61a25d1',
  },
  {
    providerId: '68a89161a3ed228516130d2e',
    serviceId: '68db812e1fdd9fffe61a25d8',
  },
  {
    providerId: '68a89161a3ed228516130d2e',
    serviceId: '68db812e1fdd9fffe61a25df',
  },
  {
    providerId: '68a8910ca3ed228516130d2a',
    serviceId: '68db812e1fdd9fffe61a25e6',
  },
];

const MAPPINGS = RAW_MAPPINGS.map(({ providerId, serviceId }) => ({
  provider: new Types.ObjectId(providerId),
  service: new Types.ObjectId(serviceId),
}));

/* =========================
   Helpers for synthetic contact data
   ========================= */
const FIRST = [
  'Amir',
  'Sara',
  'Navid',
  'Laleh',
  'Omid',
  'Nika',
  'Reza',
  'Parisa',
  'Kaveh',
  'Mahsa',
  'Arman',
  'Leyla',
  'Hassan',
];
const LAST = [
  'Karimi',
  'Azizi',
  'Rahimi',
  'Nazari',
  'Sadeghi',
  'Tahami',
  'Ebrahimi',
  'Jafari',
  'Ansari',
  'Ghahramani',
  'Fattahi',
  'Motamedi',
  'Rostami',
];

const phoneFor = (i: number) =>
  `+1-202-555-01${(10 + i).toString().padStart(2, '0')}`;
const emailFor = (i: number) => {
  const fn = FIRST[i % FIRST.length].toLowerCase();
  const ln = LAST[i % LAST.length].toLowerCase();
  return `${fn}.${ln}${i}@example.com`;
};

/* =========================
   Build seed data from mappings
   ========================= */
const BOOK_REQUESTS: BookRequest[] = MAPPINGS.map((ref, i) => ({
  name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
  phoneNumber: phoneFor(i),
  email: emailFor(i),
  description:
    i % 3 === 0
      ? 'Looking to schedule the earliest available appointment.'
      : i % 3 === 1
        ? 'Please share more details about preparation and recovery.'
        : 'Prefer morning slots; flexible on weekdays.',
  provider: ref.provider,
  service: ref.service,
}));

/* =========================
   Main
   ========================= */
async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;
  console.log('Connected to', db.name);

  await BookRequestModel.deleteMany({});
  console.log('Cleared existing book requests');

  const inserted = await BookRequestModel.insertMany(BOOK_REQUESTS);
  console.log(`Inserted ${inserted.length} book requests`);

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
