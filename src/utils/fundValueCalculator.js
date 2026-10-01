const {
  getPACCharge,
  getAdminCharge,
  calculateGST,
  // getMortalityCharge,
  getFMCCharge,
} = require("./charge");
const calculateFundValue = (
  previousFundValue,
  annualPremium,
  policyYear,
  age,
  gender,
  sumAssured,
  navReturn = 0.1,
) => {
  // NAV Return assumption = 10% annually

  const pac = getPACCharge(policyYear, sumAssured);
  const admin = getAdminCharge(policyYear, annualPremium);
  const gst = calculateGST(pac + admin);
  const totalDeductions = pac + admin + gst;

  // Premium after deductions
  const netPremium = annualPremium - totalDeductions;

  // Add to fund and apply return
  let fundBeforeMortality = (previousFundValue + netPremium) * (1 + navReturn);

  // Calculate Sum at Risk
  const sumAtRisk = Math.max(0, sumAssured - fundBeforeMortality);

  // Fund after mortality
  let fundValue = fundBeforeMortality;

  // FMC charge
  const fmc = getFMCCharge(fundValue);
  fundValue = fundValue - fmc;

  return Math.max(0, fundValue);
};
module.exports = { calculateFundValue };
