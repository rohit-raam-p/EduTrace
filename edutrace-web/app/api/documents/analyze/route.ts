import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import EduDocument from '@/models/EduDocument';
import Notification from '@/models/Notification';
import Institution from '@/models/Institution';
import { scoreDocument } from '@/lib/documents';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const { documentId } = await req.json();
  const doc = await EduDocument.findOne({ _id: documentId, userId: user.userId });
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  doc.status = 'processing';
  await doc.save();

  try {
    let score: number, gaps: string[], report: string;

    // Use OpenAI only if API key is configured and it's a real uploaded doc
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && !doc.isAgentic) {
      const { analyzeDocument } = await import('@/lib/agenticAI');
      const result = await analyzeDocument(doc.content, doc.type, user.institutionName);
      score = result.score; gaps = result.gaps; report = result.report;
    } else {
      // Rule-based scoring — no API needed
      const result = scoreDocument(doc.type, doc.content);
      score = result.score; gaps = result.gaps; report = result.report;
    }

    doc.score = score;
    doc.gaps = gaps;
    doc.aiReport = report;
    doc.status = 'analyzed';
    await doc.save();

    await Notification.create({
      userId: user.userId,
      type: 'success',
      title: `Analysis Complete: ${doc.name}`,
      body: `Score: ${score}%. ${gaps.length} gap(s) identified.`,
    });

    // Recalculate overall score
    const allDocs = await EduDocument.find({ userId: user.userId, status: 'analyzed' });
    const paramScores: Record<string, number[]> = { iiqa: [], ssr: [], dvv: [], research: [], studentSatisfaction: [], bibliometric: [] };
    allDocs.forEach(d => {
      const mapped: Record<string, string> = { survey: 'studentSatisfaction' };
      const key = d.type.toLowerCase();
      const paramKey = mapped[key] || key;
      if (paramScores[paramKey]) paramScores[paramKey].push(d.score);
    });
    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const WEIGHTS: Record<string, number> = { iiqa: 0.15, ssr: 0.25, dvv: 0.20, research: 0.15, innovation: 0.10, sdg: 0.05, studentSatisfaction: 0.05, bibliometric: 0.05 };
    const parameters = { iiqa: avg(paramScores.iiqa), ssr: avg(paramScores.ssr), dvv: avg(paramScores.dvv), research: avg(paramScores.research), innovation: 0, sdg: 0, studentSatisfaction: avg(paramScores.studentSatisfaction), bibliometric: avg(paramScores.bibliometric) };
    const overallScore = Math.round(Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (parameters[k as keyof typeof parameters] || 0) * w, 0));
    await Institution.findOneAndUpdate({ userId: user.userId }, { parameters, overallScore, lastCalculated: new Date() }, { upsert: true });

    return NextResponse.json({ document: doc, overallScore });
  } catch (err: any) {
    doc.status = 'failed';
    await doc.save();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
