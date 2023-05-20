import React, { useState } from "react";
import { Box, Button, Grid, Slider } from "@mui/material";
import { storage } from "../../../firebaseConfig.js"
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import GameCard from "../../../components/gamecard";
import ParticlesBackground2 from "../../../components/particlesBackground2";
import { Timeline, TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';


function VideoEditor() {
  const [video, setVideo] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [value, setValue] = useState([20, 50]);
  function valuetext(value) {
    return `${value}°C`;
  }
  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue);
  };
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

  const mockData: TimelineRow[] = [{
    id: "0",
    actions: [
      {
        id: "action00",
        start: 0,
        end: 2,
        effectId: "effect0",
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action10",
        start: 1.5,
        end: 5,
        effectId: "effect1",
      }
    ],
}]

const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "效果0",
  },
  effect1: {
    id: "effect1",
    name: "效果1",
  },
};

  
  function onChange(data) {
    setFrame(data[0]['actions'][0]['start'])
    console.log(frame);
  }

  function onReady(data) {
    console.log(data)
  }

  return (
    <div>
      {/* <ParticlesBackground2 /> */}
      <Box
        display="flex"
        flexDirection="column"
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
          <Box
            display="flex"
            alignItems="flex-start"
            flexDirection="column"
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
                style={{ marginTop: "20px"}}
              >
                Submit Video
              </Button>
            )}

            <Button variant="contained" onClick={handleEditWithAI}>
              Edit with AI
            </Button>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection='column'
            >
              <iframe width="560" height="315" src={'https://www.youtube.com/embed/ORMx45xqWkA?start=' + Math.round(value[0]) + "&end=" + Math.round(value[1])} ></iframe>
              <Slider
              style={{width: 500}}
  getAriaLabel={() => 'Temperature range'}
  value={value}
  onChange={handleChange}
  valueLabelDisplay="auto"
  getAriaValueText={valuetext}
      />
            </Box>
           
           </>
          
        )}
      </Box>
    </div>
  );
}

export default VideoEditor;
