import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import EduDocument from '@/models/EduDocument';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  // const user = getAuthUser(req);
  // if (!user) return unauthorized();
  // Temporarily skip auth for testing
  const mockUser = { userId: '507f1f77bcf86cd799439011' };
  const user = mockUser;
  await connectDB();
  const docs = await EduDocument.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ documents: docs });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;
  const isAgentic = formData.get('isAgentic') === 'true';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Create uploads directory if it doesn't exist
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const fileExtension = path.extname(file.name);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
  const filePath = path.join(uploadsDir, fileName);

  // Save file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const doc = await EduDocument.create({
    userId: user.userId,
    name: file.name,
    type,
    content: '', // Will be populated by analysis
    status: 'queued',
    size: `${(file.size / 1024).toFixed(1)} KB`,
    isAgentic,
    fileUrl: `/uploads/${fileName}`,
    filePath: filePath,
    mimeType: file.type,
    originalName: file.name,
  });

  await Notification.create({
    userId: user.userId,
    type: 'info',
    title: `Document Uploaded: ${file.name}`,
    body: `${file.name} has been queued for AI analysis.`,
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
