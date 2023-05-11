import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { db, auth } from "../../../../firebaseConfig";
const CreateProjectModal = ({ isOpen, onClose }) => {
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

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create a new project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          type="text"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
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
          />
        ))}
        <Button onClick={addInviteField} style={{ marginTop: "1rem" }}>
          Add another invite
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateProject}>Create Project</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
