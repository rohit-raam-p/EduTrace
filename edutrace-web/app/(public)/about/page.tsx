import Link from 'next/link';
import { Target, Eye, Cpu, FileText, BarChart2, Sparkles, ArrowRight, Zap } from 'lucide-react';
import styles from './about.module.css';

const team = [
  { name: 'Dr. Priya Sharma', role: 'AI Research Lead', bg: '#6366F1' },
  { name: 'Rohit Nair', role: 'Embedded Systems', bg: '#F59E0B' },
  { name: 'Meena Krishnan', role: 'Product & Design', bg: '#10B981' },
  { name: 'Arjun Patel', role: 'Backend Engineering', bg: '#3B82F6' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className="badge badge-primary"><Zap size={11} /> About EduTrace-ES</div>
          <h1>Built to make NAAC & NBA <span className="text-gradient">accreditation effortless</span></h1>
          <p>EduTrace-ES was born from a simple observation: educational institutions spend enormous time and effort on accreditation, with little data-driven guidance. We set out to change that.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={`glass-card ${styles.missionCard}`}>
              <div className={styles.missionIcon}><Target size={24} color="#6366F1" /></div>
              <h3>Our Mission</h3>
              <p>To empower every educational institution with the real-time intelligence they need to achieve and sustain accreditation excellence — continuously, not just at audit time.</p>
            </div>
            <div className={`glass-card ${styles.missionCard}`}>
              <div className={styles.missionIcon}><Eye size={24} color="#F59E0B" /></div>
              <h3>Our Vision</h3>
              <p>A world where accreditation readiness is a continuous, measurable state — not a stressful, periodic scramble — enabling institutions to focus on what truly matters: quality education.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How EduTrace-ES Works</h2>
          <p className={styles.sectionDesc}>A fully integrated stack from physical sensor nodes to AI-powered dashboards.</p>
          <div className={styles.stack}>
            {[
              { icon: Cpu, label: 'IoT Layer', detail: 'ESP32 sensor nodes collect environmental data across campus', color: '#F59E0B' },
              { icon: FileText, label: 'Document Layer', detail: 'OCR + LLM extracts meaning from SSR, IIQA, and research docs', color: '#10B981' },
              { icon: Sparkles, label: 'AI Layer', detail: 'RAG pipeline generates insights, recommendations, and readiness scoring', color: '#8B5CF6' },
              { icon: BarChart2, label: 'Dashboard', detail: 'Institution-wide view for IQAC, committees, and administrators', color: '#3B82F6' },
            ].map((s, i) => (
              <div key={i} className={styles.stackItem}>
                <div className={styles.stackIcon} style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <div className={styles.stackLabel}>{s.label}</div>
                <div className={styles.stackDetail}>{s.detail}</div>
                {i < 3 && <div className={styles.stackArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ textAlign:'center' }}>The Team</h2>
          <div className={styles.teamGrid}>
            {team.map(m => (
              <div key={m.name} className={`glass-card ${styles.teamCard}`}>
                <div className={styles.teamAvatar} style={{ background: m.bg }}>
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={styles.teamName}>{m.name}</div>
                <div className={styles.teamRole}>{m.role}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/register" className="btn btn-primary btn-lg">Join our platform <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
