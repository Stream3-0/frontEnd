import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import FloatingButtons from "./components/FloatingButtons";
import { auth } from "./firebaseConfig";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DrawerComponent from "./screens/homePage";
import ProjectView from "./screens/homePage/ProjectView";
import VideoEditor from "./screens/homePage/VideoEditor";
import AccountSettings from "./screens/homePage/AccountSettings";
import AICreator from "./screens/homePage/AiCreator";
import TestScreen from "./screens/homePage/test";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import GameDetails from "./components/GameDetails";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function EmptyHomePage() {
  return <div>Empty homepage after logging in</div>;
}

function EmptyPage({ name }) {
  return <div>Empty page for {name}</div>;
}

function App() {
  const theme = createTheme();
  const [user, setUser] = useState(null);
  const customInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

 

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Navbar user={user} />

          {user ? (
            <Routes>
              <Route path="/" element={<EmptyHomePage />} />
              <Route path="/projects" element={<ProjectView />} />
              <Route path="/video-edit" element={<VideoEditor />} />
              <Route path="/ai-creator" element={<AICreator />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/test" element={<TestScreen />} />
              <Route path="/game/:gameName" element={<GameDetails />} />
            </Routes>
          ) : (
            <div style={{ flex: 1 }}>
              <Header />
            </div>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
