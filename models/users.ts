import { BSON } from 'realm';

export type Users = {
  _id: string;
  email: string;
  role: string;
  auth_id: string;
  first_name: string;
  last_name: string;
};
