'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import styles from './PublicNav.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemo(window.location.port === '3001');
    }
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}><Zap size={18} /></div>
          <span className={styles.logoText}>EduTrace<span className={styles.logoAccent}>-ES</span></span>
        </Link>

        <ul className={styles.links}>
          {navLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {!isDemo && <a href="http://localhost:3001/dashboard" className={`btn btn-ghost btn-sm ${styles.demoBtn}`}>▶ Demo</a>}
          {isDemo && <a href="http://localhost:3000" className={`btn btn-ghost btn-sm ${styles.siteBtn}`}>🌐 Site</a>}
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobile}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            <a href="http://localhost:3000" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>🌐 Site</a>
            <a href="http://localhost:3001/dashboard" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>▶ Demo</a>
            <Link href="/login" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
