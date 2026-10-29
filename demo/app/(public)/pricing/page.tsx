'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle, ArrowRight, Zap, Star } from 'lucide-react';
import styles from './pricing.module.css';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 9999,
    annualPrice: 7999,
    desc: 'For small colleges getting started with accreditation tracking.',
    color: '#3B82F6',
    features: [
      'Up to 5 departments',
      'Accreditation readiness score',
      '10 document uploads/month',
      'Basic AI analysis',
      '2 sensor nodes',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    monthlyPrice: 24999,
    annualPrice: 19999,
    desc: 'For growing institutions pursuing NAAC A or NBA accreditation.',
    color: '#6366F1',
    features: [
      'Unlimited departments',
      'Full accreditation scoring (IIQA, SSR, DVV)',
      '100 document uploads/month',
      'Advanced AI + LLM analysis',
      '10 sensor nodes',
      'RAG-powered recommendations',
      'Analytics & custom reports',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    desc: 'For multi-campus universities and autonomous institutions.',
    color: '#F59E0B',
    features: [
      'Everything in Professional',
      'Unlimited sensor nodes',
      'Unlimited document uploads',
      'On-premise deployment option',
      'Custom LLM fine-tuning',
      'SSO & advanced RBAC',
      'Dedicated account manager',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

function formatPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className="badge badge-primary"><Zap size={11} /> Pricing</div>
            <h1>Simple, transparent <span className="text-gradient">pricing</span></h1>
            <p>Start free. Scale as your institution grows. No hidden fees.</p>

            {/* Toggle */}
            <div className={styles.toggle}>
              <span className={!annual ? styles.toggleActive : ''}>Monthly</span>
              <button
                className={`${styles.toggleSwitch} ${annual ? styles.toggleOn : ''}`}
                onClick={() => setAnnual(!annual)}
              >
                <span className={styles.toggleThumb} />
              </button>
              <span className={annual ? styles.toggleActive : ''}>
                Annual <span className={styles.saveBadge}>Save 20%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.plansGrid}>
            {plans.map(plan => {
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div key={plan.name} className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}>
                  {plan.highlighted && (
                    <div className={styles.popularTag}><Star size={12} fill="currentColor" /> Most Popular</div>
                  )}
                  <div className={styles.planTop} style={{ borderBottom: `2px solid ${plan.color}20` }}>
                    <div className={styles.planName} style={{ color: plan.color }}>{plan.name}</div>
                    <div className={styles.planPrice}>
                      {price ? (
                        <>
                          <span className={styles.priceNum}>{formatPrice(price)}</span>
                          <span className={styles.pricePeriod}>/month</span>
                        </>
                      ) : (
                        <span className={styles.priceNum}>Custom</span>
                      )}
                    </div>
                    {price && annual && (
                      <div className={styles.annualNote}>Billed annually · {formatPrice(price * 12)}/yr</div>
                    )}
                    <p className={styles.planDesc}>{plan.desc}</p>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map(f => (
                      <li key={f}><CheckCircle size={14} color={plan.color} /> {f}</li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                    className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'} ${styles.planCta}`}
                  >
                    {plan.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.faq}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              {[
                { q: 'Is there a free trial?', a: 'Yes — Starter plan includes a 30-day free trial, no credit card required.' },
                { q: 'Can I switch plans?', a: 'Yes, upgrade or downgrade any time. Billing is prorated automatically.' },
                { q: 'What accreditation bodies are supported?', a: 'NAAC and NBA are fully supported. Other standards can be configured on Enterprise.' },
                { q: "Is my institution's data secure?", a: 'Yes — all data is encrypted at rest and in transit. Enterprise can choose on-premise deployment.' },
              ].map(item => (
                <div key={item.q} className={styles.faqItem}>
                  <div className={styles.faqQ}>{item.q}</div>
                  <div className={styles.faqA}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
