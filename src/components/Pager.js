import React, { useState } from "react";
import { animated, useTransition } from "react-spring";
import NavigationButtons from "./NavigationButtons";

export default function Pager({ children }) {
  const [index, setIndex] = useState(0);

  const increment = () => setIndex((idx) => (idx + 1) % children.length);
  const decrement = () =>
    setIndex((idx) => (idx - 1 + children.length) % children.length);

  const transitions = useTransition(index, {
    keys: null,
    from: { opacity: 0, transform: "translate3d(100%, 0, 0)" },
    enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(-50%, 0, 0)" },
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      {transitions((springProps, idx) => (
        <animated.div
          style={{ ...springProps, position: "absolute", width: "100%" }}
        >
          {children[idx]}
        </animated.div>
      ))}
      <NavigationButtons onBack={decrement} onNext={increment} />
    </>
  );
}
