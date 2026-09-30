const express = require("express");
const cors = require("cors");
const { registerUser, Loginuser } = require("./Controller/Authroute");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend Vite app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // Local Vite/React
  process.env.FRONTEND_URL, // Production frontend URL (set after deploying frontend)
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//save user in users db
app.post("/register", registerUser);
app.post("/login", Loginuser);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
