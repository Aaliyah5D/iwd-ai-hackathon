/**
 * South African ID Validation Algorithm
 * - 13 digits
 * - First 6 digits: Date of birth (YYMMDD)
 * - Next 4 digits: Gender (0-4999 female, 5000-9999 male)
 * - Next digit: Citizenship (0 SA, 1 permanent resident)
 * - Next digit: Usually 8 or 9
 * - Last digit: Checksum using Luhn algorithm
 */

export interface IDValidationResult {
  isValid: boolean;
  gender?: 'female' | 'male';
  dob?: Date;
  citizenship?: 'SA' | 'Permanent Resident';
  error?: string;
}

export function validateSAID(id: string): IDValidationResult {
  if (!id || id.length !== 13 || !/^\d+$/.test(id)) {
    return { isValid: false, error: 'ID must be 13 digits' };
  }

  const yy = id.substring(0, 2);
  const mm = id.substring(2, 4);
  const dd = id.substring(4, 6);
  const genderCode = parseInt(id.substring(6, 10), 10);
  const citizenshipCode = parseInt(id.substring(10, 11), 10);
  const checksum = parseInt(id.substring(12, 13), 10);

  // Basic date validation (simple check)
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = parseInt(yy, 10) > currentYear ? 1900 + parseInt(yy, 10) : 2000 + parseInt(yy, 10);
  const dob = new Date(fullYear, parseInt(mm, 10) - 1, parseInt(dd, 10));

  if (isNaN(dob.getTime()) || dob.getMonth() + 1 !== parseInt(mm, 10) || dob.getDate() !== parseInt(dd, 10)) {
    return { isValid: false, error: 'Invalid date of birth in ID' };
  }

  // Luhn algorithm for checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(id[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const calculatedChecksum = (10 - (sum % 10)) % 10;

  if (calculatedChecksum !== checksum) {
    return { isValid: false, error: 'Invalid checksum' };
  }

  return {
    isValid: true,
    gender: genderCode < 5000 ? 'female' : 'male',
    dob,
    citizenship: citizenshipCode === 0 ? 'SA' : 'Permanent Resident',
  };
}
