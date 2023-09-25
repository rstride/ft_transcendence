import * as React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import { genHexString } from "components/game/utils/game.color";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import { Dimensions, Game, Ratio } from "../../interfaces/gameInterfaces";
import { PlayerAvatars } from "./PlayerAvatars";
import { render } from "./utils/game.draw";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const GameScreen = (props: Dimensions & Ratio) => {
  /* Initialize Canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>();

  const getCanvasContext = () => {
    if (!canvasRef.current) {
      return;
    }
    context.current = canvasRef.current.getContext("2d");
  };

  useEffect(getCanvasContext, []);

  /* Update color of game elements */
  const [color, setColor] = useState("#000");

  const updateColor = () => {
    setColor(genHexString(3));
  };

  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);
  const [gameOn, setGameOn] = useState<string>("");
  const [gameState, setGameState] = useState<Game>();
  const [winner, setWinner] = useState<string>("");
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      socket.emit("spectator", hash.slice(1));
    }
  }, [hash, socket]);

  useEffect(() => {
    socket.on("gameLaunched", (data: Game) => {
      setGameOn("gameOn");
      setGameState(data);
    });
    return () => {
      socket.off("gameLaunched");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("gameUpdate", (data: Game) => {
      setGameOn("gameOn");
      setGameState(data);
    });
    return () => {
      socket.off("gameUpdate");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("gameFinished", (winner: string) => {
      setGameOn("gameOver");
      setWinner(winner);
    });
    return () => {
      socket.off("gameFinished");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("gameFinishedEarly", (leftEarly: string) => {
      setGameOn("gameInterrupted");
      setWinner(leftEarly);
    });
    return () => {
      socket.off("gameFinishedEarly");
    };
  }, [socket]);

  /* Capture user inputs */
  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if (typeof gameState != "undefined" && gameOn === "gameOn") {
        if (e.key === "Down" || e.key === "ArrowDown") {
          socket.emit("paddleDown", true, gameState.gameID);
        } else if (e.key === "Up" || e.key === "ArrowUp") {
          socket.emit("paddleUp", true, gameState.gameID);
        }
      }
    },
    [socket, gameOn, gameState]
  );
  const keyUpHandler = useCallback(
    (e: KeyboardEvent) => {
      if (typeof gameState != "undefined" && gameOn === "gameOn") {
        if (e.key === "Down" || e.key === "ArrowDown") {
          socket.emit("paddleDown", false, gameState.gameID);
        } else if (e.key === "Up" || e.key === "ArrowUp") {
          socket.emit("paddleUp", false, gameState.gameID);
        }
      }
    },
    [socket, gameOn, gameState]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler, false);
    return () => {
      window.removeEventListener("keydown", keyDownHandler, false);
    };
  }, [keyDownHandler]);

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler, false);
    return () => {
      window.removeEventListener("keyup", keyUpHandler, false);
    };
  }, [keyUpHandler]);

  /* Render next frame */
  const renderFrame = () => {
    if (!canvasRef.current || !context.current) return;
    if (gameState) {
      render(context.current, canvasRef.current, gameState, props.x, props.y, color);
    }
  };

  const requestIdRef = useRef<number>(0);
  const tick = () => {
    renderFrame();
    if (requestIdRef.current) {
      requestIdRef.current = requestAnimationFrame(tick);
    }
  };

  /* Launch game + cleanup */
  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  });

  const theme = useTheme();

  return (
    <div>
      {gameOn === "gameOver" && (
        <div>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            align="center"
            sx={{
              backgroundcolor: "primary",
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Game is over! Congrats to {winner} for winning!
          </Typography>
          <Button href="/">Go back to main menu</Button>
        </div>
      )}
      {gameOn === "gameInterrupted" && (
        <div>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            align="center"
            sx={{
              backgroundcolor: "primary",
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Game is over! {winner} left the game before its end!
          </Typography>
          <Button href="/">Go back to main menu</Button>
        </div>
      )}
      <div>
        {gameOn !== "gameOver" && gameOn !== "gameInterrupted" && (
          <div>
            {gameState && (
              <PlayerAvatars id1={gameState.player1.userID} id2={gameState.player2.userID} />
            )}
            <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab size="small" color="primary" aria-label="edit" onClick={updateColor}>
                <EditIcon />
              </Fab>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;

/* Helpful doc:
- https://tinyurl.com/yc34ta38
- https://tinyurl.com/mpw8mvb5
- https://tinyurl.com/bdah5rw6
*/
