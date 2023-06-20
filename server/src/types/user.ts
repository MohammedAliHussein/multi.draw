import { Socket } from "socket.io";

export interface User {
  connection: Socket,
  drawings: number[][],
  x: number,
  y: number,
}