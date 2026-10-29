'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formBox}>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to your institution's EduTrace-ES dashboard</p>

      {error && <div className={styles.errorBox}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className={styles.inputWrap}>
            <Mail size={16} className={styles.inputIcon} />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={`form-input ${styles.withIcon}`} placeholder="iqac@university.edu" required
            />
          </div>
        </div>
        <div className="form-group">
          <div className={styles.labelRow}>
            <label className="form-label">Password</label>
            <Link href="/reset-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <div className={styles.inputWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className={`form-input ${styles.withIcon}`} placeholder="••••••••" required
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
          {loading ? 'Signing in...' : <> Sign In <ArrowRight size={16} /> </>}
        </button>
      </form>

      <div className={styles.divider}><span>or</span></div>
      <button className={`btn btn-ghost ${styles.ssoBtn}`}>
        🏛️ Sign in with Institution SSO
      </button>

      <p className={styles.switchText}>
        Don't have an account? <Link href="/register" className={styles.switchLink}>Register your institution</Link>
      </p>
    </div>
  );
}
