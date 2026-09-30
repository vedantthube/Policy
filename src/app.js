const express = require("express");
const cors = require("cors");
const { registerUser, Loginuser } = require("./Controller/Authroute");

const app = express();

// Configure CORS for both local development and production deployments
app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow non-browser requests (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      // 2. Allow local frontend development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }

      // 3. Allow ANY Vercel deployment URL under your project
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // 4. Allow explicit FRONTEND_URL environment variable if set on Render
      if (
        process.env.FRONTEND_URL &&
        origin === process.env.FRONTEND_URL.replace(/\/$/, "")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle HTTP preflight requests for all routes
app.options("*", cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Routes
app.post("/register", registerUser);
app.post("/login", Loginuser);

// Use Render's dynamic PORT with a fallback to 5000 for local testing
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
