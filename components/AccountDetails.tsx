import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';

import React, { useReducer, useState } from 'react';

function AccountDetails() {
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
  const [password, setPassword] = useState('');
  const [confirmtPassword, setConfirmPassword] = useState('');
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      email: formData.email
    };

    const response = await fetch('/api/resetPassword', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.status !== 200) {
      setShowSubmitError({ show: true, message: result.result });
    } else {
      // call email function
      const emailMessage = `You have requested to reset your password. \n Please use ${result.password} to login`;
      const info = {
        name: '',
        email: formData.email
      };
    }

    setFormData({
      type: 'RESET_FORM',
      payLoad: initialState
    });
  };
  const alert = () => {
    window.alert('email sent');
  };
  return (
    <div className="flex min-h-full   justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Update Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="flex flex-row">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                className={`${
                  formValidityData.passwordError && 'bg-red-300'
                } relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Password"
              />
              <div
                className="z-10 -ml-8 mt-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className="fa-regular fa-eye"></i>
              </div>
            </div>
            <div className="flex flex-row">
              <label htmlFor="password" className="sr-only">
                Confirm password
              </label>
              <input
                id="password"
                name="password"
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
                className={`${
                  formValidityData.passwordError && 'bg-red-300'
                } relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Confirm password"
              />
              <div
                className="z-10 -ml-8 mt-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className="fa-regular fa-eye"></i>
              </div>
            </div>
          </div>

          <div>
            <button
              disabled={!formValidityData.isFormValid}
              type="submit"
              className={`group relative flex w-full justify-center rounded-md ${
                formValidityData.isFormValid
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-slate-400'
              } px-3 py-2 text-sm font-semibold text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className={`h-5 w-5 ${
                    formValidityData.isFormValid
                      ? 'text-indigo-500 group-hover:text-indigo-400'
                      : 'text-white'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Update password
            </button>
            {showSubmitError.show && (
              <p className="text-center text-pink-600 mt-2">
                Error: {showSubmitError.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountDetails;
