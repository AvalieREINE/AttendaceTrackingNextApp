import { BSON } from 'realm';

export type Attendance = {
  _id: BSON.ObjectId;
  program_data_id: BSON.ObjectId;
  attendance_result: {
    student_id: string;
    present: boolean;
  }[];
  session_start_date: Date;
};
