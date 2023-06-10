import { Attendance } from '@/models/Attendance';
import { ProgramForTeacher, Programs } from '@/models/Programs';
import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useReducer, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import DatePicker, { setDefaultLocale } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
type FormData = {
  years: number[];
  quarters: string[];
  numberOfOfferings: number;
  programId: string;
  programName: string;
  teachersData: any[];
  studentsData: any[];
  selectedStudents: any[];
  selectedTeachers: any[];
  selectedOfferings: any[];
  programData: any[];
  filteredProgramData: any[];
  selectedProgram?: ProgramForTeacher;
  showDeleteModal: boolean;
  confirmSelected: boolean;
  selectedSessionDate: Date | null;
  attendanceData?: { student_id: string; present: boolean }[];
  filteredStudentsData: any[];
  selectedStudentData?: any;
  showStudentList: boolean;
  selectedStudent: any;
};

function AttendanceForm() {
  const initialState: FormState = {
    email: '',
    password: ''
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      data.selectedProgram?.offering.students?.length ===
      data.attendanceData?.length
    ) {
      const insertData = {
        programId: data.selectedProgram?.id,
        attendanceData: data.attendanceData,
        sessionDate: data.selectedSessionDate
      };

      const response = await fetch('/api/addAttendance', {
        method: 'POST',
        body: JSON.stringify(insertData)
      });
      const result = await response.json();

      if (response.status !== 200) {
        window.alert(result.result);
      } else {
        window.alert('success');
      }
      updateData({
        selectedProgram: undefined,
        attendanceData: undefined,
        confirmSelected: false,
        selectedSessionDate: null
      });
    } else {
      window.alert('Please mark attendance for all students');
    }
  };
  const cookies = parseCookies();

  const [data, updateData] = useReducer(
    (prev: FormData, next: Partial<FormData>) => {
      return { ...prev, ...next };
    },
    {
      years: [],
      quarters: [],
      numberOfOfferings: 1,
      teachersData: [],
      selectedStudents: [],
      selectedTeachers: [],
      selectedOfferings: [],
      programData: [],
      filteredProgramData: [],
      selectedProgram: undefined,
      confirmSelected: false,
      programId: '',
      programName: '',
      showDeleteModal: false,
      selectedSessionDate: null,
      attendanceData: undefined,
      studentsData: [],
      filteredStudentsData: [],
      selectedStudentData: undefined,
      showStudentList: false,
      selectedStudent: undefined
    }
  );
  const [loading, setloading] = useState(true);

  const addStudentToProgram = async () => {
    // student id, program id, teacher id , q, y
    if (data.selectedStudent && data.selectedProgram) {
      const reqData = {
        studentData: data.selectedStudent,
        programId: data.selectedProgram.id,
        teacherId: cookies.id,
        quarter: data.selectedProgram.offering.quarter,
        year: data.selectedProgram.offering.year
      };

      const response = await fetch('/api/addStudentToProgram', {
        method: 'POST',
        body: JSON.stringify(reqData)
      });
      const result = await response.json();

      if (response.status !== 200) {
        window.alert(result.result);
      } else {
        window.alert('success');
      }
      updateData({
        selectedStudent: undefined
      });
      setloading(true);
    }
  };

  const getInitialData = useCallback(async () => {
    const proRes = await fetch('/api/getProgramsForTeacher', {
      method: 'POST',
      body: JSON.stringify({ teacherId: cookies.id })
    });
    const proResult = await proRes.json();
    if (proResult.result as Programs[]) {
      const programArr = [] as ProgramForTeacher[];
      proResult.result.map((p: Programs) => {
        p.program_offerings.map((offer) => {
          const currentOfferBelongsTeacher = offer.teachers.filter(
            (t) => t.teacher_id === cookies.id
          )[0];
          if (currentOfferBelongsTeacher) {
            programArr.push({
              id: p._id,
              program_id: p.program_id,
              program_name: p.program_name,
              offering: {
                quarter: offer.quarter,
                year: offer.year.toString(),
                students: currentOfferBelongsTeacher.students
              }
            });
          }
        });
      });

      updateData({
        programData: programArr,
        filteredProgramData: programArr
      });
    }

    const re = await fetch('/api/getStudents', {
      method: 'GET'
    });
    const reResult = await re.json();
    if (reResult.result) {
      updateData({
        studentsData: reResult.result,
        filteredStudentsData: reResult.result
      });
    }

    const response = await fetch('/api/getTeachers', {
      method: 'GET'
    });
    const result = await response.json();
    if (result.result) {
      updateData({
        teachersData: [
          {
            _id: 0,
            first_name:
              'I will add this data later - select this if you want to leave it empty',
            last_name: ''
          },
          ...result.result
        ]
      });
    }
    const studentRes = await fetch('/api/getStudents', {
      method: 'GET'
    });
    const studentResult = await studentRes.json();
    if (studentResult.result) {
      updateData({
        studentsData: [
          {
            _id: 0,
            first_name:
              'I will add this data later - select this if you want to leave it empty',
            last_name: ''
          },
          ...studentResult.result
        ]
      });
    }

    const currentYear = new Date().getFullYear();

    updateData({
      years: [currentYear - 1, currentYear, currentYear + 1, currentYear + 2],
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      selectedOfferings: [{ quarter: 'Q1', year: currentYear - 1 }]
    });
  }, []);
  useEffect(() => {
    if (loading) {
      getInitialData();
      setloading(false);
    }
  }, [loading]);
  if (loading) {
    return (
      <div role="status" className="flex justify-center  mt-20">
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin   fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  const AddProgramForm = () => {
    return (
      <div className="flex bg-blue-100   items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Mark Attendance for {data.selectedProgram?.program_id}{' '}
              {data.selectedProgram?.program_name}{' '}
              {data.selectedProgram?.offering.quarter}{' '}
              {data.selectedProgram?.offering.year}
            </h2>
          </div>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col p-2">
              <div className="mb-4 ">
                <p className="text-lg mb-2">Session start time</p>
                <DatePicker
                  required
                  className="rounded-lg border-0 w-full"
                  showYearDropdown
                  scrollableMonthYearDropdown
                  selected={data.selectedSessionDate}
                  onChange={(d) => {
                    updateData({ selectedSessionDate: d });
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>
              {data.selectedProgram?.offering.students?.map((stu) => {
                return (
                  <div className="bg-white rounded-lg p-5 mb-5  flex-row flex items-center">
                    <div className="w-2/5">
                      <div>
                        Name: {stu.first_name} {stu.last_name}
                      </div>
                      <div>Student Id: {stu.student_id}</div>
                    </div>
                    <div className="w-3/5">
                      <button
                        type="button"
                        onClick={() => {
                          if (data.attendanceData) {
                            const dataIndx = data.attendanceData.findIndex(
                              (a) => a.student_id === stu.student_id
                            );
                            if (dataIndx > -1) {
                              const copy = [...data.attendanceData];
                              copy[dataIndx].present = true;
                              updateData({ attendanceData: copy });
                            } else {
                              updateData({
                                attendanceData: [
                                  ...data.attendanceData,
                                  {
                                    student_id: stu.student_id,
                                    present: true
                                  }
                                ]
                              });
                            }
                          } else {
                            updateData({
                              attendanceData: [
                                { student_id: stu.student_id, present: true }
                              ]
                            });
                          }
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mr-2 mt-1 "
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (data.attendanceData) {
                            const dataIndx = data.attendanceData.findIndex(
                              (a) => a.student_id === stu.student_id
                            );
                            if (dataIndx > -1) {
                              const copy = [...data.attendanceData];
                              copy[dataIndx].present = false;
                              updateData({ attendanceData: copy });
                            } else {
                              updateData({
                                attendanceData: [
                                  ...data.attendanceData,
                                  {
                                    student_id: stu.student_id,
                                    present: false
                                  }
                                ]
                              });
                            }
                          } else {
                            updateData({
                              attendanceData: [
                                { student_id: stu.student_id, present: false }
                              ]
                            });
                          }
                        }}
                        className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
                      >
                        Absent
                      </button>
                    </div>
                    <div className=" ml-5">
                      {data.attendanceData?.map((d) => {
                        if (d.student_id === stu.student_id) {
                          return (
                            <>
                              {d.present ? (
                                <i className="fa-solid fa-check"></i>
                              ) : (
                                <i
                                  className="fa-solid fa-xmark"
                                  // style={{ color: '#d11f66' }}
                                ></i>
                              )}
                            </>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };
  return (
    <div className="h-full bg-sky-50">
      <div className=" ml-40 mr-40 flex-row  items-center justify-center ">
        <p className="  mb-2 text-sm font-medium text-gray-900  mt-5 ">
          Select or search a program to mark attendance
        </p>
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500  "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>

          <input
            type="text"
            id="simple-search"
            onChange={(e) => {
              const result = data.programData.filter(
                (s) =>
                  s.program_id
                    .toLowerCase()
                    ?.includes(e.target.value.toLowerCase()) ||
                  s.program_name
                    .toLowerCase()
                    ?.includes(e.target.value.toLowerCase())
              );
              updateData({ filteredProgramData: result });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-4/5 mb-2  pl-10 p-2.5  "
            placeholder="Search"
          />
        </div>
        <div className="bg-white rounded-md p-2.5 w-4/5 mb-5 max-h-20 overflow-auto">
          {data.filteredProgramData?.map((student, idx) => {
            return (
              <a
                className="font-medium hover:underline hover:cursor-pointer block"
                onClick={() => {
                  updateData({ selectedProgram: student });
                }}
              >
                {`Program Id: ${student.program_id}`}&nbsp; &nbsp;{' '}
                {`Program Name: ${student.program_name} `}&nbsp; &nbsp;{' '}
                {`Program Quarter: ${student.offering.quarter} `}
              </a>
            );
          })}
        </div>
        {data.selectedProgram ? (
          <div>
            <p>Selected program: </p>
            <p className="mb-2">
              Program Id : {data.selectedProgram?.program_id} Program Name:{' '}
              {data.selectedProgram?.program_name} Program Quarter:{' '}
              {data.selectedProgram?.offering.quarter}
            </p>
            <button
              type="button"
              onClick={() => {
                const currentData = structuredClone(data.selectedProgram);
                const newData = data.filteredProgramData.filter(
                  (f) => f.id === currentData?.id
                )[0];
                updateData({
                  selectedProgram: newData,
                  confirmSelected: true
                });
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Mark attendance
            </button>
            <button
              type="button"
              onClick={() => {
                updateData({
                  showStudentList: true,
                  confirmSelected: false
                });
              }}
              className="text-white bg-fuchsia-600 hover:bg-fuchsia-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Add existing students to this program
            </button>
            <button
              type="button"
              onClick={() => {
                updateData({
                  selectedProgram: undefined,
                  confirmSelected: false
                });
              }}
              className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>
      {data.showStudentList ? (
        <div className="ml-40 mr-40 flex-row  items-center justify-center">
          <p className="  mb-2 text-sm font-medium text-gray-900  mt-5 ">
            Select or search a student to add to this program
          </p>
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500  "
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>

            <input
              type="text"
              id="simple-search"
              onChange={(e) => {
                const result = data.studentsData.filter(
                  (s) =>
                    s.first_name?.includes(e.target.value) ||
                    s.last_name?.includes(e.target.value) ||
                    s.student_id.toString().includes(e.target.value)
                );
                updateData({ filteredStudentsData: result });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-4/5 mb-2  pl-10 p-2.5  "
              placeholder="Search"
            />
          </div>
          <div className="bg-white rounded-md p-2.5 w-4/5 mb-5 max-h-20 overflow-auto">
            {data.filteredStudentsData?.map((student, idx) => {
              return (
                <a
                  className="font-medium hover:underline hover:cursor-pointer block"
                  onClick={() => {
                    updateData({ selectedStudent: student });
                  }}
                >
                  {`id: ${student.student_id}`}&nbsp; &nbsp;{' '}
                  {`Name: ${student.first_name} ${student.last_name}`}
                </a>
              );
            })}
          </div>
          {data.selectedStudent ? (
            <div>
              <p>Selected student: </p>

              <p className="mb-2">
                id :{data.selectedStudent?.student_id} Name:{' '}
                {data.selectedStudent?.first_name}{' '}
                {data.selectedStudent?.last_name}
              </p>
              <button
                type="button"
                onClick={() => {
                  addStudentToProgram();
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              >
                Add to program
              </button>

              <button
                type="button"
                onClick={() => {
                  updateData({
                    selectedStudent: undefined,
                    showStudentList: false
                  });
                }}
                className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {data.selectedProgram && data.confirmSelected ? AddProgramForm() : null}
    </div>
  );
}

export default AttendanceForm;
