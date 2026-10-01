const { calculateAge } = require("../utils/validation");
const { calculateAnnualPremium } = require("./premiumcalculator");
const { calculateFundValue } = require("./fundValueCalculator");
const { calculateBonus, getBonusRate } = require("./bonuscalculator");
const { calculateDeathBenefit } = require("./deathbenefit");

const generateIllustration = (policyData) => {
  const {
    dob,
    gender,
    sumAssured,
    modalPremium,
    policyTerm,
    premiumPaymentTerm,
    premiumFrequency,
  } = policyData;

  const ageAtEntry = calculateAge(dob);
  const annualPremium = calculateAnnualPremium(modalPremium, premiumFrequency);
  const illustration = [];

  let fundValue = 0;

  for (let year = 1; year <= policyTerm; year++) {
    const age = ageAtEntry + year - 1;

    // Premium (only if within PPT)
    const premium = year <= premiumPaymentTerm ? annualPremium : 0;

    // Calculate fund value
    fundValue = calculateFundValue(
      fundValue,
      premium,
      year,
      age,
      gender,
      sumAssured,
    );

    // Bonus
    const bonusAmount =
      year <= premiumPaymentTerm ? calculateBonus(sumAssured, year) : 0;

    // Total Benefit
    const totalBenefit = year === policyTerm ? sumAssured + fundValue : 0;

    // Death Benefit
    const deathBenefit = calculateDeathBenefit(
      policyData.policyType,
      sumAssured,
      fundValue,
      sumAssured,
    );

    // Net Cashflows (for IRR)
    const netCashflow =
      premium > 0 ? -premium : year === policyTerm ? totalBenefit : 0;

    illustration.push({
      policyYear: year,
      premium: Math.round(premium),
      sumAssured: Math.round(sumAssured),
      bonusRate: getBonusRate(year),
      bonusAmount: Math.round(bonusAmount),
      totalBenefit: Math.round(totalBenefit),
      fundValue: Math.round(fundValue),
      deathBenefit: Math.round(deathBenefit),
      netCashflows: Math.round(netCashflow),
    });
  }

  // Calculate IRR
  const cashflows = illustration.map((il, idx) => {
    if (idx === 0) return -annualPremium;
    if (idx === illustration.length - 1) return il.totalBenefit;
    return 0;
  });

  const irr = calculateIRR(cashflows);

  return {
    illustration,
    irr,
    summary: {
      totalPremium: annualPremium * premiumPaymentTerm,
      totalBenefit: illustration[premiumPaymentTerm - 1]?.totalBenefit || 0,
      totalBonus: illustration.reduce((sum, il) => sum + il.bonusAmount, 0),
    },
  };
};

const calculateIRR = (cashflows) => {
  // Newton-Raphson method for IRR calculation
  let irr = 0.1; // Initial guess

  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let npvDerivative = 0;

    for (let t = 0; t < cashflows.length; t++) {
      const cf = cashflows[t];
      const discount = Math.pow(1 + irr, t);
      npv += cf / discount;
      npvDerivative -= (t * cf) / Math.pow(1 + irr, t + 1);
    }

    const newIrr = irr - npv / npvDerivative;
    if (Math.abs(newIrr - irr) < 0.00001) {
      return newIrr;
    }
    irr = newIrr;
  }

  return irr;
};
module.exports = { generateIllustration };
