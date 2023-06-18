import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    const email = app.currentUser?.profile.email ?? '';

    // The new password to use
    const password = data.password;
    // Additional arguments for the reset function
    // const args = [];
    await app.emailPasswordAuth.callResetPasswordFunction(
      { email, password }
      // ...args
    );
    res.status(200).json({ result: 'success' });
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}
