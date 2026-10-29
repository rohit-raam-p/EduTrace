import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import SensorReading from '@/models/SensorReading';
import Notification from '@/models/Notification';

const DEFAULT_NODES = [
  { nodeId: 'ET-1001', location: 'Lab Block A', type: 'temperature', unit: '°C', baseline: 23 },
  { nodeId: 'ET-1002', location: 'Main Hall', type: 'aqi', unit: 'AQI', baseline: 42 },
  { nodeId: 'ET-1003', location: 'Lab Block B', type: 'temperature', unit: '°C', baseline: 30 },
  { nodeId: 'ET-1004', location: 'Main Campus', type: 'power', unit: 'kW', baseline: 48 },
  { nodeId: 'ET-1005', location: 'Library', type: 'motion', unit: '%', baseline: 80 },
  { nodeId: 'ET-1006', location: 'Lab Block C', type: 'camera', unit: '', baseline: 0 },
];

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  // Get latest reading per node AND recent history for sparklines
  const grouped = await SensorReading.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(user.userId) } },
    { $sort: { timestamp: -1 } },
    { $group: { 
        _id: '$nodeId', 
        doc: { $first: '$$ROOT' },
        history: { $push: '$value' }
      } 
    }
  ]);

  const readings = grouped.map(g => ({
    ...g.doc,
    history: g.history.slice(0, 20).reverse() // array of last 20 values in chronological order
  }));

  // If no readings exist, seed with default simulated data
  if (readings.length === 0) {
    const seeded = await seedSensorData(user.userId);
    return NextResponse.json({ sensors: seeded });
  }

  return NextResponse.json({ sensors: readings });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const { nodeId, location, type, value, unit } = await req.json();
  const threshold = type === 'temperature' ? 28 : type === 'aqi' ? 100 : null;
  const status = value === 0 && type === 'camera' ? 'offline' : threshold && value > threshold ? 'warning' : 'normal';

  const reading = await SensorReading.create({ userId: user.userId, nodeId, location, type, value, unit, status });

  if (status === 'warning') {
    await Notification.create({
      userId: user.userId,
      type: 'warning',
      title: `Sensor Alert: ${location}`,
      body: `${type} reading of ${value}${unit} exceeds threshold at ${location}.`,
    });
  }

  return NextResponse.json({ reading }, { status: 201 });
}

async function seedSensorData(userId: string) {
  const readings = DEFAULT_NODES.map(node => {
    const variation = (Math.random() - 0.5) * 4;
    const value = parseFloat((node.baseline + variation).toFixed(1));
    const threshold = node.type === 'temperature' ? 28 : node.type === 'aqi' ? 100 : null;
    const status = node.baseline === 0 ? 'offline' : threshold && value > threshold ? 'warning' : 'normal';
    return { userId, ...node, value, status, timestamp: new Date() };
  });

  await SensorReading.insertMany(readings);
  return readings;
}
