'use client';
import { useEffect, useState } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './scoring.module.css';

const WEIGHTS: Record<string, string> = { iiqa: '15%', ssr: '25%', dvv: '20%', research: '15%', innovation: '10%', sdg: '5%', studentSatisfaction: '5%', bibliometric: '5%' };
const LABELS: Record<string, string> = { iiqa: 'IIQA (Institutional Information)', ssr: 'SSR (Self Study Report)', dvv: 'DVV Clarification', research: 'Research Output', innovation: 'Innovation & Entrepreneurship', sdg: 'SDG Values Alignment', studentSatisfaction: 'Student Satisfaction Survey', bibliometric: 'Bibliometric Data' };
const statusOf = (s: number) => s >= 75 ? 'good' : s >= 60 ? 'warning' : s > 0 ? 'danger' : 'warning';
const statusColor = (s: string) => s === 'good' ? 'var(--success)' : s === 'warning' ? 'var(--warning)' : 'var(--danger)';
const badgeClass = (s: string) => s === 'good' ? 'badge-success' : s === 'warning' ? 'badge-warning' : 'badge-danger';
const statusLabel = (s: string) => s === 'good' ? 'On Track' : s === 'warning' ? 'Needs Attention' : 'At Risk';

const historyData = [
  { q: 'Q1 23', score: 58 }, { q: 'Q2 23', score: 62 }, { q: 'Q3 23', score: 65 },
  { q: 'Q4 23', score: 66 }, { q: 'Q1 24', score: 68 }, { q: 'Q2 24', score: 71 },
  { q: 'Q3 24', score: 72 }, { q: 'Q4 24', score: 74 },
];

export default function ScoringPage() {
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accreditation').then(r => r.json()).then(d => {
      setInstitution(d.institution);
      setLoading(false);
    });
  }, []);

  const params = institution ? Object.entries(institution.parameters).map(([key, score]) => ({
    key, label: LABELS[key] || key, score: score as number,
    status: statusOf(score as number), weight: WEIGHTS[key] || '5%',
  })) : [];

  const radarData = params.map(p => ({ subject: p.label.split(' ')[0], A: p.score }));
  const trend = [...historyData.slice(0, 7), { q: 'Now', score: institution?.overallScore || 0 }];

  const projectedGrade = () => {
    const s = institution?.overallScore || 0;
    if (s >= 90) return 'NAAC A++';
    if (s >= 80) return 'NAAC A+';
    if (s >= 70) return 'NAAC A';
    if (s >= 60) return 'NAAC B++';
    return 'NAAC B';
  };

  if (loading) return <div className={styles.page}><DashboardTopbar title="Accreditation Scoring" /><div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div></div>;

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Accreditation Scoring" />

      <div className={styles.topRow}>
        <div className={`glass-card ${styles.overallCard}`}>
          <div className={styles.overallIcon}><Award size={28} color="var(--primary-light)" /></div>
          <div className={styles.overallScore}>{institution?.overallScore || 0}<span>%</span></div>
          <div className={styles.overallLabel}>Overall Readiness</div>
          <div className={styles.overallChange}><TrendingUp size={14} /> Based on analyzed documents</div>
          <div className="divider" />
          <div className={styles.overallMeta}>
            <div><div className={styles.metaVal}>{projectedGrade()}</div><div className={styles.metaLab}>Projected Grade</div></div>
            <div><div className={styles.metaVal}>Mar 26</div><div className={styles.metaLab}>Next Assessment</div></div>
          </div>
        </div>

        <div className={`glass-card ${styles.radarCard}`}>
          <div className={styles.cardTitle}>Parameter Radar</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
              <Radar dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className={`glass-card ${styles.historyCard}`}>
          <div className={styles.cardTitle}>Historical Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="q" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#818CF8' }} />
              <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fill="url(#hg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`glass-card ${styles.paramsTable}`}>
        <div className={styles.cardTitle}>Parameter Breakdown</div>
        {params.every(p => p.score === 0) && (
          <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            ⚠ No documents analyzed yet. Go to Document Analysis and click Analyze on each document.
          </div>
        )}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Parameter</th><th>Score</th><th>Progress</th><th>Weight</th><th>Status</th></tr>
            </thead>
            <tbody>
              {params.map(p => (
                <tr key={p.key}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.label}</td>
                  <td style={{ color: statusColor(p.status), fontWeight: 700 }}>{p.score}%</td>
                  <td style={{ width: 200 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.score}%`, background: statusColor(p.status) }} />
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.weight}</span></td>
                  <td><span className={`badge ${badgeClass(p.status)}`}>{statusLabel(p.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
