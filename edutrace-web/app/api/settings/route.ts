import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import Institution from '@/models/Institution';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();
  const dbUser = await User.findById(user.userId).select('-password');
  const institution = await Institution.findOne({ userId: user.userId });
  return NextResponse.json({ user: dbUser, institution });
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const { type, data } = await req.json();

  if (type === 'profile') {
    await User.findByIdAndUpdate(user.userId, { firstName: data.firstName, lastName: data.lastName });
  } else if (type === 'institution') {
    await Institution.findOneAndUpdate({ userId: user.userId }, { name: data.name, type: data.type, accreditationTarget: data.accreditationTarget, code: data.code }, { upsert: true });
  } else if (type === 'password') {
    const dbUser = await User.findById(user.userId);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const valid = await bcrypt.compare(data.currentPassword, dbUser.password);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    dbUser.password = await bcrypt.hash(data.newPassword, 12);
    await dbUser.save();
  }

  return NextResponse.json({ success: true });
}
