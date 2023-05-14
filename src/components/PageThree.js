import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { db, storage } from "../firebaseConfig";

export default function PageThree() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      try {
        // Upload the file to firebase storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);

        // Get the download URL and save it to Firestore
        const downloadURL = await fileRef.getDownloadURL();
        await db.collection("images").add({ url: downloadURL });

        setUploadedFile(downloadURL);
      } catch (error) {
        // Log the error to the console
        console.error("Error uploading file:", error);
      }
    }
  };

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
      <h1 style={{ color: "white" }}>Image Upload</h1>
      <p style={{ color: "white", textAlign: "center" }}>
        Upload an image that shows a visual indicator of a kill.
      </p>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
        accept="image/jpeg, image/png"
      />
      <label
        htmlFor="file-upload"
        style={{
          cursor: "pointer",
          padding: "50px",
          marginTop: "20px",
          border: "5px dashed #888",
          borderRadius: "5px",
          backgroundColor: "transparent",
          textAlign: "center",
        }}
      >
        <FontAwesomeIcon icon={faUpload} size="5x" color="#888" />
        <p style={{ fontSize: "1.2rem", color: "white" }}>Click to upload</p>
      </label>
      {uploadedFile && (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            margin: "1rem",
          }}
        >
          <img
            src={uploadedFile}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              transition: "transform 1s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
}
