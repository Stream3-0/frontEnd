import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// Your firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBGIjpZ48YG5gt65aJy5CoJ2vvMohsWEv4",
  authDomain: "theta-hacks.firebaseapp.com",
  projectId: "theta-hacks",
  storageBucket: "theta-hacks.appspot.com",
  messagingSenderId: "33441298804",
  appId: "1:33441298804:web:124037ff0ad3ad463c9421",
  measurementId: "G-9PSYF7Y285",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // Make sure you have this line
const storage = firebase.storage();

export { firebaseApp, auth, db, storage };
