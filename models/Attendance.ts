import { BSON } from 'realm';

export type Attendance = {
  _id: string;
  program_data_id: string;
  attendance_result: {
    student_id: string;
    present: boolean;
  }[];
  session_start_date: Date;
  is_session_one: boolean;
  teacher_id: string;
};
