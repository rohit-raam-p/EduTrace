import Link from 'next/link';
import {
  Award, Activity, FileText, BarChart2, Sparkles, Cpu,
  ArrowRight, CheckCircle, Shield, Zap, TrendingUp, Globe
} from 'lucide-react';
import styles from './page.module.css';

const stats = [
  { value: '94%', label: 'Prediction Accuracy', icon: TrendingUp, color: '#6366F1' },
  { value: '60%', label: 'Less Prep Time', icon: Zap, color: '#F59E0B' },
  { value: '200+', label: 'Institutions', icon: Globe, color: '#10B981' },
  { value: 'NAAC/NBA', label: 'Standards Covered', icon: Shield, color: '#3B82F6' },
];

const features = [
  {
    icon: Award,
    title: 'Accreditation Readiness Scoring',
    desc: 'Real-time composite score based on IIQA, SSR, DVV, student satisfaction, bibliometrics, and innovation indicators.',
    color: '#6366F1',
  },
  {
    icon: Cpu,
    title: 'Embedded Sensor Monitoring',
    desc: 'IoT-powered infrastructure monitoring via ESP32 — temperature, motion, power, AQI, and camera feeds.',
    color: '#F59E0B',
  },
  {
    icon: FileText,
    title: 'AI Document Analysis',
    desc: 'OCR + LLM pipeline extracts insights from SSR reports, research publications, and accreditation submissions.',
    color: '#10B981',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    desc: 'Department-level KPIs, historical trends, and institutional performance indicators in a single view.',
    color: '#3B82F6',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    desc: 'RAG-powered suggestions for research improvements, documentation gaps, and environmental quality.',
    color: '#8B5CF6',
  },
  {
    icon: Activity,
    title: 'Real-Time Infrastructure',
    desc: 'Live sensor dashboards with alerts, equipment tracking, and environmental condition monitoring.',
    color: '#EF4444',
  },
];

const checks = [
  'NAAC & NBA standards alignment',
  'Automated document gap detection',
  'IoT sensor integration',
  'LLM-powered insights (GPT / Llama)',
  'Vector database for RAG (FAISS / Pinecone)',
  'Role-based access (Admin, IQAC, Committee)',
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className="container">
          <div className={styles.heroContent}>
            <div className={`badge badge-primary ${styles.heroBadge}`}>
              <Zap size={11} /> AI-Powered Accreditation Platform
            </div>
            <h1 className={styles.heroTitle}>
              Track Your{' '}
              <span className="text-gradient">Accreditation</span>{' '}
              Readiness in Real Time
            </h1>
            <p className={styles.heroDesc}>
              EduTrace-ES integrates IoT sensors, AI document analysis, and LLM-powered insights to give educational institutions a continuous, data-driven view of their NAAC/NBA accreditation readiness.
            </p>
            <div className={styles.heroCta}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <a href="http://localhost:3001/dashboard" className="btn btn-ghost btn-lg">
                View Live Demo
              </a>
            </div>
            <div className={styles.heroChecks}>
              {checks.slice(0, 3).map(c => (
                <div key={c} className={styles.heroCheck}>
                  <CheckCircle size={14} color="var(--success)" /> {c}
                </div>
              ))}
            </div>
          </div>

          {/* Score card preview */}
          <div className={styles.heroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Accreditation Readiness</span>
              <span className="badge badge-success">Live</span>
            </div>
            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 120 120" className={styles.donut}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="12"
                  strokeDasharray="220 314"
                  strokeDashoffset="78"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.scoreCenter}>
                <div className={styles.scoreNum}>74</div>
                <div className={styles.scoreUnit}>/ 100</div>
              </div>
            </div>
            <div className={styles.scoreParams}>
              {[
                { label: 'IIQA', val: 82 },
                { label: 'SSR', val: 71 },
                { label: 'DVV', val: 68 },
                { label: 'Research', val: 79 },
              ].map(p => (
                <div key={p.label} className={styles.scoreParam}>
                  <div className={styles.paramRow}>
                    <span>{p.label}</span>
                    <span className={styles.paramVal}>{p.val}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={`section-sm ${styles.statsSection}`}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={`stat-card ${styles.statItem}`}>
                <div className="stat-icon" style={{ background: `${s.color}20` }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="badge badge-primary"><Sparkles size={11} /> Core Capabilities</div>
            <h2 className={styles.sectionTitle}>Everything you need to <span className="text-gradient">ace accreditation</span></h2>
            <p className={styles.sectionDesc}>From real-time IoT monitoring to AI-powered document analysis — EduTrace-ES covers every dimension of accreditation readiness.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map(f => (
              <div key={f.title} className={`glass-card ${styles.featureCard}`}>
                <div className={styles.featureIcon} style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="badge badge-primary">How It Works</div>
            <h2 className={styles.sectionTitle}>From sensors to <span className="text-gradient">insights</span></h2>
          </div>
          <div className={styles.steps}>
            {[
              { num: '01', title: 'Deploy Sensors', desc: 'Install ESP32-based sensor nodes across campus facilities to collect environmental and infrastructure data.' },
              { num: '02', title: 'Upload Documents', desc: 'Upload SSR, IIQA, research papers and accreditation reports. OCR extracts text from scanned files.' },
              { num: '03', title: 'AI Analysis', desc: 'LLM + RAG pipeline analyzes documents, identifies gaps, and generates a composite readiness score.' },
              { num: '04', title: 'Act on Insights', desc: 'Dashboard surfaces prioritized recommendations so your IQAC team knows exactly what to improve.' },
            ].map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to transform your <span className="text-gradient">accreditation journey?</span></h2>
            <p className={styles.ctaDesc}>Join 200+ institutions already using EduTrace-ES to achieve NAAC and NBA excellence.</p>
            <div className={styles.ctaActions}>
              <Link href="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">Request a Demo</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
