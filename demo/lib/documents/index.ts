import { SSR_DOCUMENTS } from './ssr';
import { IIQA_DOCUMENTS } from './iiqa';
import { DVV_DOCUMENTS, RESEARCH_DOCUMENTS, SURVEY_DOCUMENTS, BIBLIOMETRIC_DOCUMENTS } from './others';

export const SEED_DOCUMENTS: Record<string, any[]> = {
  SSR: SSR_DOCUMENTS,
  IIQA: IIQA_DOCUMENTS,
  DVV: DVV_DOCUMENTS,
  Research: RESEARCH_DOCUMENTS,
  Survey: SURVEY_DOCUMENTS,
  Bibliometric: BIBLIOMETRIC_DOCUMENTS,
};

// Rule-based scorer — no API needed
export function scoreDocument(type: string, content: string): { score: number; gaps: string[]; report: string } {
  const doc = SEED_DOCUMENTS[type]?.[0];
  if (doc) return { score: doc.score, gaps: doc.gaps, report: doc.aiReport };

  // Fallback rule-based scoring for real uploaded docs
  const wordCount = content.split(' ').length;
  const hasNumbers = /\d+/.test(content);
  const hasPercentages = /%/.test(content);
  const hasTables = /\|/.test(content) || /table/i.test(content);

  let score = 50;
  if (wordCount > 500) score += 10;
  if (wordCount > 1000) score += 10;
  if (hasNumbers) score += 10;
  if (hasPercentages) score += 5;
  if (hasTables) score += 5;
  score = Math.min(95, score);

  const gaps: string[] = [];
  if (wordCount < 300) gaps.push('Document content too brief — needs more detail');
  if (!hasNumbers) gaps.push('No quantitative data found — add metrics and statistics');
  if (!hasPercentages) gaps.push('No percentage data — add performance indicators');

  return { score, gaps, report: `Document analyzed. Word count: ${wordCount}. Score: ${score}%. ${gaps.length} gaps identified.` };
}
