'use client';
import { useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Auto-seed on first login — idempotent, safe to call every time
    fetch('/api/seed', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div className={styles.shell}>
      <DashboardSidebar />
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
