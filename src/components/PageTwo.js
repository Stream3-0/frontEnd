
import React from "react";

const keyframes = `@-webkit-keyframes gradient {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
@keyframes gradient {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}`;

export default function PageTwo() {
  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h1 style={{ color: "white", fontSize: "64px" }}>AI Generator</h1>
        <p style={{ color: "white", fontSize: "25px" }}>
          Interactively create AI models in the browser. Simply upload an image
          to get started!
        </p>
        <h1 style={{ color: "white" }}>
          As Easy As{" "}
          <span
            style={{
              background: "linear-gradient(270deg, #00DBDE, #FC00FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
              animation: "gradient 3s linear infinite",
            }}
          >
            1, 2, 3!
          </span>
        </h1>
        <p style={{ color: "white", fontSize: "18px" }}>
          Upload an image of your game and select a screenshot of a kill
          indication, like a skull icon or something that pops up to show visual
          indication. 
        </p>
      </div>
    </>
  );
}
