import { IRoom } from '@/interface/IRoom';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';

export class GameScene extends Scene {
  constructor() {
    super(SceneKeyEnum.GameScene);
  }

  private socket: Socket;
  private room: IRoom;

  init(data: IRoom): void {
    this.room = data;
  }

  create(): void {
    this.socket = SocketSingleton.getInstance();
    this.handleGetRoom();
    this.cameras.main.setBackgroundColor(0xffffff);
    this.add.text(
      10,
      10,
      `GameScene room name: ${this.room.name}, user size: ${this.room.users.length}`,
      { color: '#000000' }
    );
  }

  private handleGetRoom(): void {
    this.socket.on('getRoom', (room: IRoom) => {
      this.room = room;
      console.log('get room:', room);
    });
  }
}
