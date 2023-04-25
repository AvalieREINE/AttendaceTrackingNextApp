import { students } from '@/MOCK';
import { studentListTableLabels } from '@/utils/commonUtils';
import React, { forwardRef, useState } from 'react';
import emailjs from '@emailjs/browser';
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
      <div className="w-full mt-12 ">
        <div className="justify-end flex mr-5"> {showToast && <Toast />}</div>

        <p className="text-xl pb-3 flex items-center">
          <i className="fa-solid fa-graduation-cap mr-3"></i>
          Class 1
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
              {students.map((student, idx) => (
                <tr>
                  <td className=" w-2/14 text-left py-3 px-4">
                    {student.name}
                  </td>
                  <td className=" w-2/14  text-left py-3 px-4">
                    {student.phone_number}
                  </td>
                  <td className="w-2/14   text-left py-3 px-4">
                    {student.email}
                  </td>
                  <td className="w-2/14   text-left py-3 px-4">
                    {student.program}
                  </td>
                  <td className=" w-2/14  text-left py-3 px-4">
                    {student.campus}
                  </td>
                  <td className=" w-3/14  text-left py-3 px-4">
                    {student.courses_enrolled.map((course, cIdx) => (
                      <p>{course}</p>
                    ))}
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
      </div>
    );
  };
  return (
    <div className="ml-4">
      <GetClasses />
    </div>
  );
};

export default ClassLists;
