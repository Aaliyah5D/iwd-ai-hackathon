export function validateSAID(idNumber: string): { isValid: boolean; gender: 'male' | 'female' | null; dob: Date | null } {
  if (!/^\d{13}$/.test(idNumber)) {
    return { isValid: false, gender: null, dob: null };
  }

  // Luhn algorithm
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(idNumber[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, gender: null, dob: null };
  }

  // Gender check
  const genderDigits = parseInt(idNumber.substring(6, 10));
  const gender = genderDigits < 5000 ? 'female' : 'male';

  // Date of birth
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));

  // Note: This is a simple year check, assuming 1900-2099
  const fullYear = year + (year < 30 ? 2000 : 1900);
  const dob = new Date(fullYear, month - 1, day);

  // Validate date
  if (isNaN(dob.getTime()) || dob.getMonth() !== month - 1 || dob.getDate() !== day) {
    return { isValid: false, gender: null, dob: null };
  }

  return { isValid: true, gender, dob };
}
