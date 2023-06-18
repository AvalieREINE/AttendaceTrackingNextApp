import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    const email = data.email;
    // The new password to use
    const password = generatePassword();
    // Additional arguments for the reset function
    // const args = [];
    await app.emailPasswordAuth.callResetPasswordFunction(
      { email, password }
      // ...args
    );
    res.json({ password });
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}

function generatePassword() {
  var length = 12,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
