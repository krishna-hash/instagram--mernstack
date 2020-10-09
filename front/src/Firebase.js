import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmZittw-oq8iLHYjy5RLEavU-zEh8LYXM",
  authDomain: "instagram-clone-707b7.firebaseapp.com",
  databaseURL: "https://instagram-clone-707b7.firebaseio.com",
  projectId: "instagram-clone-707b7",
  storageBucket: "instagram-clone-707b7.appspot.com",
  messagingSenderId: "868308350906",
  appId: "1:868308350906:web:e9c568884388727ac6cf83",
  measurementId: "G-BMM5454GFW",
};
const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();
const auth = firebase.auth();

const storage = firebase.storage();

export { auth, storage };
export default db;
 