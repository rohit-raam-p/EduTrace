import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SensorReading from '@/models/SensorReading';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // The ESP32 will send its data here in JSON format.
    const body = await req.json();
    const { userId, temperature, humidity, motion, cameraStatus } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const readings = [];
    const timestamp = new Date();

    if (temperature !== undefined) {
      const status = temperature > 28 ? 'warning' : 'normal';
      readings.push({ userId, nodeId: 'ET-1001', location: 'Lab Block A', type: 'temperature', value: temperature, unit: '°C', status, timestamp });
      readings.push({ userId, nodeId: 'ET-1003', location: 'Lab Block B', type: 'temperature', value: temperature, unit: '°C', status, timestamp });
      if (status === 'warning') {
        const notifExists = await Notification.findOne({ userId, type: 'warning', title: 'High Temperature Alert', createdAt: { $gte: new Date(Date.now() - 600000) } });
        if (!notifExists) await Notification.create({ userId, type: 'warning', title: 'High Temperature Alert', body: `Temperature reached ${temperature}°C at Lab A` });
      }
    }

    if (humidity !== undefined) {
      readings.push({ userId, nodeId: 'ET-1007', location: 'Lab Block A', type: 'moisture', value: humidity, unit: '%', status: 'normal', timestamp });
    }

    if (motion !== undefined) {
      const status = motion > 0 ? 'warning' : 'normal';
      readings.push({ userId, nodeId: 'ET-1005', location: 'Library', type: 'motion', value: motion, unit: '%', status, timestamp });
    }

    if (cameraStatus) {
      const dbStatus = cameraStatus === 'online' ? 'normal' : (cameraStatus === 'offline' ? 'offline' : 'normal');
      readings.push({ userId, nodeId: 'ET-1006', location: 'Lab Block C', type: 'camera', value: 1, unit: '', status: dbStatus, timestamp });
    }

    if (readings.length > 0) {
      await SensorReading.insertMany(readings);
    }

    return NextResponse.json({ success: true, count: readings.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
