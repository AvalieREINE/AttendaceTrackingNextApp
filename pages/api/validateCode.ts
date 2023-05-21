import { NextApiRequest, NextApiResponse } from 'next';
import Realm from 'realm';

const app = Realm.App.getApp(process.env.MONGO_APP_ID ?? '');
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code } = JSON.parse(req.body);

    const res = await fetch(
      'https://ap-southeast-2.aws.data.mongodb-api.com/app/application-0-wqyin/endpoint/getCode',
      {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          code: code
        })
      }
    );
    // const result = await app.currentUser?.callFunction('get_admin_code', {
    //   code: code
    // });

    // const result = await res.json();
    await res.json();
    // console.log(result, 'result');
  } catch (err) {
    console.error('Failed to log in', err);

    res.status(400).json({ result: err });
  }
}
