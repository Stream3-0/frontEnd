import React from "react";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import FloatingButtons from "./components/FloatingButtons";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Header />
      <FloatingButtons />
    </div>
  );
}

export default App;
