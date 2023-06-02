import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      setDisplayName(auth.currentUser.displayName);
    }
  }, []);

  const handleUpdate = async () => {
    try {
      if (email) {
        await auth.currentUser.updateEmail(email);
      }
      if (displayName) {
        await auth.currentUser.updateProfile({ displayName });
        await db.collection('users').doc(auth.currentUser.uid).update({ displayName });
      }
      alert("Settings updated successfully.");
    } catch (error) {
      alert("Failed to update settings: " + error.message);
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        paddingTop: "3rem",
        padding: "2rem",
        borderRadius: "0",
        backgroundColor: "#1a1a1d",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <h2>Account Settings</h2>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <label>Display Name</label>
          <TextField
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="filled"
            style={{
              background: "#fff",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
          />
            <label>Email</label>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            style={{ background: "#fff", borderRadius: "5px", padding: "0.5rem" }}
          />
          <Button
            style={{
              backgroundColor: "#fff",
              color: "#1a1a1d",
              fontWeight: "bold",
              marginTop: "1rem",
            }}
            onClick={handleUpdate}
          >
            Update Settings
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AccountSettings;
