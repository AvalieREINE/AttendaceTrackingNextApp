import {
  ProgramForTeacher,
  ProgramOffering,
  Programs
} from '@/models/Programs';
import { Students } from '@/models/students';
import { Users } from '@/models/users';
import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';
import React, { useReducer, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';

type Offering = {
  quarter: string;
  year: number | string;
  selectedTeachers?: Users[];
  selectedStudents?: {
    teacherId: string;
    studentList?: Students[];
  }[];
};

type FormData = {
  years: number[];
  quarters: string[];
  numberOfOfferings: number;
  programId: string;
  programName: string;
  teachersData: Users[];
  studentsData: Students[];
  selectedStudents: any[];
  selectedTeachers: any[];
  selectedOfferings: Offering[];
  fillEditData: boolean;
  programData: Programs[];
  filteredProgramData: Programs[];
  selectedProgram?: Programs;
  showDeleteModal: boolean;
};

function AddProgramForm() {
  const router = useRouter();
  const initialState: FormState = {
    email: '',
    password: ''
  };
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, initialState);
  const [formValidityData, setFormValidityData] = useReducer(
    formValidityReducer,
    initialValidityState
  );
  const [showSubmitError, setShowSubmitError] = useState({
    show: false,
    message: ''
  });
  const currentYear = new Date().getFullYear();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const offeringData: ProgramOffering[] = [];
    data.selectedOfferings.map((offer) => {
      const teachersData: { teacher_id: string; students?: Students[] }[] = [];
      offer.selectedTeachers?.map((teach: Users) => {
        const currentStudentData = offer.selectedStudents?.filter(
          (st) => st.teacherId === teach._id
        )[0];

        teachersData.push({
          teacher_id: teach._id,
          students: currentStudentData?.studentList
        });
      });

      offeringData.push({
        quarter: offer.quarter,
        year: Number(offer.year),
        teachers: teachersData
      });
    });

    const insertData = {
      program_id: data.programId,
      program_name: data.programName,
      program_offerings: offeringData
    };

    const response = await fetch('/api/addProgram', {
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
      numberOfOfferings: 1,
      selectedProgram: undefined,
      programId: '',
      programName: '',
      selectedStudents: [],
      selectedTeachers: [],
      selectedOfferings: [{ quarter: 'Q1', year: currentYear - 1 }],
      showDeleteModal: false
    });
    setloading(true);
  };
  const [data, updateData] = useReducer(
    (prev: FormData, next: Partial<FormData>) => {
      return { ...prev, ...next };
    },
    {
      years: [],
      quarters: [],
      numberOfOfferings: 1,
      teachersData: [],
      studentsData: [],
      selectedStudents: [],
      selectedTeachers: [],
      selectedOfferings: [],
      programData: [],
      filteredProgramData: [],
      selectedProgram: undefined,
      programId: '',
      programName: '',
      showDeleteModal: false,
      fillEditData: false
    }
  );
  const [loading, setloading] = useState(true);

  const getInitialData = useCallback(async () => {
    const proRes = await fetch('/api/getAllPrograms', {
      method: 'GET'
    });
    const proResult = await proRes.json();
    if (proResult.result) {
      updateData({
        programData: proResult.result,
        filteredProgramData: proResult.result
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

  const deleteProgram = async () => {
    updateData({ showDeleteModal: false });
    if (data.selectedProgram) {
      const response = await fetch('/api/deleteProgram', {
        method: 'POST',
        body: JSON.stringify({
          programId: data.selectedProgram._id
        })
      });
      const result = await response.json();

      if (response.status !== 200) {
        window.alert(result.result);
      } else {
        window.alert('success');

        updateData({
          fillEditData: false,
          numberOfOfferings: 1,
          selectedOfferings: [{ quarter: 'Q1', year: currentYear - 1 }],
          programId: '',
          programName: ''
        });
        setloading(true);
      }
    } else {
      window.alert('no student selected');
    }
  };
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
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {data.fillEditData ? 'Edit Program' : 'Add Program'}
            </h2>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900  "
                >
                  Program Id
                </label>
                <input
                  value={data.programId}
                  onChange={(e) => {
                    updateData({ programId: e.target.value });
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="i.g. IT5001"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900  "
                >
                  Offerings
                </label>
                {data.selectedOfferings.map((quarterAndYear, idx) => {
                  return (
                    <div className="flex flex-row" key={idx}>
                      <select
                        onChange={(e) => {
                          const copy = [...data.selectedOfferings];
                          copy[idx] = {
                            quarter: e.target.value,
                            year: copy[idx].year
                          };
                          updateData({ selectedOfferings: copy });
                        }}
                        value={quarterAndYear?.quarter}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                      >
                        {data.quarters.map((quarter: string, i: number) => {
                          return (
                            <option value={quarter} key={i}>
                              {quarter}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        onChange={(e) => {
                          const copy = [...data.selectedOfferings];
                          copy[idx] = {
                            quarter: copy[idx].quarter,
                            year: e.target.value
                          };
                          updateData({ selectedOfferings: copy });
                        }}
                        value={quarterAndYear?.year}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                      >
                        {data.years.map((year: number, i: number) => {
                          return (
                            <option value={year} key={i}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                      <button
                        onClick={() => {
                          if (idx === 0) {
                            const prevData = data.selectedOfferings[0];
                            updateData({
                              numberOfOfferings: data.numberOfOfferings + 1,
                              selectedOfferings: [
                                ...data.selectedOfferings,
                                {
                                  quarter: prevData.quarter,
                                  year: prevData.year
                                }
                              ]
                            });
                          } else {
                            const copy = [...data.selectedOfferings];
                            copy.pop();
                            updateData({
                              numberOfOfferings: data.numberOfOfferings - 1,
                              selectedOfferings: copy
                            });
                          }
                        }}
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 mt-2 mb-2 ml-2    "
                      >
                        {idx === 0 ? '+' : '- '}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900  "
              >
                Program Name
              </label>
              <input
                onChange={(e) => {
                  updateData({ programName: e.target.value });
                }}
                value={data.programName}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="i.g. Testing and Deployment of Web Application"
                required
              />
            </div>
            <label className="block mb-2 text-lg font-medium text-gray-900 text-center ">
              Please select teachers for each offering, and for each selected
              teacher, please select their students. You can also choose to do
              this later.
            </label>
            {data.selectedOfferings.map((offerings, index) => {
              return (
                <div className="mb-6">
                  <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                  <label className="block mb-2 text-sm font-medium text-gray-900  ">
                    Selected Teachers for {offerings.quarter} {offerings.year}
                  </label>
                  <div className="flex flex-row">
                    {offerings.selectedTeachers?.map((t, i) => {
                      return (
                        <>
                          <div
                            className="mr-2 bg-slate-300 rounded px-2 mb-2"
                            key={i}
                          >
                            {t?.first_name} {t?.last_name}
                            <button
                              onClick={() => {
                                const copy = [...data.selectedOfferings];
                                const newArr = copy[
                                  index
                                ]?.selectedTeachers?.filter(
                                  (s) => s._id !== t._id
                                );
                                copy[index].selectedTeachers = newArr;
                                updateData({ selectedOfferings: copy });
                              }}
                            >
                              <i className="fa-solid fa-xmark ml-2 mt-2 mb-2"></i>
                            </button>
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value !== '0') {
                        const isAdded = data.selectedOfferings[
                          index
                        ].selectedTeachers?.filter(
                          (s) => s._id === e.target.value
                        )[0];
                        if (!isAdded) {
                          const currentData = data.teachersData.filter(
                            (t) => t._id === e.target.value
                          )[0];
                          const copy = [...data.selectedOfferings];
                          const selectedTeachers =
                            copy[index]?.selectedTeachers;
                          if (
                            selectedTeachers &&
                            selectedTeachers?.length > 0
                          ) {
                            copy[index].selectedTeachers?.push(currentData);
                          } else {
                            copy[index].selectedTeachers = [currentData];
                          }
                          updateData({
                            selectedOfferings: copy
                          });
                        }
                      }
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                  >
                    {data.teachersData?.map((teacher: any, idx: number) => {
                      return (
                        <>
                          <option value={teacher._id} key={idx}>
                            {`${teacher.first_name} ${teacher.last_name}`}
                          </option>
                        </>
                      );
                    })}
                  </select>
                  {offerings.selectedTeachers?.map((t) => {
                    const currentStudentList =
                      offerings.selectedStudents?.filter(
                        (s) => s.teacherId === t._id
                      )[0];
                    return (
                      <div className="mb-6 mt-3">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900  "
                        >
                          Selected Students for {t.first_name} {t.last_name}
                        </label>
                        <div className="flex flex-row">
                          {currentStudentList?.studentList?.map((stu, i) => {
                            return (
                              <>
                                <div
                                  className="mr-2 bg-slate-300 rounded px-2 mb-2"
                                  key={i}
                                >
                                  {stu?.first_name} {stu?.last_name}
                                  <button
                                    onClick={() => {
                                      const copy = [...data.selectedOfferings];
                                      const currentList = copy[
                                        index
                                      ].selectedStudents?.filter(
                                        (se) => se.teacherId === t._id
                                      )[0];
                                      const currentStudentIdx =
                                        currentList?.studentList?.findIndex(
                                          (stud) => stud._id === stu._id
                                        );

                                      if (
                                        currentStudentIdx !== undefined &&
                                        currentStudentIdx > -1
                                      ) {
                                        currentList?.studentList?.splice(
                                          currentStudentIdx,
                                          1
                                        );
                                        updateData({ selectedOfferings: copy });
                                      }
                                    }}
                                  >
                                    <i className="fa-solid fa-xmark ml-2 mt-2 mb-2"></i>
                                  </button>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <select
                          onChange={(e) => {
                            if (e.target.value !== '0') {
                              const copy = [...data.selectedOfferings];
                              const current = copy[
                                index
                              ].selectedStudents?.filter(
                                (s) => s.teacherId === t._id
                              )[0];
                              const studentData = data.studentsData.filter(
                                (s) => s._id === e.target.value
                              )[0];
                              if (current) {
                                const studentAdded =
                                  current.studentList?.filter(
                                    (s) => s._id === e.target.value
                                  )[0];

                                if (!studentAdded) {
                                  current.studentList?.push(studentData);
                                  updateData({
                                    selectedOfferings: copy
                                  });
                                }
                              } else {
                                if (copy[index].selectedStudents) {
                                  copy[index].selectedStudents?.push({
                                    teacherId: t._id,
                                    studentList: [studentData]
                                  });
                                  updateData({
                                    selectedOfferings: copy
                                  });
                                } else {
                                  copy[index].selectedStudents = [
                                    {
                                      teacherId: t._id,
                                      studentList: [studentData]
                                    }
                                  ];
                                  updateData({
                                    selectedOfferings: copy
                                  });
                                }
                              }
                            }
                          }}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                        >
                          {data.studentsData?.map(
                            (student: any, idx: number) => {
                              return (
                                <>
                                  {student._id === 0 ? (
                                    <option value={student._id} key={idx}>
                                      {`${student.first_name} ${student.last_name}`}
                                    </option>
                                  ) : (
                                    <option value={student._id} key={idx}>
                                      {`Student Id : ${student.student_id} - Student Name: ${student.first_name} ${student.last_name}`}
                                    </option>
                                  )}
                                </>
                              );
                            }
                          )}
                        </select>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
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
          Select or search a program to edit
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
                {`Program Name: ${student.program_name} `}
              </a>
            );
          })}
        </div>
        {data.selectedProgram ? (
          <div>
            <p>Selected program: </p>
            <p className="mb-2">
              Program Id :{data.selectedProgram?.program_id} Program Name:{' '}
              {data.selectedProgram?.program_name}
            </p>
            <button
              type="button"
              onClick={() => {
                if (data.selectedProgram) {
                  const offeringData: Offering[] = [];
                  const currentData = data.selectedProgram.program_offerings;

                  currentData.map((cur) => {
                    const teachersArr: Users[] = [];
                    const studentsArr: {
                      teacherId: string;
                      studentList?: Students[];
                    }[] = [];
                    cur.teachers?.map((t) => {
                      const currentTeacher = data.teachersData.filter(
                        (te) => te._id === t.teacher_id
                      )[0];
                      teachersArr.push(currentTeacher);
                      studentsArr.push({
                        teacherId: t.teacher_id,
                        studentList: t.students
                      });
                    });
                    offeringData.push({
                      quarter: cur.quarter,
                      year: cur.year,
                      selectedStudents: studentsArr,
                      selectedTeachers: teachersArr
                    });
                  });

                  updateData({
                    fillEditData: true,
                    numberOfOfferings: offeringData.length,
                    selectedOfferings: offeringData,
                    programId: data.selectedProgram.program_id,
                    programName: data.selectedProgram.program_name
                  });
                }
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Edit program
            </button>
            <button
              type="button"
              onClick={() => {
                updateData({
                  fillEditData: false,
                  numberOfOfferings: 1,
                  selectedOfferings: [{ quarter: 'Q1', year: currentYear - 1 }],
                  programId: '',
                  programName: '',
                  selectedProgram: undefined
                });
              }}
              className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                updateData({
                  showDeleteModal: true
                });
              }}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Delete
            </button>

            {data.showDeleteModal ? (
              <div className="fixed z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative rigt-0 w-1/3">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                      type="button"
                      onClick={() => updateData({ showDeleteModal: false })}
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-hide="popup-modal"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                      <svg
                        aria-hidden="true"
                        className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this program?
                      </h3>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        onClick={deleteProgram}
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        onClick={() => updateData({ showDeleteModal: false })}
                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {AddProgramForm()}
    </div>
  );
}

export default AddProgramForm;
