import React from "react";
import {
  FaUser,
  FaLock,
  FaRocket,
  FaQuestionCircle,
  FaInfoCircle,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import DrawerComponent from "../screens/homePage";
import LoginSignupModal from "./modal";
import { auth, db } from "../firebaseConfig";
const Navbar = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const iconStyle = { marginRight: "5px" };
  const buttonStyle = {
    borderRadius: "5px",
    padding: "5px 10px",
    marginLeft: "5px",
    border: "2px solid white",
    background: "none",
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {user && <DrawerComponent />}
        <span className="navbar-name">AutoEdit</span>
        <img src="/path/to/your/logo" alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-links">
        <button className="navbar-button" style={buttonStyle}>
          <FaRocket style={iconStyle} /> Get Started
        </button>
        <button className="navbar-button" style={buttonStyle}>
          <FaInfoCircle style={iconStyle} /> About
        </button>
        <button className="navbar-button" style={buttonStyle}>
          <FaHeadset style={iconStyle} /> Support
        </button>
      </div>
      {user ? (
        <button
          className="navbar-button auth"
          onClick={handleLogout}
          style={buttonStyle}
        >
          <FaSignOutAlt style={iconStyle} /> Logout
        </button>
      ) : (
        <>
          <button
            className="navbar-button auth"
            onClick={handleModalToggle}
            style={buttonStyle}
          >
            <FaLock style={iconStyle} /> Sign Up / Login
          </button>
        </>
      )}
      <LoginSignupModal isOpen={isModalOpen} onClose={handleModalToggle} />
    </nav>
  );
};

export default Navbar;
