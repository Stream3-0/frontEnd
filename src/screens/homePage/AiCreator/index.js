import React, { useState, useCallback } from "react";
import ParticlesBackground from "../../../components/ParticlesBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { firebaseApp, db, storage } from "../../../firebaseConfig";
import Modal from "./modal";

export default function AICreator() {
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
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <ParticlesBackground />

      <>
        <style>{keyframes}</style>
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <h1 style={{ color: "white", fontSize: "64px", margin: 0 }}>
            AI Generator
          </h1>
          <p style={{ color: "white", fontSize: "25px", margin: "20px 0" }}>
            Interactively create AI models in the browser. Simply upload an
            image to get started!
          </p>
          <h1 style={{ color: "white", margin: 0 }}>
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
          <p style={{ color: "white", fontSize: "18px", margin: "20px 0" }}>
            Upload an image of your game and select a screenshot of a kill
            indication, like a skull icon or something that pops up to show
            visual indication.
          </p>
          <button
            style={{
              backgroundColor: "#1a1a1d",
              color: "white",
              fontSize: "18px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlay} style={{ marginRight: "10px" }} />
            Create
          </button>
          {modalVisible && <Modal closeModal={closeModal} />}
        </div>
      </>
    </div>
  );
}
