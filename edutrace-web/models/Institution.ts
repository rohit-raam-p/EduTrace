import mongoose, { Schema, Document, models } from 'mongoose';

export interface IInstitution extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  accreditationTarget: string;
  code: string;
  overallScore: number;
  lastCalculated: Date;
  parameters: {
    iiqa: number; ssr: number; dvv: number; research: number;
    innovation: number; sdg: number; studentSatisfaction: number; bibliometric: number;
  };
  departments: {
    name: string;
    code: string;
    students: {
      name: string;
      rollNumber: string;
      marks: { subject: string; score: number; grade: string; }[];
      cgpa: number;
      year: number;
    }[];
    faculty: {
      name: string;
      designation: string;
      qualification: string;
      experience: number;
    }[];
  }[];
  research: {
    publications: { title: string; authors: string[]; journal: string; year: number; citations: number; }[];
    patents: { title: string; inventors: string[]; patentNumber: string; year: number; }[];
    projects: { title: string; funding: number; duration: string; status: string; }[];
  };
  infrastructure: {
    buildings: { name: string; area: number; facilities: string[]; }[];
    equipment: { name: string; quantity: number; value: number; }[];
    labs: { name: string; equipment: string[]; capacity: number; }[];
  };
  surveys: {
    studentSatisfaction: { question: string; averageRating: number; responses: number; }[];
    facultySatisfaction: { question: string; averageRating: number; responses: number; }[];
    stakeholderFeedback: { question: string; averageRating: number; responses: number; }[];
  };
}

const InstitutionSchema = new Schema<IInstitution>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: String,
  accreditationTarget: String,
  code: String,
  overallScore: { type: Number, default: 0 },
  lastCalculated: { type: Date, default: Date.now },
  parameters: {
    iiqa: { type: Number, default: 0 },
    ssr: { type: Number, default: 0 },
    dvv: { type: Number, default: 0 },
    research: { type: Number, default: 0 },
    innovation: { type: Number, default: 0 },
    sdg: { type: Number, default: 0 },
    studentSatisfaction: { type: Number, default: 0 },
    bibliometric: { type: Number, default: 0 },
  },
  departments: [{
    name: String,
    code: String,
    students: [{
      name: String,
      rollNumber: String,
      marks: [{ subject: String, score: Number, grade: String }],
      cgpa: Number,
      year: Number,
    }],
    faculty: [{
      name: String,
      designation: String,
      qualification: String,
      experience: Number,
    }],
  }],
  research: {
    publications: [{ title: String, authors: [String], journal: String, year: Number, citations: Number }],
    patents: [{ title: String, inventors: [String], patentNumber: String, year: Number }],
    projects: [{ title: String, funding: Number, duration: String, status: String }],
  },
  infrastructure: {
    buildings: [{ name: String, area: Number, facilities: [String] }],
    equipment: [{ name: String, quantity: Number, value: Number }],
    labs: [{ name: String, equipment: [String], capacity: Number }],
  },
  surveys: {
    studentSatisfaction: [{ question: String, averageRating: Number, responses: Number }],
    facultySatisfaction: [{ question: String, averageRating: Number, responses: Number }],
    stakeholderFeedback: [{ question: String, averageRating: Number, responses: Number }],
  },
}, { timestamps: true });

export default models.Institution || mongoose.model<IInstitution>('Institution', InstitutionSchema);
