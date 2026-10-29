import Link from 'next/link';
import { CheckCircle, ArrowRight, Zap, Cpu, FileText, BarChart2, Sparkles, Activity, Lock, Globe, RefreshCw, Shield } from 'lucide-react';
import styles from './features.module.css';

const modules = [
  {
    icon: CheckCircle, color: '#6366F1', tag: 'Core',
    title: 'Accreditation Readiness Scoring',
    desc: 'Composite scoring engine that evaluates institutions across NAAC/NBA parameters.',
    points: ['IIQA, SSR, DVV compliance tracking', 'Student satisfaction survey analytics', 'Bibliometric and research output scoring', 'Historical trend analysis', 'Benchmark comparison against top institutions'],
  },
  {
    icon: Cpu, color: '#F59E0B', tag: 'IoT',
    title: 'Sensor Monitoring',
    desc: 'Real-time infrastructure and environmental monitoring via ESP32 sensor nodes.',
    points: ['Temperature & AQI monitoring', 'Motion detection in labs/classrooms', 'Power consumption analytics', 'Camera-based visual verification', 'MQTT-based real-time streaming'],
  },
  {
    icon: FileText, color: '#10B981', tag: 'AI',
    title: 'AI Document Analysis',
    desc: 'OCR + LLM pipeline that analyzes accreditation documents and surfaces gaps.',
    points: ['Tesseract / AWS Textract OCR', 'GPT / Llama / Mistral LLM integration', 'RAG with FAISS / Pinecone vector DB', 'Documentation gap reports', 'Automated recommendation generation'],
  },
  {
    icon: BarChart2, color: '#3B82F6', tag: 'Analytics',
    title: 'Analytics & Reports',
    desc: 'Department-level KPIs, institutional performance indicators, and custom reports.',
    points: ['Department performance breakdown', 'Custom report templates', 'PDF/Excel export', 'Year-over-year trend charts', 'Executive summary generation'],
  },
  {
    icon: Sparkles, color: '#8B5CF6', tag: 'AI',
    title: 'AI Recommendations',
    desc: 'Prioritized action items derived from AI analysis of your institutional data.',
    points: ['Research improvement suggestions', 'Infrastructure enhancement ideas', 'Documentation completion guidance', 'Innovation opportunity identification', 'SDG alignment recommendations'],
  },
  {
    icon: Activity, color: '#EF4444', tag: 'Monitoring',
    title: 'Real-Time Alerts',
    desc: 'Instant notifications for infrastructure anomalies and accreditation milestones.',
    points: ['Sensor threshold alerts', 'Document deadline reminders', 'Score drop notifications', 'WebSocket-powered live feed', 'Email & in-app notification'],
  },
];

const extras = [
  { icon: Lock, title: 'Role-Based Access', desc: 'Admin, IQAC, and Committee roles with fine-grained permissions.' },
  { icon: Globe, title: 'Cloud Deployment', desc: 'AWS, GCP, or Azure — or run on-premise on institutional servers.' },
  { icon: RefreshCw, title: 'Continuous Monitoring', desc: 'Always-on monitoring so you\'re never caught off-guard at audit time.' },
  { icon: Shield, title: 'Data Security', desc: 'End-to-end encryption and secure document storage for sensitive institutional data.' },
];

export default function FeaturesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className="badge badge-primary"><Zap size={11} /> Platform Features</div>
            <h1>Everything your institution needs to <span className="text-gradient">excel at accreditation</span></h1>
            <p>Six powerful modules working in concert — from IoT sensors to AI-powered document intelligence.</p>
            <Link href="/register" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.modulesGrid}>
            {modules.map(m => (
              <div key={m.title} className={`glass-card ${styles.moduleCard}`}>
                <div className={styles.moduleTop}>
                  <div className={styles.moduleIcon} style={{ background: `${m.color}15` }}>
                    <m.icon size={22} color={m.color} />
                  </div>
                  <span className="badge badge-primary">{m.tag}</span>
                </div>
                <h3 className={styles.moduleTitle}>{m.title}</h3>
                <p className={styles.moduleDesc}>{m.desc}</p>
                <ul className={styles.modulePoints}>
                  {m.points.map(p => (
                    <li key={p}><CheckCircle size={13} color="var(--success)" /> {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.extrasSection}`}>
        <div className="container">
          <h2 className={styles.extrasTitle}>Plus everything else you'd expect</h2>
          <div className={styles.extrasGrid}>
            {extras.map(e => (
              <div key={e.title} className={styles.extraCard}>
                <e.icon size={20} color="var(--primary-light)" />
                <div>
                  <div className={styles.extraTitle}>{e.title}</div>
                  <div className={styles.extraDesc}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
