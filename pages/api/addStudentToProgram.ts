import { ProgramOffering } from '@/models/Programs';
import { Students } from '@/models/students';
import { NextApiRequest, NextApiResponse } from 'next';
import Realm, { BSON } from 'realm';

const app = new Realm.App({ id: process.env.MONGO_APP_ID ?? '' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    const collection = mongo?.db('attendancetracking').collection('programs');
    // const programResult = await collection?.findOne({
    //   _id: new BSON.ObjectID(data.programId)
    // });
    // const copy = { ...programResult };
    // copy.program_offerings.map((c: ProgramOffering) => {
    //   if (c.year === Number(data.year) && c.quarter === data.quarter) {
    //     c.teachers.map((t: { teacher_id: string; students?: Students[] }) => {
    //       if (t.teacher_id === data.teacherId) {
    //         if (t.students) t.students?.push(data.studentData);
    //         else {
    //           t.students = [data.studentData];
    //         }
    //       }
    //     });
    //   }
    // });
    // const result = await collection?.updateOne(
    //   {
    //     _id: new BSON.ObjectID(data.programId)
    //   },
    //   copy
    // );
    const result = await collection?.updateOne(
      {
        _id: new BSON.ObjectID(data.programId)
        // 'program_offerings.year': Number(data.year),
        // 'program_offerings.quarter': data.quarter
      },
      {
        $addToSet: {
          'program_offerings.$[offering].teachers.$[teacher].students':
            data.studentData
        }
      },
      {
        arrayFilters: [
          {
            $and: [
              {
                'offering.year': {
                  $eq: Number(data.year)
                },
                'offering.quarter': {
                  $eq: data.quarter
                }
              }
            ]
          },
          {
            'teacher.teacher_id': {
              $eq: data.teacherId
            }
          }
        ]
      }
    );

    if (result) {
      res.json({ result });
    } else {
      res.status(400).json({ result: 'something went wrong' });
    }
  } catch (err: any) {
    res.status(400).json({ result: err.code });
    console.log(err, 'err ');
  }
}
