'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className="badge badge-primary"><Zap size={11} /> Contact Us</div>
          <h1>Get in touch or <span className="text-gradient">request a demo</span></h1>
          <p>Talk to our team to see how EduTrace-ES can transform your institution's accreditation process.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.info}>
              <h2>Let's talk</h2>
              <p className={styles.infoDesc}>Fill in the form and our team will get back to you within one business day.</p>
              {[
                { icon: Mail, label: 'Email', value: 'hello@edutrace-es.com' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Location', value: 'Bangalore, India' },
              ].map(c => (
                <div key={c.label} className={styles.contact}>
                  <div className={styles.contactIcon}><c.icon size={18} /></div>
                  <div>
                    <div className={styles.contactLabel}>{c.label}</div>
                    <div className={styles.contactValue}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className={`glass-card ${styles.formCard}`}>
              {sent ? (
                <div className={styles.success}>
                  <div className="badge badge-success" style={{ fontSize: '1rem', padding: '10px 20px' }}>✓ Message sent!</div>
                  <p>Thank you! We'll be in touch within one business day.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={e => { e.preventDefault(); setSent(true); }}>
                  <h3>Send us a message</h3>
                  <div className={styles.row}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input className="form-input" placeholder="Rohit" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input className="form-input" placeholder="Sharma" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input type="email" className="form-input" placeholder="iqac@university.edu" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input className="form-input" placeholder="National Institute of Technology" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">What can we help with?</label>
                    <select className="form-input">
                      <option>Demo request</option>
                      <option>Sales inquiry</option>
                      <option>Technical support</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-input" rows={4} placeholder="Tell us about your institution's accreditation needs..." style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
