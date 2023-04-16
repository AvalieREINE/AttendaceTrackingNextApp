import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

const realmSignup = async (email: string, password: string) => {
  // try {
  await app.emailPasswordAuth.registerUser({ email, password });
  const credentials = Credentials.emailPassword(email, password);
  const result = await app.logIn(credentials);
  if (result) {
    return result;
  }
  // } catch (error: any) {
  //   console.log(error.code, 'error registering user');
  //   throw Error(error.code);
  // }
};

const insertUserData = (
  email: string,
  firstName: string,
  lastName: string,
  role: string
) => {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = JSON.parse(req.body);
    const result = await realmSignup(email, password);
    if (result !== null && result?.accessToken) {
      console.log(result?.accessToken, 'register result');
      res.status(200).json({ result: result?.accessToken });
    } else {
      res.status(400).json({ result: 'Something went wrong' });
    }
    // res.status(201).json({ result: user });
  } catch (err: any) {
    console.error('Failed to log in', err);

    res.status(400).json({ result: err.code });
  }
}
