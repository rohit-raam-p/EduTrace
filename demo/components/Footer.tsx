import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}><Zap size={16} /></div>
              <span className={styles.logoText}>EduTrace<span className={styles.accent}>-ES</span></span>
            </Link>
            <p className={styles.tagline}>
              AI-powered Academic Accreditation Status Tracing Platform. Helping institutions achieve excellence.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.social}><Github size={16} /></a>
              <a href="#" className={styles.social}><Twitter size={16} /></a>
              <a href="#" className={styles.social}><Linkedin size={16} /></a>
              <a href="#" className={styles.social}><Mail size={16} /></a>
            </div>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Product</h4>
            <Link href="/features" className={styles.colLink}>Features</Link>
            <Link href="/pricing" className={styles.colLink}>Pricing</Link>
            <Link href="/about" className={styles.colLink}>About</Link>
            <Link href="/dashboard" className={styles.colLink}>Demo Dashboard</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Platform</h4>
            <Link href="/dashboard/scoring" className={styles.colLink}>Accreditation Scoring</Link>
            <Link href="/dashboard/sensors" className={styles.colLink}>Sensor Monitoring</Link>
            <Link href="/dashboard/documents" className={styles.colLink}>Document Analysis</Link>
            <Link href="/dashboard/ai-recommendations" className={styles.colLink}>AI Recommendations</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <Link href="/contact" className={styles.colLink}>Contact</Link>
            <Link href="/dashboard/help" className={styles.colLink}>Help Center</Link>
            <a href="#" className={styles.colLink}>Privacy Policy</a>
            <a href="#" className={styles.colLink}>Terms of Service</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 EduTrace-ES. All rights reserved.</span>
          <span>Built for NAAC / NBA accreditation excellence</span>
        </div>
      </div>
    </footer>
  );
}
