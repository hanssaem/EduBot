// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIUKDqrZZSOD5v5u1LBfYcNysb3K7XfYg',
  authDomain: 'edubot-95c75.firebaseapp.com',
  projectId: 'edubot-95c75',
  storageBucket: 'edubot-95c75.firebasestorage.app',
  messagingSenderId: '566005722042',
  appId: '1:566005722042:web:03074f8d4b324319258b83',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { app, auth };
