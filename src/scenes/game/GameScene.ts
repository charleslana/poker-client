import { Hand } from './Hand';
import { ICard } from '@/interface/ICard';
import { IGetUser } from '@/interface/IUser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IPlayer } from '@/interface/IPlayer';
import { IRoom } from '@/interface/IRoom';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';
import { TableCard } from './TableCard';
import { UserSingleton } from '@/config/UserSingleton';

export class GameScene extends Scene {
  constructor() {
    super(SceneKeyEnum.GameScene);
  }

  private socket: Socket;
  private room: IRoom;
  private user: IGetUser;
  private players: IPlayer[];
  private tableCards: ICard[];

  init(data: IRoom): void {
    this.room = data;
    this.user = UserSingleton.getInstance();
    console.log(this.room);
  }

  create(): void {
    this.socket = SocketSingleton.getInstance();
    this.handleSocket();
    this.handleGetRoom();
    this.createBg();
    this.createCloseButton();
    this.createUsersCards();
    this.createTableCards();
  }

  private createUsersCards(): void {
    this.players = Array.from({ length: 6 }, (_, index) => ({
      id: index.toString(),
      name: `User${index}`,
    }));
    this.players.forEach((player, index) => {
      const hand = new Hand(this);
      hand.setContainerPosition(index);
      hand.changeUserNamePlayer(player.name);
    });
  }

  private createTableCards(): void {
    this.tableCards = Array.from({ length: 5 }, (_, index) => ({
      id: index,
      name: `Card${index}`,
    }));
    this.tableCards.forEach((_card, index) => {
      const tableCard = new TableCard(this);
      tableCard.setTableCard(index);
      tableCard.createFlipEvent();
    });
  }

  private handleSocket(): void {
    this.socket.on('connect', () => {
      this.socket.emit('updateUserName', this.user.name || this.socket.id, this.user.id);
      console.log('Conectado ao servidor Socket.io');
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.io');
    });
  }

  private handleGetRoom(): void {
    this.socket.on('getRoom', (room: IRoom) => {
      this.room = room;
      console.log('get room:', room);
    });
  }

  private createBg(): void {
    const gameBg = this.add.image(0, 0, ImageKeyEnum.GameBg).setOrigin(0);
    gameBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createCloseButton(): void {
    const closeButton = this.add
      .image(this.cameras.main.width - 10, 10, ImageKeyEnum.CloseIcon)
      .setOrigin(1, 0);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.backToLobby();
    });
  }

  private backToLobby(): void {
    const user = UserSingleton.getInstance();
    this.socket.emit('leaveRoom', this.room.id, user.name);
    this.socket.on('leaveRoomSuccess', () => {
      this.socket.off('getRoom');
      this.socket.off('leaveRoomSuccess');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.scene.start(SceneKeyEnum.LobbyScene);
    });
  }
}
