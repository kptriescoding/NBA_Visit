// import firebase from 'firebase/app';
import "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  EmailAuthProvider,
} from "firebase/auth";
import axios from "axios";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

// Initialize Firebase with your project's config

const firebaseConfig = {
  apiKey: "AIzaSyBgMUXc0_knwu3yq7Ttor5hm0JupXD_c18",
  authDomain: "nda-visit.firebaseapp.com",
  projectId: "nda-visit",
  storageBucket: "nda-visit.appspot.com",
  messagingSenderId: "825053781061",
  appId: "1:825053781061:web:fe8e723602537d2663d72c",
  measurementId: "G-X3FLD6Y5T9",
};

// Function to sign in with Google

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const emailRegex = /[a-z]*@rvce\.edu\.in$/;
const emailRegex2 = /[a-z]*\.[a-z][a-z][0-9][0-9]@rvce\.edu\.in$/;
const instance = axios.create({
  baseURL: "http://localhost:8081", // Replace with your server URL
});

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    if (res) {
      // const q = query(collection(db, "users"), where("uid", "==", user.uid));
      // const docs = await getDocs(q);
      // if (docs.docs.length === 0) {
      //   await addDoc(collection(db, "users"), {
      //     uid: user.uid,
      //     email: user.email,
      //     userType:userType
      //   });
      // }
      if (
        user.email == "dilsharma0220@gmail.com" ||
        user.email == "karthikpai08@gmail.com"
      ) {
        try {
          instance.post("/professor/create", {
            data: {
              email: user.email,
              name: user.displayName,
            },
          });
        } catch (err) {
          console.log("signed in" + user);
        }
        window.location.reload();
        return user;
      } else if (!emailRegex.test(user.email) || emailRegex2.test(user.email)) {
        window.alert("Please use your college email id");

        logout();
      } else {
        try {
          instance.post("/professor/create", {
            data: {
              email: user.email,
              name: user.displayName,
            },
          });
        } catch (err) {}
        window.location.reload();
        return user;
      }
      // }
    }
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};

// // Function to sign out
// export const signOut = () => {
//   return firebase.auth().signOut();
// };
