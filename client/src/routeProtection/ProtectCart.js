import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Outlet } from "react-router-dom";
import SignIn from "../components/Auth/SignIn/SignIn";
import PageLoader from "../components/PageLoader/PageLoader";

function ProtectCart() {
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

  if(loading){
    return <PageLoader />
  }

  if (isSignedIn) {
    return <Outlet />;
  } else {
    return <SignIn />;
  }
}

export default ProtectCart;
