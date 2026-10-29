'use client';
import Link from 'next/link';
import { Search, Bell, ChevronDown, User, ArrowLeft } from 'lucide-react';
import styles from './DashboardTopbar.module.css';

export default function DashboardTopbar({ title }: { title?: string }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="http://localhost:3000" className={styles.backLink}>
          <ArrowLeft size={14} /> Website
        </Link>
        <div className={styles.divider} />
        <h1 className={styles.title}>{title || 'Dashboard'}</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <Search size={15} className={styles.searchIcon} />
          <input placeholder="Search modules..." className={styles.searchInput} />
        </div>
        <button className={styles.iconBtn}>
          <Bell size={18} />
          <span className={styles.dot} />
        </button>
        <Link href="/dashboard/settings" className={styles.profile}>
          <div className={styles.avatar}><User size={16} /></div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>Admin User</div>
            <div className={styles.profileRole}>IQAC Coordinator</div>
          </div>
          <ChevronDown size={14} className={styles.chevron} />
        </Link>
      </div>
    </header>
  );
}
