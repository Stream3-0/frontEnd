import React, { useCallback } from "react";
import ParticlesBackground from "../../../components/ParticlesBackground";

import Pager from "../../../components/Pager";
import PageOne from "../../../components/PageOne";
import PageThree from "../../../components/PageThree";
import PageTwo from "../../../components/PageTwo";
import PageFour from "../../../components/PageFour";
import NavigationButtons from "../../../components/NavigationButtons";
export default function AICreator() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <ParticlesBackground />

      <Pager>
        <PageOne />
        <PageTwo />
        <PageThree />
        <PageFour />
        <NavigationButtons />
      </Pager>
    </div>
  );
}
