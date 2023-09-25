import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../interfaces/game.interfaces';

export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.radius = CANVAS_WIDTH / 50;
    this.speed = CANVAS_WIDTH / 100;
    this.velocityX = CANVAS_WIDTH / 150;
    this.velocityY = 0;
  }
}

export class Player1 {
  x: number;
  y: number;
  width: number;
  height: number;
  socketID: string;
  userID: number;
  userName: string;
  arrowDown: boolean;
  arrowUp: boolean;
  score: number;

  constructor() {
    this.x = 0;
    this.y = (CANVAS_HEIGHT - CANVAS_HEIGHT / 5) / 2;
    this.width = CANVAS_WIDTH / 50;
    this.height = CANVAS_HEIGHT / 5;
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
  }
}

export class Player2 {
  x: number;
  y: number;
  width: number;
  height: number;
  socketID: string;
  userID: number;
  userName: string;
  arrowDown: boolean;
  arrowUp: boolean;
  score: number;

  constructor() {
    this.x = CANVAS_WIDTH - CANVAS_WIDTH / 50;
    this.y = (CANVAS_HEIGHT - CANVAS_HEIGHT / 5) / 2;
    this.width = CANVAS_WIDTH / 50;
    this.height = CANVAS_HEIGHT / 5;
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
  }
}

export class Game {
  player1: Player1;
  player2: Player2;
  ball: Ball;
  gameID: string;
  gameStatus: string;
  gameWinner: string;
  gameLoser: string;

  constructor() {
    this.player1 = new Player1();
    this.player2 = new Player2();
    this.ball = new Ball();
  }
}
