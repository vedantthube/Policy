export const calculateFundValue = (
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

  // Mortality Charge
  const mortalityCharge = getMortalityCharge(
    age + policyYear - 1,
    gender,
    sumAtRisk,
  );

  // Fund after mortality
  let fundValue = fundBeforeMortality - mortalityCharge;

  // FMC charge
  const fmc = getFMCCharge(fundValue);
  fundValue = fundValue - fmc;

  return Math.max(0, fundValue);
};
