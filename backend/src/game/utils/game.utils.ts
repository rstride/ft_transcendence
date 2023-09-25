import { Ball, Game, Player1 } from '../classes/game.classes';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../interfaces/game.interfaces';

/* Collision detection */
export function collision(ball: Ball, player: Player1) {
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;

  const playerTop = player.y;
  const playerBottom = player.y + player.height;
  const playerLeft = player.x;
  const playerRight = player.x + player.width;

  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}

/* Reset ball once a player has scored */
export function resetBall(ball: Ball) {
  ball.x = CANVAS_WIDTH / 2;
  ball.y = CANVAS_HEIGHT / 2;
  ball.velocityX = -ball.velocityX;
  ball.velocityY = 0;
  ball.speed = CANVAS_WIDTH / 100;
}

/* Update game state */
export function updateGame(game: Game): Game {
  /* Update score */
  if (game.ball.x - game.ball.radius < 0) {
    game.player2.score++;
    if (game.player2.score < 5) {
      resetBall(game.ball);
    }
  } else if (game.ball.x + game.ball.radius > CANVAS_WIDTH) {
    game.player1.score++;
    if (game.player1.score < 5) {
      resetBall(game.ball);
    }
  }

  /* Update paddle1 position */
  game.player1.y += game.player1.arrowDown ? 5 : 0;
  if (game.player1.y + game.player1.height > CANVAS_HEIGHT) {
    game.player1.y = CANVAS_HEIGHT - game.player1.height;
  }
  game.player1.y -= game.player1.arrowUp ? 5 : 0;
  if (game.player1.y < 0) {
    game.player1.y = 0;
  }

  /* Update paddle2 position */
  game.player2.y += game.player2.arrowDown ? 5 : 0;
  if (game.player2.y + game.player2.height > CANVAS_HEIGHT) {
    game.player2.y = CANVAS_HEIGHT - game.player2.height;
  }
  game.player2.y -= game.player2.arrowUp ? 5 : 0;
  if (game.player2.y < 0) {
    game.player2.y = 0;
  }

  /* Update ball's position */
  game.ball.x += game.ball.velocityX;
  game.ball.y += game.ball.velocityY;
  if (game.ball.y + game.ball.radius > CANVAS_HEIGHT || game.ball.y - game.ball.radius < 0) {
    game.ball.velocityY = -game.ball.velocityY;
  }

  /* Check for collision between ball and paddle */
  let player = game.ball.x + game.ball.radius < CANVAS_WIDTH / 2 ? game.player1 : game.player2;

  if (collision(game.ball, player) === true) {
    let collidePoint = game.ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = (collidePoint * Math.PI) / 4;
    let direction = game.ball.x + game.ball.radius < CANVAS_WIDTH / 2 ? 1 : -1;
    game.ball.velocityX = direction * game.ball.speed * Math.cos(angleRad);
    game.ball.velocityY = game.ball.speed * Math.sin(angleRad);
    game.ball.speed += 0.2;
  }
  return game;
}
