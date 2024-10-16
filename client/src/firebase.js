// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClkZPU8gdAaFtyH3SD9TV-68KMPCp1MDI",
  authDomain: "publish-ef9a3.firebaseapp.com",
  projectId: "publish-ef9a3",
  storageBucket: "publish-ef9a3.appspot.com",
  messagingSenderId: "814088232779",
  appId: "1:814088232779:web:c15897de8de7a8aa6212ce",
  measurementId: "G-QWFHZNH1E7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);