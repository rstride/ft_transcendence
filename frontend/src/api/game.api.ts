import { Game, Result } from "interfaces/gameInterfaces";

export class GameAPI {
  public static async getGameSessions(): Promise<{ games: Game[] } | null> {
    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/game`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : null;
  }

  public static async getGameStats(userId: number): Promise<{ games: Result[] } | null> {
    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/game/gameStats/${userId}`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : null;
  }
}
