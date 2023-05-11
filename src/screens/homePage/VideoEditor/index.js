import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FormControl, MenuItem, Select } from "@mui/material";
import { auth, db as firestore } from "../../../firebaseConfig";
function VideoEditor() {
  useEffect(() => {
    console.log("AUTH!");
    if (auth.currentUser) {
      console.log("in authy");
      const unsubscribe = firestore
        .collection("Projects")
        .where("createdBy.email", "==", auth.currentUser.email)
        .onSnapshot((snapshot) => {
          console.log(JSON.stringify(snapshot.docs));
          const fetchedProjects = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          console.log(JSON.stringify(fetchedProjects) + "QQQQQQQQQ");
          setProjects(fetchedProjects);
        });

      return () => unsubscribe();
    }
  }, []);
  const [step, setStep] = useState(0);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Box>
      {step === 0 && (
        <Box mt={2}>
          <Typography variant="h6">Choose Project</Typography>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Select
              value={selectedProject}
              onChange={(event) => setSelectedProject(event.target.value)}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.data.projectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        {[0, 1, 2, 3, 4].map((item, index) => (
          <Box key={index} display="flex" alignItems="center">
            <CircularProgress
              variant={step === item ? "indeterminate" : "determinate"}
              value={100}
              size={24}
              thickness={4}
            />
            {index < 4 && (
              <Box
                width={32}
                height={4}
                bgcolor={step >= item ? "primary.main" : "grey.300"}
                ml={1}
                mr={1}
              />
            )}
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant="h5">Page {step + 1}</Typography>
      </Box>
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBeforeIcon />}
          onClick={handleBack}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<NavigateNextIcon />}
          onClick={handleNext}
          disabled={step === 4}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default VideoEditor;
