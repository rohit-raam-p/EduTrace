import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const DOC_TEMPLATES: Record<string, { name: string; type: string }[]> = {
  SSR: [
    { name: 'SSR_Chapter1_Curricular_Aspects.pdf', type: 'SSR' },
    { name: 'SSR_Chapter2_Teaching_Learning.pdf', type: 'SSR' },
    { name: 'SSR_Chapter3_Research_Innovation.pdf', type: 'SSR' },
  ],
  IIQA: [{ name: 'IIQA_Submission_2024.pdf', type: 'IIQA' }],
  DVV: [{ name: 'DVV_Clarification_2024.pdf', type: 'DVV' }],
  Research: [{ name: 'Research_Publications_2024.pdf', type: 'Research' }],
  Survey: [{ name: 'Student_Satisfaction_Survey_2024.xlsx', type: 'Survey' }],
  Bibliometric: [{ name: 'Bibliometric_Report_2024.pdf', type: 'Bibliometric' }],
};

export async function generateDocumentContent(
  type: string,
  institutionName: string
): Promise<string> {
  const prompts: Record<string, string> = {
    SSR: `Generate a realistic Self Study Report (SSR) section for NAAC accreditation for "${institutionName}". Include faculty details, curriculum, research output, student data, and infrastructure. Make it detailed and realistic with actual numbers.`,
    IIQA: `Generate a realistic Institutional Information for Quality Assessment (IIQA) document for NAAC accreditation for "${institutionName}". Include institutional profile, programs offered, faculty count, student enrollment, and infrastructure details.`,
    DVV: `Generate a realistic DVV (Data Verification and Validation) clarification document for NAAC accreditation for "${institutionName}". Include responses to common DVV queries about faculty qualifications, research output, and student data.`,
    Research: `Generate a realistic research publications report for "${institutionName}" for 2024. Include journal papers, conference papers, patents, and funded projects with realistic author names and publication details.`,
    Survey: `Generate a realistic student satisfaction survey analysis report for "${institutionName}". Include satisfaction scores across teaching, infrastructure, library, sports, and overall experience with statistical analysis.`,
    Bibliometric: `Generate a realistic bibliometric analysis report for "${institutionName}". Include h-index, citation counts, Scopus/Web of Science publications, and research impact metrics.`,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert in NAAC/NBA accreditation documentation for Indian educational institutions. Generate realistic, detailed documents.' },
      { role: 'user', content: prompts[type] || prompts.SSR },
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content || '';
}

export async function analyzeDocument(
  content: string,
  type: string,
  institutionName: string
): Promise<{ score: number; gaps: string[]; report: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a NAAC accreditation expert. Analyze documents and return JSON with score (0-100), gaps (array of strings), and report (detailed analysis string).',
      },
      {
        role: 'user',
        content: `Analyze this ${type} document for "${institutionName}" for NAAC accreditation readiness:\n\n${content.slice(0, 2000)}\n\nReturn JSON: { "score": number, "gaps": string[], "report": string }`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 800,
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      score: Math.min(100, Math.max(0, result.score || 70)),
      gaps: result.gaps || [],
      report: result.report || 'Analysis complete.',
    };
  } catch {
    return { score: 70, gaps: ['Unable to parse analysis'], report: 'Analysis complete.' };
  }
}

export async function generateRecommendations(
  institutionName: string,
  parameters: Record<string, number>,
  gaps: string[]
): Promise<Array<{ priority: string; title: string; why: string; actions: string[]; impact: string; category: string; color: string }>> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a NAAC accreditation consultant. Generate actionable improvement recommendations as JSON array.',
      },
      {
        role: 'user',
        content: `Generate 5 improvement recommendations for "${institutionName}" based on:
Parameters: ${JSON.stringify(parameters)}
Document gaps: ${gaps.join(', ')}

Return JSON array: [{ "priority": "High|Medium|Low", "title": string, "why": string, "actions": string[], "impact": string, "category": string, "color": "#hexcolor" }]`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1200,
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.recommendations || result || [];
  } catch {
    return [];
  }
}
