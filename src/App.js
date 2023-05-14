import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import FloatingButtons from "./components/FloatingButtons";
import { auth } from "./firebaseConfig";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import DrawerComponent from "./screens/homePage";
import ProjectView from "./screens/homePage/ProjectView";
import VideoEditor from "./screens/homePage/VideoEditor";
import AccountSettings from "./screens/homePage/AccountSettings";
import AICreator from "./screens/homePage/AiCreator";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
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

  const particlesConfig = {
    fullScreen: false,
    background: { image: "linear-gradient(90deg, #DE26A0 0%, #068FF1 100%)" },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" },
        polygon: { nb_sides: 5 },
        image: { src: "img/github.svg", width: 100, height: 100 },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: true,
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />

        {user ? (
          <Routes>
            <Route path="/projects" element={<ProjectView />} />
            <Route path="/video-edit" element={<VideoEditor />} />
            <Route path="/ai-creator" element={<AICreator />} />
            <Route path="/account-settings" element={<AccountSettings />} />
          </Routes>
        ) : (
          <div style={{ flex: 1 }}>
            <Header />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
