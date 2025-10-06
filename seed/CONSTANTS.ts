import { Types } from 'mongoose';

export const PROVIDERS: Types.ObjectId[] = [
  '68a890bfa3ed228516130d26',
  '68a890f8a3ed228516130d28',
  '68a8910ca3ed228516130d2a',
  '68a8914ea3ed228516130d2c',
  '68a89161a3ed228516130d2e',
  '68a89179a3ed228516130d30',
  '68dbb7c600ea0075bb5cea54',
].map((id) => new Types.ObjectId(id));

export const CATEGORIES: Types.ObjectId[] = [
  '68a88ab32c641a7f223012d9',
  '68a88abf2c641a7f223012db',
  '68a88ac32c641a7f223012dd',
  '68a88afb2c641a7f223012e2',
  '68a88b082c641a7f223012e5',
  '68a88b112c641a7f223012e7',
  '68a88b132c641a7f223012e9',
].map((id) => new Types.ObjectId(id));

export const MONGODB_URI =
  'mongodb://root:example@localhost:27017/test?authSource=admin';
