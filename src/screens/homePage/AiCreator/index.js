import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { Range } from "react-range";
import ParticlesBg from "particles-bg";
import html2canvas from "html2canvas";
import _ from "lodash"; // for throttling

export default function AICreator() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState([0, 0]);
  const [screenshot, setScreenshot] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const throttleMouseMove = useRef(
    _.throttle((event) => {
      if (isSelecting) {
        const rect = containerRef.current.getBoundingClientRect();
        setEndPos({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    }, 200)
  ); // 200ms throttle
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const handlePaste = (e) => {
    setVideoUrl(e.clipboardData.getData("Text"));
  };

  const handleDuration = (duration) => {
    setVideoDuration(duration);
    setVideoProgress([0, duration]);
  };

  const handleProgress = (progress) => {
    setVideoProgress([progress.playedSeconds, videoDuration]);
  };

  const handleSeek = (values) => {
    setVideoProgress(values);
    playerRef.current.seekTo(values[0]);
  };

  const handleScreenshot = () => {
    setIsSelecting(true);
    playerRef.current.getInternalPlayer().pauseVideo();
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      html2canvas(containerRef.current, {
        x: startPos.x,
        y: startPos.y,
        width: endPos.x - startPos.x,
        height: endPos.y - startPos.y,
      }).then((canvas) => {
        setScreenshot(canvas.toDataURL());
      });
    }
  };

  const handleMouseDown = (event) => {
    if (isSelecting) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (event) => {
    throttleMouseMove.current(event);
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onPaste={handlePaste}
      style={{ height: "100vh", width: "100vw", position: "relative" }} // set position to relative
    >
      <ParticlesBg type="circle" bg={true} />
      <input // Add this input field to accept YouTube video URL
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Paste YouTube video URL here"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={!isSelecting} // pause when selecting
        onDuration={handleDuration}
        onProgress={handleProgress}
      />
      {videoDuration > 0 && (
        <Range
          step={0.1}
          min={0}
          max={videoDuration}
          values={videoProgress}
          onChange={handleSeek}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ccc",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                backgroundColor: "#999",
              }}
            />
          )}
        />
      )}
      <button onClick={handleScreenshot}>Take Screenshot</button>
      {isSelecting && (
        <>
          <div
            style={{
              position: "absolute",
              top: startPos.y,
              left: startPos.x,
              width: endPos.x - startPos.x,
              height: endPos.y - startPos.y,
              border: "2px dashed red",
              zIndex: 1, // make sure the selection box is above the overlay
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "transparent",
              zIndex: 0, // make sure the overlay is under the selection box
            }}
          />
        </>
      )}
      {screenshot && <img src={screenshot} alt="Screenshot" />}
    </div>
  );
}
