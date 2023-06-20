import { User } from "./user"

export interface Room {
  name: string,
  users: User[],
  connected: number
}