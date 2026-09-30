export const getMortalityCharge = (age, gender, sumAtRisk, policyType) => {
  // Get mortality rate from mortality tables based on age and gender
  const mortalityRate = getMortalityRateFromTable(age, gender, policyType);
  return (sumAtRisk / 1000) * mortalityRate;
};

export const getPACCharge = (policyYear, sumAssured) => {
  // PAC = Policy Administration Charge
  // Typically a percentage or fixed amount
  const pacRates = {
    1: 500,
    2: 500,
    3: 500,
    4: 500,
    5: 500,
    6: 500,
    7: 500,
    8: 500,
    9: 500,
    10: 500,
  };

  return pacRates[policyYear] || 500;
};

export const getAdminCharge = (policyYear, premiumAmount) => {
  // Admin charge is typically percentage based
  if (policyYear <= 10) {
    return Math.min(500, premiumAmount * 0.15);
  }
  return 0;
};

export const getFMCCharge = (fundValue) => {
  // FMC = Fund Management Charge (1.35% or 0.75% depending on fund)
  return fundValue * 0.0135;
};

export const calculateGST = (chargeableAmount) => {
  const GST_RATE = 0.18;
  return chargeableAmount * GST_RATE;
};
