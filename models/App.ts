import mongoose, { Schema, Document } from "mongoose";

export enum Strategy {
  SLIDING_WINDOW = "sliding_window",
  FIXED_WINDOW = "fixed_window",
  TOKEN_BUCKET = "token_bucket",
}

export interface IApp extends Document {
  baseUrl: string;
  strategy: Strategy;
  config: any;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AppSchema: Schema = new Schema({
  baseUrl: {
    type: String,
    required: true,
    unique: true,
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
