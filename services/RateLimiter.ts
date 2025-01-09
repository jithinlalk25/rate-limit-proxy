import { Strategy, RateLimitConfig } from "../models/App";
import RateLimit from "../models/RateLimit";

export class RateLimiter {
  static async isAllowed(
    appId: string,
    strategy: Strategy,
    config: RateLimitConfig
  ): Promise<boolean> {
    switch (strategy) {
      case Strategy.FIXED_WINDOW:
        return await RateLimiter.checkFixedWindow(appId, config);
      case Strategy.SLIDING_WINDOW:
        return await RateLimiter.checkSlidingWindow(appId, config);
      default:
        throw new Error("Invalid rate limiting strategy");
    }
  }

  private static async checkFixedWindow(
    appId: string,
    config: RateLimitConfig
  ): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(
      Math.floor(now.getTime() / (config.window * 1000)) *
        (config.window * 1000)
    );

    // Clean up old entries
    await RateLimit.deleteMany({
      appId,
      windowStart: { $lt: windowStart },
    });

    // Find or create rate limit record for current window
    const rateLimit = await RateLimit.findOneAndUpdate(
      {
        appId,
        windowStart,
      },
      {
        $setOnInsert: {
          appId,
          windowStart,
          timestamp: now,
        },
        $inc: { count: 1 },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return rateLimit.count <= config.requests;
  }

  private static async checkSlidingWindow(
    appId: string,
    config: RateLimitConfig
  ): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.window * 1000);

    // Count requests in the sliding window
    const count = await RateLimit.countDocuments({
      appId,
      timestamp: { $gte: windowStart },
    });

    // If limit is already reached, return false without creating new entry
    if (count >= config.requests) {
      return false;
    }

    // Create new request record only if under the limit
    await RateLimit.create({
      appId,
      count: 1,
      timestamp: now,
      windowStart: now,
    });

    // Clean up old records (optional, can be done periodically)
    RateLimit.deleteMany({
      appId,
      timestamp: { $lt: windowStart },
    }).exec();

    return true;
  }
}
