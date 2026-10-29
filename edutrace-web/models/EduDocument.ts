import mongoose, { Schema, Document, models } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'SSR' | 'IIQA' | 'DVV' | 'Research' | 'Survey' | 'Bibliometric' | 'Infrastructure';
  status: 'queued' | 'processing' | 'analyzed' | 'failed';
  size: string;
  content: string;
  score: number;
  gaps: string[];
  aiReport: string;
  isAgentic: boolean;
  fileUrl?: string;
  filePath?: string;
  mimeType?: string;
  originalName?: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['SSR', 'IIQA', 'DVV', 'Research', 'Survey', 'Bibliometric', 'Infrastructure'], required: true },
  status: { type: String, enum: ['queued', 'processing', 'analyzed', 'failed'], default: 'queued' },
  size: { type: String, default: '0 KB' },
  content: { type: String, default: '' },
  score: { type: Number, default: 0 },
  gaps: [{ type: String }],
  aiReport: { type: String, default: '' },
  isAgentic: { type: Boolean, default: false },
  fileUrl: { type: String },
  filePath: { type: String },
  mimeType: { type: String },
  originalName: { type: String },
}, { timestamps: true });

export default models.EduDocument || mongoose.model<IDocument>('EduDocument', DocumentSchema);
