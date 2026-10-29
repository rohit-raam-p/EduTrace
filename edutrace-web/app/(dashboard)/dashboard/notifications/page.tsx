'use client';
import { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Activity, FileText, Sparkles, Trash2 } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './notifications.module.css';

const iconMap: Record<string, any> = { warning: AlertCircle, success: CheckCircle, info: Sparkles, danger: Bell };
const colorMap: Record<string, string> = { warning: '#F59E0B', success: '#10B981', info: '#8B5CF6', danger: '#EF4444' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data.notifications || []);
    setLoading(false);
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true }) });
    await load();
  }

  async function clearRead() {
    await fetch('/api/notifications', { method: 'DELETE' });
    await load();
  }

  async function markRead(id: string) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
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
