import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();
  const notifications = await Notification.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(50);
  return NextResponse.json({ notifications });
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();
  const { id, markAllRead } = await req.json();
  if (markAllRead) {
    await Notification.updateMany({ userId: user.userId }, { read: true });
  } else if (id) {
    await Notification.findOneAndUpdate({ _id: id, userId: user.userId }, { read: true });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();
  await Notification.deleteMany({ userId: user.userId, read: true });
  return NextResponse.json({ success: true });
}
