import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useRef } from "react";
import { db } from "../../../firebaseConfig.js";
import { Search } from "@mui/icons-material";
import { collection, getDocs } from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactPlayer from "react-player";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Slider } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "@videojs/http-streaming";
import { useCallback } from "react";
function VideoEditor() {
  const dummyClips = [
    [20, 35],
    [70, 105],
    [135, 160],
  ];
  const [combinedVideo, setCombinedVideo] = useState("");
  const [editors, setEditors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [selectedEditorsImages, setSelectedEditorsImages] = useState({});
  const [clipsData, setClipsData] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [trimmingStep, setTrimmingStep] = useState(null);
  const [currentClip, setCurrentClip] = useState(null);
  const [videoDuration, setVideoDuration] = useState(180);
  const [trimSeconds, setTrimSeconds] = useState([0, 180]);
  const videoPlayer = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [playerInstanceReady, setPlayerInstanceReady] = useState(false);
  const [isDraggingTrim, setIsDraggingTrim] = useState(false);
  const [timestamps, setTimestamps] = useState([]);
  const [video, setVideo] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [value, setValue] = useState([20, 50]);
  function valuetext(value) {
    return `${value}°C`;
  }
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  const uploadToFirebase = async (video) => {
    console.log(video);
    return new Promise((resolve, reject) => {
      console.log("Uploading " + video.name + " to Firebase...");
      const storage = getStorage();
      const fileRef = ref(storage, "files/" + video.name);
      uploadBytesResumable(fileRef, video)
        .then((snapshot) => {
          console.log("Uploaded", snapshot.totalBytes, "bytes.");
          console.log("File metadata:", snapshot.metadata);

          getDownloadURL(snapshot.ref).then((url) => {
            console.log("File available at", url);
            resolve(url);
          });
        })
        .catch((error) => {
          console.error("Upload failed", error);
          reject(error);
        });
    });
  };

  const getClipUrl = (timestamp) => {
    const start = timestamp;
    const end = timestamp + 5;
    return (
      "https://www.youtube.com/embed/ORMx45xqWkA?start=" + start + "&end=" + end
    );
  };
  const getEmbedURL = async (video_id) => {
    await getThetaURL(video_id);
    return "https://player.thetavideoapi.com/video/" + video_id;
  };

  const getVideoURL = async (video_id) => {
    const data = await getThetaURL(video_id);
    return data["body"]["videos"][0]["playback_uri"];
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleVideoSubmit = async () => {
    console.log("Submitting Video");

    if (video) {
      const firebase_url = await uploadToFirebase(video);
      const response = await uploadToTheta(firebase_url);
      const theta_url = await getEmbedURL(response["body"]["videos"][0]["id"]);
      const theta_url2 = await getVideoURL(response["body"]["videos"][0]["id"]);
      console.log(
        "Encoded into Theta with URL: " + theta_url + " and: " + theta_url2
      );
    }
  };

  const handleTrimChange = (event, newValue) => {
    setTrimSeconds(newValue);
    if (isDraggingTrim) {
      if (newValue[0] !== trimSeconds[0]) {
        videoPlayer.current.seekTo(newValue[0]);
      } else if (newValue[1] !== trimSeconds[1]) {
        videoPlayer.current.seekTo(newValue[1]);
      }
    }
  };
  useEffect(() => {
    if (currentClip) {
      const startTimeInSeconds = timeToSeconds(currentClip.startTime);
      const endTimeInSeconds = timeToSeconds(currentClip.endTime);
      setTrimSeconds([startTimeInSeconds, endTimeInSeconds]);
      if (videoPlayer.current) {
        videoPlayer.current.seekTo(startTimeInSeconds);
      }
    }
  }, [currentClip]);
  const handleMouseDown = useCallback(() => {
    setIsDraggingTrim(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDraggingTrim(false);
    videoPlayer.current.seekTo(trimSeconds[0]);
  }, [trimSeconds]);

  useEffect(() => {
    if (videoPlayer && videoPlayer.current) {
      updateVideoTime();
    }
  }, [trimSeconds]);

  useEffect(() => {
    if (!combinedVideo || !videoPlayer.current || playerInstance) {
      return;
    }
    player.on("mousemove", updateVideoTime);
    player.on("touchmove", updateVideoTime);

    const player = videojs(
      videoPlayer.current,

      () => {
        player.src([{ src: combinedVideo }]);
        setPlayerInstanceReady(true);
      }
    );

    player.on("timeupdate", () => {
      setPlayheadTime(Math.floor(player.currentTime()));
    });

    player.on("mousedown", () => {
      setIsDraggingTrim(true);
    });
    player.on("touchstart", () => {
      setIsDraggingTrim(true);
    });
    player.on("mouseup touchend", () => {
      setIsDraggingTrim(false);
      if (player.currentTime() >= trimSeconds[1]) {
        player.currentTime(trimSeconds[0]);
      }
    });

    setPlayerInstance(player);
    const handleDragStart = () => {
      setIsDraggingTrim(true);
    };

    const handleDrag = (_, newValue) => {
      setTrimSeconds(newValue);
      player.currentTime(newValue[0]);
    };

    const handleDragEnd = () => {
      setIsDraggingTrim(false);
    };

    playerInstance.on("sliderChange", handleDrag);
    playerInstance.on("sliderDragStart", handleDragStart);
    playerInstance.on("sliderDragEnd", handleDragEnd);
    const slider = player.controlBar.progressControl.seekBar;
    slider.on("mousedown", handleMouseDown);
    slider.on("mouseup", handleMouseUp);

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [
    combinedVideo,
    videoPlayer,
    playerInstance,
    handleMouseDown,
    handleMouseUp,
  ]);

  useEffect(() => {
    if (videoPlayer && videoPlayer.current) {
      updateVideoTime();
    }
  }, [trimSeconds]);

  useEffect(() => {
    if (!playerInstanceReady || !playerInstance) {
      return;
    }
    playerInstance.src([{ src: combinedVideo }]);
  }, [combinedVideo, playerInstance, playerInstanceReady]);
  const handleBackClick = () => {
    setSelectedEditor(null);
  };
  const timeToSeconds = (time) => {
    const [minutes, seconds] = time.split(":").map((t) => parseInt(t, 10));
    return minutes * 60 + seconds;
  };
  const clipType = "clip";
  useEffect(() => {
    if (videoPlayer.current && trimSeconds) {
      if (!isDraggingTrim) {
        videoPlayer.current.seekTo(trimSeconds[0]);
      }
    }
  }, [isDraggingTrim, trimSeconds]);
  const Timeline = ({ clips }) => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "no-wrap",
          overflowX: "scroll",
          bgcolor: "primary.main",
          p: 2,
        }}
      >
        {clips.map((clip, index) => (
          <ClipBox key={clip.id} id={index + 1} clip={clip} index={index} />
        ))}
      </Box>
    );
  };

  const secondsToTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const updateVideoTime = () => {
    if (playerInstance && playerInstanceReady && !isDraggingTrim) {
      playerInstance.currentTime(trimSeconds[0]);
    }
  };

  const handleNextClip = () => {
    addTrimmedClipToTimeline();

    const currentIndex = dummyClips.findIndex(
      (clip) => clip.id === currentClip.id
    );
    if (currentIndex < dummyClips.length - 1) {
      setCurrentClip(dummyClips[currentIndex + 1]);
    } else {
      setTrimmingStep("timeline");
      setCurrentClip(null);
    }
  };

  const moveClip = (oldIndex, newIndex) => {
    const updatedTimelineData = [...timelineData];
    updatedTimelineData.splice(
      newIndex,
      0,
      updatedTimelineData.splice(oldIndex, 1)[0]
    );
    setTimelineData(updatedTimelineData);
    updateCombinedVideo(updatedTimelineData);
  };

  const updateCombinedVideo = (clips) => {
    const combined = clips
      .map((clip) => {
        const start = timeToSeconds(clip.startTime);
        const end = timeToSeconds(clip.endTime);
        return `https://www.youtube.com/embed/${videoFile}?start=${start}&end=${end}`;
      })
      .join("&playlist=");
    setCombinedVideo(combined);
  };
  const ClipBox = ({ clip, id, index }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "primary.light",
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          textAlign="center"
          color="primary.contrastText"
        >
          Clip {id}
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          {`${clip.startTime} - ${clip.endTime}`}
        </Typography>
      </Box>
    );
  };
  const addTrimmedClipToTimeline = () => {
    const updatedClipData = {
      ...currentClip,
      startTime: secondsToTime(trimSeconds[0]),
      endTime: secondsToTime(trimSeconds[1]),
    };
    const updatedTimelineData = [...timelineData];
    updatedTimelineData[currentClip.id - 1] = updatedClipData;
    setTimelineData(updatedTimelineData);
  };
  useEffect(() => {
    const fetchEditors = async () => {
      const editorsCollection = collection(db, "editors");
      const editorSnapshot = await getDocs(editorsCollection);
      const editorList = editorSnapshot.docs.map((doc) => doc.data());
      setEditors(editorList);
      console.log("Fetched editors: ", JSON.stringify(editorList));
    };

    fetchEditors();
  }, []);

  const handleClick = (editor) => {
    setSelectedEditor(editor);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const handleEditorCheckboxChange = (editorName, imgURL) => (event) => {
    if (event.target.checked) {
      setSelectedEditorsImages((prevState) => ({
        ...prevState,
        [editorName]: imgURL,
      }));
    } else {
      setSelectedEditorsImages((prevState) => {
        const newState = { ...prevState };
        delete newState[editorName];
        return newState;
      });
    }
  };

  const handleUploadVideo = (event) => {
    console.log("strting upoload");
    const file = event.target.files[0];
    setVideoFile(file);
  };

  const handleButtonClick = async () => {
    try {
      if (videoFile) {
        const videoUrl = await uploadToFirebase(videoFile);
        const videoName = videoFile.name;

        const editorTimestampsPromises = Object.values(
          selectedEditorsImages
        ).map((imgUrl) => getTimestampsFromAPI(videoName, videoUrl, imgUrl));

        const allEditorTimestamps = await Promise.all(editorTimestampsPromises);
        const combinedEditorTimestamps = []
          .concat(...allEditorTimestamps)
          .map((ts, index) => ({
            id: index + 1,
            startTime: secondsToTime(ts[0]),
            endTime: secondsToTime(ts[1]),
          }));

        if (combinedEditorTimestamps.length > 0) {
          setTimelineData(combinedEditorTimestamps);
          setTrimmingStep("clips");
          setCurrentClip(combinedEditorTimestamps[0]);
        } else {
          const dummyDataTimeline = dummyClips.map((ts, index) => ({
            id: index + 1,
            startTime: secondsToTime(ts[0]),
            endTime: secondsToTime(ts[1]),
          }));
          setTimelineData(dummyDataTimeline);
          setCurrentClip(dummyDataTimeline[0]);
          setTrimmingStep("clips");
          alert("No timestamps were found by the selected editors.");
        }
      }
    } catch (error) {
      console.error("Error fetching timestamps:", error);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterTags = (event, tag) => {
    if (event.target.checked) {
      setFilterTags([...filterTags, tag]);
    } else {
      setFilterTags(filterTags.filter((t) => t !== tag));
    }
  };
  const [playheadTime, setPlayheadTime] = useState(0);
  const handlePlayheadChange = (_, newValue) => {
    setPlayheadTime(newValue);
  };
  useEffect(() => {
    if (timestamps.length > 0) {
      const newClipsData = timestamps.map((ts, index) => ({
        id: index + 1,
        startTime: secondsToTime(ts[0]),
        endTime: secondsToTime(ts[1]),
      }));
      setClipsData(newClipsData);
    } else {
      const newClipsData = dummyClips.map((ts, index) => ({
        id: index + 1,
        startTime: secondsToTime(ts[0]),
        endTime: secondsToTime(ts[1]),
      }));
      setClipsData(newClipsData);
    }
  }, [timestamps]);
  if (trimmingStep === "timeline") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="primary.dark"
        pt={4}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            color="primary.contrastText"
            gutterBottom
          >
            Timeline View
          </Typography>
          <div data-vjs-player>
            <video
              ref={videoPlayer}
              className="video-js vjs-16-9"
              playsInline
            ></video>
          </div>

          <DndProvider backend={HTML5Backend}>
            <Timeline clips={clipsData} />
          </DndProvider>
        </Container>
      </Box>
    );
  }

  let tags = [
    "FPS",
    "RPG",
    "MMORPG",
    "Puzzle",
    "Platformer",
    "Multiplayer",
    "Indie",
    "TripleA",
    "Sandbox",
    "OpenWorld",
    "StoryDriven",
    "Retro",
    "EarlyAccess",
    "Casual",
    "Hardcore",
  ];

  const getTimestampsFromAPI = async (videoName, videoUrl, photoUrl) => {
    try {
      const response = await fetch(
        `https://5f2d-76-21-126-166.ngrok-free.app/timestamps?name=${videoName}&url=${encodeURIComponent(
          videoUrl
        )}&photo_url=${encodeURIComponent(photoUrl)}`
      );
      const data = await response.json();
      console.log("Timestamps from API:", data);

      if (!data.timestamps || data.timestamps.kills.length === 0) {
        console.log("No timestamps received from API");
        return [];
      }

      const timestamps = data.timestamps.kills;
      return timestamps;
    } catch (error) {
      console.error("Error getting timestamps:", error);
      return [];
    }
  };
  const filteredEditors = editors
    .filter((editor) => {
      if (editor.GameName || editor.gameName) {
        const gameName = editor.GameName || editor.gameName;
        return gameName.toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    .filter((editor) => {
      const editorTags = editor.tags || editor.Tags;
      return filterTags.length === 0
        ? true
        : editorTags.some((tag) => filterTags.includes(tag));
    });

  if (selectedEditor && trimmingStep !== "clips") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="#1a1a1d"
        pt={4}
      >
        <Container maxWidth="md">
          <Box mb={4} display="flex" justifyContent="space-between">
            <Typography
              variant="h3"
              component="h1"
              textAlign="center"
              style={{ color: "white" }}
            >
              {selectedEditor.GameName} Editor
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackClick}
            >
              Back
            </Button>
          </Box>
          <Typography
            variant="body2"
            style={{ color: "white" }}
            textAlign="justify"
          >
            {selectedEditor.GameDescription}
          </Typography>
          <Box mt={2} display="flex" alignItems="center">
            <Grid
              container
              component={Box}
              maxHeight="calc(100vh - 200px)"
              overflow="auto"
            >
              {(selectedEditor.AvailableEditors || []).map((editorDetails) => (
                <Grid
                  container
                  key={editorDetails.name}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Grid item></Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      component="div"
                      style={{ color: "white" }}
                    >
                      {editorDetails.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          onChange={handleEditorCheckboxChange(
                            editorDetails.name,
                            editorDetails.DetectionImage
                          )}
                        />
                      }
                      label=""
                      labelPlacement="end"
                      sx={{
                        color: "#ffffff",
                        "& .MuiCheckbox-root": {
                          color: "#ffffff",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            mt={4}
            mb={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="primary"
              component="label"
              sx={{ mb: 2 }}
            >
              Upload Video
              <input
                type="file"
                hidden
                onChange={handleUploadVideo}
                accept="video/*"
              />
            </Button>

            <ReactPlayer url={videoFile} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
              sx={{ mt: 2 }}
            >
              Edit
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }
  if (trimmingStep === "clips" && currentClip) {
    const startTimeInSeconds = timeToSeconds(currentClip.startTime);
    const endTimeInSeconds = timeToSeconds(currentClip.endTime);
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="primary.dark"
        pt={4}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            color="primary.contrastText"
            gutterBottom
          >
            Trimming Clip {currentClip.id}/{dummyClips.length}
          </Typography>
          <ReactPlayer
            url={videoFile}
            onDuration={(duration) => setVideoDuration(duration)}
            controls
            width="100%"
            playing={!isDraggingTrim}
            ref={videoPlayer}
            onReady={() => {
              updateVideoTime();
              videoPlayer.current.seekTo(trimSeconds[0]);
            }}
            onProgress={updateVideoTime}
          />
          <Box mt={2}>
            <Slider
              value={trimSeconds}
              onChange={handleTrimChange}
              valueLabelDisplay="auto"
              max={Math.floor(videoDuration)}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            />
          </Box>
          <Box mt={4}>
            <Typography variant="subtitle1" color="primary.contrastText">
              Selected Range:{" "}
              {`${secondsToTime(trimSeconds[0])} - ${secondsToTime(
                trimSeconds[1]
              )}`}
            </Typography>
          </Box>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextClip}
            >
              Next Clip
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <div>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="#1a1a1d"
        pt={4}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h3"
              component="h1"
              textAlign="center"
              color="primary.contrastText"
              gutterBottom
            >
              AI Game Editors
            </Typography>
            <TextField
              label="Search Games"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              sx={{ minWidth: 225 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton edge="start" sx={{ color: "#fff" }}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "#fff" },
              }}
              InputLabelProps={{
                style: { color: "#fff" },
                className: "text-lg",
              }}
            />
          </Box>
          <Box
            mb={4}
            display="grid"
            justifyContent="center"
            alignItems="center"
            gridTemplateColumns="repeat(5, 1fr)"
            gridTemplateRows="repeat(3, 1fr)"
            gridGap={2}
            sx={{ maxWidth: "100%" }}
          >
            {tags.map((tag, index) => (
              <Box key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={tag}
                      color="primary"
                      checked={filterTags.includes(tag)}
                      onChange={(e) => handleFilterTags(e, tag)}
                    />
                  }
                  label={tag}
                  labelPlacement="end"
                  sx={{
                    color: "#ffffff",
                    "& .MuiCheckbox-root": {
                      color: "#ffffff",
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {filteredEditors.map((editor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    width: "100%",
                    bgcolor: "#1a1a1d",
                    borderImage: "linear-gradient(45deg, #6C63FF, #C687FC)",
                    borderImageSlice: 1,
                    boxShadow: "0 0 10px #6C63FF, 0 0 10px #C687FC",
                    borderWidth: 2,
                    WebkitBorderImage:
                      "-webkit-gradient(linear, 0 0, 100% 100%)",
                    WebkitBorderImageSlice: 1,
                  }}
                >
                  <CardActionArea onClick={() => handleClick(editor)}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={editor.BackGroundImage}
                      alt={editor.GameName}
                    />
                    <CardContent sx={{ bgcolor: "primary.main" }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        color="primary.contrastText"
                      >
                        {editor.GameName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary.contrastText"
                        textAlign="justify"
                      >
                        {editor.GameDescription}
                      </Typography>
                      <Box mt={2}>
                        {editor.tags.map((tag) => (
                          <Typography
                            key={tag}
                            variant="body2"
                            color="primary.contrastText"
                            display="inline"
                            sx={{ mx: 1 }}
                          >
                            #{tag}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default VideoEditor;
