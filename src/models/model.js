// models/User.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../server");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

// ============================================
// models/Policy.js
const Policy = sequelize.define(
  "Policy",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    policy_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    policy_type: {
      type: DataTypes.ENUM(
        "Type_4a",
        "Type_4c",
        "Type_4d",
        "Type_4e",
        "Type_4f",
        "Type_4g",
        "Type_4h",
        "Type_4i",
        "Type_4k",
        "Type_4m",
        "Type_4o",
        "Type_5",
      ),
      defaultValue: "Type_4d",
    },
    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "QUOTED",
        "ACTIVE",
        "LAPSED",
        "SURRENDERED",
      ),
      defaultValue: "DRAFT",
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    sum_assured: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    modal_premium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    premium_frequency: {
      type: DataTypes.ENUM("YEARLY", "HALF_YEARLY", "QUARTERLY", "MONTHLY"),
      defaultValue: "YEARLY",
    },
    policy_term_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premium_payment_term_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "policies",
    timestamps: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["policy_number"],
      },
    ],
  },
);

// ============================================
// models/Illustration.js
const Illustration = sequelize.define(
  "Illustration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    policy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "policies",
        key: "id",
      },
    },
    illustration_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premium_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    sum_assured: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    bonus_rate: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: true,
    },
    bonus_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    total_benefit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    net_cashflows: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    fund_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    death_benefit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    surrender_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    irr_value: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "illustrations",
    timestamps: false,
    indexes: [
      {
        fields: ["policy_id"],
      },
      {
        fields: ["policy_id", "illustration_year"],
        unique: true,
      },
    ],
  },
);

// ============================================
// models/ChargesMaster.js
const ChargesMaster = sequelize.define(
  "ChargesMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    charge_type: {
      type: DataTypes.ENUM("PAC", "ADMIN", "FMC", "MORTALITY", "GST"),
      allowNull: false,
    },
    policy_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sa_from: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    sa_to: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    male_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
    },
    female_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
    },
    gst_rate: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: true,
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "charges_master",
    timestamps: false,
    indexes: [
      {
        fields: ["charge_type"],
      },
      {
        fields: ["sa_from", "sa_to"],
      },
    ],
  },
);

// ============================================
// models/BonusRates.js
const BonusRates = sequelize.define(
  "BonusRates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    policy_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bonus_rate: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: false,
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bonus_rates",
    timestamps: false,
    indexes: [
      {
        fields: ["policy_year"],
      },
    ],
  },
);

// ============================================
// models/MortalityTable.js
const MortalityTable = sequelize.define(
  "MortalityTable",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    policy_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    male_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
    },
    female_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
    },
    gender_agnostic_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true,
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "mortality_tables",
    timestamps: false,
    indexes: [
      {
        fields: ["policy_type", "age"],
      },
    ],
  },
);

// ============================================
// models/AuditLog.js
const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    table_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_values: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    new_values: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "audit_log",
    timestamps: false,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["timestamp"],
      },
    ],
  },
);

module.exports = {
  User,
  Policy,
  Illustration,
  ChargesMaster,
  BonusRates,
  MortalityTable,
  AuditLog,
};
