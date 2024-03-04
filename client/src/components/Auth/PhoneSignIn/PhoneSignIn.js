import { Button, TextField } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../../firebase";
import useNotification from "../../SnackBar/useNotification";
import NameDialog from "./NameDialog";
import NavBar from "../../NavBar/NavBar";

function PhoneSignIn() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(null);

  const [conf, setConf] = useNotification();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const captcha = new RecaptchaVerifier(auth, "captcha", {});
      const result = await signInWithPhoneNumber(auth, phone, captcha);
      setUser(result);
    } catch (error) {
      console.log(error);
      setConf({
        msg: "Too many requests, Try agin later!",
        variant: "warning",
      });
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const data = await user.confirm(otp);
      setVerified(data);
      setConf({ msg: "successfully verified", variant: "success" });
    } catch (error) {
      // console.log(error);
      setConf({ msg: error.code?.replace("auth/", ""), variant: "error" });
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {verified && <NameDialog />}

        <div className="absolute  bg-white p-8 rounded shadow-md">
          <form onSubmit={(e) => sendOtp(e)}>
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(phone) => setPhone("+" + phone)}
            />
            <Button
              sx={{ marginTop: "10px" }}
              type="submit"
              variant="contained"
            >
              Send OTP
            </Button>
          </form>
          <div className="mt-4" id="captcha"></div>
          {user && (
            <form onSubmit={(e) => verifyOtp(e)}>
              <TextField
                onChange={(e) => setOtp(e.target.value)}
                type="number"
                variant="outlined"
                size="small"
                label="Enter OTP"
                required
                sx={{ display: "block", marginTop: "10px" }}
              />
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                type="submit"
                color="success"
              >
                Verify OTP
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default PhoneSignIn;
