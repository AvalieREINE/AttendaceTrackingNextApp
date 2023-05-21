import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';
const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

const realmSignup = async (email: string, password: string) => {
  await app.emailPasswordAuth.registerUser({ email, password });
  const credentials = Credentials.emailPassword(email, password);
  const result = await app.logIn(credentials);
  if (result) {
    return result;
  }
};

const removeUser = async () => {
  if (app.currentUser) {
    await app.deleteUser(app?.currentUser);
  }
};

const insertUserData = async (
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  authId: string
) => {
  let result = null;
  try {
    const db = app.currentUser
      ?.mongoClient('mongodb-atlas')
      ?.db('attendancetracking')
      ?.collection('users');
    result = await db?.insertOne({
      email,
      firstName,
      lastName,
      role,
      auth_id: authId
    });
    return result;
  } catch (error) {
    removeUser();
    return result;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password, firstName, lastName, role, remember } = JSON.parse(
      req.body
    );
    const result = await realmSignup(email, password);
    const insertResult = await insertUserData(
      email,
      firstName,
      lastName,
      role,
      result?.id as string
    );
    if (insertResult !== null && result?.accessToken) {
      if (remember) {
        res.status(200).json({
          result: result?.refreshToken,
          role:
            role === 'admin'
              ? process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING
              : process.env.NEXT_PUBLIC_TEACHER_ROLE_STRING
        });
      } else {
        res.status(200).json({
          result: result?.accessToken,
          role:
            role === 'admin'
              ? process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING
              : process.env.NEXT_PUBLIC_TEACHER_ROLE_STRING
        });
      }
    } else {
      removeUser();
      res.status(400).json({ result: 'Something went wrong' });
    }
  } catch (err: any) {
    console.error('Failed to log in', err);
    removeUser();
    res.status(400).json({ result: err.code });
  }
}
