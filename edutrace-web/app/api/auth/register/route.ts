import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { institutionName, institutionType, accreditationTarget, firstName, lastName, email, password, plan } = await req.json();

    if (!email || !password || !firstName || !institutionName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      institutionName, institutionType, accreditationTarget,
      firstName, lastName, email, password: hashed, plan: plan || 'Starter',
    });

    return NextResponse.json({ message: 'Account created successfully', userId: user._id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
