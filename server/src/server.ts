import express, { Express } from "express";
import { Server, Socket } from "socket.io";

import http from "http";

import { Room } from "./types/room";
import { Connection } from "./types/connection";
import { User } from "./types/user";
import { Input } from "./types/input";

const rooms: Map<string, Room> = new Map<string, Room>();

const MAX_HEIGHT: number = 768;
const MAX_WIDTH: number = 1024;

const server: http.Server = http.createServer(express()); 
const io: Server = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
  socket.on("join", join(socket));
  socket.on("input", input(socket));
});

server.listen(3000);

const input = (socket: Socket) => (input: Input) => {
  const { room, display, position } = input;

  socket.broadcast.to(room).emit("input_response", { display, position });
}

const join = (socket: Socket) => (connection: Connection) => {
  try {
    const { display, room } = connection;
    const joining: Room | undefined = rooms.get(room);

    const user: User = {
      connection: socket,
      drawings: [],
      x: 0,
      y: 0
    }

    if (joining === undefined) {
      rooms.set(room, {
        name: room,
        users: [],
        connected: 0
      });

      const created: Room | undefined = rooms.get(room);

      created!.users.push(user);
      created!.connected++;
    } else {
      joining!.users.push(user);
      joining!.connected++;
    }

    socket.join(room);
    socket.emit("join_response", { status: "joined", message: `successfully joined ${room}` });
  } catch (error) {
    socket.emit("join_response", { status: "failed", message: `check message format` });
  }
}
