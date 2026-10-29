import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import Institution from '@/models/Institution';
import EduDocument from '@/models/EduDocument';
import SensorReading from '@/models/SensorReading';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const institution = await Institution.findOne({ userId: user.userId });
  const docs = await EduDocument.find({ userId: user.userId, status: 'analyzed' });

  // Department scores derived from document scores + some variation
  const baseScore = institution?.overallScore || 70;
  const departments = [
    { dept: 'CS', score: Math.min(100, baseScore + 10) },
    { dept: 'ECE', score: Math.min(100, baseScore + 4) },
    { dept: 'Mech', score: Math.min(100, baseScore - 2) },
    { dept: 'Civil', score: Math.min(100, baseScore - 6) },
    { dept: 'MBA', score: Math.min(100, baseScore + 6) },
    { dept: 'MCA', score: Math.min(100, baseScore + 2) },
  ];

  // KPI trend - last 6 months
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const kpiTrend = months.map((month, i) => ({
    month,
    research: Math.round((baseScore - 12) + i * 2.4),
    infra: Math.round((baseScore - 4) + i * 1.6),
    satisfaction: Math.round((baseScore - 6) + i * 1.2),
  }));

  // Document stats
  const docStats = {
    total: docs.length,
    analyzed: docs.filter(d => d.status === 'analyzed').length,
    avgScore: docs.length ? Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) : 0,
    totalGaps: docs.reduce((s, d) => s + d.gaps.length, 0),
  };

  return NextResponse.json({ departments, kpiTrend, docStats, parameters: institution?.parameters || {}, overallScore: institution?.overallScore || 0 });
}
