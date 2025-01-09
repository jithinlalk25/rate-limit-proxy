import mongoose, { Schema, Document } from "mongoose";

export interface IRateLimit extends Document {
  appId: string;
  count: number;
  timestamp: Date;
  windowStart: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema = new Schema(
  {
    appId: { type: String, required: true },
    count: { type: Number, default: 0 },
    timestamp: { type: Date, required: true },
    windowStart: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

RateLimitSchema.index({ appId: 1, windowStart: 1 });
RateLimitSchema.index({ appId: 1, timestamp: 1 });
RateLimitSchema.index({ timestamp: 1 });

export default mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
