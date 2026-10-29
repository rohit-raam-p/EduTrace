'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import styles from '../auth.module.css';

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.formBox}>
      <h1 className={styles.title}>{sent ? 'Check your email' : 'Reset password'}</h1>
      <p className={styles.subtitle}>
        {sent ? 'We\'ve sent a password reset link to your email.' : 'Enter your work email and we\'ll send a reset link.'}
      </p>

      {!sent ? (
        <form className={styles.form} onSubmit={() => setSent(true)}>
          <div className="form-group">
            <label className="form-label">Work Email</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input type="email" className={`form-input ${styles.withIcon}`} placeholder="iqac@university.edu" />
            </div>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} onClick={() => setSent(true)}>
            Send Reset Link <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        <div className={styles.sentBox}>
          <div className={styles.sentIcon}>📧</div>
          <p>Didn't receive it? Check your spam folder or <button className={styles.resendBtn} onClick={() => setSent(false)}>try again</button>.</p>
        </div>
      )}
      <p className={styles.switchText}>
        Remember your password? <Link href="/login" className={styles.switchLink}>Sign in</Link>
      </p>
    </div>
  );
}
