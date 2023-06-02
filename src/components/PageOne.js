
import React from "react";

export default function PageOne() {
  return (
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
        Interactively create AI models in the browser. Simply upload an image to
        get started!
      </p>
    </div>
  );
}
