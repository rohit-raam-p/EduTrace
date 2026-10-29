'use client';
import { useEffect, useState } from 'react';
import { Award, Activity, FileText, BarChart2, Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import Link from 'next/link';
import styles from './dashboard.module.css';
import DashboardTopbar from '@/components/DashboardTopbar';

export default function DashboardHome() {
  const [institution, setInstitution] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [docStats, setDocStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const trendData = [
    { month: 'Sep', score: 66 }, { month: 'Oct', score: 69 }, { month: 'Nov', score: 68 },
    { month: 'Dec', score: 71 }, { month: 'Jan', score: 74 }, { month: 'Feb', score: institution?.overallScore || 74 },
  ];

  useEffect(() => {
    async function load() {
      try {
        const [instRes, notifRes, analyticsRes] = await Promise.all([
          fetch('/api/accreditation'),
          fetch('/api/notifications'),
          fetch('/api/analytics'),
        ]);
        const instData = await instRes.json();
        const notifData = await notifRes.json();
        const analyticsData = await analyticsRes.json();
        setInstitution(instData.institution);
        setNotifications(notifData.notifications?.slice(0, 4) || []);
        setDocStats(analyticsData.docStats || {});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const params = institution ? [
    { label: 'IIQA', score: institution.parameters.iiqa, target: 90 },
    { label: 'SSR', score: institution.parameters.ssr, target: 85 },
    { label: 'DVV', score: institution.parameters.dvv, target: 80 },
    { label: 'Research', score: institution.parameters.research, target: 90 },
    { label: 'Innovation', score: institution.parameters.innovation, target: 75 },
    { label: 'SDGs', score: institution.parameters.sdg, target: 80 },
  ] : [];

  const kpis = [
    { label: 'IIQA Score', value: institution ? `${institution.parameters.iiqa}%` : '--', change: '+3%', up: true, icon: Award, color: '#6366F1' },
    { label: 'SSR Completion', value: institution ? `${institution.parameters.ssr}%` : '--', change: '+8%', up: true, icon: FileText, color: '#10B981' },
    { label: 'Docs Analyzed', value: docStats.analyzed ?? '--', change: `${docStats.total ?? 0} total`, up: true, icon: BarChart2, color: '#3B82F6' },
    { label: 'Gaps Found', value: docStats.totalGaps ?? '--', change: 'needs attention', up: false, icon: Activity, color: '#F59E0B' },
  ];

  const notifIcon = (type: string) => {
    if (type === 'warning') return <AlertCircle size={16} color="var(--warning)" />;
    if (type === 'success') return <CheckCircle size={16} color="var(--success)" />;
    return <Activity size={16} color="var(--info)" />;
  };

  if (loading) return <div className={styles.page}><DashboardTopbar title="Dashboard Overview" /><div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div></div>;

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Dashboard Overview" />

      <div className={styles.topRow}>
        <div className={`glass-card ${styles.scoreCard}`}>
          <div className={styles.scoreHeader}>
            <div>
              <div className={styles.scoreTitle}>Accreditation Readiness</div>
              <div className={styles.scoreSub}>Overall composite score</div>
            </div>
            <span className="badge badge-warning">{params.filter(p => p.score < p.target).length} items need attention</span>
          </div>
          <div className={styles.scoreDisplay}>
            <div className={styles.bigScore}>{institution?.overallScore || 0}<span>%</span></div>
            <div className={styles.scoreChange}><TrendingUp size={14} /> Live from your data</div>
          </div>
          <div className={styles.paramsGrid}>
            {params.map(p => (
              <div key={p.label} className={styles.param}>
                <div className={styles.paramHeader}>
                  <span className={styles.paramLabel}>{p.label}</span>
                  <span className={styles.paramScore}>{p.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.score}%` }} />
                </div>
                <div className={styles.paramTarget}>Target: {p.target}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`glass-card ${styles.trendCard}`}>
          <div className={styles.trendHeader}>
            <div className={styles.trendTitle}>Score Trend</div>
            <span className="badge badge-success">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#818CF8' }} />
              <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.kpisGrid}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${k.color}15` }}>
              <k.icon size={20} color={k.color} />
            </div>
            <div className="stat-value" style={{ color: k.color }}>{k.value}</div>
            <div className="stat-label">{k.label}</div>
            <div className={`stat-change ${k.up ? 'up' : 'down'}`}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomRow}>
        <div className={`glass-card ${styles.alertsCard}`}>
          <div className={styles.cardTitle}>Recent Alerts</div>
          <div className={styles.alertsList}>
            {notifications.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '12px 0' }}>No notifications yet.</div>}
            {notifications.map((n: any) => (
              <Link key={n._id} href="/dashboard/notifications" className={styles.alertItem}>
                {notifIcon(n.type)}
                <span>{n.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={`glass-card ${styles.actionsCard}`}>
          <div className={styles.cardTitle}>Quick Actions</div>
          <div className={styles.actionsList}>
            {[
              { label: 'Upload SSR Document', href: '/dashboard/documents', icon: FileText, color: '#10B981' },
              { label: 'View AI Suggestions', href: '/dashboard/ai-recommendations', icon: Sparkles, color: '#8B5CF6' },
              { label: 'Check Sensor Status', href: '/dashboard/sensors', icon: Activity, color: '#F59E0B' },
              { label: 'Generate Report', href: '/dashboard/analytics', icon: BarChart2, color: '#3B82F6' },
            ].map(a => (
              <Link key={a.label} href={a.href} className={styles.actionItem}>
                <div className={styles.actionIcon} style={{ background: `${a.color}15` }}>
                  <a.icon size={16} color={a.color} />
                </div>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
