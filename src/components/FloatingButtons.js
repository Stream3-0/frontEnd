import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { gsap } from "gsap";
const FloatingButtons = () => {
  const buttonsData = [
    {
      id: 1,
      name: "Valorant",
      description: "Button 1 Description",
      image: "valorant.jpg",
    },
    {
      id: 2,
      name: "Button 2",
      description: "Button 2 Description",
      image: "/path/to/image2.jpg",
    },
    {
      id: 3,
      name: "Button 3",
      description: "Button 3 Description",
      image: "/path/to/image3.jpg",
    },
    {   
      id: 4,
      name: "Button 4",
      description: "Button 4 Description",
      image: "/path/to/image4.jpg",
    },
    {
      id: 5,
      name: "Button 5",
      description: "Button 5 Description",
      image: "/path/to/image5.jpg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = buttonsData.length;

  const rotateCarousel = (direction) => {
    setActiveIndex((prevActiveIndex) => {
      return (prevActiveIndex + direction + carouselItems) % carouselItems;
    });
  };

  return (
    <div className="carousel-container">
      <button
        className="carousel-button carousel-button-prev"
        onClick={() => rotateCarousel(-1)}
      >
        &#x276E;
      </button>
      <div
        className="carousel"
        style={{
          transform: `translateX(-${(100 * activeIndex) / carouselItems}%)`,
        }}
      >
        {buttonsData.map((buttonData, index) => (
          <div
            key={buttonData.id}
            className={`image-display-item${
              index === activeIndex ? " active" : ""
            }`}
            style={{
              backgroundImage: `url(${buttonData.image})`,
              width: `${100 / carouselItems}%`,
            }}
          >
            <div className="image-display-overlay">
              <div>{buttonData.name}</div>
              <div>{buttonData.description}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-button carousel-button-next"
        onClick={() => rotateCarousel(1)}
      >
        &#x276F;
      </button>
    </div>
  );
};

export default FloatingButtons;
