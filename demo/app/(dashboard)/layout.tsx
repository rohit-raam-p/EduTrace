import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <DashboardSidebar />
      <div className={styles.main}>
        <DashboardTopbar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
