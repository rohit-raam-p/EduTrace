export const DVV_DOCUMENTS = [
  {
    name: 'DVV_Clarification_2024.pdf',
    type: 'DVV',
    size: '2.9 MB',
    score: 68,
    gaps: [
      'Faculty PhD certificates not uploaded for 12 faculty members',
      'Research funding utilization certificates missing for 4 projects',
      'Student satisfaction survey raw data not attached',
      'Placement data third-party verification pending',
    ],
    aiReport: `DVV clarification document addresses 34 queries raised by NAAC peer team. Major gaps identified: 12 faculty members have PhD qualifications listed but supporting certificates are not uploaded to the portal — this is a critical gap affecting Criterion 3 score. Research funding utilization certificates are missing for 4 DST-funded projects totaling ₹67 lakhs. Student satisfaction survey raw data (individual responses) is not attached, only summary statistics provided. Placement data for 2022-23 batch lacks third-party verification certificate. These 4 gaps are high priority and must be resolved before DVV submission deadline. Remaining 30 queries are adequately addressed with supporting documents.`,
    content: `DVV CLARIFICATION DOCUMENT
NAAC 3rd Cycle — Data Verification and Validation
Institution: National Institute of Technology

CLARIFICATION RESPONSES:

Query 1 (Criterion 1.1.2): Curriculum revision evidence
Response: BoS meeting minutes attached for 2021, 2022, 2023. Revised syllabi uploaded for 16/20 programs. Pending: BBA, MCA, M.Sc Chemistry, B.Com (revision in progress, expected March 2025).

Query 2 (Criterion 2.4.1): Faculty qualification data
Response: Total faculty 143. Ph.D holders: 112.
ISSUE: PhD certificates uploaded for 100/112 faculty. 12 faculty certificates pending upload.
- Dr. R. Sharma (CS) — certificate requested from university
- Prof. K. Patel (ECE) — original misplaced, duplicate applied
- [10 more faculty — certificates in process]

Query 3 (Criterion 3.1.1): Research funding details
Response: 23 funded projects, total ₹2,34,67,000.
Utilization certificates submitted for 19/23 projects.
PENDING: 4 DST projects (₹67,40,000) — certificates awaited from accounts department.

Query 4 (Criterion 3.3.1): Publication data verification
Response: 18 Scopus publications verified. DOI links provided for all 18. Web of Science: 12 publications verified.

Query 5 (Criterion 5.3.1): Student satisfaction survey
Response: Survey conducted for 2,847 students. Summary report attached.
ISSUE: Raw data (individual responses) not attached — only aggregate statistics provided.

Query 6 (Criterion 5.2.1): Placement data
Response: 2023-24 placement — 847 students placed out of 974 eligible (87%).
2022-23 placement — 812 students placed out of 956 eligible (85%).
ISSUE: 2022-23 data lacks third-party verification certificate.

Queries 7-34: [All adequately addressed with supporting documents]`,
  },
];

export const RESEARCH_DOCUMENTS = [
  {
    name: 'Research_Publications_2024.pdf',
    type: 'Research',
    size: '4.4 MB',
    score: 74,
    gaps: [
      'International collaboration publications below benchmark',
      'Research output from Commerce and Chemistry departments very low',
    ],
    aiReport: `Research publications report covers 2021-24 period. Total Scopus publications: 47 (18 in 2023-24, 16 in 2022-23, 13 in 2021-22). The h-index of 14 is reasonable for an institution of this size. CS and ECE departments contribute 68% of all publications. Commerce and Chemistry departments have only 2 publications combined over 3 years — significantly below expectations. International collaboration is present in only 4 papers (8.5%) against a benchmark of 20%. Funded research output is strong with 23 projects. Patent portfolio shows 3 granted patents. Overall research trajectory is positive but needs broader departmental participation and more international collaborations.`,
    content: `RESEARCH PUBLICATIONS AND OUTPUT REPORT 2021-2024
Institution: National Institute of Technology

PUBLICATION SUMMARY:
Total Scopus Publications (2021-24): 47
- 2023-24: 18 publications
- 2022-23: 16 publications
- 2021-22: 13 publications

Web of Science Publications: 28
Total Citations: 847
h-index (Institutional): 14
i10-index: 23

DEPARTMENT-WISE PUBLICATIONS (2023-24):
1. Computer Science: 6 papers
   - IEEE Transactions on Neural Networks (IF: 14.2)
   - Expert Systems with Applications (IF: 8.5)
   - Applied Soft Computing (IF: 8.7)
   - Pattern Recognition Letters (IF: 4.1)
   - Computers & Security (IF: 5.6)
   - Journal of Information Security (IF: 3.2)

2. Electronics & Communication: 4 papers
   - IEEE Sensors Journal (IF: 4.3)
   - Signal Processing (IF: 4.4)
   - AEU International Journal (IF: 3.2)
   - Microelectronics Journal (IF: 2.1)

3. Mechanical Engineering: 3 papers
   - Journal of Manufacturing Processes (IF: 6.2)
   - Materials Today (IF: 3.4)
   - Engineering Failure Analysis (IF: 4.4)

4. Civil Engineering: 2 papers
   - Construction and Building Materials (IF: 7.4)
   - Journal of Building Engineering (IF: 6.4)

5. MBA: 1 paper, MCA: 2 papers
6. Chemistry: 1 paper, Commerce: 0 papers (CRITICAL GAP)

INTERNATIONAL COLLABORATIONS:
Papers with international co-authors: 4/18 (22%)
- MIT collaboration: 1 paper
- University of Melbourne: 1 paper
- TU Berlin: 1 paper
- NUS Singapore: 1 paper

PATENTS:
Filed: 8 | Granted: 3 | Published: 5
1. "IoT-based Smart Campus Monitoring System" — Granted (2023)
2. "AI-powered Document Analysis Framework" — Granted (2024)
3. "Energy-efficient VLSI Design Methodology" — Granted (2022)

FUNDED PROJECTS:
Total: 23 projects | Funding: ₹2,34,67,000
Major funders: DST (₹89L), AICTE (₹67L), DBT (₹34L), Industry (₹44L)`,
  },
];

export const SURVEY_DOCUMENTS = [
  {
    name: 'Student_Satisfaction_Survey_2024.xlsx',
    type: 'Survey',
    size: '0.9 MB',
    score: 80,
    gaps: [
      'Raw individual response data not attached (only summary)',
      'Alumni survey response rate below 30%',
    ],
    aiReport: `Student satisfaction survey conducted for 2023-24 academic year with 2,847 student responses (94% participation rate). Overall satisfaction score is 3.84/5.0. Teaching quality scores highest at 4.1/5.0. Infrastructure satisfaction is 3.7/5.0 with library and sports facilities rated lower. Canteen and hostel facilities score 3.2/5.0 — lowest among all parameters. Alumni survey had only 312 responses out of 1,847 alumni contacted (16.9% response rate — below 30% benchmark). Employer satisfaction survey shows 4.2/5.0 for graduate competency. Key improvement areas: hostel facilities, sports infrastructure, and canteen quality. Raw individual response data is not attached which is a DVV requirement.`,
    content: `STUDENT SATISFACTION SURVEY ANALYSIS REPORT 2023-24
Institution: National Institute of Technology

SURVEY METHODOLOGY:
Survey period: January - February 2024
Total students: 3,024
Responses received: 2,847 (94.1% participation)
Survey platform: Google Forms + LMS
Anonymity: Ensured

OVERALL SATISFACTION: 3.84 / 5.0

PARAMETER-WISE SCORES:
1. Teaching Quality: 4.1/5.0
   - Faculty knowledge: 4.3/5.0
   - Teaching methodology: 4.0/5.0
   - Availability for doubt clearing: 3.9/5.0
   - Fairness in evaluation: 4.1/5.0

2. Curriculum: 3.9/5.0
   - Relevance to industry: 3.8/5.0
   - Elective choices: 3.7/5.0
   - Practical exposure: 4.1/5.0

3. Infrastructure: 3.7/5.0
   - Classrooms: 4.0/5.0
   - Laboratories: 3.9/5.0
   - Library: 3.6/5.0
   - Sports facilities: 3.2/5.0
   - Internet connectivity: 3.8/5.0

4. Student Support: 3.8/5.0
   - Placement support: 4.2/5.0
   - Scholarship assistance: 3.6/5.0
   - Grievance redressal: 3.4/5.0
   - Mentoring: 3.9/5.0

5. Hostel & Amenities: 3.2/5.0
   - Hostel facilities: 3.1/5.0
   - Canteen quality: 3.0/5.0
   - Medical facilities: 3.4/5.0

ALUMNI SURVEY:
Alumni contacted: 1,847
Responses received: 312 (16.9%) — BELOW 30% BENCHMARK
Overall alumni satisfaction: 4.1/5.0
Would recommend institution: 87%

EMPLOYER SURVEY:
Employers contacted: 124
Responses: 48 (38.7%)
Graduate competency rating: 4.2/5.0
Technical skills: 4.3/5.0
Soft skills: 3.9/5.0

NOTE: Raw individual response data not attached — summary statistics only.`,
  },
];

export const BIBLIOMETRIC_DOCUMENTS = [
  {
    name: 'Bibliometric_Report_2024.pdf',
    type: 'Bibliometric',
    size: '2.1 MB',
    score: 72,
    gaps: [
      'h-index below A-grade benchmark of 20',
      'Citation count needs improvement — average 18 citations per paper',
    ],
    aiReport: `Bibliometric analysis covers the period 2019-2024. Institutional h-index of 14 is below the NAAC A-grade benchmark of 20 for institutions of this category. Total citations: 847 across 47 Scopus papers — average 18 citations per paper. Top cited paper has 124 citations (CS department, 2021). Scopus author profiles exist for 67 of 143 faculty (47%) — remaining faculty need to create profiles. Web of Science coverage is 28 papers. The citation growth trend is positive: 2021 (187 citations), 2022 (234 citations), 2023 (289 citations), 2024 (137 citations, ongoing year). Journal quality is good with 34% papers in Q1/Q2 journals. Improvement needed in h-index and overall citation count.`,
    content: `BIBLIOMETRIC ANALYSIS REPORT 2019-2024
Institution: National Institute of Technology
Data Source: Scopus, Web of Science

INSTITUTIONAL METRICS:
h-index: 14 (Benchmark for NAAC A: 20+)
i10-index: 23
Total publications (Scopus): 47
Total citations: 847
Average citations per paper: 18.0
Self-citation rate: 12%

CITATION TREND:
2019-20: 89 citations (12 papers)
2020-21: 134 citations (14 papers)
2021-22: 187 citations (13 papers)
2022-23: 234 citations (16 papers)
2023-24: 289 citations (18 papers, year ongoing: 137)

TOP CITED PAPERS:
1. "Deep Learning for Medical Image Segmentation" — 124 citations (CS, 2021)
2. "IoT Security Framework for Smart Cities" — 98 citations (ECE, 2020)
3. "Sustainable Construction Materials" — 67 citations (Civil, 2021)
4. "Optimization Algorithms for VLSI" — 54 citations (ECE, 2022)
5. "Machine Learning in Supply Chain" — 43 citations (MBA, 2022)

JOURNAL QUALITY DISTRIBUTION:
Q1 journals: 12 papers (25.5%)
Q2 journals: 16 papers (34%)
Q3 journals: 11 papers (23.4%)
Q4 journals: 8 papers (17%)

FACULTY SCOPUS PROFILES:
Faculty with Scopus profiles: 67/143 (46.9%)
Faculty needing profile creation: 76

COLLABORATION NETWORK:
National collaborations: 12 institutions
International collaborations: 4 institutions
Industry co-authored papers: 6

IMPACT FACTOR SUMMARY:
Average IF of journals: 5.2
Highest IF paper: IEEE TNNLS (IF: 14.2)
Papers in journals with IF > 5: 18 (38.3%)`,
  },
];
