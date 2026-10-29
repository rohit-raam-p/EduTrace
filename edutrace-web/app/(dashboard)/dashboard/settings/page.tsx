'use client';
import { useEffect, useState } from 'react';
import { User, Building, Cpu, Shield, Save, CheckCircle } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', role: 'IQAC Coordinator' });
  const [institution, setInstitution] = useState({ name: '', type: 'Engineering College', accreditationTarget: 'NAAC A++', code: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.user) setProfile({ firstName: data.user.firstName, lastName: data.user.lastName, email: data.user.email, role: 'IQAC Coordinator' });
      if (data.institution) setInstitution({ name: data.institution.name, type: data.institution.type, accreditationTarget: data.institution.accreditationTarget, code: data.institution.code || '' });
    });
  }, []);

  async function save() {
    setError('');
    let type = activeTab;
    let data: any = {};
    if (activeTab === 'profile') { type = 'profile'; data = profile; }
    else if (activeTab === 'institution') { type = 'institution'; data = institution; }
    else if (activeTab === 'security') {
      type = 'password'; data = passwords;
      if (!passwords.currentPassword || !passwords.newPassword) { setError('Both password fields are required'); return; }
    }

    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, data }) });
    const result = await res.json();
    if (!res.ok) { setError(result.error); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Settings" />

      <div className={styles.tabs}>
        {[{ id: 'profile', icon: User, label: 'Profile' }, { id: 'institution', icon: Building, label: 'Institution' }, { id: 'sensors', icon: Cpu, label: 'Sensors' }, { id: 'security', icon: Shield, label: 'Security' }]
          .map(t => (
            <button key={t.id} className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.id)}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
      </div>

      <div className={`glass-card ${styles.panel}`}>
        {error && <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

        {activeTab === 'profile' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Profile Settings</h2>
            <div className={styles.avatarRow}>
              <div className={styles.avatar}>{profile.firstName?.[0]}{profile.lastName?.[0]}</div>
              <div><div className={styles.avatarName}>{profile.firstName} {profile.lastName}</div><button className="btn btn-ghost btn-sm">Change Photo</button></div>
            </div>
            <div className={styles.grid2}>
              <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={profile.email} disabled /></div>
              <div className="form-group"><label className="form-label">Role</label><select className="form-input" value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}><option>IQAC Coordinator</option><option>Administrator</option><option>Committee Member</option></select></div>
            </div>
          </div>
        )}

        {activeTab === 'institution' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Institution Configuration</h2>
            <div className={styles.grid2}>
              <div className="form-group"><label className="form-label">Institution Name</label><input className="form-input" value={institution.name} onChange={e => setInstitution(i => ({ ...i, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Type</label><select className="form-input" value={institution.type} onChange={e => setInstitution(i => ({ ...i, type: e.target.value }))}><option>Engineering College</option><option>University</option><option>Autonomous College</option></select></div>
              <div className="form-group"><label className="form-label">Accreditation Target</label><select className="form-input" value={institution.accreditationTarget} onChange={e => setInstitution(i => ({ ...i, accreditationTarget: e.target.value }))}><option>NAAC A++</option><option>NAAC A+</option><option>NBA</option><option>Both NAAC & NBA</option></select></div>
              <div className="form-group"><label className="form-label">Institution Code</label><input className="form-input" value={institution.code} onChange={e => setInstitution(i => ({ ...i, code: e.target.value }))} /></div>
            </div>
          </div>
        )}

        {activeTab === 'sensors' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Sensor Node Configuration</h2>
            <div className={styles.sensorList}>
              {['Lab Block A', 'Lab Block B', 'Main Hall', 'Library', 'Campus'].map((loc, i) => (
                <div key={loc} className={styles.sensorRow}>
                  <div className={styles.sensorDot} style={{ background: i === 2 ? 'var(--danger)' : 'var(--success)' }} />
                  <div className={styles.sensorName}>{loc}</div>
                  <div className={styles.sensorId}>Node ID: ET-{1000 + i}</div>
                  <span className={`badge ${i === 2 ? 'badge-danger' : 'badge-success'}`}>{i === 2 ? 'Offline' : 'Online'}</span>
                  <button className="btn btn-ghost btn-sm">Configure</button>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}><Cpu size={13} /> Add Sensor Node</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Security Settings</h2>
            <div className={styles.grid2}>
              <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" placeholder="••••••••" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" placeholder="••••••••" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} /></div>
            </div>
          </div>
        )}

        {activeTab !== 'sensors' && (
          <div className={styles.footer}>
            <button className="btn btn-primary" onClick={save}>
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
