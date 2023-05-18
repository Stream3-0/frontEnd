import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { storage } from "../../../firebaseConfig.js"
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import GameCard from "../../../components/gamecard";
import ParticlesBackground2 from "../../../components/particlesBackground2";
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
      const storage = getStorage();
      const fileRef = ref(storage, 'files/' + video.name);
      uploadBytesResumable(fileRef, video)
        .then((snapshot) => {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log('File metadata:', snapshot.metadata);
          // Let's get a download URL for the file.
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

  const uploadToTheta = async() => {
      const response = await fetch("https://api.thetavideoapi.com/video", {
        method: "POST",

        headers: {
            "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
            "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
            'Content-Type': 'application/json'
          },
        
        body: JSON.stringify({
            "source_uri": "https://storage.googleapis.com/musestore-678bd.appspot.com/clip.mp4", 
            "playback_policy":"public",
            "nft_collection":"0x5d0004fe2e0ec6d002678c7fa01026cabde9e793"
        })
      })

      const data = await response.json()
      return data
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleVideoSubmit = async () => {
    console.log("Submitting Video");

    if (video) {
      const url = await uploadToFirebase(video)
      console.log("Uploaded to Firebase with URL: " + url)
      const response = await uploadToTheta(url)
      console.log("Uploaded to theta which will be available at: https://media.thetavideoapi.com/" + response['body']['videos'][0]['id'])
      // const response = await fetch("https://api.thetavideoapi.com/upload", {
      //   headers: {
      //     "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
      //     "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
      //   },
      //   method: "POST",
      // });

      // const data = await response.json();

      // const id = data["body"]["uploads"][0]["id"];
      // const url = data["body"]["uploads"][0]["presigned_url"];
      // console.log("URL: " + url);

      // reader.readAsBinaryString(video);

      // reader.onload = async () => {
      //   const video_binary = reader.result;

      //   console.log("Uploading...");
      //   const upload = await fetch(url, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/octet-stream",
      //     },
      //     body: video_binary,
      //   });

      //   console.log("Finished uploading. Transcoding id: " + id);

      //   const trans = await fetch("https://api.thetavideoapi.com/video", {
      //     method: "POST",
      //     headers: {
      //       "x-tva-sa-id": "srvacc_kuy73r8xffdt1ibdf5itjm2ky",
      //       "x-tva-sa-secret": "tsf1kvu2pehfwk95mr4er8u319rkdvrg",
      //       "Content-Type": "application/json",
      //     },

        //   body: JSON.stringify({
        //     "source_upload_id": id,
        //     "playback_policy": "public",
        //     "nft_collection": "0x5d0004fe2e0ec6d002678c7fa01026cabde9e793"

        //   }),
        // });

      //   const res = await trans.json();
      //   console.log("Finished transcoding " + JSON.stringify(res));
      // };
    }
  };

  const handleEditWithAI = () => {
    if (video) {
      console.log("Editing with AI...");
    }
  };

  return (
    <div>
      <ParticlesBackground2 />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        {!selectedGame && (
          <Box>
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
          </Box>
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
    </div>
  );
}

export default VideoEditor;
