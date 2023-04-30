import React from "react";
import {
  FaUser,
  FaLock,
  FaRocket,
  FaQuestionCircle,
  FaInfoCircle,
  FaHeadset,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/path/to/your/logo" alt="Logo" className="navbar-logo" />
        <span className="navbar-name">AutoEdit</span>
      </div>
      <div className="navbar-links">
        <button className="navbar-button">
          <FaRocket /> Get Started
        </button>
        <button className="navbar-button">
          <FaInfoCircle /> About
        </button>
        <button className="navbar-button">
          <FaHeadset /> Support
        </button>
      </div>
      <div className="navbar-auth">
        <button className="navbar-button auth">
          <FaUser /> Login
        </button>
        <button className="navbar-button auth">
          <FaLock /> Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
