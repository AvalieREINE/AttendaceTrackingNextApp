import {
  FormState,
  formReducer,
  formValidityReducer,
  initialValidityState
} from '@/utils/FormValidation';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import React, { useReducer, useState } from 'react';

function SignInPage() {
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
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password,
      remember
    };

    const response = await fetch('/api/signin', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.status !== 200) {
      setShowSubmitError({ show: true, message: result.result });
    } else {
      setCookie(null, 'token', result.result);
      router.push('/');
    }

    setFormData({
      type: 'RESET_FORM',
      payLoad: initialState
    });
  };
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account yet?
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-2"
              onClick={() => router.push('/signup')}
            >
              Sign up
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
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
                    payLoad: formData
                  });
                }}
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
                name="password"
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={(e) => {
                  setFormData({
                    type: 'UPDATE_PASSWORD',
                    payLoad: e.target.value
                  });
                  setFormValidityData({
                    type: 'VALIDATE_PASSWORD',
                    payLoad: formData
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
              Sign in
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

export default SignInPage;
