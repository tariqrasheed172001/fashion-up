import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../../../firebase";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";

function GoogleSignIn() {
  const navigate = useNavigate();

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      navigate("/");
    });
  };

  return (
    <div>
      <GoogleButton
        onClick={handleClick}
        style={{ borderRadius: "10px", maxWidth: "10rem" }}
        type="light"
        label="Google"
      />
    </div>
  );
}

export default GoogleSignIn;
