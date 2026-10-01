const { generateIllustration } = require("../utils/illustrationGenerator"); // Adjust path if needed

const Illustrationcontroller = async (req, res) => {
  try {
    const { dob, gender, modalPremium, ppt, premiumFrequency, pt, sumAssured } =
      req.body;

    // Optional validation check
    if (!dob || !modalPremium || !ppt || !pt || !sumAssured) {
      return res.status(400).json({
        success: false,
        message: "Missing required policy parameters.",
      });
    }

    // Map req.body to the expected structure of generateIllustration
    const policyData = {
      dob,
      gender,
      sumAssured: Number(sumAssured),
      modalPremium: Number(modalPremium),
      premiumFrequency: (premiumFrequency || "ANNUAL").toUpperCase(),
      policyTerm: Number(pt),
      premiumPaymentTerm: Number(ppt),
      policyType: "Type_4d",
    };
    console.log("OPPPP", policyData);
    // Calculate illustration table, summary, and IRR
    const result = generateIllustration(policyData);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Illustration calculation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate policy illustration.",
      error: error.message,
    });
  }
};

module.exports = {
  Illustrationcontroller,
};
