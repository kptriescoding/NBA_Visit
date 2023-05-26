import React, { useEffect } from "react";

import { signInWithGoogle, logout, auth} from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";
import Dashboard from "./Dashboard";
import axios from "axios";
export default function Login() {
  const [user, loading, error] = useAuthState(auth);

  const instance = axios.create({
    baseURL: "http://localhost:8081", // Replace with your server URL
  });

  useEffect(() => {
    if (user) {
      console.log("logged in");
      instance.post("/professor/create", {
        data: {
          email: user.email,
          name: user.displayName,
        },
      });
      console.log("signed in" + user);
    }
  }, [user, loading]);

  const handleSignIn = async () => {
    await signInWithGoogle();
    // if(!emailRegex.test(user.email)){
    //   handleSignOut();
    // }
  };

  const handleSignOut = async () => {
    await logout();
    console.log("signed out");
    console.log(user);
  };

  return (
    <div>
      {/* {!user ? (
        <GoogleButton onClick={handleSignIn}>Sign In with Google</GoogleButton>
      ) : ( */}
        <Dashboard />
      {/* // )} */}
    </div>
  );
}
