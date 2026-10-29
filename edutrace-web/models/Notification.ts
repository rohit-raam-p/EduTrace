import mongoose, { Schema, Document, models } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'warning' | 'success' | 'info' | 'danger';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['warning', 'success', 'info', 'danger'], default: 'info' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
