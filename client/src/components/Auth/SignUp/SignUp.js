import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../firebase";
import useNotification from "../../SnackBar/useNotification";
import NavBar from "../../NavBar/NavBar";

function SignUp() {
  const [conf, setConf] = useNotification();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    if (formData?.confirmPassword === formData?.password) {
      createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
        .then((userCredentials) => {
          setConf({ msg: "signed up successfully", variant: "success" });
          setUser(userCredentials.user);
        })
        .catch((error) => {
          setConf({
            msg: error.code?.replace("auth/", ""),
            variant: "warning",
          });
        });
    } else {
      setConf({ msg: "Passwords don't match!", variant: "warning" });
    }
  };

  useEffect(() => {
    if (user) {
      updateProfile(auth.currentUser, {
        displayName: formData?.firstName + " " + formData?.lastName,
      })
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={(e) => signUp(e)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <div className="flex">
            {/* <GoogleButton
              style={{ borderRadius: "10px", maxWidth: "10rem" }}
              type="light"
              label="Google"
            /> */}
            <GoogleSignIn />
            <Button
              style={{
                borderRadius: "10px",
                maxWidth: "20rem",
                marginLeft: "1rem",
              }}
              size="sm"
              variant="outlined"
              color="primary"
              onClick={() => navigate("/signInWithPhone")}
            >
              <PhoneIcon /> Continue with phone
            </Button>
          </div>
          <Grid
            onClick={() => navigate("/sign-in")}
            container
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            <Grid item>
              <Link className="cursor-pointer" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
