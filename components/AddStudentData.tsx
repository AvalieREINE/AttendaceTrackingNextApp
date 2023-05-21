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
  teachersData: any[];
  campuses: (string | undefined)[];
  studentId?: number;
  selectedCampus: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber?: number;
  email: string;
  isInternational: boolean;
};

const initialData = {
  teachersData: [],
  campuses: [undefined, 'Auckland', 'Wellington', 'Christchurch'],
  studentId: undefined,
  selectedCampus: '',
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: undefined,
  email: '',
  isInternational: false
};

function AddStudentForm() {
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
  const [remember, setRemember] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    const response = await fetch('/api/addStudent', {
      method: 'POST',
      body: JSON.stringify(submitData)
    });
    const result = await response.json();
    console.log(result.result, 'submit result');

    if (response.status !== 200) {
      setShowSubmitError({ show: true, message: result.result });
    } else {
      window.alert('success');
    }
    updateData(initialData);
    setFormData({
      type: 'RESET_FORM',
      payLoad: initialState
    });
  };
  const [data, updateData] = useReducer(
    (prev: FormData, next: Partial<FormData>) => {
      return { ...prev, ...next };
    },
    initialData
  );
  const [loading, setloading] = useState(true);

  const getInitialData = useCallback(async () => {
    const response = await fetch('/api/getTeachers', {
      method: 'GET'
    });
    const result = await response.json();
    if (result.result) {
      updateData({
        teachersData: [
          {
            _id: 0,
            firstName:
              'I will add this data later - select this if you want to leave it empty',
            lastName: ''
          },
          ...result.result
        ]
      });
    }
  }, []);
  useEffect(() => {
    if (loading) {
      getInitialData();
      setloading(false);
    }
  }, []);
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
  return (
    <div className="flex bg-blue-100  h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Add Student
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
                value={data.studentId ? data.studentId?.toString() : ''}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    updateData({
                      studentId: Number(e.target.value)
                    });
                  }

                  // setFormValidityData({
                  //   type: 'VALIDATE_EMAIL',
                  //   payLoad: { ...formData, email: e.target.value }
                  // });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="i.g. 20200123"
                required
              />
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
              }}
              value={data.firstName}
              type="text"
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
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
              }}
              id="lastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
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
              }}
              id="address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
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
                }
              }}
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
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
                updateData({ email: e.target.value });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="isInternational"
                type="checkbox"
                onChange={(e) => {
                  updateData({ isInternational: e.target.checked });
                }}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  "
                required
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
    </div>
  );
}

export default AddStudentForm;
