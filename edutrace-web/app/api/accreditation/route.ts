import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import Institution from '@/models/Institution';
import EduDocument from '@/models/EduDocument';

const WEIGHTS = { iiqa: 0.15, ssr: 0.25, dvv: 0.20, research: 0.15, innovation: 0.10, sdg: 0.05, studentSatisfaction: 0.05, bibliometric: 0.05 };

export async function GET(req: NextRequest) {
  // const user = getAuthUser(req);
  // if (!user) return unauthorized();
  // Temporarily skip auth for testing
  const mockUser = { userId: '507f1f77bcf86cd799439011' };
  const user = mockUser;
  await connectDB();

  let institution = await Institution.findOne({ userId: user.userId });
  if (!institution) {
    institution = await Institution.create({
      userId: user.userId,
      name: user.institutionName,
      type: 'Engineering College',
      accreditationTarget: 'NAAC A++',
      code: 'ET-' + Date.now(),
      overallScore: 0,
      parameters: { iiqa: 0, ssr: 0, dvv: 0, research: 0, innovation: 0, sdg: 0, studentSatisfaction: 0, bibliometric: 0 },
    });
  }

  return NextResponse.json({ institution });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  // Recalculate score from analyzed documents
  const docs = await EduDocument.find({ userId: user.userId, status: 'analyzed' });

  const paramScores: Record<string, number[]> = { iiqa: [], ssr: [], dvv: [], research: [], studentSatisfaction: [], bibliometric: [] };

  docs.forEach(doc => {
    const key = doc.type.toLowerCase().replace(' ', '');
    const mapped: Record<string, string> = { survey: 'studentSatisfaction' };
    const paramKey = mapped[key] || key;
    if (paramScores[paramKey]) paramScores[paramKey].push(doc.score);
  });

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const parameters = {
    iiqa: avg(paramScores.iiqa) || 0,
    ssr: avg(paramScores.ssr) || 0,
    dvv: avg(paramScores.dvv) || 0,
    research: avg(paramScores.research) || 0,
    innovation: 0,
    sdg: 0,
    studentSatisfaction: avg(paramScores.studentSatisfaction) || 0,
    bibliometric: avg(paramScores.bibliometric) || 0,
  };

  const overallScore = Math.round(
    Object.entries(WEIGHTS).reduce((sum, [key, weight]) => {
      return sum + (parameters[key as keyof typeof parameters] || 0) * weight;
    }, 0)
  );

  const institution = await Institution.findOneAndUpdate(
    { userId: user.userId },
    { parameters, overallScore, lastCalculated: new Date() },
    { new: true, upsert: true }
  );

  return NextResponse.json({ institution });
}
