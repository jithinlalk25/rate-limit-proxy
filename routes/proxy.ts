import express, { Request, Response, Router } from "express";
import axios from "axios";
import App from "../models/App";
import User, { IUser } from "../models/User";
import { Types, Document } from "mongoose";
import { RateLimiter } from "../services/RateLimiter";

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user: IUser & Document;
}

// Authentication middleware
const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const apiKey = req.header("X-API-Key");
    if (!apiKey) {
      return res.status(401).json({ error: "Missing API key" });
    }

    // Find user and compare API key
    const users = await User.find();
    for (const user of users) {
      if (user.compareApiKey(apiKey)) {
        // Attach user to request for use in routes
        (req as AuthenticatedRequest).user = user;
        return next();
      }
    }

    return res.status(401).json({ error: "Invalid API key" });
  } catch (error) {
    return res.status(500).json({ error: "Authentication error" });
  }
};

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateApiKey as express.RequestHandler);

router.all("/apis/:appId/*", async (req: Request, res: Response) => {
  try {
    // Extract appId and remaining path
    const { appId } = req.params;
    const forwardPath = req.url.split(`/apis/${appId}/`)[1];

    // Validate appId and find app
    if (!Types.ObjectId.isValid(appId)) {
      return res.status(400).json({ error: "Invalid app ID" });
    }

    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }

    // Verify app belongs to authenticated user
    const user = (req as AuthenticatedRequest).user;
    if (app.userId.toString() !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this app" });
    }

    // Check rate limit
    const isAllowed = await RateLimiter.isAllowed(
      appId,
      app.strategy,
      app.config
    );

    if (!isAllowed) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    // Prepare the forwarded request
    const targetUrl = `${app.baseUrl}/${forwardPath}`;

    // Forward the request
    const response = await axios({
      method: req.method?.toLowerCase(),
      url: targetUrl,
      headers: {
        ...req.headers,
        host: undefined,
        "content-length": undefined,
      },
      data: req.body,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    // Forward the response back to the client
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
