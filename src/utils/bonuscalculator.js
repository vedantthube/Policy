export const getBonusRate = (policyYear) => {
  const bonusRates = {
    1: 0.025, // 2.5%
    2: 0.03, // 3%
    3: 0.035, // 3.5%
    4: 0.035,
    5: 0.035,
    6: 0.035,
    7: 0.03,
    8: 0.03,
    9: 0.03,
    10: 0.03,
    11: 0.03,
    12: 0.025,
  };

  return bonusRates[policyYear] || 0.025;
};

export const calculateBonus = (sumAssured, policyYear) => {
  const bonusRate = getBonusRate(policyYear);
  return sumAssured * bonusRate;
};

export const calculateCumulativeBonus = (sumAssured, uptoYear) => {
  let totalBonus = 0;
  for (let year = 1; year <= uptoYear; year++) {
    totalBonus += calculateBonus(sumAssured, year);
  }
  return totalBonus;
};
