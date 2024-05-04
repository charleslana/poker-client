import { io, Socket } from 'socket.io-client';

export class SocketSingleton {
  private constructor() {}

  private static instance: Socket | null = null;

  static getInstance(): Socket {
    if (SocketSingleton.instance === null) {
      SocketSingleton.instance = io(process.env.API_URL as string);
    }
    return SocketSingleton.instance;
  }
}
