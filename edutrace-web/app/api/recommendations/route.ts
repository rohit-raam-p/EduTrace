import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import Recommendation from '@/models/Recommendation';
import Institution from '@/models/Institution';
import EduDocument from '@/models/EduDocument';
import Notification from '@/models/Notification';
import { STATIC_RECOMMENDATIONS } from '@/lib/documents/recommendations';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();
  const recs = await Recommendation.find({ userId: user.userId, resolved: false }).sort({ createdAt: -1 });
  return NextResponse.json({ recommendations: recs });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const institution = await Institution.findOne({ userId: user.userId });
  const docs = await EduDocument.find({ userId: user.userId, status: 'analyzed' });
  const allGaps = docs.flatMap(d => d.gaps);

  let recs;

  // Use OpenAI only if API key is configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    const { generateRecommendations } = await import('@/lib/agenticAI');
    const parameters = institution?.parameters || {};
    recs = await generateRecommendations(user.institutionName, parameters, allGaps);
  } else {
    recs = STATIC_RECOMMENDATIONS;
  }

  // Clear old unresolved recommendations
  await Recommendation.deleteMany({ userId: user.userId, resolved: false });

  const saved = await Recommendation.insertMany(
    recs.map(r => ({ ...r, userId: user.userId }))
  );

  await Notification.create({
    userId: user.userId,
    type: 'info',
    title: 'New AI Recommendations Generated',
    body: `${saved.length} improvement suggestions generated based on your latest data.`,
  });

  return NextResponse.json({ recommendations: saved }, { status: 201 });
}
