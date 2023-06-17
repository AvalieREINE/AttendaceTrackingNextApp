import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { Credentials } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    // const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    // const collection = mongo?.db('attendancetracking').collection('attendance');

    // const result = await collection?.insertOne({
    //   program_data_id: data.programId,
    //   attendance_result: data.attendanceData,
    //   session_start_date: data.sessionDate,
    //   is_session_one: data.isSessionOne,
    //   teacher_id: data.teacherId
    // });
    // The user's email address
    const email = data.email;
    // The new password to use
    const password = data.password;
    // Additional arguments for the reset function
    // const args = [];
    await app.emailPasswordAuth.callResetPasswordFunction(
      { email, password }
      // ...args
    );
    res.status(200);
    // if (result) {
    //   res.json({ result });
    // } else {
    //   res.status(400).json({ result: 'something went wrong' });
    // }
  } catch (err: any) {
    res.status(400).json({ result: err.code });
  }
}
