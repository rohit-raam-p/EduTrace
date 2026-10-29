import mongoose, { Schema, Document, models } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  why: string;
  actions: string[];
  impact: string;
  category: string;
  color: string;
  resolved: boolean;
  createdAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  title: { type: String, required: true },
  why: { type: String, required: true },
  actions: [{ type: String }],
  impact: { type: String, required: true },
  category: { type: String, default: 'General' },
  color: { type: String, default: '#6366F1' },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
