import { NextApiRequest, NextApiResponse } from 'next';
import Realm from 'realm';

const app = Realm.App.getApp(process.env.MONGO_APP_ID ?? '');
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code } = JSON.parse(req.body);
    const result = await app.currentUser?.callFunction('get_admin_code', {
      code: code
    });

    res.json({ result });
  } catch (err) {
    console.error('Failed to log in', err);

    res.status(400).json({ result: err });
  }
}
