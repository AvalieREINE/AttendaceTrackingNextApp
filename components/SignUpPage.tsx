import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import React, { useReducer, useState } from 'react';

function signUpPage() {
  const router = useRouter();
  const initialState: FormState = {
    firstName: '',
    lastName: '',
    adminCode: '',
    email: '',
    password: ''
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminValid, setAdminValid] = useState(false);
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
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowAdminInput(false);
    setShowSubmitError({ show: false, message: '' });
    const data = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: showAdminInput ? 'admin' : 'teacher',
      remember
    };

    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    setFormData({
      type: 'RESET_FORM',
      payLoad: initialState
    });
    if (response.status !== 200) {
      setShowSubmitError({ show: true, message: result.result });
    } else {
      setCookie(null, 'token', result.result);
      router.push('/');
    }
  };

  const checkAdminCode = async (code: string) => {
    const data = {
      code
    };

    const response = await fetch('/api/validateCode', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    // return response.json();
    const result = await response.json();
    if (result.result) {
      setAdminValid(true);
    } else {
      setAdminValid(false);
    }
  };
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Register your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-2"
              onClick={() => router.push('/signin')}
            >
              Sign in
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="first_name" className="sr-only">
                first name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_FIRST_NAME',
                    payLoad: e.target.value
                  });
                  setFormValidityData({
                    type: 'VALIDATE_FIRST_NAME',
                    payLoad: { ...formData, firstName: e.target.value }
                  });
                }}
                required
                className={`${
                  formValidityData.firstNameError && 'bg-red-300'
                } relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="sr-only">
                Last name
              </label>
              <input
                id="last_name"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_LAST_NAME',
                    payLoad: e.target.value
                  });
                  setFormValidityData({
                    type: 'VALIDATE_LAST_NAME',
                    payLoad: { ...formData, lastName: e.target.value }
                  });
                }}
                name="last_name"
                type="text"
                autoComplete="last_name"
                required
                className={`${
                  formValidityData.lastNameError && 'bg-red-300'
                } relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Last name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_EMAIL',
                    payLoad: e.target.value
                  });
                  setFormValidityData({
                    type: 'VALIDATE_EMAIL',
                    payLoad: { ...formData, email: e.target.value }
                  });
                }}
                value={formData.email}
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${
                  formValidityData.emailError && 'bg-red-300'
                } relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Email address"
              />
            </div>
            <div className="flex flex-row">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                value={formData.password}
                name="password"
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_PASSWORD',
                    payLoad: e.target.value
                  });
                  setFormValidityData({
                    type: 'VALIDATE_PASSWORD',
                    payLoad: { ...formData, password: e.target.value }
                  });
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
            <div className="flex items-center">
              <input
                id="admin"
                name="admin"
                type="checkbox"
                onChange={(e) => {
                  setShowAdminInput(e.target.checked);
                }}
                className="my-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="admin"
                className="ml-2 block text-sm text-gray-900 my-3 "
              >
                Registering as admin ?
              </label>
            </div>
            <div className={`${showAdminInput ? 'flex flex-row' : 'hidden '}`}>
              <label htmlFor="admin_code" className="sr-only">
                admin code
              </label>
              <input
                id="admin_code"
                value={formData.adminCode}
                name="admin_code"
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_ADMIN',
                    payLoad: e.target.value
                  });
                  checkAdminCode(e.target.value);
                }}
                className={`${
                  !adminValid && 'bg-red-300'
                }  relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Admin code"
              />
              <div
                className="z-10 -ml-8 mt-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className="fa-regular fa-eye"></i>
              </div>
            </div>
            {!adminValid && showAdminInput ? (
              <p className="text-xs text-pink-600">
                If you don't have your admin code, you are probably not allowed
                to register as admin
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                onChange={(e) => {
                  setRemember(e.target.checked);
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
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
              Sign up
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

export default signUpPage;
