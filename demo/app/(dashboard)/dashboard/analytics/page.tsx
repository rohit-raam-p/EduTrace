'use client';
import { useEffect, useState } from 'react';
import { BarChart2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './analytics.module.css';

const tooltipStyle = { background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94A3B8', fontSize: 12 };

// Mock analytics data for demo
const mockAnalyticsData = {
  departments: [
    { dept: 'CSE', score: 82, students: 120, faculty: 15 },
    { dept: 'ECE', score: 78, students: 95, faculty: 12 },
    { dept: 'ME', score: 75, students: 110, faculty: 14 },
    { dept: 'CE', score: 80, students: 85, faculty: 10 },
    { dept: 'IT', score: 85, students: 100, faculty: 13 },
  ],
  kpiTrend: [
    { month: 'Sep', overall: 72, research: 68, infra: 76 },
    { month: 'Oct', overall: 74, research: 71, infra: 78 },
    { month: 'Nov', overall: 76, research: 73, infra: 79 },
    { month: 'Dec', overall: 78, research: 75, infra: 81 },
    { month: 'Jan', overall: 79, research: 76, infra: 82 },
    { month: 'Feb', overall: 81, research: 78, infra: 84 },
  ],
  docStats: {
    total: 6,
    analyzed: 4,
    totalGaps: 3,
    avgScore: 83,
  },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - just set the mock data
    setTimeout(() => {
      setData(mockAnalyticsData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className={styles.page}><DashboardTopbar title="Analytics & Reports" /><div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div></div>;

  const deptData = data?.departments || [];
  const kpiTrend = data?.kpiTrend || [];
  const docStats = data?.docStats || {};
  const best = deptData.reduce((a: any, b: any) => a.score > b.score ? a : b, deptData[0] || {});
  const worst = deptData.reduce((a: any, b: any) => a.score < b.score ? a : b, deptData[0] || {});

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Analytics & Reports" />

      <div className={styles.kpiRow}>
        {[
          { label: 'Best Dept.', value: best?.dept ? `${best.dept} Dept` : '--', sub: `${best?.score || 0}% score`, color: '#10B981' },
          { label: 'Weakest Dept.', value: worst?.dept ? `${worst.dept} Dept` : '--', sub: `${worst?.score || 0}% score`, color: '#EF4444' },
          { label: 'Docs Analyzed', value: `${docStats.analyzed || 0}/${docStats.total || 0}`, sub: `${docStats.totalGaps || 0} gaps found`, color: '#6366F1' },
          { label: 'Avg Doc Score', value: docStats.avgScore ? `${docStats.avgScore}%` : '--', sub: 'across all documents', color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div className="stat-value" style={{ color: k.color, fontSize: '1.6rem' }}>{k.value}</div>
            <div className="stat-label">{k.label}</div>
            <div className="stat-change up" style={{ color: k.color }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={`glass-card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Department Performance</div>
            <button className="btn btn-ghost btn-sm"><Download size={13} /> Export</button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptData}>
              <XAxis dataKey="dept" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`glass-card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>KPI Trends</div>
            <button className="btn btn-ghost btn-sm"><Download size={13} /> Export</button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={kpiTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 95]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="research" stroke="#6366F1" strokeWidth={2} dot={false} name="Research" />
              <Line type="monotone" dataKey="infra" stroke="#10B981" strokeWidth={2} dot={false} name="Infrastructure" />
              <Line type="monotone" dataKey="satisfaction" stroke="#F59E0B" strokeWidth={2} dot={false} name="Satisfaction" />
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            <span className={styles.legendItem} style={{ color: '#6366F1' }}>● Research</span>
            <span className={styles.legendItem} style={{ color: '#10B981' }}>● Infrastructure</span>
            <span className={styles.legendItem} style={{ color: '#F59E0B' }}>● Satisfaction</span>
          </div>
        </div>
      </div>

      <div className={`glass-card ${styles.reportCard}`}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>Department-wise Breakdown</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm"><Download size={13} /> Download PDF</button>
            <button className="btn btn-primary btn-sm"><BarChart2 size={13} /> Generate Report</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Department</th><th>Score</th><th>Research</th><th>Infrastructure</th><th>Students</th><th>Status</th></tr>
            </thead>
            <tbody>
              {deptData.map((d: any) => (
                <tr key={d.dept}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.dept} Department</td>
                  <td style={{ color: d.score >= 80 ? 'var(--success)' : d.score >= 70 ? 'var(--warning)' : 'var(--danger)', fontWeight: 700 }}>{d.score}%</td>
                  <td>{Math.round(d.score * 0.9)}%</td>
                  <td>{Math.round(d.score * 1.05 > 100 ? 100 : d.score * 1.05)}%</td>
                  <td>{Math.round(500 + d.score * 10)}</td>
                  <td><span className={`badge ${d.score >= 80 ? 'badge-success' : d.score >= 70 ? 'badge-warning' : 'badge-danger'}`}>{d.score >= 80 ? 'Excellent' : d.score >= 70 ? 'Good' : 'Needs Work'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
