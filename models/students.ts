import { BSON } from 'realm';

export type Students = {
  _id: string;
  student_id: string;
  campus: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: number;
  email: string;
  is_international_student: boolean;
};
