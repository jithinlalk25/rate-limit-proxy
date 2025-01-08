import express, { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import crypto from "crypto";

const router = express.Router();

/* GET users listing. */
const getUsers: RequestHandler = (req, res) => {
  res.send("respond with a resource");
};

/* Register new user */
const registerUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "Valid userId is required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Generate API key (32 bytes converted to hex = 64 characters)
    const apiKey = crypto.randomBytes(32).toString("hex");

    // Encrypt the API key
    const encryptedApiKey = User.encryptApiKey(apiKey);

    // Create new user with encrypted API key
    const user = new User({ userId, encryptedApiKey });
    await user.save();

    // Return the API key to the user (this is the only time it will be shown)
    res.status(201).json({
      message: "User registered successfully",
      userId,
      apiKey, // Send the original API key
      note: "Please store this API key safely. It won't be shown again.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get("/", getUsers);
router.post("/register", registerUser);

export default router;
