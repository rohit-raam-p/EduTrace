'use client';
import { Award, Activity, FileText, BarChart2, Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import Link from 'next/link';
import styles from './dashboard.module.css';
import DashboardTopbar from '@/components/DashboardTopbar';

const mockInstitution = {
  name: 'Demo Institute of Technology',
  overallScore: Math.floor(Math.random() * 40) + 60, // Random 60-100
  parameters: {
    iiqa: Math.floor(Math.random() * 40) + 60,
    ssr: Math.floor(Math.random() * 40) + 60,
    dvv: Math.floor(Math.random() * 40) + 60,
    research: Math.floor(Math.random() * 40) + 60,
    innovation: Math.floor(Math.random() * 40) + 60,
    sdg: Math.floor(Math.random() * 40) + 60,
  }
};

const mockNotifications = [
  { type: 'warning', text: 'Lab Block B temperature above threshold', href: '/dashboard/sensors' },
  { type: 'success', text: 'SSR Chapter 1 analysis complete', href: '/dashboard/documents' },
  { type: 'info', text: 'AI generated 6 new improvement suggestions', href: '/dashboard/ai-recommendations' },
  { type: 'info', text: 'Monthly report generated', href: '/dashboard/analytics' },
];

export default function DashboardHome() {
  const trendData = [
    { month: 'Sep', score: 66 }, { month: 'Oct', score: 69 }, { month: 'Nov', score: 68 },
    { month: 'Dec', score: 71 }, { month: 'Jan', score: 74 }, { month: 'Feb', score: mockInstitution.overallScore },
  ];

  const params = [
    { label: 'IIQA', score: mockInstitution.parameters.iiqa, target: 90 },
    { label: 'SSR', score: mockInstitution.parameters.ssr, target: 85 },
    { label: 'DVV', score: mockInstitution.parameters.dvv, target: 80 },
    { label: 'Research', score: mockInstitution.parameters.research, target: 90 },
    { label: 'Innovation', score: mockInstitution.parameters.innovation, target: 75 },
    { label: 'SDGs', score: mockInstitution.parameters.sdg, target: 80 },
  ];

  const kpis = [
    { label: 'IIQA Score', value: `${mockInstitution.parameters.iiqa}%`, change: '+3%', up: true, icon: Award, color: '#6366F1' },
    { label: 'SSR Completion', value: `${mockInstitution.parameters.ssr}%`, change: '+8%', up: true, icon: FileText, color: '#10B981' },
    { label: 'Sensor Nodes', value: '8 / 10', change: '2 offline', up: false, icon: Activity, color: '#F59E0B' },
    { label: 'Docs Analyzed', value: '5', change: '+2 this week', up: true, icon: BarChart2, color: '#3B82F6' },
  ];

  const notifIcon = (type: string) => {
    if (type === 'warning') return <AlertCircle size={16} color="var(--warning)" />;
    if (type === 'success') return <CheckCircle size={16} color="var(--success)" />;
    return <Activity size={16} color="var(--info)" />;
  };

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
            <div className={styles.bigScore}>{mockInstitution.overallScore}<span>%</span></div>
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
            {mockNotifications.map((n, i) => (
              <Link key={i} href={n.href} className={styles.alertItem}>
                {notifIcon(n.type)}
                <span>{n.text}</span>
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
