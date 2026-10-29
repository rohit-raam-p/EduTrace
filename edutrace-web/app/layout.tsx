import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduTrace-ES | Academic Accreditation Status Tracing Platform',
  description: 'AI-powered platform for NAAC/NBA accreditation monitoring, sensor tracking, document analysis and institutional quality improvement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grid-bg">{children}</body>
    </html>
  );
}
