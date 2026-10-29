import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISensorReading extends Document {
  userId: mongoose.Types.ObjectId;
  nodeId: string;
  location: string;
  type: 'temperature' | 'aqi' | 'power' | 'motion' | 'moisture' | 'camera';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'offline';
  timestamp: Date;
}

const SensorReadingSchema = new Schema<ISensorReading>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nodeId: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['temperature', 'aqi', 'power', 'motion', 'moisture', 'camera'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  status: { type: String, enum: ['normal', 'warning', 'offline'], default: 'normal' },
  timestamp: { type: Date, default: Date.now },
});

export default models.SensorReading || mongoose.model<ISensorReading>('SensorReading', SensorReadingSchema);
