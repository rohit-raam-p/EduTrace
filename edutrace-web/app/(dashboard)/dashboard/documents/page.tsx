'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Search, Sparkles, RefreshCw, Download, Eye } from 'lucide-react';
import DashboardTopbar from '@/components/DashboardTopbar';
import styles from './documents.module.css';

const typeColors: Record<string, string> = {
  SSR: '#6366F1', IIQA: '#10B981', Research: '#3B82F6',
  DVV: '#F59E0B', Survey: '#8B5CF6', Bibliometric: '#EF4444',
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('SSR');
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadDocs() {
    const res = await fetch('/api/documents');
    const data = await res.json();
    setDocs(data.documents || []);
    setLoading(false);
  }

  useEffect(() => { loadDocs(); }, []);

  async function analyzeDoc(docId: string) {
    setAnalyzing(docId);
    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId }),
      });
      if (res.ok) await loadDocs();
    } finally {
      setAnalyzing(null);
    }
  }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);
      formData.append('isAgentic', 'false');

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await loadDocs();
      } else {
        alert('Upload failed');
      }
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }

  function downloadFile(docId: string) {
    window.open(`/api/documents/download?id=${docId}`, '_blank');
  }

  function viewFile(doc: any) {
    setViewingDoc(doc);
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
          onDrop={handleDrop}
        >
          <Upload size={32} color="var(--primary-light)" />
          <div className={styles.uploadTitle}>Upload Accreditation Documents</div>
          <div className={styles.uploadDesc}>Drag & drop SSR, IIQA, DVV, research papers, or surveys. Supports PDF, DOCX, XLSX</div>

          <div style={{ marginBottom: '1rem' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="btn btn-ghost"
              style={{ marginRight: '0.5rem' }}
            >
              <option value="SSR">SSR</option>
              <option value="IIQA">IIQA</option>
              <option value="DVV">DVV</option>
              <option value="Research">Research</option>
              <option value="Survey">Survey</option>
              <option value="Bibliometric">Bibliometric</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.doc,.xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Browse Files'}
          </button>
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

                {doc.fileUrl && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => viewFile(doc)}>
                      <Eye size={13} /> View
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => downloadFile(doc._id)}>
                      <Download size={13} /> Download
                    </button>
                  </div>
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
      {viewingDoc && (
        <div className={styles.modalOverlay} onClick={() => setViewingDoc(null)}>
          <div className={styles.previewModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{viewingDoc.name}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingDoc(null)}>✕</button>
            </div>
            <div className={styles.previewContainer}>
              <iframe 
                src={`/api/documents/download?id=${viewingDoc._id}`} 
                title={viewingDoc.name}
                className={styles.fileViewer}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
