'use client';
import { useEffect, useState } from 'react';
import { Thermometer, Wind, Zap, Eye, Droplets, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './sensors.module.css';

const typeIcon: Record<string, any> = { temperature: Thermometer, aqi: Wind, power: Zap, motion: Eye, moisture: Droplets, camera: Eye };
const typeColor: Record<string, string> = { temperature: '#6366F1', aqi: '#10B981', power: '#3B82F6', motion: '#8B5CF6', moisture: '#06B6D4', camera: '#EF4444' };

function generateSparkline(history: number[]) {
  if (!history || history.length === 0) return [];
  return history.map((val, i) => ({ t: i, v: val }));
}

const statusBadge = (s: string) =>
  s === 'normal' ? <span className="badge badge-success"><CheckCircle size={10} /> Online</span>
  : s === 'warning' ? <span className="badge badge-warning"><AlertCircle size={10} /> Warning</span>
  : <span className="badge badge-danger"><AlertCircle size={10} /> Offline</span>;

export default function SensorsPage() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function load() {
    // Add cache-busting to ensure we get live ESP32 data instead of stale Next.js/Browser cache
    const res = await fetch(`/api/sensors?t=${new Date().getTime()}`, { cache: 'no-store' });
    const data = await res.json();
    setSensors(data.sensors || []);
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Auto-refresh every 5 seconds for live hardware feel
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const online = sensors.filter(s => s.status === 'normal').length;
  const warnings = sensors.filter(s => s.status === 'warning').length;
  const offline = sensors.filter(s => s.status === 'offline').length;
  const avgAqi = sensors.find(s => s.type === 'aqi')?.value || 0;

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Sensor Monitoring" />

      <div className={styles.topBar}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className={styles.summary}>
        {[
          { label: 'Nodes Online', value: online, color: '#10B981' },
          { label: 'Warnings', value: warnings, color: '#F59E0B' },
          { label: 'Offline', value: offline, color: '#EF4444' },
          { label: 'Avg. AQI', value: Math.round(avgAqi), color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color, fontSize: '2rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {loading && <div style={{ color: 'var(--text-muted)', padding: 20 }}>Loading sensor data...</div>}

      <div className={styles.sensorsGrid}>
        {sensors.map((s: any) => {
          const Icon = typeIcon[s.type] || Eye;
          const color = typeColor[s.type] || '#6366F1';
          const sparkline = generateSparkline(s.history || [s.value || 0]);
          const displayValue = s.status === 'offline' ? 'Offline' : `${s.value}${s.unit}`;

          return (
            <div key={s._id || s.nodeId} className={`glass-card ${styles.sensorCard} ${s.status === 'offline' ? styles.offline : ''}`}>
              <div className={styles.sensorHeader}>
                <div className={styles.sensorIconWrap} style={{ background: `${color}15` }}>
                  <Icon size={18} color={color} />
                </div>
                <div className={styles.sensorInfo}>
                  <div className={styles.sensorName}>{s.location} — {s.type.charAt(0).toUpperCase() + s.type.slice(1)}</div>
                  <div className={styles.sensorLocation}>Node: {s.nodeId}</div>
                </div>
                {statusBadge(s.status)}
              </div>
              <div className={styles.sensorValue} style={{ color }}>{displayValue}</div>
              {s.status !== 'offline' ? (
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={sparkline}>
                    <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
                    <Tooltip contentStyle={{ background: '#1a1f3a', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [v.toFixed(1)]} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.offlineMsg}>No data — sensor offline</div>
              )}
              {s.status === 'warning' && (
                <div className={styles.warningNote}><AlertCircle size={12} /> Above threshold — check {s.type === 'temperature' ? 'ventilation' : 'conditions'}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
