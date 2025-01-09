import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";

// Encryption settings
const ENCRYPTION_KEY = Buffer.from(
  process.env.ENCRYPTION_KEY || "YCTi9Usas6MQ+5PJFJQN97jDLU7bdESjq1awp/pR+I0=",
  "base64"
);
const IV_LENGTH = 16; // For AES, this is always 16
const ALGORITHM = "aes-256-gcm";

export interface IUser extends Document {
  userId: string;
  encryptedApiKey: string;
  createdAt: Date;
  updatedAt: Date;
  compareApiKey(candidateApiKey: string): boolean;
}

interface IUserModel extends Model<IUser> {
  encryptApiKey(apiKey: string): string;
}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    encryptedApiKey: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Add after the Schema definition
UserSchema.index({ userId: 1 }, { unique: true });

// Static method to encrypt API key
UserSchema.statics.encryptApiKey = function (apiKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // We need to store the IV and auth tag with the encrypted data
  return JSON.stringify({
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag.toString("hex"),
  });
};

// Method to compare API keys
UserSchema.methods.compareApiKey = function (candidateApiKey: string): boolean {
  try {
    const { iv, encryptedData, authTag } = JSON.parse(this.encryptedApiKey);

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted === candidateApiKey;
  } catch (error) {
    return false;
  }
};

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
