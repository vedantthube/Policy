const calculateDeathBenefit = (policyType, sumAssured, fundValue, sai) => {
  // sai = Sum Assured at Issue

  const deathBenefitFormulas = {
    Type_4a: () => Math.max(sumAssured, fundValue, 1.05 * sai),
    Type_4c: () => fundValue,
    Type_4d: () => sumAssured + fundValue,
    Type_4e: () => Math.max(sumAssured, fundValue),
    Type_4f: () => sumAssured,
    Type_4g: () => 1000 + fundValue,
    Type_4h: () => sumAssured + fundValue, // Simplified
    Type_4i: () => Math.max(fundValue, sai),
    Type_4k: () => Math.max(fundValue, 1.01 * sai),
    Type_4m: () => Math.max(1.05 * sai, sumAssured + fundValue),
    Type_4o: () => Math.max(sumAssured, 1.05 * sai) + fundValue, // Simplified
    Type_5: () => 0, // Endowment only
  };

  const formula =
    deathBenefitFormulas[policyType] || deathBenefitFormulas["Type_4d"];
  return Math.max(0, formula());
};
module.exports = { calculateDeathBenefit };
