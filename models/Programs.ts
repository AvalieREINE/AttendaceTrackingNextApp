import { BSON } from 'realm';
import { Students } from './students';

export type ProgramOffering = {
  quarter: string;
  year: number;
  teachers: {
    teacher_id: string;
    students?: Students[];
  }[];
};

export type Programs = {
  _id: BSON.ObjectId;
  program_id: string;
  program_name: string;
  program_offerings: ProgramOffering[];
};

export type ProgramForTeacher = {
  id: BSON.ObjectId;
  program_id: string;
  program_name: string;
  offering: {
    quarter: string;
    year: string;
    students?: Students[];
  };
};
