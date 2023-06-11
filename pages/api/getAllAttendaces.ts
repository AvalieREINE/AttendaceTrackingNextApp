import { Programs } from '@/models/Programs';
import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    const collection = mongo?.db('attendancetracking').collection('attendance');
    const result = (await collection?.find({})) as Programs[];

    if (result) {
      res.json({ result });
    } else {
      res.status(400).json({ result: 'something went wrong' });
    }
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}
