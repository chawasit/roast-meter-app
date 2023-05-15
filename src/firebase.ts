// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDNAuzdY4n1hLV6EKBzfcq2i1a0pM4P_Mg',
  authDomain: 'roast-meter-app.firebaseapp.com',
  databaseURL: 'https://roast-meter-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'roast-meter-app',
  storageBucket: 'roast-meter-app.appspot.com',
  messagingSenderId: '1026668297909',
  appId: '1:1026668297909:web:4f047dbc736cf4623848fc'
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
