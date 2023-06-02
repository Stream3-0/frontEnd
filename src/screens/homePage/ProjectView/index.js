import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { db, auth } from "../../../firebaseConfig";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CrownIcon from "@mui/icons-material/KingBed";
import CreateProjectModal from "./CreateProject";

const ProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invite, setInvite] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchInvites = async () => {
    const userEmail = auth.currentUser.email;
    const querySnapshot = await db
      .collection("Projects")
      .where("invites", "array-contains", userEmail)
      .get();

    if (!querySnapshot.empty) {
      const inviteData = querySnapshot.docs[0].data();
      setInvite({
        id: querySnapshot.docs[0].id,
        ...inviteData,
      });
      setDialogOpen(true);
    }
  };

  const handleInviteResponse = async (accept) => {
    if (accept) {
      const projectRef = db.collection("Projects").doc(invite.id);
      await projectRef.update({
        members: [
          ...invite.members,
          {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
          },
        ],
        invites: invite.invites.filter(
          (email) => email !== auth.currentUser.email
        ),
      });
    } else {
      const projectRef = db.collection("Projects").doc(invite.id);
      await projectRef.update({
        invites: invite.invites.filter(
          (email) => email !== auth.currentUser.email
        ),
      });
    }
    setDialogOpen(false);
    setInvite(null);
  };
  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser.uid;
      const unsubscribe = db
        .collection("Projects")
        .where("createdBy.uid", "==", uid)
        .onSnapshot((snapshot) => {
          const projectList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectList);
        });

      return () => unsubscribe();
    };

    fetchData();
    fetchInvites();
  }, []);
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        paddingTop: "2rem",
        background: "#1a1a1d",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#fff", fontSize: "2rem" }}>
        Your Projects
      </h2>
      {projects.length === 0 ? (
        <>
          <p style={{ color: "#ffffff", fontSize: "1.25rem" }}>
            This place looks pretty empty,
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            style={{
              textDecoration: "none",
              background:
                "linear-gradient(315deg, rgba(63, 81, 181, 1) 0%, rgba(156, 39, 176, 1) 74%)",
              color: "#fff",
              borderRadius: "24px",
              padding: "8px 16px",
              fontSize: "1rem",
              position: "relative",
              textTransform: "capitalize",
            }}
          >
            Create A Project?
            <span
              style={{
                position: "absolute",
                top: "-8px",
                left: "-8px",
                right: "-8px",
                bottom: "-8px",
                background:
                  "linear-gradient(315deg, rgba(63, 81, 181, 1) 0%, rgba(156, 39, 176, 1) 74%)",
                borderRadius: "inherit",
                zIndex: -1,
                filter: "blur(8px)",
                opacity: 0.5,
              }}
            />
          </Button>
        </>
      ) : (
        <div>
          {projects.map((project) => (
            <Button
              key={project.id}
              variant="contained"
              onClick={() =>
                console.log(`Go to project ${project.projectName}`)
              }
              style={{
                background: "linear-gradient(315deg, #3f51b5 0%, #9c27b0 74%)",
                color: "#fff",
                margin: "4px",
                fontSize: "1.25rem",
              }}
            >
              {project.projectName}
            </Button>
          ))}
        </div>
      )}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          background: "linear-gradient(45deg, #3f51b5 0%, #9c27b0 100%)",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{"Project Invite"}</DialogTitle>
        <DialogContent>
          {invite && (
            <>
              <p>
                You have been invited to join project "{invite.projectName}" by
                "{invite.createdBy.email}".
              </p>
              <p>Description: {invite.projectDescription}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => handleInviteResponse(false)}
            color="primary"
          >
            Decline
          </Button>
          <Button onClick={() => handleInviteResponse(true)} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectView;
