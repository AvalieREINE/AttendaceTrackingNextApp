import { students } from '@/MOCK';
import { studentListTableLabels } from '@/utils/commonUtils';
import React, { useReducer, useCallback, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Students } from '@/models/students';
import { ProgramForTeacher, Programs } from '@/models/Programs';
import { parseCookies } from 'nookies';
import { Users } from '@/models/users';

type FormData = {
  programList: Programs[];
  currentRole: string;
  teacherList?: Users[];
};
const ClassLists = () => {
  const [showToast, setShowToast] = useState(false);
  const sendEmailReminder = (studentInfo: any) => {
    const content = {
      to_name: studentInfo.name,
      to_email: studentInfo.email,
      message: 'You have missed your class'
    };
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? '',
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID ?? '',
        content,
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY ?? ''
      )
      .then(
        (result) => {
          console.log(result.text);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const [data, updateData] = useReducer(
    (prev: FormData, next: Partial<FormData>) => {
      return { ...prev, ...next };
    },
    {
      programList: [],
      currentRole: 'teacher'
    }
  );
  const [loading, setloading] = useState(true);
  const cookies = parseCookies();

  const getInitialData = useCallback(async () => {
    const role = cookies.role;
    let result;
    if (role === process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING) {
      updateData({ currentRole: 'admin' });
      const response = await fetch('/api/getAllPrograms', {
        method: 'GET'
      });
      result = await response.json();
      const teacherResult = await fetch('/api/getTeachers', {
        method: 'GET'
      });
      const teacherData = await teacherResult.json();
      if (teacherData.result) {
        updateData({ teacherList: teacherData.result });
      }
    } else {
      const response = await fetch('/api/getProgramsForTeacher', {
        method: 'POST',
        body: JSON.stringify({ teacherId: cookies.id })
      });
      result = await response.json();
    }

    if (result.result) {
      updateData({
        programList: result.result
      });
    }
  }, []);
  useEffect(() => {
    if (loading) {
      getInitialData();
      setloading(false);
    }
  }, [loading]);
  const Toast = () => (
    <div
      id="toast-simple"
      className="flex  items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow "
      role="alert"
    >
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-blue-600  "
        focusable="false"
        data-prefix="fas"
        data-icon="paper-plane"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
        ></path>
      </svg>
      <div className="pl-4 text-md font-semibold">Email sent successfully.</div>
    </div>
  );
  const GetClasses = () => {
    return (
      <div className="w-full mt-12 mb-20">
        <div className="justify-end flex mr-5"> {showToast && <Toast />}</div>
        {data.programList?.map((program) => {
          return program.program_offerings.map((offering) => {
            const currentStudentList = offering.teachers.filter(
              (f) => f.teacher_id === cookies.id
            )[0];

            if (currentStudentList) {
              return (
                <>
                  <p className="text-xl pb-3 flex items-center mt-5">
                    <i className="fa-solid fa-graduation-cap mr-3"></i>
                    {program.program_id} {program.program_name}{' '}
                    {offering.quarter} {offering.year}
                  </p>
                  <div className="bg-white overflow-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          {studentListTableLabels.map((label, i) => (
                            <>
                              {i === studentListTableLabels.length - 2 ? (
                                <th
                                  key={i}
                                  className="w-32 text-left py-3 px-4 uppercase font-semibold text-sm"
                                >
                                  {label}
                                </th>
                              ) : (
                                <th
                                  key={i}
                                  className="text-left py-3 px-4 uppercase font-semibold text-sm"
                                >
                                  {label}
                                </th>
                              )}
                            </>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-gray-700  ">
                        {currentStudentList?.students?.map((student, idx) => (
                          <tr>
                            <td className=" w-2/14 text-left py-3 px-4">
                              {student.student_id}
                            </td>
                            <td className=" w-2/14 text-left py-3 px-4">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className=" w-2/14  text-left py-3 px-4">
                              {student.phone_number}
                            </td>
                            <td className="w-2/14   text-left py-3 px-4">
                              {student.email}
                            </td>

                            <td className=" w-2/14  text-left py-3 px-4">
                              {student.campus}
                            </td>

                            <td className=" w-1/14  text-left py-3 px-4">
                              {student.is_international_student ? 'Yes' : 'No'}
                            </td>
                            <td className=" w-1/14  text-left py-3 px-4">
                              <button
                                onClick={() => sendEmailReminder(student)}
                                className="hover:rounded-full rounded-lg bg-indigo-700 text-white p-2"
                              >
                                Send reminder
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!currentStudentList.students && (
                          <div className=" flex">
                            No students added to this program yet.
                          </div>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            } else {
              return null;
            }
          });
        })}
      </div>
    );
  };

  const GetClassesForAdmin = () => {
    return (
      <div className="w-full mt-12 mb-20">
        <div className="justify-end flex mr-5  "> {showToast && <Toast />}</div>
        {data.programList?.map((program) => {
          return program.program_offerings.map((offering) => {
            return offering.teachers.map((teacher) => {
              const currentTeacher = data.teacherList?.find(
                (t) => t._id === teacher.teacher_id
              );

              return (
                <>
                  <p className="text-xl pb-3 flex items-center mt-5">
                    <i className="fa-solid fa-graduation-cap mr-3"></i>
                    {program.program_id} {program.program_name}{' '}
                    {offering.quarter} {offering.year} Program Teacher:{' '}
                    {`${currentTeacher?.first_name} ${currentTeacher?.last_name}`}
                  </p>
                  <div className="bg-white overflow-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          {studentListTableLabels.map((label, i) => (
                            <>
                              {i === studentListTableLabels.length - 2 ? (
                                <th
                                  key={i}
                                  className="w-32 text-left py-3 px-4 uppercase font-semibold text-sm"
                                >
                                  {label}
                                </th>
                              ) : (
                                <th
                                  key={i}
                                  className="text-left py-3 px-4 uppercase font-semibold text-sm"
                                >
                                  {label}
                                </th>
                              )}
                            </>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-gray-700  ">
                        {teacher?.students?.map((student, idx) => (
                          <tr>
                            <td className=" w-2/14 text-left py-3 px-4">
                              {student.student_id}
                            </td>
                            <td className=" w-2/14 text-left py-3 px-4">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className=" w-2/14  text-left py-3 px-4">
                              {student.phone_number}
                            </td>
                            <td className="w-2/14   text-left py-3 px-4">
                              {student.email}
                            </td>

                            <td className=" w-2/14  text-left py-3 px-4">
                              {student.campus}
                            </td>

                            <td className=" w-1/14  text-left py-3 px-4">
                              {student.is_international_student ? 'Yes' : 'No'}
                            </td>
                            <td className=" w-1/14  text-left py-3 px-4">
                              <button
                                onClick={() => sendEmailReminder(student)}
                                className="hover:rounded-full rounded-lg bg-indigo-700 text-white p-2"
                              >
                                Send reminder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            });
          });
        })}
      </div>
    );
  };
  return (
    <div className="ml-4  ">
      {data.currentRole === 'admin' ? <GetClassesForAdmin /> : <GetClasses />}
    </div>
  );
};

export default ClassLists;
