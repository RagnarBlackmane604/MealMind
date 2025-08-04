import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  subscription: string;
  allergies: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  subscription: { type: String, default: "free" },
  allergies: { type: [String], default: [] },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
