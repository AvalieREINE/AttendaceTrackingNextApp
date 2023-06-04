import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { BSON, Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    const collection = mongo?.db('attendancetracking').collection('programs');
    const result = await collection?.deleteOne({
      _id: new BSON.ObjectID(data.programId)
    });
    if (result) {
      res.json({ result });
    } else {
      res.status(400).json({ result: 'something went wrong' });
    }
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}
