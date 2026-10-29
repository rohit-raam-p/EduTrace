'use client';
import { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Activity, FileText, Sparkles, Trash2 } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './notifications.module.css';

const iconMap: Record<string, any> = { warning: AlertCircle, success: CheckCircle, info: Sparkles, danger: Bell };
const colorMap: Record<string, string> = { warning: '#F59E0B', success: '#10B981', info: '#8B5CF6', danger: '#EF4444' };

// Mock notifications data for demo
const mockNotifications = [
  {
    _id: '1',
    type: 'warning',
    title: 'Lab Block B Temperature Alert',
    message: 'Temperature in Lab Block B has exceeded threshold (28°C > 25°C)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    href: '/dashboard/sensors'
  },
  {
    _id: '2',
    type: 'success',
    title: 'SSR Chapter 1 Analysis Complete',
    message: 'AI analysis of SSR Chapter 1 completed successfully. Score: 78%',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    href: '/dashboard/documents'
  },
  {
    _id: '3',
    type: 'info',
    title: 'AI Recommendations Updated',
    message: '6 new improvement recommendations generated based on latest document analysis',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: true,
    href: '/dashboard/ai-recommendations'
  },
  {
    _id: '4',
    type: 'info',
    title: 'Monthly Accreditation Report',
    message: 'Your monthly accreditation readiness report is now available',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    href: '/dashboard/analytics'
  },
  {
    _id: '5',
    type: 'warning',
    title: 'Sensor Offline',
    message: 'Motion sensor in Main Hall is currently offline. Last reading: 2 hours ago',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: false,
    href: '/dashboard/sensors'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>(mockNotifications);
  const [loading, setLoading] = useState(false);

  async function load() {
    // Mock loading - just set the mock data
    setNotifications(mockNotifications);
    setLoading(false);
  }

  async function markAllRead() {
    // Mock marking all as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function clearRead() {
    // Mock clearing read notifications
    setNotifications(prev => prev.filter(n => !n.read));
  }

  async function markRead(id: string) {
    // Mock marking single notification as read
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  }

  useEffect(() => { load(); }, []);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Notifications" />
      <div className={`glass-card ${styles.card}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.cardTitle}>All Notifications</div>
            {unread > 0 && <span className="badge badge-danger">{unread} unread</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            <button className="btn btn-ghost btn-sm" onClick={clearRead}><Trash2 size={13} /> Clear read</button>
          </div>
        </div>

        {loading && <div style={{ padding: 20, color: 'var(--text-muted)' }}>Loading...</div>}

        <div className={styles.list}>
          {notifications.length === 0 && !loading && (
            <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>No notifications yet.</div>
          )}
          {notifications.map((n: any) => {
            const Icon = iconMap[n.type] || Bell;
            const color = colorMap[n.type] || '#6366F1';
            return (
              <div key={n._id} className={`${styles.item} ${!n.read ? styles.unread : ''}`} onClick={() => !n.read && markRead(n._id)}>
                <div className={styles.icon} style={{ background: `${color}15` }}>
                  <Icon size={18} color={color} />
                </div>
                <div className={styles.content}>
                  <div className={styles.title}>{n.title}</div>
                  <div className={styles.body}>{n.body}</div>
                  <div className={styles.time}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <div className={styles.dot} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
