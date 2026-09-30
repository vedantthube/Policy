const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Policy, AuditLog } = require("../models");
const { authenticate } = require("../middleware/auth");
const { validatePolicyInput } = require("../utils/validations");

// Get all policies for user
router.get("/", authenticate, async (req, res) => {
  try {
    const policies = await Policy.findAll({
      where: { user_id: req.user.userId },
    });

    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single policy
router.get("/:id", authenticate, async (req, res) => {
  try {
    const policy = await Policy.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.userId,
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create policy
router.post(
  "/",
  authenticate,
  [
    body("dob").isDate(),
    body("gender").isIn(["M", "F"]),
    body("sum_assured").isFloat({ min: 100000 }),
    body("modal_premium").isFloat({ min: 1000 }),
    body("premium_frequency").isIn([
      "YEARLY",
      "HALF_YEARLY",
      "QUARTERLY",
      "MONTHLY",
    ]),
    body("policy_term_years").isInt({ min: 10, max: 20 }),
    body("premium_payment_term_years").isInt({ min: 5, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Validate business rules
      const validation = validatePolicyInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      // Create policy
      const policy = await Policy.create({
        user_id: req.user.userId,
        ...req.body,
        status: "DRAFT",
      });

      // Log action
      await AuditLog.create({
        user_id: req.user.userId,
        action: "POLICY_CREATED",
        table_name: "policies",
        record_id: policy.id,
        new_values: policy.toJSON(),
        ip_address: req.ip,
      });

      res.status(201).json(policy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Update policy
router.put("/:id", authenticate, async (req, res) => {
  try {
    const policy = await Policy.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.userId,
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Validate if updating
    if (Object.keys(req.body).length > 0) {
      const validation = validatePolicyInput({
        ...policy.toJSON(),
        ...req.body,
      });
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }
    }

    const oldValues = policy.toJSON();
    await policy.update(req.body);

    // Log action
    await AuditLog.create({
      user_id: req.user.userId,
      action: "POLICY_UPDATED",
      table_name: "policies",
      record_id: policy.id,
      old_values: oldValues,
      new_values: policy.toJSON(),
      ip_address: req.ip,
    });

    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete policy (soft delete)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const policy = await Policy.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.userId,
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Soft delete by setting status
    await policy.update({ status: "SURRENDERED" });

    // Log action
    await AuditLog.create({
      user_id: req.user.userId,
      action: "POLICY_DELETED",
      table_name: "policies",
      record_id: policy.id,
      old_values: policy.toJSON(),
      ip_address: req.ip,
    });

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate policy inputs
router.post(
  "/validate",
  authenticate,
  [
    body("dob").isDate(),
    body("gender").isIn(["M", "F"]),
    body("sum_assured").isFloat({ min: 100000 }),
    body("modal_premium").isFloat({ min: 1000 }),
    body("policy_term_years").isInt({ min: 10, max: 20 }),
    body("premium_payment_term_years").isInt({ min: 5, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const validation = validatePolicyInput(req.body);

      res.json({
        isValid: validation.isValid,
        errors: validation.errors,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

module.exports = router;
