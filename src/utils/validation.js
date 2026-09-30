const policyValidations = {
  // Validation 1: PPT (Premium Payment Term) Range
  ppt: {
    min: 5,
    max: 10,
    name: "Premium Payment Term",
  },

  // Validation 2: PT (Policy Term) Range
  pt: {
    min: 10,
    max: 20,
    name: "Policy Term",
  },

  // Validation 3: Age at Entry
  ageAtEntry: {
    min: 18,
    max: 65,
    name: "Age at Entry",
  },

  // Validation 4: Sum Assured Range
  sumAssured: {
    min: 100000,
    max: 10000000,
    name: "Sum Assured",
  },

  // Validation 5: PPT must be <= PT
  pptLessThanPt: {
    message: "Premium Payment Term cannot exceed Policy Term",
  },
};
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Main validation function
 */
const validatePolicyInput = (data) => {
  const errors = {};

  // Validation 1: PPT Range
  if (
    data.premium_payment_term_years < policyValidations.ppt.min ||
    data.premium_payment_term_years > policyValidations.ppt.max
  ) {
    errors.ppt = `Premium Payment Term must be between ${policyValidations.ppt.min} and ${policyValidations.ppt.max} years`;
  }

  // Validation 2: PT Range
  if (
    data.policy_term_years < policyValidations.pt.min ||
    data.policy_term_years > policyValidations.pt.max
  ) {
    errors.pt = `Policy Term must be between ${policyValidations.pt.min} and ${policyValidations.pt.max} years`;
  }

  // Validation 3: Age at Entry
  const ageAtEntry = calculateAge(data.dob);
  if (
    ageAtEntry < policyValidations.ageAtEntry.min ||
    ageAtEntry > policyValidations.ageAtEntry.max
  ) {
    errors.ageAtEntry = `Age at entry must be between ${policyValidations.ageAtEntry.min} and ${policyValidations.ageAtEntry.max} years`;
  }

  // Validation 4: Sum Assured
  if (
    data.sum_assured < policyValidations.sumAssured.min ||
    data.sum_assured > policyValidations.sumAssured.max
  ) {
    errors.sumAssured = `Sum Assured must be between ${policyValidations.sumAssured.min} and ${policyValidations.sumAssured.max}`;
  }

  // Validation 5: PPT <= PT
  if (data.premium_payment_term_years > data.policy_term_years) {
    errors.pptPt = policyValidations.pptLessThanPt.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    ageAtEntry,
  };
};

/**
 * Validate bulk records for bulk upload
 */
const validateBulkRecords = (records) => {
  const validRecords = [];
  const invalidRecords = [];

  records.forEach((record, index) => {
    const validation = validatePolicyInput(record);

    if (validation.isValid) {
      validRecords.push(record);
    } else {
      invalidRecords.push({
        rowNumber: index + 1,
        record,
        errors: validation.errors,
      });
    }
  });

  return {
    valid: validRecords,
    invalid: invalidRecords,
    totalProcessed: records.length,
    validCount: validRecords.length,
    invalidCount: invalidRecords.length,
  };
};

module.exports = {
  policyValidations,
  validatePolicyInput,
  validateBulkRecords,
  calculateAge,
};
