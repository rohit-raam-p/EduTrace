'use client';
import { useEffect, useState } from 'react';
import { Thermometer, Wind, Zap, Eye, Droplets, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './sensors.module.css';

const typeIcon: Record<string, any> = { temperature: Thermometer, aqi: Wind, power: Zap, motion: Eye, moisture: Droplets };
const typeColor: Record<string, string> = { temperature: '#6366F1', aqi: '#10B981', power: '#3B82F6', motion: '#8B5CF6', moisture: '#06B6D4' };

function generateSparkline(base: number, count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: i, v: base + Math.sin(i * 0.5) * (base * 0.05) + (Math.random() - 0.5) * (base * 0.03),
  }));
}

const statusBadge = (s: string) =>
  s === 'normal' ? <span className="badge badge-success"><CheckCircle size={10} /> Online</span>
  : s === 'warning' ? <span className="badge badge-warning"><AlertCircle size={10} /> Warning</span>
  : <span className="badge badge-danger"><AlertCircle size={10} /> Offline</span>;

function makeSensors() {
  return [
    { id: 1, name: 'Lab Block A – Temperature', type: 'temperature', value: `${(22 + Math.random() * 6).toFixed(1)}°C`, numVal: 24, status: Math.random() > 0.8 ? 'warning' : 'normal', location: 'Lab Block A' },
    { id: 2, name: 'Main Hall – AQI', type: 'aqi', value: `${Math.floor(30 + Math.random() * 40)} AQI`, numVal: 45, status: 'normal', location: 'Main Hall' },
    { id: 3, name: 'Lab Block B – Temperature', type: 'temperature', value: `${(25 + Math.random() * 8).toFixed(1)}°C`, numVal: 28, status: Math.random() > 0.7 ? 'warning' : 'normal', location: 'Lab Block B' },
    { id: 4, name: 'Campus – Power Usage', type: 'power', value: `${(40 + Math.random() * 20).toFixed(1)} kW`, numVal: 50, status: 'normal', location: 'Main Campus' },
    { id: 5, name: 'Library – Motion', type: 'motion', value: Math.random() > 0.3 ? 'Active' : 'Inactive', numVal: 70, status: 'normal', location: 'Library' },
    { id: 6, name: 'Server Room – Temperature', type: 'temperature', value: `${(18 + Math.random() * 4).toFixed(1)}°C`, numVal: 20, status: Math.random() > 0.9 ? 'offline' : 'normal', location: 'Server Room' },
  ];
}

export default function SensorsPage() {
  const [sensors, setSensors] = useState(makeSensors());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(makeSensors());
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => { setSensors(makeSensors()); setLastUpdated(new Date()); };

  const online = sensors.filter(s => s.status !== 'offline').length;
  const warnings = sensors.filter(s => s.status === 'warning').length;
  const offline = sensors.filter(s => s.status === 'offline').length;

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Sensor Monitoring" />

      <div className={styles.topBar}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last updated: {lastUpdated.toLocaleTimeString()}</div>
        <button onClick={refresh} className="btn btn-ghost btn-sm"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className={styles.summary}>
        {[
          { label: 'Nodes Online', value: online, color: '#10B981' },
          { label: 'Warnings', value: warnings, color: '#F59E0B' },
          { label: 'Offline', value: offline, color: '#EF4444' },
          { label: 'Total Sensors', value: sensors.length, color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color, fontSize: '2rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.sensorsGrid}>
        {sensors.map(s => {
          const Icon = typeIcon[s.type] || Eye;
          const color = typeColor[s.type] || '#6366F1';
          const sparkline = generateSparkline(s.numVal);
          return (
            <div key={s.id} className={`glass-card ${styles.sensorCard} ${s.status === 'offline' ? styles.offline : ''}`}>
              <div className={styles.sensorHeader}>
                <div className={styles.sensorIconWrap} style={{ background: `${color}15` }}>
                  <Icon size={18} color={color} />
                </div>
                <div className={styles.sensorInfo}>
                  <div className={styles.sensorName}>{s.name}</div>
                  <div className={styles.sensorLocation}>{s.location}</div>
                </div>
                {statusBadge(s.status)}
              </div>
              <div className={styles.sensorValue} style={{ color }}>{s.value}</div>
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
                <div className={styles.warningNote}><AlertCircle size={12} /> Above threshold</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
