import React from "react";
import { FaRocket } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        Introducing The Next Era of Video Editing
      </h1>
      <p className="header-blurb">
        Our revolutionary product uses AI to automatically edit gameplay for
        users. Upload your own videos, label them for AI, and create custom
        editors for your own games. Experience the future of video editing,
        completely free.
      </p>
      <button className="header-button">
        <FaRocket /> Launch
      </button>
    </header>
  );
};

export default Header;
