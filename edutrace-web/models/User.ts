import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  institutionName: string;
  institutionType: string;
  accreditationTarget: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  institutionName: { type: String, required: true },
  institutionType: { type: String, required: true },
  accreditationTarget: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'Starter' },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || mongoose.model<IUser>('User', UserSchema);
