'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Search, Sparkles, RefreshCw, Download, Eye } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './documents.module.css';

const typeColors: Record<string, string> = {
  SSR: '#6366F1', IIQA: '#10B981', Research: '#3B82F6',
  DVV: '#F59E0B', Survey: '#8B5CF6', Bibliometric: '#EF4444',
};

// Mock documents data for demo
const mockDocuments = [
  {
    _id: '1',
    name: 'SSR_2024_Draft.pdf',
    type: 'SSR',
    size: '2.4 MB',
    status: 'analyzed',
    score: 78,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    gaps: ['Missing faculty qualification data', 'Incomplete research metrics'],
  },
  {
    _id: '2',
    name: 'IIQA_Self_Declaration.xlsx',
    type: 'IIQA',
    size: '1.8 MB',
    status: 'analyzed',
    score: 85,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    gaps: ['Need additional infrastructure details'],
  },
  {
    _id: '3',
    name: 'DVV_Report_2023.pdf',
    type: 'DVV',
    size: '3.2 MB',
    status: 'queued',
    score: 0,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    gaps: [],
  },
  {
    _id: '4',
    name: 'Research_Publications_2024.docx',
    type: 'Research',
    size: '956 KB',
    status: 'analyzed',
    score: 92,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    gaps: [],
  },
  {
    _id: '5',
    name: 'Student_Satisfaction_Survey.pdf',
    type: 'Survey',
    size: '1.1 MB',
    status: 'processing',
    score: 0,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    gaps: [],
  },
  {
    _id: '6',
    name: 'Bibliometric_Analysis.xlsx',
    type: 'Bibliometric',
    size: '2.7 MB',
    status: 'analyzed',
    score: 76,
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    gaps: ['Citation impact needs improvement'],
  },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>(mockDocuments);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  async function loadDocs() {
    // Mock loading - just set the mock data
    setDocs(mockDocuments);
    setLoading(false);
  }

  useEffect(() => { loadDocs(); }, []);

  async function analyzeDoc(docId: string) {
    setAnalyzing(docId);
    // Mock AI analysis - simulate AI processing with realistic results
    setTimeout(() => {
      const mockAnalysis = {
        score: Math.floor(70 + Math.random() * 25),
        gaps: [
          'Missing faculty qualification data in Section 2.3',
          'Incomplete research metrics for the last academic year',
          'Need additional infrastructure utilization statistics'
        ].slice(0, Math.floor(Math.random() * 3) + 1), // 1-3 random gaps
        recommendations: [
          'Consider updating faculty profiles with recent publications',
          'Include more detailed research collaboration metrics',
          'Add infrastructure usage analytics for better resource planning'
        ]
      };

      setDocs(prev => prev.map(doc =>
        doc._id === docId
          ? {
              ...doc,
              status: 'analyzed',
              score: mockAnalysis.score,
              gaps: mockAnalysis.gaps,
              recommendations: mockAnalysis.recommendations
            }
          : doc
      ));
      setAnalyzing(null);
    }, 2500); // Simulate AI processing time
  }

  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const stats = {
    total: docs.length,
    analyzed: docs.filter(d => d.status === 'analyzed').length,
    queued: docs.filter(d => d.status === 'queued').length,
    avgScore: docs.filter(d => d.score > 0).length
      ? Math.round(docs.filter(d => d.score > 0).reduce((s, d) => s + d.score, 0) / docs.filter(d => d.score > 0).length)
      : 0,
    gaps: docs.reduce((s, d) => s + (d.gaps?.length || 0), 0),
  };

  return (
    <div className={styles.page}>
      <DashboardTopbar title="Document Analysis" />

      <div className={styles.topRow}>
        {[
          { label: 'Total Documents', value: stats.total, color: '#6366F1' },
          { label: 'Analyzed', value: stats.analyzed, color: '#10B981' },
          { label: 'Pending Analysis', value: stats.queued, color: '#F59E0B' },
          { label: 'Gaps Found', value: stats.gaps, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color, fontSize: '2rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.main}>
        <div
          className={`glass-card ${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={() => setDragOver(false)}
        >
          <Upload size={32} color="var(--primary-light)" />
          <div className={styles.uploadTitle}>Upload Accreditation Documents</div>
          <div className={styles.uploadDesc}>Drag & drop SSR, IIQA, DVV, research papers, or surveys. Supports PDF, DOCX, XLSX</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Demo Mode: AI analysis uses mock responses</div>
          <button className="btn btn-primary">Browse Files</button>
        </div>

        <div className={`glass-card ${styles.docsCard}`}>
          <div className={styles.docsHeader}>
            <div className={styles.cardTitle}>Accreditation Documents ({docs.length})</div>
            <div className={styles.searchWrap}>
              <Search size={14} />
              <input className={styles.searchInput} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading && <div style={{ padding: 20, color: 'var(--text-muted)' }}>Loading documents...</div>}

          <div className={styles.docsList}>
            {filtered.map(doc => (
              <div key={doc._id} className={styles.docRow}>
                <div className={styles.docIcon} style={{ background: `${typeColors[doc.type] || '#6366F1'}15` }}>
                  <FileText size={16} color={typeColors[doc.type] || '#6366F1'} />
                </div>
                <div className={styles.docInfo}>
                  <div className={styles.docName}>{doc.name}</div>
                  <div className={styles.docMeta}>{doc.size} • {new Date(doc.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{doc.type}</span>

                {doc.status === 'analyzed' && <span className="badge badge-success"><CheckCircle size={10} /> Analyzed</span>}
                {doc.status === 'processing' && <span className="badge badge-warning"><Clock size={10} /> Processing</span>}
                {doc.status === 'failed' && <span className="badge badge-danger">Failed</span>}
                {doc.status === 'queued' && <span className="badge badge-info">Queued</span>}

                {doc.status === 'analyzed' && doc.score > 0 && (
                  <div className={styles.docScore} style={{ color: doc.score >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                    {doc.score}%
                  </div>
                )}
                {doc.gaps?.length > 0 && (
                  <div className={styles.docGaps}><AlertCircle size={12} /> {doc.gaps.length} gaps</div>
                )}
                {doc.status === 'queued' && (
                  <button className="btn btn-primary btn-sm" onClick={() => analyzeDoc(doc._id)} disabled={analyzing === doc._id}>
                    {analyzing === doc._id
                      ? <><RefreshCw size={13} className={styles.spin} /> Analyzing...</>
                      : <><Sparkles size={13} /> Analyze</>}
                  </button>
                )}
                {doc.status === 'analyzed' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDoc(doc)}>
                    <Sparkles size={13} /> View Report
                  </button>
                )}
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>No documents found.</div>
            )}
          </div>
        </div>
      </div>

      {selectedDoc && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDoc(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{selectedDoc.name}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDoc(null)}>✕</button>
            </div>
            <div className={styles.modalScore} style={{ color: selectedDoc.score >= 80 ? 'var(--success)' : 'var(--warning)' }}>
              Score: {selectedDoc.score}%
            </div>
            {selectedDoc.gaps?.length > 0 && (
              <div className={styles.modalGaps}>
                <div className={styles.modalSectionTitle}>Documentation Gaps:</div>
                {selectedDoc.gaps.map((g: string, i: number) => (
                  <div key={i} className={styles.modalGap}><AlertCircle size={12} color="var(--warning)" /> {g}</div>
                ))}
              </div>
            )}
            <div className={styles.modalReport}>
              <div className={styles.modalSectionTitle}>AI Analysis Report:</div>
              <p>{selectedDoc.aiReport}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
