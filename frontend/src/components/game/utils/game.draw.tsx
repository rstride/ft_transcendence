import { CANVAS_HEIGHT, CANVAS_WIDTH, Game } from "../../../interfaces/gameInterfaces";

/* Draw rectangle */
export function drawRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }
}

/* Draw circle */
export function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }
}

/* Draw text */
export function drawText(
  context: CanvasRenderingContext2D,
  text: any,
  x: number,
  y: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.font = "45px times";
    context.fillText(text, x, y);
  }
}

/* Draw net */
export function drawNet(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  color: string
) {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(context, (canvas.width - 2) / 2, i, 2, 10, color);
  }
}

/* Render a frame */
export const render = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  gameState: Game,
  ratioX: number,
  ratioY: number,
  color: string
) => {
  /* Clear the canvas */
  context.clearRect(0, 0, CANVAS_WIDTH * ratioX, CANVAS_HEIGHT * ratioY);
  drawRect(context, 0, 0, CANVAS_WIDTH * ratioX, CANVAS_HEIGHT * ratioY, "aliceblue");

  /* Draw net */
  drawNet(canvas, context, color);

  /* Draw score */
  drawText(
    context,
    gameState.player1.score,
    (CANVAS_WIDTH * ratioX) / 4,
    (CANVAS_HEIGHT * ratioY) / 6,
    color
  );
  drawText(
    context,
    gameState.player2.score,
    (3 * CANVAS_WIDTH * ratioX) / 4,
    (CANVAS_HEIGHT * ratioY) / 6,
    color
  );

  /* Draw paddle 1 */
  drawRect(
    context,
    gameState.player1.x * ratioX,
    gameState.player1.y * ratioY,
    gameState.player1.width * ratioX,
    gameState.player1.height * ratioY,
    color
  );

  /* Draw paddle 2 */
  drawRect(
    context,
    gameState.player2.x * ratioX,
    gameState.player2.y * ratioY,
    gameState.player2.width * ratioX,
    gameState.player2.height * ratioY,
    color
  );

  /* Draw ball */
  const ballRadius =
    CANVAS_WIDTH * ratioX < CANVAS_HEIGHT * ratioY
      ? gameState.ball.radius * ratioX
      : gameState.ball.radius * ratioY;
  drawCircle(context, gameState.ball.x * ratioX, gameState.ball.y * ratioY, ballRadius, color);
};
