export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

export interface Dimensions {
  width: number;
  height: number;
}

export interface Ratio {
  x: number;
  y: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  userName: string;
  userID: number;
  score: number;
}

export interface Game {
  ball: Ball;
  player1: Player;
  player2: Player;
  gameID: string;
}

export interface Result {
	key: number;
	date: string;
	winner: string;
	loser: string;
	scoreWinner: number;
	scoreLoser: number;
  }
