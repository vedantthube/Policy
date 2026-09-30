// const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";

const registerUser = async (req, res) => {
  try {
    console.log("API STARTED - Saving User");
    const { name, email, phone, dob, gender, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // 2. Hash password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert user and RETURNING id to get the new record
    const queryText = `
      INSERT INTO users (name, dob, mobile, mail, password_hash, gender)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, mail, mobile, gender, dob, created_at;
    `;

    const values = [name, dob, phone, email, passwordHash, gender];
    console.log("TILLLL HERE");
    const result = await pool.query(queryText, values);
    const newUser = result.rows[0];

    // 4. Generate JWT Token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.mail },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 5. Send back response (never expose password_hash)
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Database error:", error);

    // PostgreSQL unique constraint violation (duplicate email or mobile)
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Email or phone number already exists." });
    }

    res.status(500).json({ message: "Database error" });
  }
};

//login
const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOFFFFFF", email, password);
    // return res.json("data found");
    // 1. Validate request body input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // 2. Fetch user from Supabase/PostgreSQL by email (mail column)
    const queryText = `
      SELECT id, name, mail, mobile, gender, dob, password_hash
      FROM public.users
      WHERE mail = $1;
    `;
    const result = await pool.query(queryText, [email]);

    // Check if user exists
    if (result.rows.length === 0) {
      // Return 401 Unauthorized for invalid credentials
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];
    console.log("user found here", user);
    // 3. Compare provided password with stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Generate JWT Token
    const token = jwt.sign({ userId: user.id, email: user.mail }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Omit sensitive hash and return token + non-sensitive user info
    delete user.password_hash;
    return res.status(200).json({
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  registerUser,
  Loginuser,
};
