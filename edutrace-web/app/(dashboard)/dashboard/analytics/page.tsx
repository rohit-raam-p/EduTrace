'use client';
import { useEffect, useState } from 'react';
import { BarChart2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { jsPDF } from 'jspdf';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './analytics.module.css';

const tooltipStyle = { background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94A3B8', fontSize: 12 };

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text('EduTrace-ES Analytics Report', 20, 20);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Best Department: ${best?.dept || 'N/A'} (${best?.score || 0}%)`, 20, 50);
    doc.text(`Weakest Department: ${worst?.dept || 'N/A'} (${worst?.score || 0}%)`, 20, 60);
    doc.text(`Documents Analyzed: ${docStats.analyzed || 0}/${docStats.total || 0}`, 20, 70);
    doc.text(`Average Document Score: ${docStats.avgScore || 0}%`, 20, 80);
    doc.save('edutrace-analytics-report.pdf');
  };

  const deptData = data?.departments || [];
  const kpiTrend = data?.kpiTrend || [];
  const docStats = data?.docStats || {};
  const best = deptData.reduce((a: any, b: any) => a.score > b.score ? a : b, deptData[0] || {});
  const worst = deptData.reduce((a: any, b: any) => a.score < b.score ? a : b, deptData[0] || {});

  const handleKpiExport = () => {
    const doc = new jsPDF();
    doc.text('EduTrace-ES KPI Trends Report', 20, 20);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
    let y = 50;
    doc.text('Month | Research | Infra | Satisfaction', 20, y);
    y += 10;
    kpiTrend.forEach((k: any) => {
      doc.text(`${k.month} | ${k.research}% | ${k.infra}% | ${k.satisfaction}%`, 20, y);
      y += 10;
    });
    doc.save('edutrace-kpi-trends.pdf');
  };

  const handleDeptExportPdf = () => {
    const doc = new jsPDF();
    doc.text('EduTrace-ES Department Breakdown Report', 20, 20);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
    let y = 50;
    doc.text('Department | Score | Status', 20, y);
    y += 10;
    deptData.forEach((d: any) => {
      const status = d.score >= 80 ? 'Excellent' : d.score >= 70 ? 'Good' : 'Needs Work';
      doc.text(`${d.dept} | ${d.score}% | ${status}`, 20, y);
      y += 10;
    });
    doc.save('edutrace-dept-breakdown.pdf');
  };

  const handleGenerateReport = () => {
    const csvRows = [];
    csvRows.push(['Department', 'Score', 'Research', 'Infrastructure', 'Students', 'Status'].join(','));
    deptData.forEach((d: any) => {
      const status = d.score >= 80 ? 'Excellent' : d.score >= 70 ? 'Good' : 'Needs Work';
      const research = Math.round(d.score * 0.9);
      const infra = Math.round(d.score * 1.05 > 100 ? 100 : d.score * 1.05);
      const students = Math.round(500 + d.score * 10);
      csvRows.push([`${d.dept} Department`, `${d.score}%`, `${research}%`, `${infra}%`, students, status].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edutrace-dept-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
            <button className="btn btn-ghost btn-sm" onClick={handleExport}><Download size={13} /> Export</button>
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
            <button className="btn btn-ghost btn-sm" onClick={handleKpiExport}><Download size={13} /> Export</button>
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
            <button className="btn btn-ghost btn-sm" onClick={handleDeptExportPdf}><Download size={13} /> Download PDF</button>
            <button className="btn btn-primary btn-sm" onClick={handleGenerateReport}><BarChart2 size={13} /> Generate Report</button>
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
