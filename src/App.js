import React, { useState, useEffect } from "react";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import FloatingButtons from "./components/FloatingButtons";
import { auth } from "./firebaseConfig";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import DrawerComponent from "./screens/homePage";
import ProjectView from "./screens/homePage/ProjectView"; // Import the ProjectView component
import VideoEditor from "./screens/homePage/VideoEditor";
import AccountSettings from "./screens/homePage/AccountSettings";
import AICreator from "./screens/homePage/AiCreator";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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
          <Header />
        )}
      </div>
    </Router>
  );
}

export default App;
