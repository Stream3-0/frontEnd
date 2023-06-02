import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { db, auth } from "../../../../firebaseConfig";

const useStyles = makeStyles({
  modalOverlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.7)",
  },
  modal: {
    backgroundColor: "#1a1a1d",
    borderRadius: "10px",
    maxWidth: "600px",
    padding: "2em",
    position: "relative",
    margin: "1rem",
    overflowY: "auto",
  },
  textField: {
    "& .MuiFormLabel-root": {
      transition: "0.3s ease-in-out",
      color: "#FFFFFF",
    },
    "& .Mui-focused .MuiFormLabel-root": {
      top: "-5px",
    },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
    },
  },
  button: {
    marginRight: "0.5rem",
    borderRadius: "50px",
    border: "1px solid #FFF",
    color: "#FFF",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(75, 84, 244, 0.1)",
    },
  },
});

const CreateProjectModal = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [invites, setInvites] = useState([]);

  const handleCreateProject = async () => {
    const newProject = {
      projectName,
      projectDescription,
      createdBy: {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      },
      invites,
    };
    newProject.members = [
      {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      },
    ];
    await db.collection("Projects").add(newProject);
    setProjectName("");
    setProjectDescription("");
    setInvites([]);
    onClose();
  };
  const handleInviteChange = (event, index) => {
    const newInvites = [...invites];
    newInvites[index] = event.target.value;
    setInvites(newInvites);
  };

  const addInviteField = () => {
    setInvites([...invites, ""]);
  };

  if (!isOpen) return null;

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <Paper className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" style={{ color: "#FFF" }}>
          Create a new project
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              type="text"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={classes.textField}
            />
            <TextField
              margin="dense"
              label="Project Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={classes.textField}
            />
            {invites.map((invite, index) => (
              <TextField
                key={index}
                margin="dense"
                label={`Invite #${index + 1}`}
                type="email"
                fullWidth
                value={invite}
                onChange={(e) => handleInviteChange(e, index)}
                InputLabelProps={{ shrink: true }}
                className={classes.textField}
              />
            ))}
            <Button
              onClick={addInviteField}
              style={{ marginTop: "1rem" }}
              className={classes.button}
            >
              Add another invite
            </Button>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button onClick={onClose} className={classes.button}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} className={classes.button}>
              Create Project
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CreateProjectModal;
