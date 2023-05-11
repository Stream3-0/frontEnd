import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { animated, useSpring } from "react-spring";

const AnimatedBox = animated(Box);

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const springProps = useSpring({
    from: {
      background: "linear-gradient(45deg, #3f51b5 0%, #9c27b0 100%)",
    },
    to: async (next) => {
      while (1) {
        await next({
          background: "linear-gradient(135deg, #3f51b5 0%, #9c27b0 100%)",
        });
        await next({
          background: "linear-gradient(45deg, #3f51b5 0%, #9c27b0 100%)",
        });
      }
    },
  });

  const handleUpdate = async () => {
    // Update code...
  };

  return (
    <AnimatedBox
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "2rem",
        borderRadius: "1rem",
        color: "#fff",
        ...springProps,
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
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="filled"
            style={{ background: "#fff", borderRadius: "5px" }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            style={{ background: "#fff", borderRadius: "5px" }}
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            variant="filled"
            style={{ background: "#fff", borderRadius: "5px" }}
          />
          <Button
            style={{ backgroundColor: "#fff", color: "#3f51b5" }}
            onClick={handleUpdate}
          >
            Update Settings
          </Button>
        </form>
      </Box>
    </AnimatedBox>
  );
};

export default AccountSettings;
