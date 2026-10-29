import Link from 'next/link';
import { Zap } from 'lucide-react';
import styles from './authLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}><Zap size={20} /></div>
          <span className={styles.logoText}>EduTrace<span className={styles.logoAccent}>-ES</span></span>
        </Link>
        <div className={styles.brandTagline}>Academic Accreditation Status Tracing Platform</div>
        <div className={styles.brandStats}>
          <div className={styles.stat}><div className={styles.statVal}>200+</div><div className={styles.statLab}>Institutions</div></div>
          <div className={styles.stat}><div className={styles.statVal}>94%</div><div className={styles.statLab}>Prediction Accuracy</div></div>
          <div className={styles.stat}><div className={styles.statVal}>NAAC</div><div className={styles.statLab}>& NBA Ready</div></div>
        </div>
        <div className={styles.brandGlow} />
      </div>
      <div className={styles.formSide}>
        <div className={styles.formWrap}>{children}</div>
      </div>
    </div>
  );
}
