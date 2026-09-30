export const calculateModalPremium = (sumAssured, age, gender, policyType) => {
  // Get base premium rate from policy master
  // This would typically come from a rating table
  const premiumRates = {
    Type_4d: {
      base: 0.035, // 3.5% per annum
      ageFactor: 0.001, // 0.1% per year of age
      genderFactor: gender === "M" ? 1.0 : 0.95,
    },
  };

  const rate = premiumRates[policyType] || premiumRates["Type_4d"];
  const effectiveRate = rate.base + rate.ageFactor * age * rate.genderFactor;

  return sumAssured * effectiveRate;
};

export const calculateAnnualPremium = (modalPremium, frequency) => {
  const frequencyFactors = {
    YEARLY: 1.0,
    HALF_YEARLY: 0.51, // 2 x 51%
    QUARTERLY: 0.26, // 4 x 26%
    MONTHLY: 0.085, // 12 x 8.5%
  };

  return modalPremium / frequencyFactors[frequency];
};
