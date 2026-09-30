const express = require("express");
const router = express.Router();
const { Illustration, Policy, AuditLog } = require("../models");
const { authenticate } = require("../middleware/auth");
const { generateIllustration } = require("../utils/illustrationGenerator");

// Generate illustration for a policy
router.post("/generate/:policyId", authenticate, async (req, res) => {
  try {
    const policy = await Policy.findOne({
      where: {
        id: req.params.policyId,
        user_id: req.user.userId,
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Generate illustration
    const result = generateIllustration(policy.toJSON());

    // Save illustration details
    const illustrations = result.illustration.map((ill) => ({
      policy_id: policy.id,
      ...ill,
    }));

    await Illustration.bulkCreate(illustrations, { ignoreDuplicates: true });

    // Log action
    await AuditLog.create({
      user_id: req.user.userId,
      action: "ILLUSTRATION_GENERATED",
      table_name: "policies",
      record_id: policy.id,
      ip_address: req.ip,
    });

    res.json({
      policyId: policy.id,
      illustration: result.illustration,
      irr: result.irr,
      summary: result.summary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get illustration for a policy
router.get("/:policyId", authenticate, async (req, res) => {
  try {
    // Verify policy belongs to user
    const policy = await Policy.findOne({
      where: {
        id: req.params.policyId,
        user_id: req.user.userId,
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    const illustrations = await Illustration.findAll({
      where: { policy_id: req.params.policyId },
      order: [["illustration_year", "ASC"]],
    });

    res.json(illustrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
