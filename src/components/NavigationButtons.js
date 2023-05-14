import React from "react";
import { animated, useSpring } from "react-spring";

const buttonStyles = {
  padding: "12px 30px",
  borderRadius: "4px",
  fontSize: "18px",
  border: "none",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  fontFamily: "'Helvetica', 'Arial', sans-serif",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const AnimatedButton = ({ onClick, children, style }) => {
  const [springProps, setSpringProps] = useSpring(() => ({
    scale: 1.0,
    config: { tension: 350, friction: 20 },
  }));

  const handleMouseEnter = () => {
    setSpringProps({ scale: 1.15 });
  };

  const handleMouseLeave = () => {
    setSpringProps({ scale: 1.0 });
  };

  return (
    <animated.button
      onClick={onClick}
      style={{
        ...buttonStyles,
        ...style,
        ...springProps,
        backgroundColor: springProps.scale.interpolate(
          (scale) => `rgba(255, 255, 255, ${0.8 * scale})`
        ),
        transform: springProps.scale.interpolate((scale) => `scale(${scale})`),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </animated.button>
  );
};

export default function NavigationButtons({ onBack, onNext }) {
  return (
    <div
      style={{ position: "absolute", bottom: "20px", width: "100%", zIndex: 1 }}
    >
      <AnimatedButton
        onClick={onBack}
        style={{
          position: "absolute",
          left: "20px",
        }}
      >
        Back
      </AnimatedButton>
      <AnimatedButton
        onClick={onNext}
        style={{
          position: "absolute",
          right: "20px",
        }}
      >
        Next
      </AnimatedButton>
    </div>
  );
}
