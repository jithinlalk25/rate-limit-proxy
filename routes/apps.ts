import express, { Request } from "express";
import { Strategy } from "../models/App";
import App from "../models/App";
import User, { IUser } from "../models/User";

const router = express.Router();

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user: IUser;
}

// Authentication middleware
const authenticateApiKey = async (
  req: Request,
  res: express.Response,
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

// Apply authentication middleware to all routes
router.use(authenticateApiKey as express.RequestHandler);

interface RegisterAppBody {
  baseUrl: string;
  strategy: Strategy;
  config: any;
}

// Register a new app
router.post("/register", (async (req: Request, res: express.Response) => {
  try {
    const { baseUrl, strategy, config } = (req as AuthenticatedRequest)
      .body as RegisterAppBody;
    const user = (req as AuthenticatedRequest).user;

    // Validate strategy
    if (!Object.values(Strategy).includes(strategy)) {
      return res.status(400).json({ error: "Invalid strategy" });
    }

    // Create new app
    const app = new App({
      baseUrl,
      strategy,
      config,
      userId: user._id,
    });

    await app.save();

    res.status(201).json({
      id: app._id,
      baseUrl: app.baseUrl,
      strategy: app.strategy,
      config: app.config,
      userId: app.userId,
      createdAt: app.createdAt,
    });
  } catch (err) {
    const error = err as Error & { code?: number };
    if (error.code === 11000) {
      return res.status(409).json({ error: "Base URL already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}) as express.RequestHandler);

export default router;
