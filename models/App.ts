import mongoose, { Schema, Document } from "mongoose";

export enum Strategy {
  FIXED_WINDOW = "fixed_window",
  SLIDING_WINDOW = "sliding_window",
}

interface BaseRateLimitConfig {
  requests: number; // Maximum number of requests allowed
  window: number; // Time window in seconds
}

interface FixedWindowConfig extends BaseRateLimitConfig {}

interface SlidingWindowConfig extends BaseRateLimitConfig {}

export type RateLimitConfig = FixedWindowConfig | SlidingWindowConfig;

export interface IApp extends Document {
  baseUrl: string;
  strategy: Strategy;
  config: RateLimitConfig;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AppSchema: Schema = new Schema({
  baseUrl: {
    type: String,
    required: true,
  },
  strategy: {
    type: String,
    enum: Object.values(Strategy),
    required: true,
  },
  config: {
    type: Schema.Types.Mixed,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IApp>("App", AppSchema);
