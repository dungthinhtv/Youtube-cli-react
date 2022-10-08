import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'clone-bdcd4.firebaseapp.com',
  projectId: 'clone-bdcd4',
  storageBucket: 'clone-bdcd4.appspot.com',
  messagingSenderId: '191025376260',
  appId: '1:191025376260:web:d264e68a5e1333c587d951',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
