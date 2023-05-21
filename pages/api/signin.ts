import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password, remember } = JSON.parse(req.body);
    const credentials = Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    if (user) {
      if (remember) {
        res.status(200).json({
          result: user?.refreshToken,
          role:
            user.customData.role === 'admin'
              ? process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING
              : process.env.NEXT_PUBLIC_TEACHER_ROLE_STRING
        });
      } else {
        res.status(200).json({
          result: user?.accessToken,
          role:
            user.customData.role === 'admin'
              ? process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING
              : process.env.NEXT_PUBLIC_TEACHER_ROLE_STRING
        });
      }
    } else {
      res.status(400).json({ result: 'something went wrong' });
    }
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}
