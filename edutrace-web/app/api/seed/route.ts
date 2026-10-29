import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';
import EduDocument from '@/models/EduDocument';
import SensorReading from '@/models/SensorReading';
import Institution from '@/models/Institution';
import Notification from '@/models/Notification';
import { SEED_DOCUMENTS } from '@/lib/documents';
import { STATIC_RECOMMENDATIONS } from '@/lib/documents/recommendations';
import Recommendation from '@/models/Recommendation';
import User from '@/models/User';

// Generate comprehensive institutional data
const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CS', faculty: 12, students: 120 },
  { name: 'Electronics & Communication', code: 'ECE', faculty: 10, students: 100 },
  { name: 'Mechanical Engineering', code: 'ME', faculty: 8, students: 80 },
  { name: 'Civil Engineering', code: 'CE', faculty: 6, students: 60 },
  { name: 'Electrical Engineering', code: 'EE', faculty: 7, students: 70 },
];

const generateStudentData = (department: any, count: number) => {
  const students = [];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Algorithms', 'Database Systems', 'Computer Networks'];

  for (let i = 1; i <= count; i++) {
    const marks = subjects.map(subject => ({
      subject,
      score: Math.floor(60 + Math.random() * 35), // 60-95 marks
      grade: Math.random() > 0.8 ? 'A+' : Math.random() > 0.6 ? 'A' : Math.random() > 0.4 ? 'B+' : 'B'
    }));

    const totalScore = marks.reduce((sum, m) => sum + m.score, 0);
    const cgpa = (totalScore / (subjects.length * 10)).toFixed(2); // Convert to CGPA scale

    students.push({
      name: `Student ${department.code} ${i}`,
      rollNumber: `${department.code}202${i.toString().padStart(3, '0')}`,
      marks,
      cgpa: parseFloat(cgpa),
      year: Math.floor(Math.random() * 4) + 1,
    });
  }
  return students;
};

const generateFacultyData = (department: any, count: number) => {
  const faculty = [];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const qualifications = ['PhD', 'M.Tech', 'M.E.', 'MCA'];

  for (let i = 1; i <= count; i++) {
    faculty.push({
      name: `Dr. Faculty ${department.code} ${i}`,
      designation: designations[Math.floor(Math.random() * designations.length)],
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      experience: Math.floor(3 + Math.random() * 25),
    });
  }
  return faculty;
};

const generateResearchData = () => ({
  publications: [
    {
      title: 'AI-Driven Smart Campus Management System',
      authors: ['Dr. Faculty CS 1', 'Dr. Faculty CS 2'],
      journal: 'IEEE Transactions on Industrial Informatics',
      year: 2024,
      citations: 15,
    },
    {
      title: 'IoT-Based Environmental Monitoring for Educational Institutions',
      authors: ['Dr. Faculty ECE 1', 'Dr. Faculty ME 1'],
      journal: 'Sensors Journal',
      year: 2024,
      citations: 8,
    },
    {
      title: 'Sustainable Infrastructure Development in Engineering Education',
      authors: ['Dr. Faculty CE 1'],
      journal: 'Construction and Building Materials',
      year: 2023,
      citations: 12,
    },
    {
      title: 'Digital Transformation in Higher Education: A Case Study',
      authors: ['Dr. Faculty EE 1', 'Dr. Faculty CS 3'],
      journal: 'Journal of Educational Technology',
      year: 2023,
      citations: 22,
    },
    {
      title: 'Machine Learning Applications in Civil Engineering',
      authors: ['Dr. Faculty CE 2', 'Dr. Faculty ME 2'],
      journal: 'Construction and Building Materials',
      year: 2024,
      citations: 18,
    },
  ],
  patents: [
    {
      title: 'Smart IoT Sensor Network for Campus Monitoring',
      inventors: ['Dr. Faculty ECE 1', 'Dr. Faculty CS 1'],
      patentNumber: 'US20240012345',
      year: 2024,
    },
    {
      title: 'AI-Based Student Performance Prediction System',
      inventors: ['Dr. Faculty CS 2', 'Dr. Faculty EE 1'],
      patentNumber: 'IN20230056789',
      year: 2023,
    },
  ],
  projects: [
    {
      title: 'Smart Campus IoT Implementation',
      funding: 2500000,
      duration: '2 years',
      status: 'Ongoing',
    },
    {
      title: 'AI-Driven Learning Analytics Platform',
      funding: 1800000,
      duration: '1.5 years',
      status: 'Completed',
    },
    {
      title: 'Sustainable Campus Infrastructure Project',
      funding: 3500000,
      duration: '3 years',
      status: 'Ongoing',
    },
  ],
});

const generateInfrastructureData = () => ({
  buildings: [
    { name: 'Main Academic Block', area: 5000, facilities: ['Classrooms', 'Labs', 'Library', 'Cafeteria'] },
    { name: 'Computer Science Lab', area: 800, facilities: ['Computers', 'Servers', 'Networking Equipment'] },
    { name: 'Electronics Lab', area: 600, facilities: ['Oscilloscopes', 'Power Supplies', 'Embedded Systems'] },
    { name: 'Mechanical Workshop', area: 1200, facilities: ['Lathes', 'Milling Machines', 'Welding Equipment'] },
    { name: 'Library', area: 2000, facilities: ['Books', 'Journals', 'Digital Resources', 'Study Areas'] },
  ],
  equipment: [
    { name: 'High-Performance Computers', quantity: 120, value: 50000 },
    { name: 'Laboratory Equipment', quantity: 50, value: 25000 },
    { name: 'Workshop Machinery', quantity: 30, value: 100000 },
    { name: 'Sports Equipment', quantity: 100, value: 5000 },
  ],
  labs: [
    { name: 'Computer Lab 1', equipment: ['Dell Optiplex', 'Projectors', 'UPS'], capacity: 60 },
    { name: 'Electronics Lab', equipment: ['Oscilloscopes', 'Function Generators', 'Multimeters'], capacity: 45 },
    { name: 'Mechanical Workshop', equipment: ['Lathes', 'Drilling Machines', 'Grinders'], capacity: 40 },
    { name: 'Physics Lab', equipment: ['Spectrometers', 'Microscopes', 'Centrifuges'], capacity: 35 },
  ],
});

const generateSurveyData = () => ({
  studentSatisfaction: [
    { question: 'Quality of teaching', averageRating: 4.2, responses: 450 },
    { question: 'Course content relevance', averageRating: 4.1, responses: 445 },
    { question: 'Laboratory facilities', averageRating: 4.0, responses: 440 },
    { question: 'Library resources', averageRating: 4.3, responses: 455 },
    { question: 'Sports facilities', averageRating: 3.8, responses: 420 },
    { question: 'Campus infrastructure', averageRating: 4.1, responses: 445 },
    { question: 'Administrative support', averageRating: 3.9, responses: 430 },
    { question: 'Overall satisfaction', averageRating: 4.2, responses: 450 },
  ],
  facultySatisfaction: [
    { question: 'Work environment', averageRating: 4.0, responses: 45 },
    { question: 'Research support', averageRating: 3.8, responses: 42 },
    { question: 'Administrative support', averageRating: 3.9, responses: 43 },
    { question: 'Professional development', averageRating: 4.1, responses: 46 },
    { question: 'Resource availability', averageRating: 3.7, responses: 41 },
  ],
  stakeholderFeedback: [
    { question: 'Industry relevance of curriculum', averageRating: 4.0, responses: 25 },
    { question: 'Graduate employability', averageRating: 4.2, responses: 26 },
    { question: 'Industry-academia collaboration', averageRating: 3.9, responses: 24 },
    { question: 'Overall institutional quality', averageRating: 4.1, responses: 25 },
  ],
});

const SENSOR_NODES = [
  { nodeId: 'ET-1001', location: 'Lab Block A', type: 'temperature', value: 23.4, unit: '°C', status: 'normal' },
  { nodeId: 'ET-1002', location: 'Main Hall', type: 'aqi', value: 42, unit: 'AQI', status: 'normal' },
  { nodeId: 'ET-1003', location: 'Lab Block B', type: 'temperature', value: 29.7, unit: '°C', status: 'warning' },
  { nodeId: 'ET-1004', location: 'Main Campus', type: 'power', value: 48.2, unit: 'kW', status: 'normal' },
  { nodeId: 'ET-1005', location: 'Library', type: 'motion', value: 80, unit: '%', status: 'normal' },
  { nodeId: 'ET-1006', location: 'Lab Block C', type: 'camera', value: 0, unit: '', status: 'offline' },
];

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  await connectDB();

  // Check if already seeded
  const existingDocs = await EduDocument.countDocuments({ userId: user.userId });
  if (existingDocs > 0) return NextResponse.json({ seeded: false, message: 'Already seeded' });

  try {
    // Generate comprehensive institutional data
    const researchData = generateResearchData();
    const infrastructureData = generateInfrastructureData();
    const surveyData = generateSurveyData();

    // Generate departments with students and faculty
    const departmentsWithData = DEPARTMENTS.map(dept => ({
      name: dept.name,
      code: dept.code,
      students: generateStudentData(dept, 10), // 10 students per department
      faculty: generateFacultyData(dept, dept.faculty),
    }));

    // Create comprehensive documents
    const comprehensiveDocs = [
      // Accreditation Documents
      {
        name: 'SSR_2024_Complete.pdf',
        type: 'SSR',
        content: `Self Study Report 2024 - ${user.institutionName}
        Executive Summary: ${user.institutionName} is committed to excellence in engineering education...

        Chapter 1: Curricular Aspects
        - Programs Offered: ${DEPARTMENTS.length} undergraduate programs
        - Curriculum Design: Industry-aligned with continuous updates
        - Academic Flexibility: Choice based credit system implemented

        Chapter 2: Teaching-Learning and Evaluation
        - Faculty Strength: ${departmentsWithData.reduce((sum, d) => sum + d.faculty.length, 0)} qualified faculty members
        - Teaching Methods: Blended learning approach
        - Student Assessment: Continuous evaluation system

        Chapter 3: Research, Innovations and Extension
        - Research Output: ${researchData.publications.length} publications in reputed journals
        - Innovation: ${researchData.patents.length} patents filed
        - Extension Activities: Community outreach programs

        Chapter 4: Infrastructure and Learning Resources
        - Campus Area: 25 acres with modern facilities
        - Laboratories: ${infrastructureData.labs.length} state-of-the-art labs
        - Library: ${infrastructureData.buildings.find(b => b.name === 'Library')?.area || 2000} sq.m area

        Chapter 5: Student Support and Progression
        - Student Strength: ${departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)} enrolled students
        - Support Services: Counseling, mentorship programs
        - Average CGPA: ${(departmentsWithData.reduce((sum, d) => sum + d.students.reduce((sSum, s) => sSum + s.cgpa, 0), 0) / departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)).toFixed(2)}

        Chapter 6: Governance, Leadership and Management
        - Leadership: Experienced academic leadership
        - Governance: Transparent decision-making processes
        - Quality Assurance: IQAC implementation

        Chapter 7: Institutional Values and Best Practices
        - Values: Academic excellence, innovation, inclusivity
        - Best Practices: Industry-academia collaboration, research culture`,
        size: '5.2 MB',
        score: 82,
        gaps: ['Minor documentation gaps in research commercialization', 'Need more industry collaborations'],
        aiReport: 'SSR analysis complete. Strong foundation with room for improvement in research commercialization.',
      },
      {
        name: 'IIQA_Submission_2024.pdf',
        type: 'IIQA',
        content: `Institutional Information for Quality Assessment (IIQA)

        Institution Name: ${user.institutionName}
        Address: Tech Park, Innovation City - 560001
        Website: www.${user.institutionName.toLowerCase().replace(/\s+/g, '')}.edu

        Basic Information:
        - Establishment Year: 2005
        - Institution Type: Private Self-Financed
        - Affiliation: Autonomous
        - Accreditation Status: NAAC Accredited (A Grade)

        Programs Offered:
        ${departmentsWithData.map(d => `- ${d.name} (${d.code}) - ${d.students.length} students, ${d.faculty.length} faculty`).join('\n')}

        Faculty Profile:
        - Total Faculty: ${departmentsWithData.reduce((sum, d) => sum + d.faculty.length, 0)}
        - PhD Holders: ${departmentsWithData.reduce((sum, d) => sum + d.faculty.filter(f => f.qualification === 'PhD').length, 0)}
        - Average Experience: ${Math.round(departmentsWithData.reduce((sum, d) => sum + d.faculty.reduce((fSum, f) => fSum + f.experience, 0), 0) / departmentsWithData.reduce((sum, d) => sum + d.faculty.length, 0))} years

        Student Profile:
        - Total Students: ${departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)}
        - Male: ${Math.round(departmentsWithData.reduce((sum, d) => sum + d.students.length, 0) * 0.6)}
        - Female: ${Math.round(departmentsWithData.reduce((sum, d) => sum + d.students.length, 0) * 0.4)}
        - Average CGPA: ${(departmentsWithData.reduce((sum, d) => sum + d.students.reduce((sSum, s) => sSum + s.cgpa, 0), 0) / departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)).toFixed(2)}

        Infrastructure:
        - Campus Area: 25 acres
        - Built-up Area: 15,000 sq.m
        - Buildings: ${infrastructureData.buildings.length}
        - Laboratories: ${infrastructureData.labs.length}

        Financial Information:
        - Annual Budget: ₹25 crores
        - Research Funding: ₹${researchData.projects.reduce((sum, p) => sum + p.funding, 0) / 100000} lakhs
        - Fee Structure: Competitive with merit scholarships`,
        size: '3.8 MB',
        score: 85,
        gaps: ['Need more female faculty representation'],
        aiReport: 'IIQA submission is comprehensive with strong institutional data.',
      },
      {
        name: 'DVV_Clarification_2024.pdf',
        type: 'DVV',
        content: `Data Verification and Validation (DVV) Clarifications

        Institution: ${user.institutionName}
        Assessment Period: 2023-2024
        Submission Date: January 15, 2025

        Query 1: Faculty Qualification Verification
        Response: All faculty members have verified qualifications.
        - PhD Holders: ${departmentsWithData.reduce((sum, d) => sum + d.faculty.filter(f => f.qualification === 'PhD').length, 0)}
        - Supporting Documents: Attached certificates for all faculty
        - Verification Status: Complete

        Query 2: Student Enrollment Data
        Response: Accurate enrollment data provided.
        - Total Students: ${departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)}
        - Department-wise breakup: ${departmentsWithData.map(d => `${d.name}: ${d.students.length}`).join(', ')}
        - Verification Status: Complete

        Query 3: Research Publication Claims
        Response: All publications are verified and indexed.
        - Total Publications: ${researchData.publications.length}
        - Indexed Journals: ${researchData.publications.filter(p => p.journal).length}
        - Citations: ${researchData.publications.reduce((sum, p) => sum + p.citations, 0)}
        - Verification Status: Complete

        Query 4: Infrastructure Availability
        Response: All infrastructure claims verified.
        - Buildings: ${infrastructureData.buildings.length} functional buildings
        - Laboratories: ${infrastructureData.labs.length} equipped labs
        - Equipment Items: ${infrastructureData.equipment.length} categories
        - Verification Status: Complete

        Query 5: Financial Data Accuracy
        Response: Financial statements audited and verified.
        - Annual Budget: ₹25 crores
        - Research Funding: ₹${researchData.projects.reduce((sum, p) => sum + p.funding, 0) / 100000} lakhs
        - Fee Collection: 98% collection rate
        - Verification Status: Complete`,
        size: '2.1 MB',
        score: 88,
        gaps: [],
        aiReport: 'DVV clarifications are comprehensive and address all queries adequately.',
      },
      // Research Documents
      {
        name: 'Research_Publications_2024.pdf',
        type: 'Research',
        content: `Research Publications Report 2024

        ${researchData.publications.map((pub, i) => `
        Publication ${i + 1}:
        Title: ${pub.title}
        Authors: ${pub.authors.join(', ')}
        Journal: ${pub.journal}
        Year: ${pub.year}
        Citations: ${pub.citations}
        `).join('\n')}

        Summary Statistics:
        - Total Publications: ${researchData.publications.length}
        - Patents: ${researchData.patents.length}
        - Research Projects: ${researchData.projects.length}
        - Total Citations: ${researchData.publications.reduce((sum, p) => sum + p.citations, 0)}
        - Average Citations per Paper: ${(researchData.publications.reduce((sum, p) => sum + p.citations, 0) / researchData.publications.length).toFixed(1)}

        Research Areas:
        - Artificial Intelligence & Machine Learning
        - IoT & Smart Systems
        - Sustainable Engineering
        - Digital Education
        - Civil & Infrastructure Engineering`,
        size: '4.2 MB',
        score: 86,
        gaps: ['Need more international collaborations'],
        aiReport: 'Strong research output with good citation impact. Focus on international publications.',
      },
      // Infrastructure Document
      {
        name: 'Infrastructure_Report_2024.pdf',
        type: 'Infrastructure',
        content: `Infrastructure and Facilities Report 2024

        Campus Overview:
        - Total Area: 25 acres
        - Built-up Area: 15,000 square meters
        - Green Coverage: 40%
        - Location: Tech Park, Innovation City

        Academic Buildings:
        ${infrastructureData.buildings.map(b => `- ${b.name}: ${b.area} sq.m, Facilities: ${b.facilities.join(', ')}`).join('\n')}

        Laboratory Facilities:
        ${infrastructureData.labs.map(l => `- ${l.name}: Capacity ${l.capacity}, Equipment: ${l.equipment.join(', ')}`).join('\n')}

        Equipment Inventory:
        ${infrastructureData.equipment.map(e => `- ${e.name}: ${e.quantity} units (₹${e.value.toLocaleString('en-IN')} each)`).join('\n')}

        Maintenance and Upkeep:
        - Annual Maintenance Budget: ₹2 crores
        - Regular inspections conducted quarterly
        - Green building certifications achieved
        - Energy-efficient lighting and HVAC systems`,
        size: '6.1 MB',
        score: 84,
        gaps: ['Need modernization of mechanical workshop'],
        aiReport: 'Excellent infrastructure with modern facilities. Minor upgrades needed in workshops.',
      },
      // Student Survey
      {
        name: 'Student_Satisfaction_Survey_2024.xlsx',
        type: 'Survey',
        content: `Student Satisfaction Survey Results 2024

        Survey Overview:
        - Total Responses: ${surveyData.studentSatisfaction.reduce((sum, q) => sum + q.responses, 0)}
        - Response Rate: 95%
        - Survey Period: September-December 2024

        Department-wise Participation:
        ${departmentsWithData.map(d => `${d.name}: ${d.students.length} students`).join('\n')}

        Average Ratings (1-5 Scale):
        ${surveyData.studentSatisfaction.map(q => `${q.question}: ${q.averageRating}/5 (${q.responses} responses)`).join('\n')}

        Key Findings:
        - Overall Satisfaction: ${surveyData.studentSatisfaction.find(q => q.question === 'Overall satisfaction')?.averageRating || 4.2}/5
        - Highest Rated: ${surveyData.studentSatisfaction.reduce((max, q) => q.averageRating > max.averageRating ? q : max).question} (${surveyData.studentSatisfaction.reduce((max, q) => q.averageRating > max.averageRating ? q : max).averageRating}/5)
        - Areas for Improvement: ${surveyData.studentSatisfaction.reduce((min, q) => q.averageRating < min.averageRating ? q : min).question} (${surveyData.studentSatisfaction.reduce((min, q) => q.averageRating < min.averageRating ? q : min).averageRating}/5)
        - Positive Feedback: Quality teaching and campus infrastructure`,
        size: '2.8 MB',
        score: 83,
        gaps: ['Sports facilities need improvement'],
        aiReport: 'Good student satisfaction levels with strong performance in academics and infrastructure.',
      },
    ];

    // Seed all documents
    await EduDocument.insertMany(comprehensiveDocs.map(d => ({
      userId: user.userId,
      name: d.name,
      type: d.type,
      content: d.content,
      status: 'analyzed',
      size: d.size,
      score: d.score,
      gaps: d.gaps,
      aiReport: d.aiReport,
      isAgentic: true,
    })));

    // Seed sensor readings
    await SensorReading.insertMany(SENSOR_NODES.map(s => ({
      userId: user.userId,
      ...s,
      timestamp: new Date()
    })));

    // Seed institution with comprehensive data
    await Institution.findOneAndUpdate(
      { userId: user.userId },
      {
        userId: user.userId,
        name: user.institutionName,
        type: 'Engineering College',
        accreditationTarget: 'NAAC A++',
        code: 'ET-' + Date.now(),
        overallScore: 74,
        parameters: {
          iiqa: 82,
          ssr: 71,
          dvv: 68,
          research: 79,
          innovation: 65,
          sdg: 72,
          studentSatisfaction: 80,
          bibliometric: 74
        },
        departments: departmentsWithData,
        research: researchData,
        infrastructure: infrastructureData,
        surveys: surveyData,
      },
      { upsert: true }
    );

    // Seed recommendations
    await Recommendation.insertMany(STATIC_RECOMMENDATIONS.map(r => ({
      ...r,
      userId: user.userId,
      resolved: false
    })));

    // Create notification
    await Notification.create({
      userId: user.userId,
      type: 'success',
      title: 'Database Seeded Successfully',
      body: `Generated ${comprehensiveDocs.length} documents, ${departmentsWithData.reduce((sum, d) => sum + d.students.length, 0)} student records, ${departmentsWithData.reduce((sum, d) => sum + d.faculty.length, 0)} faculty profiles, and ${researchData.publications.length} research publications.`,
    });

    return NextResponse.json({
      seeded: true,
      message: 'Comprehensive institutional data generated and stored',
      stats: {
        documents: comprehensiveDocs.length,
        departments: departmentsWithData.length,
        students: departmentsWithData.reduce((sum, d) => sum + d.students.length, 0),
        faculty: departmentsWithData.reduce((sum, d) => sum + d.faculty.length, 0),
        research: researchData.publications.length,
        patents: researchData.patents.length,
        projects: researchData.projects.length,
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
