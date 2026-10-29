import { HelpCircle, Book, FileText, Activity, Award, Sparkles, BarChart2, Settings, ChevronRight } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import Link from 'next/link';
import styles from './help.module.css';

const faqs = [
  { q: 'How is the accreditation readiness score calculated?', a: 'The score is a weighted composite of IIQA (15%), SSR (25%), DVV (20%), Research (15%), Innovation (10%), SDGs (5%), Student Satisfaction (5%), and Bibliometric data (5%).' },
  { q: 'How do I add a new sensor node?', a: 'Go to Settings → Sensors → Add Sensor Node. You will need the ESP32 MAC address and location details.' },
  { q: 'What document formats are supported?', a: 'PDF (including scanned), DOCX, XLSX, and PPTX. Scanned PDFs are processed via OCR before AI analysis.' },
  { q: 'How long does AI document analysis take?', a: 'Simple documents (< 5 pages) process in 2–5 minutes. Larger SSR reports with 50+ pages may take 15–20 minutes.' },
  { q: 'Can I export reports to PDF?', a: 'Yes — go to Analytics → Generate Report → Download PDF to export any report.' },
  { q: 'Which accreditation standards are supported?', a: 'NAAC (A++, A+, A grades) and NBA are fully supported. Custom criteria can be configured on Enterprise plans.' },
];

const guides = [
  { icon: Award, title: 'Getting Started with Accreditation Scoring', href: '#', color: '#6366F1' },
  { icon: FileText, title: 'Uploading & Analyzing Documents', href: '#', color: '#10B981' },
  { icon: Activity, title: 'Setting Up Sensor Monitoring', href: '#', color: '#F59E0B' },
  { icon: Sparkles, title: 'Understanding AI Recommendations', href: '#', color: '#8B5CF6' },
  { icon: BarChart2, title: 'Generating Analytics Reports', href: '#', color: '#3B82F6' },
  { icon: Settings, title: 'Managing Institution Settings', href: '#', color: '#EF4444' },
];

export default function HelpPage() {
  return (
    <div className={styles.page}>
      <DashboardTopbar title="Help & Documentation" />

      <div className={styles.hero}>
        <HelpCircle size={32} color="var(--primary-light)" />
        <h2>How can we help?</h2>
        <p>Browse guides, FAQs, and documentation for EduTrace-ES.</p>
        <div className={styles.searchBox}>
          <input className={styles.search} placeholder="Search documentation..." />
          <button className="btn btn-primary btn-sm">Search</button>
        </div>
      </div>

      <div className={styles.guides}>
        <div className={styles.sectionTitle}><Book size={16} /> Quick Guides</div>
        <div className={styles.guidesGrid}>
          {guides.map(g => (
            <a key={g.title} href={g.href} className={`glass-card ${styles.guideCard}`}>
              <div className={styles.guideIcon} style={{ background: `${g.color}15` }}>
                <g.icon size={18} color={g.color} />
              </div>
              <span className={styles.guideTitle}>{g.title}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </a>
          ))}
        </div>
      </div>

      <div className={`glass-card ${styles.faqCard}`}>
        <div className={styles.sectionTitle}><HelpCircle size={16} /> Frequently Asked Questions</div>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <div className={styles.faqQ}>{f.q}</div>
              <div className={styles.faqA}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.support}>
        <div className={`glass-card ${styles.supportCard}`}>
          <div className={styles.supportTitle}>💬 Live Chat</div>
          <p>Chat with our support team directly from the platform.</p>
          <button className="btn btn-primary btn-sm">Start Chat</button>
        </div>
        <div className={`glass-card ${styles.supportCard}`}>
          <div className={styles.supportTitle}>📧 Email Support</div>
          <p>Send us an email and we'll respond within one business day.</p>
          <Link href="/contact" className="btn btn-outline btn-sm">Send Email</Link>
        </div>
        <div className={`glass-card ${styles.supportCard}`}>
          <div className={styles.supportTitle}>📚 Full Docs</div>
          <p>Read the complete API reference and developer documentation.</p>
          <button className="btn btn-ghost btn-sm">View Docs →</button>
        </div>
      </div>
    </div>
  );
}
