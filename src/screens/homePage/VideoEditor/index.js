import React, { useState } from "react";
import { Box, Button } from "@mui/material";

function VideoEditor() {
  const [video, setVideo] = useState(null);

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleVideoSubmit = async () => {
    console.log("Submitting Video");
    var reader = new FileReader();

    if (video) {
      const response = await fetch("https://api.thetavideoapi.com/upload", {
        headers: {
          "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
          "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
        },
        method: "POST",
      });

      const data = await response.json();

      const id = data["body"]["uploads"][0]["id"];
      const url = data["body"]["uploads"][0]["presigned_url"];
      console.log("URL: " + url);

      reader.readAsBinaryString(video);

      reader.onload = async () => {
        const video_binary = reader.result;

        console.log("Uploading...");
        const upload = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: video_binary,
        });

        console.log("Finished uploading. Transcoding id: " + id);

        const trans = await fetch("https://api.thetavideoapi.com/video", {
          method: "POST",
          headers: {
            "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
            "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            "source_upload_id": id,
            "playback_policy": "public",
            "nft_collection": "0x5d0004fe2e0ec6d002678c7fa01026cabde9e793"

          }),
        });

        const res = await trans.json();
        console.log("Finished transcoding " + JSON.stringify(res));
      };
    }
  };

  const handleEditWithAI = () => {
    if (video) {
      console.log("Editing with AI...");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <input
        accept="video/*"
        style={{ display: "none" }}
        id="video-upload-button"
        type="file"
        onChange={handleVideoUpload}
      />
      <label htmlFor="video-upload-button">
        <Button variant="contained" color="primary" component="span">
          Upload Video
        </Button>
      </label>
      {video && (
        <Button
          variant="contained"
          onClick={handleVideoSubmit}
          style={{ marginTop: "20px" }}
        >
          Submit Video
        </Button>
      )}
      <Button variant="contained" onClick={handleEditWithAI}>
        Edit with AI
      </Button>
    </Box>
  );
}

export default VideoEditor;
