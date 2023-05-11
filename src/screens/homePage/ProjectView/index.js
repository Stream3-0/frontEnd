import React, { useState, useEffect } from "react";
import { Button } from "@mui/material"; // missing import
import { db, auth } from "../../../firebaseConfig";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CreateProjectModal from "./CreateProject";

const ProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Your Projects</h2>
      {projects.length === 0 ? (
        <>
          <p>This place looks pretty empty,</p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              textDecoration: "underline",
              border: "none",
              backgroundColor: "transparent",
              color: "blue",
              cursor: "pointer",
            }}
          >
            Create A Project?
          </button>
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
    </div>
  );
};

export default ProjectView;
