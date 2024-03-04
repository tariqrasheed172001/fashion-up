import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../firebase";
import useNotification from "../../SnackBar/useNotification";

function NameDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const navigate = useNavigate();
  const [conf, setConf] = useNotification();
  const [updatedFlag, setUpdatedFlag] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        setConf({ msg: "Signed in successfully", variant: "success" });
        setOpen(false);
        setUpdatedFlag(true);
      })
      .catch((error) => {
        console.log(error);
        setConf({ msg: error.code?.replace("auth/", ""), variant: "error" });
      });
  };

  useEffect(() => {
    if (updatedFlag) {
      navigate("/");
    }
  }, [updatedFlag]);

  useEffect(() => {
    handleClickOpen();
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Hey what is your name ?"}
        </DialogTitle>
        <form onSubmit={(e) => handleSubmit(e)}>
          <DialogContent>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Done</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default NameDialog;
