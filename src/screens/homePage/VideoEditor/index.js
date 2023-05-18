import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { storage } from "../../../firebaseConfig.js"
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import GameCard from "../../../components/gamecard";
import { styled, keyframes } from "@mui/system";

const steam = keyframes`
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
`;

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: "#000",
  padding: theme.spacing(2),
  maxHeight: "70vh",
  overflowY: "auto",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Add box-shadow to make component appear floating
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    background:
      "linear-gradient(45deg, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000)",
    backgroundSize: "400%",
    animation: `${steam} 20s linear infinite`,
    transform: "scale(1.02)", // to cover the entire area
  },
}));

function VideoEditor() {
  const [video, setVideo] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      name: "Valorant",
      description: "A competitive first-person shooter game",
      image: "https://example.com/valorant.jpg",
    },
    {
      name: "Albion Online",
      description: "A fantasy sandbox MMORPG featuring a player-driven economy",
      image: "https://example.com/albion.jpg",
    },
    {
      name: "Minecraft",
      description: "A game about placing blocks and going on adventures",
      image: "https://example.com/minecraft.jpg",
    },
  ];

  const handleGameButtonClick = (game) => {
    setSelectedGame(game);
  };

  const uploadToFirebase = async(video) => {
    return new Promise((resolve, reject) => {
      console.log("Uploading " + video.name + " to Firebase...")
      const storage = getStorage();
      const fileRef = ref(storage, 'files/' + video.name);
      uploadBytesResumable(fileRef, video)
        .then((snapshot) => {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log('File metadata:', snapshot.metadata);

          getDownloadURL(snapshot.ref).then((url) => {
            console.log('File available at', url);
            resolve(url)
          });
        }).catch((error) => {
          console.error('Upload failed', error);
          reject(error)
        });
    });
  }

  const uploadToTheta = async(url) => {
      console.log("Encoding URL " + url + " to Theta")

      const response = await fetch("https://api.thetavideoapi.com/video", {
        method: "POST",

        headers: {
            "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
            "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
            'Content-Type': 'application/json'
          },
        
        body: JSON.stringify({
            "source_uri": url,
            "playback_policy":"public",
            "nft_collection":"0x5d0004fe2e0ec6d002678c7fa01026cabde9e793"
        })
      })

      const data = await response.json()
      return data
  };

  const getEmbedURL = async(video_id) => {
      await getThetaURL(video_id);
      return "https://player.thetavideoapi.com/video/" + video_id;
  };

  const getVideoURL = async(video_id) => {
    const data = await getThetaURL(video_id);
    return data['body']['videos'][0]['playback_uri'];
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  
  const getThetaURL = async (video_id) => {
    try {
      const response = await fetch("https://api.thetavideoapi.com/video/" + video_id);
      const data = await response.json();
  
      if (data['body']['videos'][0]['playback_uri'] !== null) {
        console.log("Transcoding complete")
        return data;
      } else {
        console.log("Waiting for Theta to transcode...")
        await delay(3000);
        return await getThetaURL(video_id);
      }
    } catch (error) {
      throw error;
    }
  };
  
  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleVideoSubmit = async () => {
    console.log("Submitting Video");

    if (video) {
      const firebase_url = await uploadToFirebase(video)
      const response = await uploadToTheta(firebase_url)
      const theta_url = await getEmbedURL(response['body']['videos'][0]['id'])
      const theta_url2 = await getVideoURL(response['body']['videos'][0]['id'])
      console.log("Encoded into Theta with URL: " + theta_url + " and: " + theta_url2)
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
      {!selectedGame && (
        <StyledBox>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {games.map((game) => (
              <Grid item xs={6} md={4} key={game.name}>
                <GameCard
                  game={game}
                  onClick={() => handleGameButtonClick(game)}
                />
              </Grid>
            ))}
          </Grid>
        </StyledBox>
      )}
      {selectedGame && (
        <>
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
        </>
      )}
    </Box>
  );
}

export default VideoEditor;
