import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import EduDocument from '@/models/EduDocument';
import Notification from '@/models/Notification';
import { SEED_DOCUMENTS } from '@/lib/documents';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const { type } = await req.json();
  const templates = SEED_DOCUMENTS[type];
  if (!templates || templates.length === 0) {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
  }

  const results = [];

  for (const template of templates) {
    // Check if already exists
    const existing = await EduDocument.findOne({ userId: user.userId, name: template.name });
    if (existing) continue;

    const doc = await EduDocument.create({
      userId: user.userId,
      name: template.name,
      type: template.type,
      content: template.content,
      status: 'analyzed',
      size: template.size,
      score: template.score,
      gaps: template.gaps,
      aiReport: template.aiReport,
      isAgentic: true,
    });

    results.push(doc);
  }

  if (results.length === 0) {
    return NextResponse.json({ message: `${type} documents already exist`, documents: [] });
  }

  await Notification.create({
    userId: user.userId,
    type: 'success',
    title: `${type} Documents Ready`,
    body: `${results.length} ${type} document(s) seeded and analyzed. Ready for review.`,
  });

  return NextResponse.json({ documents: results }, { status: 201 });
}
