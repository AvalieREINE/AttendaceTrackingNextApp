import { useReducer } from 'react';

export type FormState = {
  firstName?: string;
  lastName?: string;
  adminCode?: string;
  email: string;
  password: string;
  // adminSelected: boolean;
};
const initialState: FormState = {
  firstName: '',
  lastName: '',
  adminCode: '',
  email: '',
  password: ''
  // adminSelected: false
};
export type FormValidityState = {
  firstNameError: boolean;
  lastNameError: boolean;
  // adminCodeError: boolean;
  emailError: boolean;
  passwordError: boolean;
  isFormValid: boolean;
};
export const initialValidityState: FormValidityState = {
  firstNameError: false,
  lastNameError: false,
  // adminCodeError: false,
  emailError: false,
  passwordError: false,
  isFormValid: false
};
type FormAction = {
  type: string;
  payLoad: string | boolean | FormState;
};
type FormValidityAction = {
  type: string;
  payLoad: FormState;
};
export const formReducer = (
  state: FormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case 'UPDATE_FIRST_NAME':
      return {
        ...state,
        firstName: action.payLoad as string
      };
    case 'UPDATE_LAST_NAME':
      return {
        ...state,
        lastName: action.payLoad as string
      };
    case 'UPDATE_ADMIN':
      return {
        ...state,
        adminCode: action.payLoad as string
      };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        email: action.payLoad as string
      };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        password: action.payLoad as string
      };
    case 'RESET_FORM':
      return action.payLoad as FormState;

    default:
      return state;
  }
};
export function formValidityReducer(
  state: FormValidityState,
  action: FormValidityAction
): FormValidityState {
  let isValid: boolean = false;
  switch (action.type) {
    case 'VALIDATE_FIRST_NAME':
      isValid =
        action.payLoad.firstName && action.payLoad.firstName.length > 0
          ? true
          : false;
      return {
        ...state,
        ...{
          firstNameError: !isValid,
          isFormValid:
            isValid &&
            !state.lastNameError &&
            !state.emailError &&
            !state.passwordError
        }
      };
    case 'VALIDATE_LAST_NAME':
      isValid =
        action.payLoad.lastName && action.payLoad.lastName.length > 0
          ? true
          : false;
      return {
        ...state,
        ...{
          lastNameError: !isValid,
          isFormValid:
            isValid &&
            !state.firstNameError &&
            !state.emailError &&
            !state.passwordError
        }
      };

    case 'VALIDATE_EMAIL':
      isValid =
        action.payLoad.email.length > 0 && action.payLoad.email.includes('@')
          ? true
          : false;
      return {
        ...state,
        ...{
          emailError: !isValid,
          isFormValid:
            isValid &&
            !state.firstNameError &&
            !state.lastNameError &&
            !state.passwordError
        }
      };
    case 'VALIDATE_PASSWORD':
      isValid = action.payLoad.password.length > 9 ? true : false;
      return {
        ...state,
        ...{
          passwordError: !isValid,
          isFormValid:
            isValid &&
            !state.firstNameError &&
            !state.lastNameError &&
            !state.emailError
        }
      };

    default:
      return state;
  }
}
