import mongoose, { Schema, Document } from "mongoose";

export interface IRateLimit extends Document {
  appId: string;
  count: number;
  timestamp: Date;
  windowStart: Date;
}

const RateLimitSchema = new Schema({
  appId: { type: String, required: true },
  count: { type: Number, default: 0 },
  timestamp: { type: Date, required: true },
  windowStart: { type: Date, required: true },
});

RateLimitSchema.index({ appId: 1, windowStart: 1 });

export default mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
