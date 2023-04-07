import { students } from '@/MOCK';
import { studentListTableLabels } from '@/utils/commonUtils';
import React, { forwardRef } from 'react';

const ClassLists = forwardRef(function classLists({
  clickRef
}: {
  clickRef: any;
}) {
  const GetClasses = () => {
    return (
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> Class 1
        </p>
        <div className="bg-white overflow-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                {studentListTableLabels.map((label, i) => (
                  <>
                    {i === studentListTableLabels.length - 1 ? (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <div ref={clickRef} className="ml-4">
      <GetClasses />
    </div>
  );
});

export default ClassLists;
