import React, { useEffect } from "react";

import { signInWithGoogle, logout, auth } from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import GoogleButton from 'react-google-button'
import Dashboard from "./Dashboard";

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      console.log("lgged in");
    }
  }, [user, loading]);

  const handleSignIn = async () => {
    await signInWithGoogle();
    console.log("signed in" + user);
  };

  const handleSignOut = async () => {
    await logout();
    console.log("signed out");
    console.log(user);
  };

  return (
    <div>
      {!user ? (
        <GoogleButton onClick={handleSignIn}>Sign In with Google</GoogleButton>
      ) : (
        <Dashboard/>
      )}
    </div>
  );
}
