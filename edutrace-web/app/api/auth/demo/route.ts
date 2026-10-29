import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  const token = jwt.sign(
    { userId: 'demo', email: 'demo@edutrace.dev', institutionName: 'Demo Institute of Technology', plan: 'pro' },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  const response = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
