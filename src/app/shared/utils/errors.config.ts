import {ErrorMessage} from "./error.interface";

export const errorMessages: ErrorMessage = {
  'auth/user-not-found': 'Incorrect username or password!',
  'auth/wrong-password': 'Incorrect username or password!',
  'auth/email-already-in-use': 'Address email already in use!',
  'auth/email-already-exists': 'Address email already exists!',
  'auth/internal-error': 'Something went wrong. Please try again!',
  'auth/invalid-email': 'Invalid email address!',
  'auth/invalid-password': 'Invalid password!',
  'usernameExists': 'Username already exists'
};
