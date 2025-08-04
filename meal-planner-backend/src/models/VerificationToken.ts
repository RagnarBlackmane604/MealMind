import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token läuft nach 1 Stunde ab
});

const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
