import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Outlet } from "react-router-dom";
import HomePage from "../components/Pages/HomePage";
import PageLoader from "../components/PageLoader/PageLoader";

function ProtectAuth() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getting currently loggedin user details from firebase.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(user?.displayName);
        setLoading(false);
      } else {
        // user is not logged in.
        setIsSignedIn(null);
        setLoading(false);
      }
    });
  }, []);

  if(loading)
    return <PageLoader />

  if (isSignedIn) {
    return <HomePage />;
  } else {
    return <Outlet />;
  }
}

export default ProtectAuth;
