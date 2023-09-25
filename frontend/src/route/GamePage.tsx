import React, { useEffect, useState } from "react";
import { debounce } from "../components/game/utils/game.resize";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../interfaces/gameInterfaces";
import GameScreen from "../components/game/GameScreen";
import Container from "@mui/material/Container";

export const GamePage = () => {
  /* Check for window resizes every 300ms */
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 300);
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  /* Set screen ratio accordingly for proper rendering */
  const [ratio, setRatio] = useState({
    y: dimensions.height * 0.5,
    x: dimensions.width * 0.5,
  });
  useEffect(() => {
    setRatio({
      x: (dimensions.width * 0.5) / CANVAS_WIDTH,
      y: (dimensions.height * 0.5) / CANVAS_HEIGHT,
    });
  }, [dimensions]);

  return (
    <div className="Gamepage">
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          my: 3,
          py: 3,
          px: 3,
        }}
      >
        <GameScreen {...dimensions} {...ratio} />
      </Container>
    </div>
  );
};
