import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase";
import useNotification from "../../SnackBar/useNotification";
import NavBar from "../../NavBar/NavBar";

function SignIn() {
  const navigate = useNavigate();
  const [conf, setConf] = useNotification();
  const [data, setData] = useState(null);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCreds({ ...creds, [name]: value });
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, creds?.email, creds?.password)
      .then((userCredentials) => {
        setData(userCredentials);
        setConf({ msg: "Signed in successfully", variant: "success" });
      })
      .catch((error) => {
        console.log(error.code);
        setConf({ msg: error.code.replace("auth/", ""), variant: "warning" });
      });
  };

  useEffect(() => {
    if (data) navigate("/");
  }, [data]);

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={(e) => signIn(e)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => handleChange(e)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <div className="flex">
            <GoogleSignIn />
            <Button
              onClick={() => navigate("/signInWithPhone")}
              style={{
                borderRadius: "10px",
                maxWidth: "20rem",
                marginLeft: "1rem",
              }}
              size="sm"
              variant="outlined"
              color="primary"
            >
              <PhoneIcon /> Continue with phone
            </Button>
          </div>
          <Grid container sx={{ mt: 3 }} justifyContent="flex-end">
            <Grid onClick={() => navigate("/sign-up")} item>
              <Link className="cursor-pointer" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
