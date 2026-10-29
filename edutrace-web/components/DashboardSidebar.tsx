'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Award, Activity, FileText, BarChart2,
  Sparkles, Settings, Bell, HelpCircle, Zap, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import styles from './DashboardSidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Award, label: 'Accreditation Score', href: '/dashboard/scoring' },
  { icon: Activity, label: 'Sensor Monitoring', href: '/dashboard/sensors' },
  { icon: FileText, label: 'Document Analysis', href: '/dashboard/documents' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Sparkles, label: 'AI Recommendations', href: '/dashboard/ai-recommendations' },
];
const bottomItems = [
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help', href: '/dashboard/help' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon}><Zap size={16} /></div>
          {!collapsed && (
            <span className={styles.logoText}>EduTrace<span className={styles.logoAccent}>-ES</span></span>
          )}
        </Link>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && <div className={styles.section}>MAIN NAVIGATION</div>}

      <nav className={styles.nav}>
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} className={`${styles.item} ${isActive(href) ? styles.active : ''}`}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
            {isActive(href) && <div className={styles.activePill} />}
          </Link>
        ))}
      </nav>

      {!collapsed && <div className={styles.section}>SYSTEM</div>}

      <nav className={styles.navBottom}>
        <Link href="/" className={styles.backToSite}>
          <ExternalLink size={18} />
          {!collapsed && <span>Back to Website</span>}
        </Link>
        {bottomItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} className={`${styles.item} ${isActive(href) ? styles.active : ''}`}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className={styles.scoreWidget}>
          <div className={styles.scoreLabel}>Accreditation Score</div>
          <div className={styles.scoreValue}>74<span>%</span></div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: '74%' }} />
          </div>
          <div className={styles.scoreHint}>Good – 4 items need attention</div>
        </div>
      )}
    </aside>
  );
}
