'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Building, User, Mail, Lock } from 'lucide-react';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    institutionName: '', institutionType: 'Engineering College',
    accreditationTarget: 'NAAC A++', firstName: '', lastName: '',
    email: '', password: '', plan: 'Professional',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/login');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formBox}>
      <div className={styles.stepIndicator}>
        {[1, 2, 3].map(s => (
          <div key={s} className={`${styles.stepDot} ${step >= s ? styles.stepActive : ''}`} />
        ))}
      </div>
      <h1 className={styles.title}>
        {step === 1 ? 'Register Institution' : step === 2 ? 'Admin Account' : 'Almost done!'}
      </h1>
      <p className={styles.subtitle}>
        {step === 1 ? 'Start with your institution details' : step === 2 ? 'Create your administrator account' : 'Choose your plan and activate'}
      </p>

      {error && <div className={styles.errorBox}>{error}</div>}

      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label className="form-label">Institution Name</label>
              <div className={styles.inputWrap}>
                <Building size={16} className={styles.inputIcon} />
                <input className={`form-input ${styles.withIcon}`} placeholder="National Institute of Technology"
                  value={form.institutionName} onChange={e => set('institutionName', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Institution Type</label>
              <select className="form-input" value={form.institutionType} onChange={e => set('institutionType', e.target.value)}>
                <option>Engineering College</option>
                <option>University</option>
                <option>Autonomous College</option>
                <option>Deemed University</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Accreditation Target</label>
              <select className="form-input" value={form.accreditationTarget} onChange={e => set('accreditationTarget', e.target.value)}>
                <option>NAAC A++</option>
                <option>NAAC A+</option>
                <option>NBA</option>
                <option>Both NAAC & NBA</option>
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input className={`form-input ${styles.withIcon}`} placeholder="Rohit"
                    value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Sharma"
                  value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input type="email" className={`form-input ${styles.withIcon}`} placeholder="iqac@university.edu"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input type="password" className={`form-input ${styles.withIcon}`} placeholder="Min. 8 characters"
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <div className={styles.finalStep}>
            <div className={styles.planChoice}>
              {[
                { name: 'Starter', price: '₹9,999/mo' },
                { name: 'Professional', price: '₹24,999/mo' },
              ].map(p => (
                <label key={p.name} className={styles.planOption}>
                  <input type="radio" name="plan" checked={form.plan === p.name} onChange={() => set('plan', p.name)} />
                  <div className={styles.planLabel}>
                    <div className={styles.planName}>{p.name}</div>
                    <div className={styles.planPrice}>{p.price}</div>
                  </div>
                </label>
              ))}
            </div>
            <p className={styles.trialNote}>✓ 30-day free trial • No credit card required</p>
          </div>
        )}

        <div className={styles.stepActions}>
          {step > 1 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)} style={{ flex: 1 }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account...' : <> Activate Account <ArrowRight size={16} /> </>}
            </button>
          )}
        </div>
      </form>
      <p className={styles.switchText}>
        Already have an account? <Link href="/login" className={styles.switchLink}>Sign in</Link>
      </p>
    </div>
  );
}
