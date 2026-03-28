import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a South African ID number using the Luhn algorithm.
 * Returns the detected gender ('Female' | 'Male' | 'Invalid').
 */
export function validateSAID(id: string): { isValid: boolean; gender: 'Female' | 'Male' | 'Other' } {
  if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) {
    return { isValid: false, gender: 'Other' };
  }

  // Luhn Algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(id[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  const isValid = checkDigit === parseInt(id[12]);

  if (!isValid) {
    return { isValid: false, gender: 'Other' };
  }

  // Gender check (digits 7-10)
  // 0000-4999: Female
  // 5000-9999: Male
  const genderDigits = parseInt(id.substring(6, 10));
  const gender = genderDigits >= 5000 ? 'Male' : 'Female';

  return { isValid: true, gender };
}

export const SA_UNIVERSITIES = [
  { name: 'University of Cape Town (UCT)', lat: -33.9573, lng: 18.4612 },
  { name: 'University of the Witwatersrand (Wits)', lat: -26.1906, lng: 28.0240 },
  { name: 'University of Pretoria (UP)', lat: -25.7545, lng: 28.2314 },
  { name: 'Stellenbosch University (SU)', lat: -33.9321, lng: 18.8644 },
  { name: 'University of KwaZulu-Natal (UKZN)', lat: -29.8668, lng: 30.9812 },
  { name: 'Rhodes University', lat: -33.3132, lng: 26.5201 },
  { name: 'University of Johannesburg (UJ)', lat: -26.1824, lng: 27.9996 },
  { name: 'CPUT', lat: -33.9329, lng: 18.4314 },
  { name: 'DUT', lat: -29.8517, lng: 31.0069 },
  { name: 'TUT', lat: -25.7324, lng: 28.1623 },
  { name: 'Vaal University of Technology', lat: -26.7119, lng: 27.8596 },
  { name: 'Private Institution (Certified)', lat: -26.1076, lng: 28.0567 },
  { name: 'Other', lat: -26.2041, lng: 28.0473 }
];

export const STUDENT_BANK_ACCOUNTS = [
  {
    bank: 'Standard Bank',
    name: 'MyMo Account',
    description: 'Zero monthly fees, free data, and discounted movie tickets.',
    link: 'https://www.standardbank.co.za/southafrica/personal/products-and-services/bank-with-us/bank-accounts/student-accounts'
  },
  {
    bank: 'FNB',
    name: 'FNBy Student Account',
    description: 'No monthly fee, free electronic transactions, and eBucks rewards.',
    link: 'https://www.fnb.co.za/student-banking/index.html'
  },
  {
    bank: 'Absa',
    name: 'Student Silver Account',
    description: 'Zero monthly fees, free Absa-to-Absa transfers, and food vouchers.',
    link: 'https://www.absa.co.za/personal/bank/student-banking/'
  },
  {
    bank: 'Nedbank',
    name: 'Unlocked.me Account',
    description: 'Zero monthly fees, lifestyle deals, and data rewards.',
    link: 'https://www.unlocked.me/bank'
  },
  {
    bank: 'Capitec',
    name: 'Global One Account',
    description: 'Low transaction fees, high interest on savings, and easy app banking.',
    link: 'https://www.capitecbank.co.za/personal/transact/global-one/'
  }
];

export const GUARDIAN_SKILLS = [
  'First Aid',
  'SASL (Sign Language)',
  'Disability Support',
  'Mental Health Support',
  'Medication Administration',
  'CPR Trained',
  'Peer Support',
  'Multilingual'
];

export const AVATARS = ['shield', 'heart', 'star', 'zap', 'user', 'graduation-cap', 'bell', 'anchor'];
