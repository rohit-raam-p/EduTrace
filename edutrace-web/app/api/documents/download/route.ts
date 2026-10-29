import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import EduDocument from '@/models/EduDocument';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('id');

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
  }

  await connectDB();

  const doc = await EduDocument.findOne({ _id: documentId, userId: user.userId });

  if (!doc || !doc.filePath) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  try {
    const filePath = path.resolve(doc.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = doc.originalName || doc.name;

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}