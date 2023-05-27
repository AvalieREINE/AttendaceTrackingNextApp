import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import React, { useReducer, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';

type FormData = {
  studentsData: any[];
  filteredStudentsData: any[];
  selectedStudentData: any;
  campuses: (string | undefined)[];
  studentId?: number;
  selectedCampus: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber?: number;
  email: string;
  isInternational: boolean;
  fillEditData: boolean;
  showDeleteModal: boolean;
};

const initialData = {
  studentsData: [],
  filteredStudentsData: [],
  selectedStudentData: undefined,
  campuses: [undefined, 'Auckland', 'Wellington', 'Christchurch'],
  studentId: undefined,
  selectedCampus: '',
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: undefined,
  email: '',
  isInternational: false,
  fillEditData: false,
  showDeleteModal: false
};

const initialErrors = {
  studentIdError: false,
  campusError: false,
  firstNameError: false,
  lastNameError: false,
  addressError: false,
  phoneError: false,
  emailError: false
};

function AddStudentForm() {
  const [formErrors, updateFormErrors] = useReducer(
    (prev: typeof initialErrors, next: Partial<typeof initialErrors>) => {
      return { ...prev, ...next };
    },
    initialErrors
  );

  const validateForm = () => {
    let hasError = false;
    if (data.studentId === undefined) {
      updateFormErrors({ studentIdError: true });
      hasError = true;
    }

    if (data.selectedCampus === '') {
      updateFormErrors({ campusError: true });
      hasError = true;
    }
    if (data.firstName === '') {
      updateFormErrors({ firstNameError: true });
      hasError = true;
    }
    if (data.lastName === '') {
      updateFormErrors({ lastNameError: true });
      hasError = true;
    }
    if (data.phoneNumber === undefined) {
      updateFormErrors({ phoneError: true });
      hasError = true;
    }
    if (data.email === '') {
      updateFormErrors({ emailError: true });
      hasError = true;
    }
    if (data.address === '') {
      updateFormErrors({ addressError: true });
      hasError = true;
    }
    let isValid: undefined | boolean;
    Object.values(formErrors).map((value, idx) => {
      if (value === true) {
        isValid = false;
      }
      if (
        idx === Object.values(formErrors).length - 1 &&
        isValid === undefined
      ) {
        isValid = true;
      }
    });
    return isValid === true && hasError === false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValid = validateForm();

    if (formValid) {
      const submitData = {
        student_id: data.studentId,
        campus: data.selectedCampus,
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address,
        phone_number: data.phoneNumber,
        email: data.email,
        is_international_student: data.isInternational
      };

      if (!data.fillEditData) {
        const response = await fetch('/api/addStudent', {
          method: 'POST',
          body: JSON.stringify(submitData)
        });
        const result = await response.json();

        if (response.status !== 200) {
          window.alert(result.result);
        } else {
          window.alert('success');
        }
      } else {
        const response = await fetch('/api/editStudent', {
          method: 'POST',
          body: JSON.stringify(submitData)
        });
        const result = await response.json();

        if (response.status !== 200) {
          window.alert(result.result);
        } else {
          window.alert('success');
        }
      }

      updateData({
        fillEditData: false,
        studentId: undefined,
        selectedCampus: undefined,
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phoneNumber: undefined,
        isInternational: false
      });
    }
  };
  const [data, updateData] = useReducer(
    (prev: FormData, next: Partial<FormData>) => {
      return { ...prev, ...next };
    },
    initialData
  );
  const [loading, setloading] = useState(true);

  const deleteStudent = async () => {
    updateData({ showDeleteModal: false });
    if (data.selectedStudentData && data.selectedStudentData.student_id) {
      const response = await fetch('/api/deleteStudent', {
        method: 'POST',
        body: JSON.stringify({ studentId: data.selectedStudentData.student_id })
      });
      const result = await response.json();

      if (response.status !== 200) {
        window.alert(result.result);
      } else {
        window.alert('success');

        updateData({
          fillEditData: false,
          studentId: undefined,
          selectedCampus: undefined,
          firstName: '',
          lastName: '',
          address: '',
          email: '',
          phoneNumber: undefined,
          isInternational: false,
          selectedStudentData: undefined
        });
        setloading(true);
      }
    } else {
      window.alert('no student selected');
    }
  };
  const getInitialData = useCallback(async () => {
    const response = await fetch('/api/getStudents', {
      method: 'GET'
    });
    const result = await response.json();
    if (result.result) {
      updateData({
        studentsData: result.result,
        filteredStudentsData: result.result
      });
    }
  }, []);
  useEffect(() => {
    if (loading) {
      getInitialData();
      setloading(false);
    }
  }, [loading]);
  if (loading) {
    return (
      <div role="status" className="flex justify-center mt-20">
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
  const AddStudentForm = () => {
    return (
      <div className="w-full max-w-md space-y-8  ">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {!data.fillEditData ? 'Add Student' : 'Edit Student'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-6">
              <label
                htmlFor="studentId"
                className="block mb-2 text-sm font-medium text-gray-900  "
              >
                Student Id
              </label>
              <input
                type="text"
                id="studentId"
                disabled={data.fillEditData}
                value={data.studentId ? data.studentId?.toString() : ''}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    updateFormErrors({ studentIdError: false });
                    updateData({
                      studentId: Number(e.target.value)
                    });
                  } else {
                    updateFormErrors({ studentIdError: true });
                  }
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="i.g. 20200123"
                required
              />
              {formErrors.studentIdError ? (
                <p className="text-xs text-pink-600 ml-2">
                  This field is required. Please enter numbers.
                </p>
              ) : null}
            </div>
            <div className="mb-6">
              <label
                htmlFor="campus"
                className="block mb-2 text-sm font-medium text-gray-900  "
              >
                Campus
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value !== '') {
                    updateFormErrors({ campusError: false });
                  } else {
                    updateFormErrors({ campusError: true });
                  }
                  updateData({ selectedCampus: e.target.value });
                }}
                value={data.selectedCampus}
                id="campus"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              >
                {data.campuses?.map((c: any, idx: number) => {
                  return (
                    <option value={c} key={idx}>
                      {c}
                    </option>
                  );
                })}
              </select>
              {formErrors.campusError ? (
                <p className="text-xs text-pink-600 ml-2">
                  Please select a campus.
                </p>
              ) : null}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-900  "
            >
              First Name
            </label>
            <input
              onChange={(e) => {
                updateData({ firstName: e.target.value });
                updateFormErrors({ firstNameError: false });
              }}
              value={data.firstName}
              type="text"
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
            {formErrors.firstNameError ? (
              <p className="text-xs text-pink-600 ml-2">
                This field is required.
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900  "
            >
              Last Name
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => {
                updateData({ lastName: e.target.value });
                updateFormErrors({ lastNameError: false });
              }}
              id="lastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
            {formErrors.lastNameError ? (
              <p className="text-xs text-pink-600 ml-2">
                This field is required.
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900  "
            >
              Address
            </label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => {
                updateData({ address: e.target.value });
                updateFormErrors({ addressError: false });
              }}
              id="address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
            {formErrors.addressError ? (
              <p className="text-xs text-pink-600 ml-2">
                This field is required.
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900  "
            >
              Phone number
            </label>
            <input
              type="text"
              value={data.phoneNumber ? data.phoneNumber?.toString() : ''}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  updateData({ phoneNumber: Number(e.target.value) });
                  updateFormErrors({ phoneError: false });
                } else {
                  updateFormErrors({ phoneError: true });
                }
              }}
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
            {formErrors.phoneError ? (
              <p className="text-xs text-pink-600 ml-2">
                This field is required. Please only enter numbers.
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900  "
            >
              Email
            </label>
            <input
              type="email"
              value={data.email}
              id="email"
              onChange={(e) => {
                if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                  updateFormErrors({ emailError: false });
                } else {
                  updateFormErrors({ emailError: true });
                }
                updateData({ email: e.target.value });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
            {formErrors.emailError ? (
              <p className="text-xs text-pink-600 ml-2">
                This field is required. Please enter a valid email.
              </p>
            ) : null}
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="isInternational"
                type="checkbox"
                checked={data.isInternational}
                onChange={(e) => {
                  updateData({ isInternational: e.target.checked });
                }}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  "
              />
            </div>
            <label
              htmlFor="isInternational"
              className="ml-2 text-sm font-medium text-gray-900  "
            >
              International Student
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
          >
            Submit
          </button>
        </form>
      </div>
    );
  };
  return (
    <div className=" h-full bg-sky-50   ">
      <div className=" ml-40 mr-40 flex-row  items-center justify-center ">
        <p className="  mb-2 text-sm font-medium text-gray-900  mt-5 ">
          Select or search a student to edit
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
                  updateData({ selectedStudentData: student });
                }}
              >
                {`id: ${student.student_id}`}&nbsp; &nbsp;{' '}
                {`Name: ${student.first_name} ${student.last_name}`}
              </a>
            );
          })}
        </div>
        {data.selectedStudentData ? (
          <div>
            <p>Selected student: </p>
            <p className="mb-2">
              id :{data.selectedStudentData?.student_id} Name:{' '}
              {data.selectedStudentData?.first_name}{' '}
              {data.selectedStudentData?.last_name}
            </p>
            <button
              type="button"
              onClick={() => {
                const selectedData = data.selectedStudentData;
                updateData({
                  fillEditData: true,
                  studentId: selectedData.student_id,
                  selectedCampus: selectedData.campus,
                  firstName: selectedData.first_name,
                  lastName: selectedData.last_name,
                  address: selectedData.address,
                  email: selectedData.email,
                  phoneNumber: selectedData.phone_number,
                  isInternational: selectedData.is_international_student
                });
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Edit student
            </button>
            <button
              type="button"
              onClick={() => {
                updateData({
                  fillEditData: false,
                  studentId: undefined,
                  selectedCampus: undefined,
                  firstName: '',
                  lastName: '',
                  address: '',
                  email: '',
                  phoneNumber: undefined,
                  isInternational: false,
                  selectedStudentData: undefined
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
                        Are you sure you want to delete this student?
                      </h3>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        onClick={deleteStudent}
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
      <div className="flex bg-blue-100  items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {AddStudentForm()}
      </div>
    </div>
  );
}

export default AddStudentForm;
